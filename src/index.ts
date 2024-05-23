import { Context, Logger } from "koishi"
import { Config } from "./config"
import * as Database from "./database"
import * as Command from "./command"
import * as Events from "./events"
import {Converter} from "./utils/converter"
import {Parser} from "./utils/parser"

export * from "./config"

export const name = 'currency-converter'
export const inject = ['database']
export const logger = new Logger('Currency Converter')
export let converter: Converter
export let praser: Parser

export async function apply(ctx: Context, config: Config) {
  // localization
  ['en-US', 'zh-CN']
    .forEach(lang => ctx.i18n.define(lang, require(`./locales/${lang}`)))
  // initialization
  ctx.plugin(Database)
  ctx.plugin(Events, config)
  ctx.plugin(Command, config)
  converter = new Converter(ctx, config)
  praser = new Parser(await ctx.database.get('currency', {}))
}
