# DataContractWASM

This class allows to create instance of DataContract and interact with him.

You can create `DataContractWASM` via constructor, bytes and from raw value

Arguments in constructor:

- `ownerId -> IdentifierWASM | String | ArrayLike`
- `identityNonce -> BigInt`
- `schema -> Object`
- `definitions -> Object | undefined`
- `fullValidation -> Boolean`
- `platformVersion -> ?PlatformVersionEnum`

If you want to create DataContract from bytes,
you need to use serialized to bytes DataContract from `rs-dpp` or `pshenmic-dpp`

This class also contains static method for DataContract id generation:

- `generateId`
    - `ownerId -> IdentifierWASM | String | ArrayLike`
    - `nonce -> BigInt`

___

## Navigation

- [Example](#example)
- [Getters methods](#getters-methods)
    - [getSchema](#getschema)
    - [getVersion](#getversion)
    - [getId](#getid)
    - [getOwnerId](#getownerid)
    - [getConfig](#getconfig)
- [Setters methods](#setters-methods)
    - [setSchema](#setschema)
    - [setVersion](#setversion)
    - [setId](#setid)
    - [setOwnerId](#setownerid)
    - [setConfig](#setconfig)

___

## Example

```js
const identifier = new IdentifierWASM('11111111111111111111111111111111')
const schema = {
  "note": {
    "type": "object",
    "properties": {
      "message": {
        "type": "string",
        "position": 0
      }
    },
    "additionalProperties": false
  }
}

const dataContract = new DataContractWASM(identifier, BigInt(2), schema, null, false)
```

___

## Getters methods

### `getSchema`

Returns DataContract schema as `Object`

```js
dataContractInstance.getSchema() // -> Object
```

___

### `getVersion`

Returns DataContract version in `Number`

```js
dataContractInstance.getVersion() // -> Number
```

___

### `getId`

Returns DataContract identifier in `IdentifierWASM`

```js
dataContractInstance.getId() // -> IdentifierWASM
```

___

### `getOwnerId`

Returns DataContract owner identifier in `IdentifierWASM`

```js
dataContractInstance.getOwnerId() // -> IdentifierWASM
```

___

### `getConfig`

Returns DataContract config in `Object`

```js
dataContractInstance.getConfig() // -> Object
```

___

## Setters methods

### `setSchema`

Allows to set DataContract schema in `Object`

```js
const schema = {
  "note": {
    "type": "object",
    "properties": {
      "message": {
        "type": "string",
        "position": 0
      }
    },
    "additionalProperties": false
  }
}

dataContractInstance.setSchema(schema)
```

___

### `setVersion`

Allows to set DataContract version in `Number`

```js
dataContractInstance.setVersion(11)
```

___

### `setId`

Allows to set DataContract identifier in `IdentifierWASM | String | ArrayLike`

```js
dataContractInstance.setId('GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit') 
```

___

### `setOwnerId`

Allows to set DataContract owner identifier in `IdentifierWASM | String | ArrayLike`

```js
dataContractInstance.setOwnerId('GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit')
```

___

### `setConfig`

Allows to set DataContract config in `Object`

```js
const config = {
  "$format_version": "0",
  "canBeDeleted": false,
  "readonly": false,
  "keepsHistory": false,
  "documentsKeepHistoryContractDefault": false,
  "documentsMutableContractDefault": true,
  "documentsCanBeDeletedContractDefault": true,
  "requiresIdentityEncryptionBoundedKey": null,
  "requiresIdentityDecryptionBoundedKey": null
}

dataContractInstance.setConfig(config)
```