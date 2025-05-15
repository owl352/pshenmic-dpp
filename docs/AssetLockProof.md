# AssetLockProofWASM

This class allows to create chain or instant lock proof very quick.
Also, this structure allows to pass different types of locks to methods.

You can create `AssetLockProofWASM` via constructor or one of static methods

Arguments in constructor:

- `assteLockProofType -> AssetLockProofTypeENUM`

___

## Navigation

- [Example](#Example)
- [Getters](#getters)
    - [getLockType](#getlocktype)
    - [getInstantLockProof](#getinstantlockproof)
    - [getChainLockProof](#getchainlockproof)
    - [toObject](#toobject)
- [Static](#static)
    - [createInstantAssetLockProof](#createinstantassetlockproof)
    - [createChainAssetLockProof](#createchainassetlockproof)

___

### Example

```js
const instantLockProof = new AssetLockProofWASM('instant')

const outpoint = new OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

const chainLockProof = AssetLockProofWASM.createChainAssetLockProof(1, outpoint)
```

___

## Getters

### `getLockType`

Allows to get lock type in `String`

```js
lockProofInstance.getLockType() // -> String (Chain or Instant)
```

___

### `getInstantLockProof`

Returns instant lock proof in `InstantAssetLockProofWASM`

```js
lockProofInstance.getInstantLockProof() // -> InstantAssetLockProofWASM
```

___

### `getChainLockProof`

Returns chain lock proof in `ChainAssetLockProofWASM`

```js
lockProofInstance.getChainLockProof() // -> ChainAssetLockProofWASM
```

___

### `toObject`

Returns lock in `Object`

```js
lockProofInstance.toObject() // -> Object
```

___

## Static

### `createInstantAssetLockProof`

Allows to create Instant lock in `AssetLockProofWASM` struct

- `instantLockBytes -> ArrayLike`
- `transactionBytes -> ArrayLike`
- `outputIndex -> Number`

```js
AssetLockProofWASM.createInstantAssetLockProof([], [], 0) // -> AssetLockProofWASM 
```

___

### `createChainAssetLockProof`

Allows to create Chain lock in `AssetLockProofWASM` struct

- `coreChainLockedHeight -> Number`
- `outPoint -> OutPointWASM`

```js
AssetLockProofWASM.createChainAssetLockProof(0, outpointWASMInstance) // -> AssetLockProofWASM 
```