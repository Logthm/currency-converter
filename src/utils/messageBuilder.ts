import {Context, Session} from 'koishi'

export async function getAutoConversionListInChannel(session: Session) {
  let msg = ''
  let idList = []
  const ctx = session.app
  const channelId = session.channelId
  const platform = session.platform
  const autoConversionRes = await ctx.database.get('auto_conversion', {channel_id: channelId, channel_platform: platform})
  ctx.database
    .select('auto_conversion')
    .where({channel_id: channelId, channel_platform: platform})
    .orderBy('id')
  let index = 1
  for (const item of autoConversionRes) {
    msg += session.text('messageBuilder.autoConversionList.item', {
      index: index,
      base: item.base_code,
      target: item.target_code,
    })
    idList.push(item.id)
    index++
  }
  return [msg, idList]
}
