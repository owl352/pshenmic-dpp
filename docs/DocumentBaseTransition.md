# DocumentBaseTransitionWASM

This class allows to create DocumentBaseTransition and interact.

This class used in DocumentTransitions

`DocumentBaseTransitionWASM` can be created only via constructor

Constructor arguments:
- `documentId -> IdentifierWASM | String | ArrayLike`
- `identityContractNonce -> BigInt`
- `documentTypeName -> String`
- `dataContractId -> IdentifierWASM | String | ArrayLike`

___

## Navigation
- [Example](#example)
- [Fields](#fields)
  - [id](#id)
  - [identityContractNonce](#identitycontractnonce)
  - [dataContractId](#datacontractid)
  - [documentTypeName](#documenttypename)

___

## Example

```js
new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)
```

___

## Fields
All fields are readable and writable.

### `id`
Returns document id in `IdentfierWASM`

```js
const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

base.id // -> IdentifierWASM

base.id = 'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
```

___

### `identityContractNonce`
Returns identity contract nonce for transition in `BigInt`

```js
const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

base.identityContractNonce // -> BigInt

base.identityContractNonce = BigInt(11)
```

___

### `dataContractId`
Returns data contract id in `IdentifierWASM`

```js
const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

base.dataContractId // -> IdentifierWASM

base.dataContractId = '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn'
```

___

### `documentTypeName`
Returns document type name in `String`

```js
const base = new DocumentBaseTransitionWASM(
  '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn',
  BigInt(12350),
  'note',
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i'
)

base.documentTypeName // -> String

base.documentTypeName = 'note2'
```
