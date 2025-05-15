# DocumentsBatchWASM

This class allows to create DocumentBatch from transitions and interact

`DocumentsBatchWASM` can be created from constructor, bytes and state transition

Constructor arguments:

- `documentTransitions -> [DocumentTransitionWASM]`
- `ownerId -> IdentifierWASM | String | ArrayLike`
- `userFeeIncrease -> Number`
- `publicKeyId -> ?Number`
- `signature -> ?ArrayLike`

If you want to create instance from bytes,
use `fromBytes()` with `ArrayLike` as argument.
Also, you can use `fromStateTransition` with
`StateTransitionWASM` instance as argument

___

## Navigation

- [Example](#example)
- [Fields](#fields)
    - [transitions](#transitions)
    - [signature](#signature)
    - [signaturePublicKeyId](#signaturepublickeyid)
    - [allPurchasesAmount](#allpurchasesamount)
    - [ownerId](#ownerid)
    - [modifiedDataIds](#modifieddataids)
    - [allConflictingIndexCollateralVotingFunds](#allconflictingindexcollateralvotingfunds)

___

## Example

```js
const documentInstance = new DocumentWASM(document, documentTypeName, revision, dataContractId, ownerId, id)
const createTransition = new DocumentCreateTransitionWASM(documentInstance, BigInt(1), 'preorder')

const documentTransition = createTransition.toDocumentTransition()

const batchTransition = new DocumentsBatchWASM([documentTransition], documentInstance.getOwnerId(), 1)
```

___

## Fields

Not all fields are readable and writable.

### `transitions`

Contains array of `DocumentTransitionWASM` in `[DocumentTransitionWASM]`

```js
batchTransition.transitions // -> [DocumentTransitionWASM]

batchTransition.transitions = [documentTransition1, documentTransition2]
```

___

### `signature`

Contains array of bytes in `Uint8Array`

```js
batchTransition.signature // -> Uint8Array

batchTransition.signature = [1, 2, 3]
```

___

### `signaturePublicKeyId`

Contains key id for signature in `Number`

```js
batchTransition.signaturePublicKeyId // -> Number

batchTransition.signaturePublicKeyId = 3
```

___

### `allPurchasesAmount`

Contains amount of credits for purchase in `BigInt`

**ONLY READ**

```js
batchTransition.allPurchasesAmount // -> BigInt
```

___

### `ownerId`

Contains owner id in `IdentifierWASM`

**ONLY READ**

```js
batchTransition.ownerId // -> IdentifierWASM
```

___

### `modifiedDataIds`

Contains array of ids for modifier data in `[IdentifierWASM]`

**ONLY READ**

```js
batchTransition.ownerId // -> IdentifierWASM
```

___

### `allConflictingIndexCollateralVotingFunds`

Contains array conflicting funds in `BigInt`

**ONLY READ**

```js
batchTransition.allConflictingIndexCollateralVotingFunds // -> BigInt
```
