# IdentityWASM

This class allows to create Identity instance and interact

You can create `IdentityWASM` via constructor and bytes

Arguments:

- `identifier -> IdentifierWASM | String | ArrayLike`

If you want to create Document from bytes,
you need to use serialized to bytes Document from `rs-dpp` or `pshenmic-dpp`

___

## Navigation

- [Example](#example)
- [Getters methods](#getters-methods)
    - [getId](#getid)
    - [getBalance](#getbalance)
    - [getRevision](#getrevision)
    - [getPublicKeyById](#getpublickeybyid)
    - [getPublicKeys](#getpublickeys)
- [Setters methods](#setters-methods)
    - [setId](#setid)
    - [setBalance](#setbalance)
    - [setRevision](#setrevision)
    - [addPublicKey](#addpublickey)

___

## Example

```js
const identity = new IdentityWASM('H2pb35GtKpjLinncBYeMsXkdDYXCbsFzzVmssce6pSJ1')
```

___

## Getters methods

### `getId`

Returns Identity identifier in `IdentifierWASM`

```js
identityInstance.getId() // -> IdentifierWASM
```

___

### `getBalance`

Returns Identity balance in `BigInt`

```js
identityInstance.getBalance() // -> BigInt
```

___

### `getRevision`

Returns Identity revision in `BigInt`

```js
identityInstance.getRevision() // -> BigInt
```

___

### `getPublicKeyById`

Returns Identity public key with selected id in `IdentityPublicKeyWASM`

```js
identityInstance.getPublicKeyById(1) // -> IdentityPublicKeyWASM
```

___

### `getPublicKeys`

Returns Identity all public keys in `[IdentityPublicKeyWASM]`

```js
identityInstance.getPublicKeys() // -> [IdentityPublicKeyWASM]
```

___

## Setters methods

### `setId`

Allows to set Identity identifier in `IdentifierWASM | String | ArrayLike`

```js
identityInstance.getId('GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit')
```

___

### `setBalance`

Allows to set Identity balance in `BigInt`

```js
identityInstance.setBalance(BigInt(1))
```

___

### `setRevision`

Allows to set Identity revision in `BigInt`

```js
identityInstance.setRevision(BigInt(21))
```

___

### `addPublicKey`

Allows to add Identity public key with selected id in `IdentityPublicKeyWASM`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '036a394312e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

identityInstance.addPublicKey(publicKey)
```