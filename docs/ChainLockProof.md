# ChainAssetLockProofWASM
This class allows to create and interact with ChainAssetLockProof struct

`ChainAssetLockProofWASM` can be created via constructor and `fromRawObject`

Constructor arguments: 
- `coreChainLockedHeight -> Number`
- `outPoint -> OutPointWASM`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
- [Static](#static)

___

### Example

```js
const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

const chainlock = new wasm.ChainAssetLockProofWASM(11, outpoint)
// or
const chainlock = wasm.ChainAssetLockProofWASM.fromRawObject({
  coreChainLockedHeight: 11,
  outPoint: Array.from(outpoint.toBytes())
})
```

___


## Fields
All fields are readable and writable.

### `coreChainLockedHeight`
Contains core chain locked height in `Number`

```js
chainlock.coreChainLockedHeight = 1111

chainlock.coreChainLockedHeight // -> Number
```

___

### `outPoint`
Contains out point for chain asset lock proof in `OutPointWASM`

```js
const outpoint = new wasm.OutPointWASM('e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d', 1)

chainlock.outPoint = 1111

chainlock.outPoint // -> OutPointWASM
```

___

## Static