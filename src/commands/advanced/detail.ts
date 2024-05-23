import {Context} from 'koishi';
import {Config} from '../../config';
import {converter, praser} from "../../index";

export function detail(ctx: Context, config: Config) {
  ctx.command("rate.detail <message>")
    .alias('货币')
    .alias('rate.d')
    .userFields(['base_currency', 'decimal_separator'])
    .action(async ({session}, message) => {
      if (!message) return session.text('.empty')
      const code = praser.parse(message, '.')[1]
      if (!code) return session.text('.empty')

      const targetAmount = await converter.convert(1, session.user.base_currency || config.basic.baseCurrency, code)
      const currentSeparator = session.user.decimal_separator ? session.user.decimal_separator : config.basic.decimalSeparator
      const res = await ctx.database.get('currency', {code: code})
      return session.text('.detail', {
        code: res[0].code,
        alias: res[0].alias.toLocaleString(),
        rate: targetAmount,
        base: session.user.base_currency || config.basic.baseCurrency,
      })
    })
}
