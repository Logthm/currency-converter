import {Context} from 'koishi';
import {Config} from '../../config';
import {hasPermission, isGuildAdmin, isPluginAdmin} from "../../utils/role";
import {praser} from "../../index";

export function add(ctx: Context, config: Config) {
  ctx.command("rate.auto.add <message:text>")
    .alias('创建转换')
    .userFields(['base_currency', 'decimal_separator'])
    .action(async ({session}, message) => {
      if (!config.permission.allowNormalUserEditAutoConversion) {
        if (hasPermission(
          isGuildAdmin(session),
          isPluginAdmin(session, config)
        )) return session.text('commands.noAuth')
      }

      if (!message) return session.text('.empty')
      const [base, target = session.user.base_currency || config.basic.baseCurrency] = message.split(/ to | To | TO /i)

      const targetCode = praser.parse(target, session.user.decimal_separator || config.basic.decimalSeparator)[1]
      const baseCode = praser.parse(base, session.user.decimal_separator || config.basic.decimalSeparator)[1]

      const channelId = session.channelId
      const platform = session.platform
      const autoConversionRes = await ctx.database.get('auto_conversion', {
        channel_id: channelId,
        channel_platform: platform,
        base_code: baseCode,
        target_code: targetCode
      })
      if (autoConversionRes.length != 0) return session.text('.exist')
      await ctx.database.create('auto_conversion', {
        channel_id: channelId,
        channel_platform: platform,
        base_code: baseCode,
        target_code: targetCode
      })
      return session.text('.success', [`${baseCode} to ${targetCode}`])
    })
}
