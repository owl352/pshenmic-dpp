# DocumentCreateTransitionWASM

This class allows to create DocumentCreateTransition and interact

`DocumentCreateTransitionWASM` can be created via constructor and document transition `fromDocumentTransition()`

Constructor arguments:

- `document -> DocumentWASM`
- `identityContractNonce -> BigInt`
- `documentTypeName -> String`

___

## Navigation

- [Example](#example)
- [Fields](#fields)
    - [data](#data)
    - [base](#base)
    - [entropy](#entropy)
    - [prefundedVotingBalance](#prefundedvotingbalance)
- [Getters methods](#getters-methods)
    - [toDocumentTransition](#todocumenttransition)

___

## Example

```js
const dataContractIdentifier = new IdentifierWASM('GnXgMaiqAwTxh44ccQe8AoCgFvcseHK5CncH3sUorW4X')
const ownerIdentifier = new IdentifierWASM('CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i')

const properties = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}

const documentInstance = new DocumentWASM(properties, "note", BigInt(1), dataContractIdentifier, ownerIdentifier)

const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')
```

___

## Fields

All fields are readable and writable.

### `data`

Contains document data in `Object`

```js
const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')

createTransition.data // -> Object

createTransition.data = {"message": "Tutorial CI Test @ Tue, 07 Jan 2025 15:27:50 GMT"}
```

___

### `base`

Contains document base transition `DocumentBaseTransitionWASM`

```js
const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')

const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

createTransition.base // -> DocumentBaseTransitionWASM

createTransition.base = base 
```

___

### `entropy`

Contains entropy for create transition 32 bytes length in `Uint8Array`

```js
const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')

createTransition.entropy // -> Uint8Array

createTransition.entropy = [1] 
```

___

### `prefundedVotingBalance`

Contains info about prefunded voting balance in `?PrefundedVotingBalanceWASM`

```js
const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')

const prefundedVotingBalance = new PrefundedVotingBalanceWASM('note', BigInt(9999))

createTransition.prefundedVotingBalance // -> ?PrefundedVotingBalanceWASM

createTransition.prefundedVotingBalance = prefundedVotingBalance

createTransition.clearPrefundedVotingBalance() // createTransition.prefundedVotingBalance = undefined 

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

const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'note')

createTransition.toDocumentTransition() // -> DocumentTransitionWASM
```
