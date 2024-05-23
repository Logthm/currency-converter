---
description: >-
  Currency Converter 是一个提供汇率转换功能的插件。本页将提供一些有用的建议或解释，帮助你快速开始使用 Currency
  Converter。
---

# 快速游览

## 国际化

如果你习惯使用其他货币，你可以设置你的[基准货币](basic/base-currency.md)。

如果你习惯使用 `,` 而非 `.` 作为整数与小数的分隔符，你可以设置[分隔符](basic/decimal-separator.md)。

如果你使用其他语言，你可以切换语言偏好。

## 汇率转换的精确度

对于包含小数的结果，Currency Converter 将保留4位有效数字。

Currency Converter 使用 [exchangerate-api.com](https://www.exchangerate-api.com/) 提供的免费 api 获取汇率信息，该信息每天更新一次。

对于以下货币参与的转换，Currency Converter 使用直接汇率（Direct Rate）。

对于不包含以下货币的转换，Currency Converter 使用以 USD 为中介的交叉汇率（Cross Rate）。

支持直接转换的货币：

* USD (美元)
* CNY (人民币)
* EUR (欧元)
* JPY (日元)
* GBP (英镑)
* AUD (澳元)
* NZD (新西兰元)
* CAD (加拿大元)
* CHF (瑞士法郎)
