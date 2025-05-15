# IdentityPublicKeyInCreationWASM

This class allows to create and interact with instance of IdentityPublicKeyInCreation struct

`IdentityPublicKeyInCreationWASM` can be created only via constructor

Constructor params:

- `id -> Number`
- `purpose -> PurposeEnum`
- `securityLevel -> SecurityLevelEnum`
- `keyType -> KeyTypeEnum`
- `readOnly -> Boolean`
- `binaryData -> Uint8Array`
- `signature -> Uint8Array`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [keyId](#keyid)
    - [purpose](#purpose)
    - [securityLevel](#securitylevel)
    - [keyType](#keytype)
    - [readOnly](#readonly)
    - [data](#data)
    - [signature](#signature)
- [Getters](#getters)
    - [toIdentityPublicKey](#toIdentityPublicKey)

___

### Example

```js
const key = new wasm.IdentityPublicKeyInCreationWASM(
  1, 'system', 'master', 'ECDSA_SECP256K1', false, [], []
)
```

___

## Fields

All fields are readable and writable.

### `keyId`

Contains id of key in `Number`

```js
key.keyId = 1

key.keyId // -> Number
```

___

### `purpose`

Contains purpose enum in `String`

```js
key.purpose = 'system'

key.purpose // -> String
```

___

### `securityLevel`

Contains securityLevel enum in `String`

```js
key.securityLevel = 'master'

key.securityLevel // -> String
```

___

### `keyType`

Contains keyType enum in `String`

```js
key.keyType = 'ECDSA_SECP256K1'

key.keyType // -> String
```

___

### `readOnly`

Contains readOnly flag in `Boolean`

```js
key.readOnly = true

key.readOnly // -> Boolean
```

___

### `data`

Contains data in `Uint8Array`

```js
key.data = Uint8Array.from([1, 2, 3, 4, 5])

key.data // -> Uint8Array
```

___

### `signature`

Contains signature in `Uint8Array`

```js
key.signature = Uint8Array.from([1, 2, 3, 4, 5])

key.signature // -> Uint8Array
```

___

## Getters

### `toIdentityPublicKey`

Allows to get `IdentityPublicKeyWASM`

```js
key.toIdentityPublicKey() // -> IdentityPublicKeyWASM
```