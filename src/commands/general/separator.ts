import {Context} from 'koishi';
import {Config} from '../../config';

export function separator(ctx: Context, config: Config) {
  ctx.command("rate.separator [msg]")
    .alias('分隔符')
    .alias('rate.sep')
    .userFields(['decimal_separator'])
    .action(async ({session}, msg) => {
      const currentSeparator = session.user.decimal_separator ? session.user.decimal_separator : config.basic.decimalSeparator
      if (!msg) {
        if (currentSeparator === ',') {
          return session.text('.current', [session.text('.comma')])
        } else if (currentSeparator === '.') {
          return session.text('.current', [session.text('.point')])
        }
      }


      let separator: string
      let separatorDescription: string
      if (msg === ',' || msg === '，') {
        separator = ','
        separatorDescription = session.text('.comma')
      } else if (msg === '.' || msg === '。') {
        separator = '.'
        separatorDescription = session.text('.point')
      } else {
        return session.text('.error')
      }
      session.user.decimal_separator = separator
      return session.text('.success', [separatorDescription])
    })
}
