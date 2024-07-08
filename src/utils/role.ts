import { Config } from '../index';

export * from '../config'

export function hasPermission(...perms: boolean[]): boolean {
  return perms.some(perm => perm === true)
}

export function isPluginAdmin(session: any, config: Config): boolean {
  if (config.permission.adminUsers === undefined) return false
  return config.permission.adminUsers.includes(session.userId)
}

export function isGuildAdmin(session: any): boolean {
  const platform = session.event.platform
  let guildMember: string

  if (platform === 'onebot') {
    guildMember = session.event.member.roles[0]
    return guildMember === 'owner' || guildMember === 'admin' || guildMember === 'SUBCHANNEL_ADMIN' || guildMember === 'OWNER' || guildMember === 'ADMIN'
  } else if (platform === 'qq') {
    // TODO: Support official qq bot

    return true
  } else {
    return true
  }
}
