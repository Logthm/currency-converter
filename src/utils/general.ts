import { Context, Session } from "koishi"
import {Config} from '../config';
import {logger} from "../index";

export async function updateExchangeRates(ctx: Context, config: Config) {
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
      await ctx.database.upsert('exchange_rate', res, ['base_code', 'target_code'])
      logger.info(`${currencyCode} exchange rates updated`)
    } catch (err) {
      logger.warn(`Failed to fetch exchange rates for ${currencyCode}:`, err.message)
    }
  }
}

export async function initCurrencyAlias(ctx: Context, config: Config) {
  const res = await ctx.database.get('exchange_rate', {}, ['target_code'])
  const mappedRes = res.map(item => ({ code: item.target_code, alias: [`${item.target_code.toLowerCase()}`]}))
  await ctx.database.upsert('currency', mappedRes, 'code')
  await ctx.database.upsert('currency', (row) => [
    { code: 'CNY', alias: ['cny', 'yuan', '元', '块', 'rmb', '人民币'] },
    { code: 'HKD', alias: ['hkd', 'hong kong dollar', 'hong kong dollars', '港币', '港元'] },
    { code: 'USD', alias: ['usd', 'dollar', 'dollars', 'us dollar', 'us dollars', 'buck', 'bucks', '美元', '美刀', '刀'] },
    { code: 'EUR', alias: ['eur', 'euro', 'euros', '欧', '欧元'] },
    { code: 'JPY', alias: ['jpy', 'yen', '円', '日元'] },
    { code: 'NZD', alias: ['nzd', 'kiwi', '新西兰元', '纽元'] },
    { code: 'GBP', alias: ['gbp', 'pound', 'pounds', 'british pound', 'sterling', '镑', '英镑'] },
    { code: 'AUD', alias: ['aud', 'australian dollar', 'aussie dollars', 'auds', '澳币', '澳元'] },
    { code: 'CAD', alias: ['cad', 'canadian dollar', 'canadian dollars', 'cads', '加币', '加元'] },
    { code: 'CHF', alias: ['chf', 'swiss franc', 'swiss francs', 'francs', '瑞士法郎', '法郎', '瑞郎'] },
    { code: 'INR', alias: ['inr', 'indian rupee', 'rupees', 'rupee', '卢比'] },
    { code: 'BRL', alias: ['brl', 'brazilian real', 'real', 'reais', '雷亚尔'] },
    { code: 'TRY', alias: ['try', '土耳其里拉', '里拉'] }
  ], 'code')
}


