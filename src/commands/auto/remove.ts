import {Context} from 'koishi';
import {Config} from '../../config';
import {hasPermission, isGuildAdmin, isPluginAdmin} from "../../utils/role";
import {getAutoConversionListInChannel} from "../../utils/messageBuilder";

export function remove(ctx: Context, config: Config) {
  ctx.command("rate.auto.remove")
    .alias('删除转换')
    .alias('rate.auto.rm')
    .action(async ({session}) => {
      if (!config.permission.allowNormalUserEditAutoConversion) {
        if (hasPermission(
          isGuildAdmin(session),
          isPluginAdmin(session, config)
        )) return session.text('commands.noAuth')
      }

      const [list, idList] = await getAutoConversionListInChannel(session)
      if (list === '') return session.text('.empty')

      await session.send(session.text('.header') + list)
      const input = await session.prompt()
      if (!input) return session.text('commands.timeout')
      try {
        const m = await ctx.database.get('auto_conversion', {id: idList[parseInt(input) - 1]})
        await ctx.database.remove('auto_conversion', {id: idList[parseInt(input) - 1]})
        return session.text('.success', [m[0].base_code, m[0].target_code])
      } catch(e) {
        return session.text('.error')
      }
    })
}
