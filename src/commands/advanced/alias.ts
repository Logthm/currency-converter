import {Context} from 'koishi';
import {Config} from '../../config';
import {praser} from "../../index";
import {isPluginAdmin} from "../../utils/role";
import {initCurrencyAlias} from "../../utils/general";

export function alias(ctx: Context, config: Config) {
  ctx.command("rate.alias <message>")
    .alias('货币别名')
    .alias('rate.a')
    .option('reset', '-r')
    .action(async ({session, options}, message) => {
      if (options.reset) {
        if (!isPluginAdmin(session, config)) return session.text('commands.noAuth')
        await ctx.database.remove('currency', {})
        await initCurrencyAlias(ctx, config)
        return session.text('.reset')
      }
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
