---
description: 将一种货币转换为另一种货币
---

# 手动转换

```
/rate conv A to B
/ra conv A to B
/汇率 A to B
```

A 可直接填写 [带单位金额](../glossary/amount-with-unit.md) ，也可为 [货币代码](../glossary/currency-code.md) 或 [别称](../glossary/alias.md)

B 为一个 [货币代码](../glossary/currency-code.md) 或 [别称](../glossary/alias.md)

## 用法

```
将美元转换为人民币（不填写数量时，Currency Converter 将在之后询问数量）
/ra conv USD to CNY

将 100 欧元转换为美元（支持使用别称）
/ra conv 100euro to 人民币

将 99999.9 美元转换为人民币（支持使用分隔符）
/ra conv 99,999.9 美刀 to rmb
```
