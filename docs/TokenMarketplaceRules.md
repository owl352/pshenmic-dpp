# TokenMarketplaceRulesWASM

This class allows to create and interact with TokenMarketplaceRules struct

`TokenMarketplaceRulesWASM` can be created only via constructor

Constructor Arguments:
- `tradeMode -> TokenTradeModeWASM`
- `tradeModeChangeRules -> ChangeControlRulesWASM`

___

## Navigation

- [Example](#Example)
- [Static](#static)
    - [NotTradeable](#NotTradeable)

___

### Example

```js
const noOne = AuthorizedActionTakersWASM.NoOne()

const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

const tradeMode = TokenTradeModeWASM.NotTradeable()

const marketplaceRules = new TokenMarketplaceRulesWASM(
  tradeMode,
  changeRules
)
```

___

## Fields

### `tradeMode`

Allows to read and write tradeMode in `TokenTradeModeWASM`

```js
const marketplaceRules = new wasm.TokenMarketplaceRulesWASM(
  tradeMode,
  changeRules
)

marketplaceRules.tradeMode = TokenTradeModeWASM.NotTradeable()

marketplaceRules.tradeMode // -> TokenTradeModeWASM
```

___

### `tradeModeChangeRules`

Allows to read and write tradeModeChangeRules in `ChangeControlRulesWASM`

```js
const marketplaceRules = new wasm.TokenMarketplaceRulesWASM(
  tradeMode,
  changeRules
)

const noOne = AuthorizedActionTakersWASM.NoOne()

marketplaceRules.tradeModeChangeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

marketplaceRules.tradeModeChangeRules // -> ChangeControlRulesWASM
```

___
