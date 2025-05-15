# InstantAssetLockProofWASM

This class allows to create and interact with InstantAssetLockProof struct

`InstantAssetLockProofWASM` can be created via constructor and `fromObject`

Constructor arguments:

- `instantLock -> ArrayLike`
- `transaction -> ArrayLike`
- `outputIndex -> Number`

___

## Navigation

- [Example](#Example)
- [Getters](#getters)
    - [toObject](#toobject)
    - [getOutput](#getOutput)
- [Fields](#fields)
    - [outputIndex](#outputindex)
    - [instantLock](#instantLock)
- [Static](#static)
    - [fromObject](#fromobject)

___

### Example

```js
const lockObject = {
  instantLock: instantLockBytes,
  transaction: transactionBytes,
  outputIndex: 0
}

const instantLockProof = InstantAssetLockProofWASM.fromObject(lockObject)
// or
const instantLockProof = new InstantAssetLockProofWASM(instantLockBytes, transactionBytes, 0)
```

___

## Getters

### `toObject`

Allows to convert instance to `Object`

```js
instantLockProof.toObject() // -> Object
```

___

### `getOutput`

Allows to get outputs in `TxOutWASM`

```js
instantLockProof.getOutput() // -> TxOutWASM
```

___

## Fields

All fields are readable and writable.

### `outputIndex`

Contains output index in `Number`

```js
instantLockProof.outputIndex = 1

instantLockProof.outputIndex // -> Number
```

___

### `instantLock`

Contains instant lock in `InstantLockWASM`

```js
const instantLock = new InstantLockWASM(
  0,
  [],
  'dbdb604952d08184b55d48c915ed78aadc81dbc5cc98e8b4821abe5b4bbcbecb',
  '00000000000000151e0fe3ab9a12c57402153c9f476236148364ec4337213101',
  'a9f131626c49a2f183b7a2f563ad1dc50ac8220190dbedb805209b608eb864e01d62f18bc9faa60a8b8a27f5a0c7c8b914fa3a14360a2f25558ee0e0a693b18faccbb59ec39b9b3cae430e0b76eb080752ce103df76537a1a583680a5914529d'
)

instantLockProof.instantLock = instantLock

instantLockProof.instantLock // -> InstantLockWASM
```

___

## Static

### `fromObject`

Allows to create `InstantAssetLockProofWASM` from `Object`

```js
const lockObject = {
  instantLock: instantLockBytes,
  transaction: transactionBytes,
  outputIndex: 0
}

const instantLockProof = InstantAssetLockProofWASM.fromObject(lockObject) // -> InstantAssetLockProofWASM
```