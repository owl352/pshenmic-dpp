# DocumentDeleteTransitionWASM

This class allows to create DocumentDeleteTransition and interact

`DocumentDeleteTransitionWASM` can be created via constructor and document transition `fromDocumentTransition()`

Constructor arguments:

- `document -> DocumentWASM`
- `identityContractNonce -> BigInt`
- `documentTypeName -> String`

___

## Navigation

- [Example](#example)
- [Fields](#fields)
    - [base](#base)
- [Getters methods](#getters-methods)
    - [toDocumentTransition](#todocumenttransition)

___

## Example

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)

const deleteTransition = new DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')
```

___

## Fields

All fields are readable and writable.

### `base`

Contains document base transition `DocumentBaseTransitionWASM`

```js
const deleteTransition = new DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

deleteTransition.base // -> DocumentBaseTransitionWASM

deleteTransition.base = base 
```

___

## Getters methods

### `toDocumentTransition`

Returns document create transition in `DocumentCreateTransitionWASM`

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)

const deleteTransition = new DocumentDeleteTransitionWASM(documentInstance, BigInt(1), 'preorder')

deleteTransition.toDocumentTransition() // -> DocumentTransitionWASM
```
