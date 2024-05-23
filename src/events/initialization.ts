import {Context} from 'koishi'
import {Config} from '../config'

export function initialization(ctx: Context, config: Config) {
  ctx.on('ready', async () => {
    const rates = await ctx.database.get('exchange_rate', {})
    if (!(rates.length === 0 || new Date() > rates[0].next_update)) return
    ctx.emit('currency-converter/exchange-rate-update')

    const currencyRes = await ctx.database.get('currency', {})
    if (currencyRes.length === 0) {
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
  })
}
