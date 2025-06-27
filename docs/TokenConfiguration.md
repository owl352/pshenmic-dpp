# TokenConfigurationWASM

This class allows to create and interact with TokenConfiguration struct

`TokenConfigurationWASM` can be created only via constructor

Constructor arguments:

- `conventions -> TokenConfigurationConventionWASM`
- `conventionsChangeRules -> ChangeControlRulesWASM`
- `baseSupply -> Number`
- `maxSupply -> Number | undefined`
- `keepsHistory -> TokenKeepsHistoryRulesWASM`
- `startAsPaused -> bool`
- `allowTransferToFrozenBalance -> bool`
- `maxSupplyChangeRules -> ChangeControlRulesWASM`
- `distributionRules -> TokenDistributionRulesWASM`
- `marketplaceRules -> TokenMarketplaceRulesWASM`
- `manualMintingRules -> ChangeControlRulesWASM`
- `manualBurningRules -> ChangeControlRulesWASM`
- `freezeRules -> ChangeControlRulesWASM`
- `unfreezeRules -> ChangeControlRulesWASM`
- `destroyFrozenFundsRules -> ChangeControlRulesWASM`
- `emergencyActionRules -> ChangeControlRulesWASM`
- `mainControlGroup -> Number | undefined`
- `mainControlGroupCanBeModified: AuthorizedActionTakersWASM`
- `description: String | undefined`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [conventions](#conventions)
    - [conventionsChangeRules](#conventionsChangeRules)
    - [baseSupply](#baseSupply)
    - [keepsHistory](#keepsHistory)
    - [startAsPaused](#startAsPaused)
    - [isAllowedTransferToFrozenBalance](#isAllowedTransferToFrozenBalance)
    - [maxSupply](#maxSupply)
    - [maxSupplyChangeRules](#maxSupplyChangeRules)
    - [distributionRules](#distributionRules)
    - [marketplaceRules](#marketplaceRules)
    - [manualMintingRules](#manualMintingRules)
    - [manualBurningRules](#manualBurningRules)
    - [freezeRules](#freezeRules)
    - [unfreezeRules](#unfreezeRules)
    - [destroyFrozenFundsRules](#destroyFrozenFundsRules)
    - [emergencyActionRules](#emergencyActionRules)
    - [mainControlGroup](#mainControlGroup)
    - [mainControlGroupCanBeModified](#mainControlGroupCanBeModified)

___

### Example

```js
const convention = new wasm.TokenConfigurationConventionWASM({
    ru: {
      shouldCapitalize: true,
      singularForm: 'TOKEN',
      pluralForm: 'TOKENS'
    }
  },
  1
)

const noOne = wasm.AuthorizedActionTakersWASM.NoOne()

const changeRules = new wasm.ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

const keepHistory = new wasm.TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

const preProgrammedDistribution = new wasm.TokenPreProgrammedDistributionWASM(
  {
    1750140416485: {
      PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
    }
  }
)

const distributionRules = new wasm.TokenDistributionRulesWASM(
  undefined,
  changeRules,
  preProgrammedDistribution,
  undefined,
  changeRules,
  true,
  changeRules,
  changeRules
)

const tradeMode = wasm.TokenTradeModeWASM.NotTradeable()

const marketplaceRules = new wasm.TokenMarketplaceRulesWASM(
  tradeMode,
  changeRules
)

const config = new wasm.TokenConfigurationWASM(
  convention,
  changeRules,
  BigInt(999999999),
  undefined,
  keepHistory,
  false,
  false,
  changeRules,
  distributionRules,
  marketplaceRules,
  changeRules,
  changeRules,
  changeRules,
  changeRules,
  changeRules,
  changeRules,
  undefined,
  noOne,
  'note'
)
```

___

## Fields

All fields are readable and writable.

### `conventions`

Allows to read and write value of token conventions in `TokenConfigurationConventionWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.conventions = new TokenConfigurationConventionWASM({
    ru: {
      shouldCapitalize: true,
      singularForm: 'TOKEN',
      pluralForm: 'TOKENS'
    }
  },
  1)

out.conventions // -> TokenConfigurationConventionWASM
```

___

### `conventionsChangeRules`

Allows to read and write value of token conventionsChangeRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.conventionsChangeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

out.conventionsChangeRules // -> ChangeControlRulesWASM
```

___

### `baseSupply`

Allows to read and write value of token baseSupply in `BigInt`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.baseSupply = BigInt(11)

out.conventionsChangeRules // -> BigInt
```

___

### `keepsHistory`

Allows to read and write value of token keepsHistory in `TokenKeepsHistoryRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.keepsHistory = new TokenKeepsHistoryRulesWASM(
  true,
  true,
  true,
  true,
  true,
  true
)

out.keepsHistory // -> TokenKeepsHistoryRulesWASM
```

___

### `startAsPaused`

Allows to read and write value of token startAsPaused in `Boolean`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.startAsPaused = true

out.startAsPaused // -> Boolean
```

___

### `isAllowedTransferToFrozenBalance`

Allows to read and write value of token allowedTransferToFrozenBalance in `Boolean`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.isAllowedTransferToFrozenBalance = true

out.isAllowedTransferToFrozenBalance // -> Boolean
```

___

### `maxSupply`

Allows to read and write value of token maxSupply in `BigInt | undefined`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.maxSupply = undefined
out.maxSupply = BigInt(11)

out.maxSupply // -> BigInt | undefined
```

___

### `maxSupplyChangeRules`

Allows to read and write value of token maxSupplyChangeRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.maxSupplyChangeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.maxSupplyChangeRules // -> ChangeControlRulesWASM
```

___

### `distributionRules`

Allows to read and write value of token distributionRules in `TokenDistributionRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

const preProgrammedDistribution = new TokenPreProgrammedDistributionWASM(
  {
    1750140416485: {
      PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
    }
  }
)

out.distributionRules = new TokenDistributionRulesWASM(
  undefined,
  changeRules,
  preProgrammedDistribution,
  undefined,
  changeRules,
  true,
  changeRules,
  changeRules
)


out.distributionRules // -> TokenDistributionRulesWASM
```

___

### `marketplaceRules`

Allows to read and write value of token marketplaceRules in `TokenMarketplaceRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

const changeRules =  new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

const tradeMode = wasm.TokenTradeModeWASM.NotTradeable()

out.marketplaceRules = new wasm.TokenMarketplaceRulesWASM(
  tradeMode,
  changeRules
)


out.marketplaceRules // -> TokenMarketplaceRulesWASM
```

___

### `manualMintingRules`

Allows to read and write value of token manualMintingRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.manualMintingRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.manualMintingRules // -> ChangeControlRulesWASM
```

___

### `manualBurningRules`

Allows to read and write value of token manualBurningRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.manualBurningRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.manualBurningRules // -> ChangeControlRulesWASM
```

___

### `freezeRules`

Allows to read and write value of token freezeRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.freezeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.freezeRules // -> ChangeControlRulesWASM
```

___

### `unfreezeRules`

Allows to read and write value of token unfreezeRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.unfreezeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.unfreezeRules // -> ChangeControlRulesWASM
```

___

### `destroyFrozenFundsRules`

Allows to read and write value of token destroyFrozenFundsRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.destroyFrozenFundsRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.destroyFrozenFundsRules // -> ChangeControlRulesWASM
```

___

### `emergencyActionRules`

Allows to read and write value of token emergencyActionRules in `ChangeControlRulesWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.emergencyActionRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)


out.emergencyActionRules // -> ChangeControlRulesWASM
```

___

### `mainControlGroup`

Allows to read and write value of token mainControlGroup in `Number | undefined`

```js
const out = new TokenConfigurationWASM(/* ... */)

out.mainControlGroup = undefined
out.mainControlGroup = 1

out.mainControlGroup // -> Number | undefined
```

___

### `mainControlGroupCanBeModified`

Allows to read and write value of token mainControlGroupCanBeModified in `AuthorizedActionTakersWASM`

```js
const out = new TokenConfigurationWASM(/* ... */)

const noOne = AuthorizedActionTakersWASM.NoOne()

out.mainControlGroupCanBeModified = noOne

out.mainControlGroupCanBeModified // -> AuthorizedActionTakersWASM
```

___