import { Context } from "koishi"

declare module 'koishi' {
  interface Tables {
    exchange_rate: exchangeRate
    currency: currency
    auto_conversion: autoConversion
  }
  interface User {
    base_currency: string
    decimal_separator: string
  }
}

interface exchangeRate {
  id: number
  next_update: Date
  base_code: string
  target_code: string
  rate: number
}

interface currency {
  id: number
  code: string
  alias: string[]
}

interface autoConversion {
  id: number
  channel_id: string
  channel_platform: string
  base_code: string
  target_code: string
}

export const name = 'Database'

export function apply(ctx: Context) {
  ctx.model.extend('user', {
    base_currency: 'string',
    decimal_separator: 'string',
  })

  ctx.database.extend('exchange_rate', {
    id: 'unsigned',
    next_update: 'timestamp',
    base_code: 'string',
    target_code: 'string',
    rate: 'float',
  }, {
    autoInc: true,
  })

  ctx.database.extend('currency', {
    id: 'unsigned',
    code: 'string',
    alias: {
      type: 'list',
      initial: [],
    }
  }, {
    autoInc: true,
  })

  ctx.database.extend('auto_conversion', {
    id: 'unsigned',
    channel_id: 'string',
    channel_platform: 'string',
    base_code: 'string',
    target_code: 'string',
  }, {
    autoInc: true,
  })
}
