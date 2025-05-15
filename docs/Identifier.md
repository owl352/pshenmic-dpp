# IdentifierWASM

This class allows to store identifiers.

Can be created via constructor from:
- `base58`
- `IdentifierWASM`
- `ArrayLike`

This class also allows to create `IdentifierWASM` via static methods:
- `fromBase58("...")`
- `fromBase64("...")`
- `fromHex("...")`
- `fromBytes([...])`

Allow to get Identifier in multiple formats by these methods:
- `base58() -> String`
- `base64() -> String`
- `hex() -> String`
- `bytes() -> Uint8Array`

Usage:
```js
const identifier = IdentifierWASM.fromBase58('ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U')

// Output: 'ckBqfQe7LU7vwrwXopyCB4n5phZShjA16BGhNGpsD5U'
console.log(identifier.base58())

// Output: 'CSgo7cCB07oaVPBDJZuUE2jyxxiIGwap00eIOyG/4xM='
console.log(identifier.base64())

// Output: '092828edc081d3ba1a54f043259b941368f2c718881b06a9d347883b21bfe313'
console.log(identifier.hex())

// Output: Uint8Array <...>
console.log(identifier.bytes())
```