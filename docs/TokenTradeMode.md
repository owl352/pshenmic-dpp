# TokenTradeModeWASM

This class allows to create and interact with TokenTradeMode struct

`TokenTradeModeWASM` can be created only via static methods

___

## Navigation

- [Example](#Example)
- [Static](#static)
    - [NotTradeable](#NotTradeable)
- [Getters](#getters)
  - [getValue](#getvalue)

___

### Example

```js
const tradeMode = TokenTradeModeWASM.NotTradeable()
```

___

## Static

### `NotTradeable`

Allows to get TokenTradeMode with `NotTradeable` value

```js
const tradeMode = TokenTradeModeWASM.NotTradeable()
```

___

## Getters

### `getValue`

Allows to get value

```js
const tradeMode = TokenTradeModeWASM.NotTradeable()

tradeMode.getValue() // -> String
```