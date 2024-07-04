import { Schema } from "koishi"
import zhCN from './locales/zh-CN.yml'
import enUS from './locales/en-US.yml'

namespace BasicConfig {
  export interface Config {
    apiKey: string
    baseCurrency: string
    decimalSeparator: ',' | '.'
  }
}

namespace PermissionConfig {
  export interface Config {
    adminUsers?: string[]
    allowNormalUserEditAutoConversion: boolean
    allowUserEditAlias: boolean
  }
}

export interface Config {
  basic: BasicConfig.Config
  permission: PermissionConfig.Config
}

const basicConfig: Schema<BasicConfig.Config> = Schema.object({
  apiKey: Schema.string().required(),
  baseCurrency: Schema.string().default("CNY"),
  decimalSeparator: Schema.union([',', '.']).default('.'),
})

const permissionConfig: Schema<PermissionConfig.Config> = Schema.object({
  adminUsers: Schema.union([
    Schema.array(String),
    Schema.transform(String, adminUsers => [adminUsers]),
  ]),
  allowNormalUserEditAutoConversion: Schema.boolean().default(true),
  allowUserEditAlias: Schema.boolean().default(true),
})

export const Config: Schema<Config> = Schema.object({
  basic: basicConfig,
  permission: permissionConfig,
}).i18n({
  "en-US": enUS._config,
  "zh-CN": zhCN._config
})
