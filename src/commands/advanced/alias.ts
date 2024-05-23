import {Context} from 'koishi';
import {Config} from '../../config';
import {praser} from "../../index";
import {isPluginAdmin} from "../../utils/role";

export function alias(ctx: Context, config: Config) {
  ctx.command("rate.alias <message>")
    .alias('货币别名')
    .alias('rate.a')
    .action(async ({session}, message) => {
      if (!config.permission.allowNormalUserEditAutoConversion) {
        if (!isPluginAdmin(session, config)) return session.text('commands.noAuth')
      }
      if (!message) return session.text('.empty')
      const code = praser.parse(message, '.')[1]
      if (!code) return session.text('.empty')

      await session.send(session.text('.ask', [code]))
      const input = await session.prompt()
      if (!input) return session.text('commands.timeout')
      const alias = input.split(/\r\n|\r|\n/)

      const res = await ctx.database.get('currency', {code: code})
      const resultSet = new Set<string>(res[0].alias);
      alias.forEach(item => resultSet.add(item));
      await ctx.database.set('currency', {code: code}, {alias: Array.from(resultSet)})
      return session.text('.success')
    })
}
