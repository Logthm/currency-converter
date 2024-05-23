import { Context } from "koishi"
import { Config } from "./config"

import {initialization} from "./events/initialization";
import {updateExchangeRates} from "./events/updateExchangeRates";
import {autoConversion} from "./events/autoConversion";

export const name = 'Events'

declare module 'koishi' {
  interface Events {
    'currency-converter/exchange-rate-update'(): void
  }
}

export function apply(ctx: Context, config: Config) {
  initialization(ctx, config)
  updateExchangeRates(ctx, config)
  autoConversion(ctx, config)
}
