# IdentityCreditTransferWASM

This class allows to create instance of IdentityCreditTransfer struct

`IdentityCreditTransferWASM` can be created via constructor, bytes and state transition

Constructor params:

- `amount -> BigInt`
- `sender -> IdentifierWASM | String | ArrayLike`
- `recipient -> IdentifierWASM | String | ArrayLike`
- `nonce -> BigInt`
- `platformVersion -> ?PlatformVersionEnum`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [userFeeIncrease](#userfeeincrease)
    - [senderId](#senderid)
    - [recipientId](#recipientid)
    - [amount](#amount)
    - [nonce](#nonce)
    - [signature](#signature)
    - [signaturePublicKeyId](#signaturepublickeyid)
- [Getters](#getters)
    - [getSignableBytes](#getsignablebytes)
    - [toBytes](#tobytes)
    - [toStateTransition](#tostatetransition)

___

### Example

```js
const transition = new wasm.IdentityCreditTransferWASM(
  BigInt(100),
  '11111111111111111111111111111111',
  'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec',
  BigInt(199)
)
```

___

## Fields

All fields are readable and writable.

### `userFeeIncrease`

Contains userFeeIncrease in `Number`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.userFeeIncrease = 99

transition.userFeeIncrease // -> Number
```

___

### `senderId`

Contains sender identifier in `IdentifierWASM`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.senderId = '12FRq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3'

transition.senderId // -> IdentifierWASM
```

___

### `recipientId`

Contains recipient identifier in `IdentifierWASM`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.recipientId = '12FRq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3'

transition.recipientId // -> IdentifierWASM
```

___

### `amount`

Contains credits amount for transfer in `BigInt`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.amount = BigInt(999999999)

transition.amount // -> BigInt
```

___

### `nonce`

Contains nonce in `BigInt`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.nonce = BigInt(999999999)

transition.nonce // -> BigInt
```

___

### `signature`

Contains signature in `Uint8Array`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.signature = Uint8Array.from([1, 2, 3, 4, 5])

transition.signature // -> Uint8Array
```

___

### `signaturePublicKeyId`

Contains signature public key id in `Number`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.signaturePublicKeyId = 12

transition.signaturePublicKeyId // -> Number
```

___

## Getters

### `getSignableBytes`

Returns bytes for sign in `Uint8Array`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.getSignableBytes() // -> Uint8Array

```

___

### `toBytes`

Returns transition in `Uint8Array`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.toBytes() // -> Uint8Array

```

___

### `toStateTransition`

Returns `StateTransitionWASM`

```js
const transition = new wasm.IdentityCreditTransferWASM(BigInt(100), '11111111111111111111111111111111', 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec', BigInt(199))

transition.toStateTransition() // -> StateTransitionWASM

```