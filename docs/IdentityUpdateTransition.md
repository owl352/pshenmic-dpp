# IdentityUpdateTransitionWASM

This class allows to create instance of IdentityUpdateTransition struct

`IdentityUpdateTransitionWASM` can be created via constructor, bytes and state transition

Constructor params:

- `identityId -> IdentifierWASM | String | ArrayLike`
- `revision -> BigInt`
- `nonce -> BigInt`
- `userFeeIncrease -> ?Number`
- `addPublicKeys -> [IdentityPublicKeyInCreationWASM]`
- `disablePublicKeys -> [Number]`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [revision](#revision)
    - [nonce](#nonce)
    - [identityIdentifier](#identityidentifier)
    - [publicKeyIdsToAdd](#publickeyidstoadd)
    - [publicKeyIdsToDisable](#publickeyidstodisable)
    - [userFeeIncrease](#userfeeincrease)
    - [signature](#signature)
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
const transition = new wasm.IdentityUpdateTransitionWASM(
  'GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3',
  BigInt(1),
  BigInt(1),
  1,
  [],
  []
)
```

___

## Fields

All fields are readable and writable.

### `revision`

Contains identity revision in `BigInt`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.revision = BigInt(1231)

transition.revision // -> BigInt
```

___

### `nonce`

Contains nonce in `BigInt`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.nonce = BigInt(1231)

transition.nonce // -> BigInt
```

___

### `identityIdentifier`

Contains identity identifier in `IdentifierWASM`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.identityIdentifier = '12FRq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3'

transition.identityIdentifier // -> IdentifierWASM
```

___

### `publicKeyIdsToAdd`

Contains public keys for adding in `[IdentityPublicKeyInCreationWASM]`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.publicKeyIdsToAdd = [new wasm.IdentityPublicKeyInCreationWASM(1, 'system', 'master', 'ECDSA_SECP256K1', false, [], [])]

transition.publicKeyIdsToAdd // -> [IdentityPublicKeyInCreationWASM]
```

___

### `publicKeyIdsToDisable`

Contains public keys id's for disabling in `[Number]`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.publicKeyIdsToDisable = [0, 1, 2]

transition.publicKeyIdsToDisable // -> [Number]
```

___

### `userFeeIncrease`

Contains userFeeIncrease in `Number`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.userFeeIncrease = 99

transition.userFeeIncrease // -> Number
```

___

### `signature`

Contains transition signature in `Uint8Array`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.signature = Uint8Array.from([12, 3, 4, 1])

transition.signature // -> Uint8Array
```

___

## Getters

### `getPurposeRequirement`

Returns purpose requirement in PurposeENUM `String`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.getPurposeRequirement() // -> String

```

___

### `getModifiedDataIds`

Returns modified ids in `[IdentifierWASM]`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.getModifiedDataIds() // -> [IdentifierWASM]

```

___

### `getOptionalAssetLockProof`

Returns asset lock proof in `AssetLockProofWASM | undefined`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.getOptionalAssetLockProof() // -> AssetLockProofWASM | undefined

```

___

### `getSignableBytes`

Returns bytes for sign in `Uint8Array`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.getSignableBytes() // -> Uint8Array

```

___

### `toBytes`

Returns transition in `Uint8Array`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.toBytes() // -> Uint8Array

```

___

### `toStateTransition`

Returns `StateTransitionWASM`

```js
const transition = new wasm.IdentityUpdateTransitionWASM('GL2Rq8L3VuBEQfCAZykmUaiXXrsd1Bwub2gcaMmtNbn3', BigInt(1), BigInt(1), 1, [], [])

transition.toStateTransition() // -> StateTransitionWASM

```

___
