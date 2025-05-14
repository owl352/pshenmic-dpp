# PrivateKeyWASM

This class allows to create PrivateKey instance

___

## Navigation

- [Example](#example)
- [Static methods](#static-mehtods)
    - [fromWIF](#fromwif)
    - [fromBytes](#frombytes)
    - [fromHex](#fromhex)
- [Getters methods](#getters-methods)
    - [getWIF](#getwif)
    - [getBytes](#getbytes)
    - [getHex](#gethex)
    - [getPublicKeyHash](#getpublickeyhash)

___

## Example

```js
const pkey = PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')
```

___

## Static mehtods

### `fromWIF`

Allows to create `PrivateKeyWASM` from WIF `String`

```js
PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')
```

___

### `fromBytes`

Allows to create `PrivateKey` from bytes in `ArrayLike`

```js
const bytes = [103, 173, 22, 105, 216, 130, 218, 37, 107, 111, 160, 94, 27, 10, 227, 132, 166, 172, 138, 237, 20, 110, 165, 54, 2, 184, 255, 14, 30, 156, 24, 233]

PrivateKeyWASM.fromBytes(bytes, 'Mainnet')
```

___

### `fromHex`

Allows to create `PrivateKey` from bytes in Hex `String`

```js
const hex = '67ad1669d882da256b6fa05e1b0ae384a6ac8aed146ea53602b8ff0e1e9c18e9'

PrivateKeyWASM.fromHex(hex, 'Mainnet')
```

___

## Getters methods

### `getWIF`

Allows to return PrivateKey WIF in `String`

```js
const key = PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')

key.getWIF() // -> WIF String
```

___

### `getBytes`

Allows to return PrivateKey bytes in `ArrayLike`

```js
const key = PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')

key.getBytes() // -> ArrayLike
```

___

### `getHex`

Allows to return PrivateKey bytes in hex `String`

```js
const key = PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')

key.getHex() // -> String
```

___

### `getPublicKeyHash`

Allows to return PublicKey hash from PrivateKey in `String`

```js
const key = PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')

key.getPublicKeyHash() // -> String
```