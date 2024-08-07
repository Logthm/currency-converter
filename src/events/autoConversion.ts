import {Context, h} from 'koishi'
import {Config} from '../config'
import {converter, praser} from "../index"

export function autoConversion(ctx: Context, config: Config) {
  ctx.middleware(async (session, next) => {
    let msg = ''
    const input = h.select(session.elements, 'text')
    const channelId = session.channelId
    const platform = session.platform
    const user = await ctx.database.getUser(platform, session.userId)
    const autoConversionRes = await ctx.database.get('auto_conversion', {channel_id: channelId, channel_platform: platform})
    const decimalSeparator = await ctx.database.get('user', {id: user.id})
    for (const content of input) {
      const moneyList = praser.parseAll(content.attrs.content, decimalSeparator[0].decimal_separator || config.basic.decimalSeparator)
      for (const conversion of autoConversionRes) {
        const baseCode = conversion.base_code
        const targetCode = conversion.target_code
        for (const [amount, base] of moneyList) {
          if (base === baseCode) {
            const targetAmount = await converter.convert(amount, baseCode, targetCode, config)
            msg += `${amount} ${baseCode} = ${targetAmount} ${targetCode}\n`
          }
        }
      }
    }
    if (msg != '') session.send(msg)
    return next()
  })
}
