import {Context} from 'koishi';
import {Config} from '../../config';

export function help(ctx: Context, config: Config) {
  ctx.command("rate.help")
    .alias('汇率帮助')
    .alias('rate.h')
    .action(({session}) => {
      return session.text('.help')
    })
}
