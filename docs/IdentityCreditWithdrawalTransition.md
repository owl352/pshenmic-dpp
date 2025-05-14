# IdentityCreditWithdrawalTransitionWASM

This class allows to create instance of IdentityCreditWithdrawalTransition struct

`IdentityCreditWithdrawalTransitionWASM` can be created via constructor, bytes and state transition

Constructor params:

- `identityId -> IdentifierWASM | String | ArrayLike`
- `amount -> BigInt`
- `coreFeePerByte -> Number`
- `pooling -> PoolingENUM`
- `outputScript -> OutPutScript`
- `nonce -> BigInt`
- `userFeeIncrease -> Number`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [userFeeIncrease](#userfeeincrease)
    - [identityId](#identityid)
    - [amount](#amount)
    - [nonce](#nonce)
    - [signature](#signature)
    - [signaturePublicKeyId](#signaturepublickeyid)
    - [pooling](#pooling)
    - [outputScript](#outputscript)
- [Getters](#getters)
    - [getPurposeRequirement](#getpurposerequirement)
    - [getModifiedDataIds](#getmodifieddataids)
    - [getOptionalAssetLockProof](#getoptionalassetlockproof)
    - [getSignableBytes](#getsignablebytes)
    - [toBytes](#tobytes)
    - [toStateTransition](#tostatetransition)

___

### Example

```js
const identifier = new wasm.IdentifierWASM('GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec')
const script = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)
```

___

## Fields

All fields are readable and writable.

### `userFeeIncrease`

Contains userFeeIncrease in `Number`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.userFeeIncrease = 99

transition.userFeeIncrease // -> Number
```

___

### `identityId`

Contains identity identifier in `IdentifierWASM`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.identityId = '12FRq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3'

transition.identityId // -> IdentifierWASM
```

___

### `amount`

Contains credits amount for transfer in `BigInt`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.amount = BigInt(999999999)

transition.amount // -> BigInt
```

___

### `nonce`

Contains nonce in `BigInt`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.nonce = BigInt(999999999)

transition.nonce // -> BigInt
```

___

### `signature`

Contains signature in `Uint8Array`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.signature = Uint8Array.from([1, 2, 3, 4, 5])

transition.signature // -> Uint8Array
```

___

### `signaturePublicKeyId`

Contains signature public key id in `Number`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.signaturePublicKeyId = 12

transition.signaturePublicKeyId // -> Number
```

___

### `pooling`

Contains pooling enum in `String`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.pooling = "never"

transition.pooling // -> Number
```

___

### `outputScript`

Contains output script in `CoreScriptWASM | undefined`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.outputScript = wasm.CoreScriptWASM.newP2PKH([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

transition.outputScript // -> CoreScriptWASM
```

___

## Getters

### `getPurposeRequirement`

Returns purpose requirement in PurposeENUM `String`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.getPurposeRequirement() // -> String

```

___

### `getModifiedDataIds`

Returns modified ids in `[IdentifierWASM]`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.getModifiedDataIds() // -> [IdentifierWASM]

```

___

### `getOptionalAssetLockProof`

Returns asset lock proof in `AssetLockProofWASM | undefined`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.getOptionalAssetLockProof() // -> AssetLockProofWASM | undefined

```

___

### `getSignableBytes`

Returns bytes for sign in `Uint8Array`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.getSignableBytes() // -> Uint8Array

```

___

### `toBytes`

Returns transition in `Uint8Array`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.toBytes() // -> Uint8Array

```

___

### `toStateTransition`

Returns `StateTransitionWASM`

```js
const transition = new wasm.IdentityCreditWithdrawalTransitionWASM(identifier, BigInt(111), 1, 'never', script, BigInt(1), 1)

transition.toStateTransition() // -> StateTransitionWASM

```