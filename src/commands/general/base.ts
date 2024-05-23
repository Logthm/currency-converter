import {Context} from 'koishi';
import {Config} from '../../config';
import {praser} from "../../index";

export function base(ctx: Context, config: Config) {
  ctx.command("rate.base [msg]")
    .alias('基准货币')
    .userFields(['base_currency'])
    .action(({session}, msg) => {
      if (!msg) return session.text('.current', [session.user.base_currency? session.user.base_currency : config.basic.baseCurrency])
      const baseCode = praser.parse(msg, session.user.base_currency || config.basic.decimalSeparator)[1]
      if (!baseCode) return session.text('.error')
      session.user.base_currency = baseCode
      return session.text('.success', [baseCode])
    })
}
