# DocumentUpdatePriceTransitionWASM

This class allows to create DocumentUpdatePriceTransition and interact

`DocumentUpdatePriceTransitionWASM` can be created via constructor and document transition `fromDocumentTransition()`

Constructor arguments:

- `document -> DocumentWASM`
- `identityContractNonce -> BigInt`
- `documentTypeName -> String`
- `price -> BigInt`

___

## Navigation

- [Example](#example)
- [Fields](#fields)
    - [base](#base)
    - [price](#price)
    - [revision](#revision)
- [Getters methods](#getters-methods)
    - [toDocumentTransition](#todocumenttransition)

___

## Example

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)

const updatePriceTransition = new DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))
```

___

## Fields

All fields are readable and writable.

### `base`

Contains document base transition `DocumentBaseTransitionWASM`

```js
const updatePriceTransition = new DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

updatePriceTransition.base // -> DocumentBaseTransitionWASM

updatePriceTransition.base = base 
```

___

### `price`

Contains price for purchase in `BigInt`

```js
updatePriceTransition.price // -> BigInt

updatePriceTransition.price = BigInt(213)
```

___

### `revision`

Contains document revision in `BigInt`

```js
updatePriceTransition.revision // -> BigInt

updatePriceTransition.revision = BigInt(213)
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

const updatePriceTransition = new DocumentUpdatePriceTransitionWASM(documentInstance, BigInt(1), 'preorder', BigInt(100))

updatePriceTransition.toDocumentTransition() // -> DocumentTransitionWASM
```
