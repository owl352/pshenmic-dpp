# IdentityPublicKeyWASM

This class allows to create IdentityPublicKey instance and interact

Arguments in constructor:

- `id -> Number`
- `purpose -> PurposeEnum`
- `securityLevel -> SecurityLevelEnum`
- `keyType -> KeyTypeEnum`
- `readOnly -> Boolean`
- `binaryData -> Hex String`
- `disabledAt -> ?BigInt`

You can create `IdentityPublicKeyWASM` via constructor and `fromBytes`

If you want to create `IdentityPublicKey` from bytes,
you need to use serialized to bytes `IdentityPublicKey` from `rs-dpp` or `pshenmic-dpp`
___

## Navigation

- [Example](#example)
- [Getters methods](#getters-methods)
    - [validatePrivateKey](#validateprivatekey)
    - [getKeyId](#getkeyid)
    - [getPurpose](#getpurpose)
    - [getSecurityLevel](#getsecuritylevel)
    - [getKeyType](#getkeytype)
    - [getReadOnly](#getreadonly)
    - [getData](#getdata)
    - [getDisabledAt](#getdisabledat)
- [Setters methods](#setters-methods)
    - [setKeyId](#setkeyid)
    - [setPurpose](#setpurpose)
    - [setSecurityLevel](#setsecuritylevel)
    - [setKeyType](#setkeytype)
    - [setReadOnly](#setreadonly)
    - [setData](#setdata)
    - [setDisabledAt](#setdisabledat)

___

## Example

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)
```

___

## Getters methods

### `validatePrivateKey`

Allows to validate private key for selected public key.

Returns `Boolean`

```js
const privateKey = PrivateKeyWASM.fromWIF('cR4EZ2nAvCmn2cFepKn7UgSSQFgFTjkySAchvcoiEVdm48eWjQGn')

const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.validatePrivateKey(privateKey.getBytes(), 'mainnet')
```

___

### `getKeyId`

Returns key id in `Number`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getKeyId() // -> Number
```

___

### `getPurpose`

Returns purpose value for identity public key in `String`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getPurpose() // -> String
```

___

### `getSecurityLevel`

Returns security level for identity public key in `String`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getSecurityLevel() // -> String
```

___

### `getKeyType`

Returns key type for identity public key in `String`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getKeyType() // -> String
```

___

### `getReadOnly`

Returns read only flag for identity public key in `Boolean`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getReadOnly() // -> Boolean
```

___

### `getData`

Returns identity public key data in Hex `String`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getData() // -> String
```

___

### `getDisabledAt`

Returns optional disabled at timestamp identity public key `?Number`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.getDisabledAt() // -> ?BigInt
```

___

## Setters methods

### `setKeyId`

Allows to set key id in `Number`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setKeyId(11)
```

___

### `setPurpose`

Allows to set purpose value for identity public key in `PurposeEnum`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setPurpose('ENCRYPTION')
```

___

### `setSecurityLevel`

Allows to set security level for identity public key in `SecurityLevelEnum`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setSecurityLevel('HIGH')
```

___

### `setKeyType`

Allows to set key type for identity public key in `KeyTypeEnum`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setKeyType('ECDSA_HASH160')
```

___

### `setReadOnly`

Allows to set read only flag for identity public key in `Boolean`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setReadOnly(true)
```

___

### `setData`

Allows to set identity public key data in Hex `String`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setData('0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48')
```

___

### `setDisabledAt`

Allows to set disabled at timestamp identity public key `BigInt`

```js
const publicKey = new IdentityPublicKeyWASM(
  2,
  'AUTHENTICATION',
  'CRITICAL',
  'ECDSA_SECP256K1',
  false,
  '0300000002e40e81d928fde2bde7880070e4fa9c1d1d9b168da707ea468afa2b48'
)

publicKey.setDisabledAt(BigInt(11))
```