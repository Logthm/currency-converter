import {Context} from 'koishi'
import {Config} from '../config'
import {initCurrencyAlias, updateExchangeRates} from "../utils/general";

export function initialization(ctx: Context, config: Config) {
  ctx.on('ready', async () => {
    const rates = await ctx.database.get('exchange_rate', {})

    if (!(rates.length === 0 || new Date() > rates[0].next_update)) return

    await updateExchangeRates(ctx, config)

    const currencyRes = await ctx.database.get('currency', {})
    if (currencyRes.length === 0) {
      await initCurrencyAlias(ctx, config)
    }
  })
}
