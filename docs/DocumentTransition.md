# DocumentTransitionWASM

This class allows to crate DocumentTransitions and interact

`DocumentTransitionWASM` can't be created via constructor
or any other methods for deserialization

Instance of `DocumentTransitionWASM` can be returned from getters
of other instances, like `DocumentBatchWASM` or any DocumentTransition
___

## Navigation

- [Fields](#fields)
    - [actionType](#actiontype)
    - [dataContractId](#datacontractid)
    - [revision](#revision)
    - [identityContractNonce](#identitycontractnonce)
    - [id](#id)
    - [documentTypeName](#documenttypename)
    - [entropy](#entropy)
    - [Transition conversions](#transition-conversions)

___

## Fields

All fields are read-only, exception: `dataContractId`, `revision`, `identityContractNonce`

### `actionType`

Contains action `String` from `BatchTypeEnum`

````js
transitionInstance.actionType // -> String
````

___

### `dataContractId`

Contains DataContract identifier in `IdentifierWASM`

```js
transitionInstance.dataContractId // -> IdentifierWASM

transitionInstance.dataContractId = 'GgZekwh38XcWQTyWWWvmw6CEYFnLU7yiZFPWZEjqKHit'
```

___

### `revision`

Contains revision in `BigInt`

```js
transitionInstance.revision // -> BigInt

transitionInstance.revision = BigInt(1)
```

___

### `identityContractNonce`

Contains identity contract nonce in `BigInt`

```js
transitionInstance.identityContractNonce // -> BigInt

transitionInstance.identityContractNonce = BigInt(12)
```

___

### `id`

Contains document identity in `IdentifierWASM`

```js
transitionInstance.id // -> IdentifierWASM
```

___

### `documentTypeName`

Contains document type name in `String`

```js
transitionInstance.documentTypeName // -> String
```

___

### `entropy`

Contains entropy in `Uint8Array` for transition with entropy

```js
transitionInstance.entropy // -> Uint8Array
```

___

### Transition conversions

Every DocumentTransition contains one of available Document Transition.
You can get one of they by these fields:

- `createTransition`
- `replaceTransition`
- `deleteTransition`
- `purchaseTransition`
- `transferTransition`
- `updatePriceTransition`

```js
transitionInstance.createTransition // -> DocumentCreateTransitionWASM
transitionInstance.replaceTransition // -> DocumentReplaceTransitionWASM
transitionInstance.deleteTransition // -> DocumentDeleteTransitionWASM
transitionInstance.purchaseTransition // -> DocumentPurchaseTransitionWASM
transitionInstance.transferTransition // -> DocumentTransferTransitionWASM
transitionInstance.updatePriceTransition // -> DocumentUpdatePriceTransitionWASM
```