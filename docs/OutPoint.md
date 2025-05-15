# OutPointWASM

This class allows to create and interact with OutPoint struct

You can create `OutPointWASM` via constructor and `fromBytes`

If you want to create `OutPoint` from bytes,
you need to use serialized to bytes `OutPoint` from `rs-dpp` or `pshenmic-dpp`

Constructor arguments:

- `txid -> HEX String`
- `vout -> Number`

___

## Navigation

- [Example](#Example)
- [Getters](#getters)
    - [getVOUT](#getvout)
    - [getTXID](#gettxid)
    - [toBytes](#tobytes)
- [Static](#static)
    - [fromBytes](#frombytes)

___

### Example

```js
const outpoint = new OutPointWASM(
  'e8b43025641eea4fd21190f01bd870ef90f1a8b199d8fc3376c5b62c0b1a179d',
  1
)
```

___

## Getters

### `getVOUT`

Allows to get vout in `Number`

```js
outpoint.getVOUT() // -> Number
```

___

### `getTXID`

Allows to get tx id in `String`

```js
outpoint.getTXID() // -> String
```

___

### `toBytes`

Allows to get OutPoint in `Uint8Array`

```js
outpoint.toBytes() // -> Uint8Array
```

___

## Static

### `fromBytes`

Allows to create `OutPointWASM` from bytes in `ArrayLike`

```js
const outpoint = OutpointWASM.fromBytes([]) // -> OutPointWASM
```