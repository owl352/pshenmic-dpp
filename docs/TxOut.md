# TxOutWASM

This class allows to create and interact with TxOut struct

`TxOutWASM` can be created only via constructor

Constructor arguments:

- `value -> BigInt`
- `scriptPublicKey -> String | ArrayLike`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [value](#value)
    - [scriptPubKeyHex](#scriptpubkeyhex)
    - [scriptPubKeyBytes](#scriptpubkeybytes)
- [Static](#static)
    - [getScriptPubKeyASM](#getscriptpubkeyasm)

___

### Example

```js
const out = new TxOutWASM(
  BigInt(100),
  '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac'
)
```

___

## Fields

All fields are readable and writable.

### `value`

Allows to read and write value of TxOut in `BigInt`

```js
const out = new TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

out.value = BigInt(101)

out.value // -> BigInt
```

___

### `scriptPubKeyHex`

Allows to get script public key in HEX `String`

```js
const out = new TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

out.scriptPubKeyHex = '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac'

out.scriptPubKeyHex // -> String
```

___

### `scriptPubKeyBytes`

Same as [scriptPubKeyHex](#scriptpubkeyhex) but in bytes

```js
const out = new TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

out.scriptPubKeyBytes = []

out.scriptPubKeyBytes // -> Uint8Array
```

___

## Static

### `getScriptPubKeyASM`

Allows to get script in ASM `String`

```js
const out = new TxOutWASM(BigInt(100), '76a9141a486a3855e6dc6dd02874424f53a6f2197b3d4588ac')

out.getScriptPubKeyASM() // -> String
```