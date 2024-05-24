---
description: 将一种货币转换为你设置的基准货币
---

# 转换为基准货币

```
/rate convert A
/ra conv A
/汇率 A
```

A 为一个[带单位的金额](../glossary/amount-with-unit.md)，也可为 [货币代码](../glossary/currency-code.md) 或 [别称](../glossary/alias.md)

## 用法

<pre><code><strong>若基准货币为 CNY ：
</strong><strong>将美元转换为人民币（不填写数量时，Currency Converter 将在之后询问数量）
</strong>/ra conv USD

将 100 欧元转换为人民币（支持使用别称）
/ra conv 100euro

将 99999.9 美元转换为人民币（支持使用分隔符）
/ra conv 99,999.9 美刀
</code></pre>
