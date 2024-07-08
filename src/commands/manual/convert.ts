import {Context} from 'koishi';
import {Config} from "../../config"
import {converter} from "../../index"
import {praser} from "../../index"

export function convert(ctx: Context, config: Config) {
  ctx.command("rate.convert <message:text>")
    .alias('汇率')
    .alias('rate.conv')
    .userFields(['base_currency', 'decimal_separator'])
    .action(async ({session}, message) => {
      const currentSeparator = session.user.decimal_separator ? session.user.decimal_separator : config.basic.decimalSeparator
      if (!message) return session.text('.empty')
      const [base, target = session.user.base_currency || config.basic.baseCurrency] = message.split(/ to | To | TO /i)

      const targetCode = praser.parse(target, currentSeparator)[1]
      let [amount, baseCode] = praser.parse(base, currentSeparator)

      if (!amount) {
        // ask for amount
        await session.send(session.text('.input', [baseCode]))
        const input = await session.prompt()
        if (!input) return session.text('commands.timeout')
        amount = praser.parse(input, currentSeparator)[0]
      }

      try {
        const targetAmount = await converter.convert(Number(amount), baseCode, targetCode, config)
        if (currentSeparator === ',') {
          const a = amount.toString().replace('.', ',')
          const t = targetAmount.toString().replace('.', ',')
          return a + ' ' + baseCode + ' = ' + t + ' ' + targetCode
        }
        return amount + ' ' + baseCode + ' = ' + targetAmount + ' ' + targetCode
      } catch (e) {
        return session.text('.errorInputFormat')
      }
    })
}
