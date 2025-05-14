# InstantLockWASM

This class allows to create InstantLock and interact with him.

`InstantLockWASM` can be created only via constructor

Constructor arguments:

- `version -> Number`
- `input -> [OutPointWASM]`
- `txid -> String`
- `cycleHash -> String`
- `blsSignature -> String`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
  - [version](#version)
  - [inputs](#inputs)
  - [txid](#txid)
  - [cyclehash](#cyclehash)
  - [blsSignature](#blssignature)
___

### Example

```js
const instantLock = new InstantLockWASM(
  0,
  [],
  'dbdb604952d08184b55d48c915ed78aadc81dbc5cc98e8b4821abe5b4bbcbecb',
  '00000000000000151e0fe3ab9a12c57402153c9f476236148364ec4337213101',
  'a9f131626c49a2f183b7a2f563ad1dc50ac8220190dbedb805209b608eb864e01d62f18bc9faa60a8b8a27f5a0c7c8b914fa3a14360a2f25558ee0e0a693b18faccbb59ec39b9b3cae430e0b76eb080752ce103df76537a1a583680a5914529d'
)
```

___

## Fields

All fields are readable and writable.

### `version`
This field contains version of instant lock in `Number`

```js
instantLock.version = 12

instantLock.version // -> Number
```
___

### `inputs`
This fields contains input for instant lock in array of `OutPointWASM`

```js
instantLock.inputs = [
  new OutPointWASM(
    'e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d',
    1
  )
]

instantLock.inputs // -> [OutPointWASM]
```

___

### `txid`

Contains id of transaction in `String`

```js
instantLock.txid = 'e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d'

instantLock.txid // -> String
```

___

### `cyclehash`
contains hash to figure out which quorum was used to sign this IS lock in `String`

```js
instantLock.cyclehash = '00000000000000151e0fe3ab9a12c57402153c9f476236148364ec4337213101'

instantLock.cyclehash // -> String
```

### `blsSignature`
contains BLS signature in `String`

```js
instantLock.blsSignature = 'a9f131626c49a2f183b7a2f563ad1dc50ac8220190dbedb805209b608eb864e01d62f18bc9faa60a8b8a27f5a0c7c8b914fa3a14360a2f25558ee0e0a693b18faccbb59ec39b9b3cae430e0b76eb080752ce103df76537a1a583680a5914529d'

instantLock.blsSignature // -> String
```