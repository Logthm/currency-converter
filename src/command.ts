import { Context } from "koishi"
import { Config } from "./config"

import {help} from "./commands/general/help";
import {base} from "./commands/general/base";
import {separator} from "./commands/general/separator";

import {convert} from "./commands/manual/convert";

import {add} from "./commands/auto/add";
import {remove} from "./commands/auto/remove";
import {list} from "./commands/auto/list";

import {detail} from "./commands/advanced/detail";
import {alias} from "./commands/advanced/alias";

export const name = 'Command'

export function apply(ctx: Context, config: Config) {
  ctx.command('rate').alias('ra')
  help(ctx, config)
  base(ctx, config)
  separator(ctx, config)
  convert(ctx, config)
  add(ctx, config)
  remove(ctx, config)
  list(ctx, config)
  detail(ctx, config)
  alias(ctx, config)
}
