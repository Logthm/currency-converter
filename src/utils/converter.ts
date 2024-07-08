import {Context} from 'koishi'
import {Config} from '../config'
import {updateExchangeRates} from "./general";


export class Converter {
  private ctx: Context

  constructor(context: Context, config: Config) {
    this.ctx = context
  }

  public async convert(amount: number, baseCode: string, targetCode: string, config: Config) {
    if (baseCode === targetCode) return amount
    const rates = await this.ctx.database.get('exchange_rate', {})
    if (!(rates.length != 0 && new Date() < rates[0].next_update)) await updateExchangeRates(this.ctx, config)
    // Use Direct Rate
    const directCheckRes1 = await this.ctx.database.get('exchange_rate', {base_code: baseCode, target_code: targetCode})
    const directCheckRes2 = await this.ctx.database.get('exchange_rate', {base_code: targetCode, target_code: baseCode})
    if (directCheckRes1.length === 1) {
      const res = amount * directCheckRes1[0].rate
      return this.toPrecision(res, 4)
    } else if (directCheckRes2.length === 1) {
      const res = amount / directCheckRes2[0].rate
      return this.toPrecision(res, 4)
    }
    // Use Cross Rate
    const baseRes = await this.ctx.database.get('exchange_rate', {target_code: baseCode})
    const targetRes = await this.ctx.database.get('exchange_rate', {target_code: targetCode})
    const baseRate = baseRes[0].rate
    const targetRate = targetRes[0].rate
    const res = amount * targetRate / baseRate
    return this.toPrecision(res, 4)
  }

  public toPrecision(num: number, digits: number): number {
    const number = num.toString().split('.')
    if (number.length === 1) return num

    let result = ""
    let cnt = 0
    let flag = false
    const str = number[1]
    for (let i = 0; i < str.length; i++) {
      result += str[i]
      if (str[i] !== '0') {
        flag = true
      }
      if (flag) {
        cnt++
      }
      if (cnt === digits) {
        break;
      }
    }

    return parseFloat(`${number[0]}.${result}`)
  }
}
