import { Context } from "koishi"
import { Config } from "./config"

import {initialization} from "./events/initialization";
import {autoConversion} from "./events/autoConversion";

export const name = 'Events'

declare module 'koishi' {
  interface Events {}
}

export function apply(ctx: Context, config: Config) {
  initialization(ctx, config)
  autoConversion(ctx, config)
}
