import {Context} from 'koishi';
import {Config} from '../../config';
import {getAutoConversionListInChannel} from "../../utils/messageBuilder";

export function list(ctx: Context, config: Config) {
  ctx.command('rate.auto.list')
    .alias('转换列表')
    .alias('rate.auto.ls')
    .action(async ({session}) => {
      const [list, idList] = await getAutoConversionListInChannel(session)
      if (list === '') return session.text('.empty')

      return session.text('.header') + list
    })
}
