# PrefundedVotingBalanceWASM

This class allows to create PrefundedVotingBalance instance and interact.

`PrefundedVotingBalanceWASM` can be created only via constructor

Constructor arguments: 
- `indexName -> String`
- `credits -> BigInt`

___
## Navigation

- [Example](#example)
- [Fields](#fields)
  - [indexName](#indexname)
  - [credits](#credits)
___
## Example

```js
new PrefundedVotingBalanceWASM('value', BigInt(9999))
```

___

## Fields
All fields only readable.

### `indexName`
Contains index name with value for voting in `String`

```js
const prefundedVotingBalance = new PrefundedVotingBalanceWASM('value', BigInt(9999))

prefundedVotingBalance.indexName // -> String
```

___

### `credits`
Contains amount of credits for voting in `BigInt`

```js
const prefundedVotingBalance = new PrefundedVotingBalanceWASM('value', BigInt(9999))

prefundedVotingBalance.credits // -> BigInt
```