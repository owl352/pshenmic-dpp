# DocumentWASM

This class allows to create instance of Document and interact with him

You can create `DocumentWASM` via constructor and `fromBytes`

Arguments in constructor:

- `rawDocument -> Object`
- `documentTypeName -> String`
- `revision -> BigInt`
- `dataContractId -> IdentifierWASM | String | ArrayLike`
- `ownerId -> IdentifierWASM | String | ArrayLike`
- `documentId -> IdentifierWASM | String | ArrayLike | undefined`

If you want to create Document from bytes,
you need to use serialized to bytes Document from `rs-dpp` or `pshenmic-dpp`

This class also contains static method for document id generation:

- `generateId`
    - `documentTypeName -> String`
    - `ownerId -> IdentifierWASM | String | ArrayLike`
    - `dataContractId -> IdentifierWASM | String | ArrayLike`
    - `entropy -> ArrayLike | undefined`

___

## Navigation

- [Example](#example)
- [Getters methods](#getters-methods)
    - [getId](#getid)
    - [getEntropy](#getentropy)
    - [getDataContractId](#getdatacontractid)
    - [getOwnerId](#getownerid)
    - [getProperties](#getproperties)
    - [getRevision](#getrevision)
    - [getCreatedAt](#getcreatedat)
    - [getUpdatedAt](#getupdatedat)
    - [getTransferredAt](#gettransferredat)
    - [getCreatedAtBlockHeight](#getcreatedatblockheight)
    - [getUpdatedAtBlockHeight](#getupdatedatblockheight)
    - [getTransferredAtBlockHeight](#gettransferredatblockheight)
    - [getCreatedAtCoreBlockHeight](#getcreatedatcoreblockheight)
    - [getUpdatedAtCoreBlockHeight](#getupdatedatcoreblockheight)
    - [getTransferredAtCoreBlockHeight](#gettransferredatcoreblockheight)
    - [getDocumentTypeName](#getdocumenttypename)
- [Setters methods](#setters-methods)
    - [setId](#setid)
    - [setEntropy](#setentropy)
    - [setDataContractId](#setdatacontractid)
    - [setOwnerId](#setownerid)
    - [setProperties](#setproperties)
    - [setRevision](#setrevision)
    - [setCreatedAt](#setcreatedat)
    - [setUpdatedAt](#setupdatedat)
    - [setTransferredAt](#settransferredat)
    - [setCreatedAtBlockHeight](#setcreatedatblockheight)
    - [setUpdatedAtBlockHeight](#setupdatedatblockheight)
    - [setTransferredAtBlockHeight](#settransferredatblockheight)
    - [setCreatedAtCoreBlockHeight](#setcreatedatcoreblockheight)
    - [setUpdatedAtCoreBlockHeight](#setupdatedatcoreblockheight)
    - [setTransferredAtCoreBlockHeight](#settransferredatcoreblockheight)
    - [setDocumentTypeName](#setdocumenttypename)

___

## Example

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)
```

___

## Getters methods

### `getId`

Returns document identifier in `IdentifierWASM`

```js
documentInstance.getId() // -> IdentifierWASM
```

___

### `getEntropy`

Returns document entropy in `Uint8Array`

```js
documentInstance.getEntropy() // -> Uint8Array <...>
```

___

### `getDataContractId`

Returns data contract identifier in `IdentifierWASM`

```js
documentInstance.getDataContractId() // -> IdentifierWASM
```

___

### `getOwnerId`

Returns document owner identifier in `IdentifierWASM`

```js
documentInstance.getOwnerId() // -> IdentifierWASM
```

___

### `getProperties`

Returns document properties in `Object`

```js
documentInstance.getProperties() // -> Object
```

___

### `getRevision`

Returns document revision in `BigInt`

```js
documentInstance.getRevision() // -> BigInt
```

___

### `getCreatedAt`

Returns creation timestamp in `BigInt | undefined`

```js
documentInstance.getCreatedAt() // -> BigInt | undefined
```

___

### `getUpdatedAt`

Returns update timestamp in `BigInt | undefined`

```js
documentInstance.getUpdatedAt() // -> BigInt | undefined
```

___

### `getTransferredAt`

Returns transfer timestamp in `BigInt | undefined`

```js
documentInstance.getTransferredAt() // -> BigInt | undefined
```

___

### `getCreatedAtBlockHeight`

Returns creation block height in `BigInt | undefined`

```js
documentInstance.getCreatedAtBlockHeight() // -> BigInt | undefined
```

___

### `getUpdatedAtBlockHeight`

Returns update block height in `BigInt | undefined`

```js
documentInstance.getUpdatedAtBlockHeight() // -> BigInt | undefined
```

___

### `getTransferredAtBlockHeight`

Returns transfer block height in `BigInt | undefined`

```js
documentInstance.getTransferredAtBlockHeight() // -> BigInt | undefined
```

___

### `getCreatedAtCoreBlockHeight`

Returns creation core block height in `BigInt | undefined`

```js
documentInstance.getCreatedAtCoreBlockHeight() // -> BigInt | undefined
```

___

### `getUpdatedAtCoreBlockHeight`

Returns update core block height in `BigInt | undefined`

```js
documentInstance.getUpdatedAtCoreBlockHeight() // -> BigInt | undefined
```

___

### `getTransferredAtCoreBlockHeight`

Returns transfer core block height in `BigInt | undefined`

```js
documentInstance.getTransferredAtCoreBlockHeight() // -> BigInt | undefined
```

### `getDocumentTypeName`

Returns document type name in `String`

```js
documentInstance.getDocumentTypeName() // -> String
```

## Setters methods

### `setId`

Allows to set document identifier

```js
documentInstance.setId('11111111111111111111111111111111') 
```

___

### `setEntropy`

Allows to set entropy from 32 bytes array

```js
documentInstance.setEntropy([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
```

___

### `setDataContractId`

Allows to set data contract identifier

```js
documentInstance.setDataContractId('11111111111111111111111111111111')
```

___

### `setOwnerId`

Allows to set owner identifier

```js
documentInstance.setOwnerId('11111111111111111111111111111111')
```

___

### `setProperties`

Allows to set document properties

```js
documentInstance.setProperties({"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"})
```

___

### `setRevision`

Allows to set document revision

```js
documentInstance.setRevision(BigInt(11))
```

___

### `setCreatedAt`

Allow to set creation timestamp

```js
documentInstance.setCreatedAt(BigInt(1745719987))
```

___

### `setUpdatedAt`

Allows to set update timestamp

```js
documentInstance.setUpdatedAt(BigInt(1745719987))
```

___

### `setTransferredAt`

Allows to set transfer timestamp

```js
documentInstance.setTransferredAt(BigInt(1745719987))
```

___

### `setCreatedAtBlockHeight`

Allows to set creation tx block height

```js
documentInstance.setCreatedAtBlockHeight(BigInt(12345))
```

___

### `setUpdatedAtBlockHeight`

Allows to set update tx block height

```js
documentInstance.setUpdatedAtBlockHeight(BigInt(12345))
```

___

### `setTransferredAtBlockHeight`

Allows to set transfer tx block height

```js
documentInstance.getTransferredAtBlockHeight(BigInt(12345))
```

___

### `setCreatedAtCoreBlockHeight`

Allows to set creation tx core block height

```js
documentInstance.setCreatedAtCoreBlockHeight(BigInt(12345))
```

___

### `setUpdatedAtCoreBlockHeight`

Allows to set update tx core block height

```js
documentInstance.setUpdatedAtCoreBlockHeight(BigInt(12345))
```

___

### `setTransferredAtCoreBlockHeight`

Allows to set transfer tx core block height

```js
documentInstance.setTransferredAtCoreBlockHeight(BigInt(12345))
```

### `setDocumentTypeName`

Allows to set document type name

```js
documentInstance.setDocumentTypeName('name')
```