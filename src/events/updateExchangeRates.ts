import {Context} from 'koishi'
import {Config} from '../config'
import {logger} from "../index"

export function updateExchangeRates(ctx: Context, config: Config) {
  ctx.on('currency-converter/exchange-rate-update', async () => {
    for (const currencyCode of ['USD', 'CNY', 'EUR', 'JPY', 'GBP', 'AUD', 'NZD', 'CAD', 'CHF']) {
      try {
        const data = await ctx.http.get(`https://v6.exchangerate-api.com/v6/${config.basic.apiKey}/latest/${currencyCode}`)
        if (data.result !== 'success') {
          logger.warn(`Failed to fetch exchange rates for ${currencyCode}:` + data["error-type"])
          continue;
        }
        const nextUpdate = new Date(data.time_next_update_utc)
        const baseCurrency: string = data.base_code
        const rates: number = data.conversion_rates
        const res = Object.entries(rates).map(([currency, rate]) => ({
          next_update: nextUpdate,
          base_code: baseCurrency,
          target_code: currency,
          rate: rate,
        }))
        ctx.database.upsert('exchange_rate', res, ['base_code', 'target_code'])
        logger.info(`${currencyCode} exchange rates updated`)
      } catch (err) {
        logger.warn(`Failed to fetch exchange rates for ${currencyCode}:`, err.message)
      }
    }
  })
}
