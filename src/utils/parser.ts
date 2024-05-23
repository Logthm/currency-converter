type CurrencyAliasMap = { [key: string]: string }

export class Parser {
  private currencyAliases: CurrencyAliasMap = {}

  constructor(currencies: { id: number, code: string, alias: string[] }[]) {
    this.buildAliasMap(currencies)
  }

  private buildAliasMap(currencies: { id: number, code: string, alias: string[] }[]): void {
    for (const currency of currencies) {
      for (const alias of currency.alias) {
        this.currencyAliases[alias.toLowerCase()] = currency.code
      }
    }
  }

  parse(text: string, decimalSeparator: string): [number | null, string | null] {
    //amount
    let numberRegex: RegExp
    if (decimalSeparator === ',') {
      numberRegex = new RegExp('\\d[\\d.]*(?:,\\d+)?')
    } else {
      numberRegex = new RegExp('\\d[\\d,]*(?:\\.\\d+)?')
    }

    const matchNumbers = text.match(numberRegex)
    let amount = null
    if (matchNumbers) {
      if (decimalSeparator === ',') {
        amount = matchNumbers[0].replace(/\./g, '').replace(/,/g, '.')
      } else {
        amount = matchNumbers[0].replace(/,/g, '')
      }
    }

    // alias
    const currencyRegex = new RegExp(Object.keys(this.currencyAliases).join("|"), "i")
    const matchCurrencies = text.match(currencyRegex)
    const currency = matchCurrencies ? this.currencyAliases[matchCurrencies[0].toLowerCase()] : null

    return [parseFloat(amount), currency]
  }

  parseAll(text: string, decimalSeparator: string): [number | null, string | null][] {
    const results: [number | null, string | null][] = [];

    // Find all potential currency mentions
    let numberRegex: string
    if (decimalSeparator === ',') {
      numberRegex = '\\d[\\d.]*(?:,\\d+)?'
    } else {
      numberRegex = '\\d[\\d,]*(?:\\.\\d+)?'
    }
    const currencyRegex = new RegExp(`${numberRegex}\\s*(?:${Object.keys(this.currencyAliases).join("|")})`, "gi");
    const matches = text.match(currencyRegex);

    if (matches) {
      for (const match of matches) {
        results.push(this.parse(match, decimalSeparator));
      }
    }

    return results;
  }
}
