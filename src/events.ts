import { Context } from "koishi";
import { Config } from "./config";

import { autoConversion } from "./events/autoConversion";

export const name = "Events";

declare module "koishi" {
  interface Events {}
}

export function apply(ctx: Context, config: Config) {
  autoConversion(ctx, config);
}
