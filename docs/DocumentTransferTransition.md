# DocumentTransferTransitionWASM

This class allows to create DocumentTransferTransition and interact

`DocumentTransferTransitionWASM` can be created via constructor and document transition `fromDocumentTransition()`

Constructor arguments:

- `document -> DocumentWASM`
- `identityContractNonce -> BigInt`
- `documentTypeName -> String`
- `recipientId -> IdentifierWASM | String | ArrayLike`
___

## Navigation

- [Example](#example)
- [Fields](#fields)
    - [base](#base)
    - [recipientId](#recipientid)
- [Getters methods](#getters-methods)
    - [toDocumentTransition](#todocumenttransition)

___

## Example

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')
const recipientIdentifier = new IdentifierWASM('HzHXSQcBkU9Ve5YAxhGd8NgA72xFcG9nCZKKxhayn1NW')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)

const transferTransition = new DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', recipientIdentifier)
```
___
## Fields
All fields are readable and writable.

### `base`

Contains document base transition `DocumentBaseTransitionWASM`

```js
const transferTransition = new DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', recipientIdentifier)

const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

transferTransition.base // -> DocumentBaseTransitionWASM

transferTransition.base = base 
```

___

### `recipientId`

Contains recipient identifier in `IdentifierWASM`

```js
const transferTransition = new DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', recipientIdentifier)

transferTransition.recipientId // -> IdentifierWASM

transferTransition.recipientId = 'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
```

___

## Getters methods

### `toDocumentTransition`

Returns document create transition in `DocumentCreateTransitionWASM`

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')
const recipientIdentifier = new IdentifierWASM('HzHXSQcBkU9Ve5YAxhGd8NgA72xFcG9nCZKKxhayn1NW')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)

const transferTransition = new DocumentTransferTransitionWASM(documentInstance, BigInt(1), 'preorder', recipientIdentifier)

transferTransition.toDocumentTransition() // -> DocumentTransitionWASM
```
