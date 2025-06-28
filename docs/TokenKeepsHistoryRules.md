# TokenKeepsHistoryRulesWASM

This class allows to create and interact with TokenKeepsHistoryRules struct

You can create `TokenKeepsHistoryRulesWASM` via constructor

Constructor arguments:

- `keepsTransferHistory -> Boolean`
- `keepsFreezingHistory -> AuthorizedActionTakersWASM`
- `keepsMintingHistory -> AuthorizedActionTakersWASM`
- `keepsBurningHistory -> Boolean`
- `keepsDirectPricingHistory -> Boolean`
- `keepsDirectPurchaseHistory -> Boolean`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)

___

### Example

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)
```

___

## Fields

### `keepsTransferHistory`

Allows to read and write keepsTransferHistory

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

keepHistory.keepsTransferHistory = false

keepHistory.keepsTransferHistory // -> bool
```

___

### `keepsFreezingHistory`

Allows to read and write keepsFreezingHistory

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

keepHistory.keepsFreezingHistory = false

keepHistory.keepsFreezingHistory // -> bool
```

___

### `keepsMintingHistory`

Allows to read and write keepsMintingHistory

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

keepHistory.keepsMintingHistory = false

keepHistory.keepsMintingHistory // -> bool
```

___

### `keepsBurningHistory`

Allows to read and write keepsBurningHistory

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

keepHistory.keepsBurningHistory = false

keepHistory.keepsBurningHistory // -> bool
```

___

### `keepsDirectPricingHistory`

Allows to read and write keepsDirectPricingHistory

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

keepHistory.keepsDirectPricingHistory = false

keepHistory.keepsDirectPricingHistory // -> bool
```

___

### `keepsDirectPurchaseHistory`

Allows to read and write keepsDirectPurchaseHistory

```js
const keepHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

keepHistory.keepsDirectPurchaseHistory = false

keepHistory.keepsDirectPurchaseHistory // -> bool
```

___
