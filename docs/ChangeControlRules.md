# ChangeControlRulesWASM

This class allows to create and interact with ChangeControlRules struct

You can create `ChangeControlRulesWASM` via constructor

Constructor arguments:

- `authorizedToMakeChange -> AuthorizedActionTakersWASM`
- `adminActionTakers -> AuthorizedActionTakersWASM`
- `changingAuthorizedActionTakersToNoOneAllowed -> Boolean`
- `changingAdminActionTakersToNoOneAllowed -> Boolean`
- `selfChangingAdminActionTakersAllowed -> Boolean`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
  - [authorizedToMakeChange](#authorizedToMakeChange)
  - [adminActionTakers](#adminActionTakers)
  - [changingAuthorizedActionTakersToNoOneAllowed](#changingAuthorizedActionTakersToNoOneAllowed)
  - [changingAdminActionTakersToNoOneAllowed](#changingAdminActionTakersToNoOneAllowed)
  - [selfChangingAdminActionTakersAllowed](#selfChangingAdminActionTakersAllowed)
- [Getters](#getters)
  - [canChangeAdminActionTakers](#canChangeAdminActionTakers)

___

### Example

```js
const noOne = AuthorizedActionTakersWASM.NoOne()

const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)
```

___

## Fields

### `authorizedToMakeChange`

Allows to read and write authorizedToMakeChange by `AuthorizedActionTakersWASM`

```js
const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

changeRules.authorizedToMakeChange = AuthorizedActionTakersWASM.ContractOwner()

changeRules.authorizedToMakeChange // -> AuthorizedActionTakersWASM
```

___

### `adminActionTakers`

Allows to read and write adminActionTakers by `AuthorizedActionTakersWASM`

```js
const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

changeRules.adminActionTakers = AuthorizedActionTakersWASM.ContractOwner()

changeRules.adminActionTakers // -> AuthorizedActionTakersWASM
```

___

### `changingAuthorizedActionTakersToNoOneAllowed`

Allows to read and write changingAuthorizedActionTakersToNoOneAllowed by `Boolean`

```js
const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

changeRules.changingAuthorizedActionTakersToNoOneAllowed = false

changeRules.changingAuthorizedActionTakersToNoOneAllowed // -> Boolean
```

### `changingAdminActionTakersToNoOneAllowed`

Allows to read and write changingAdminActionTakersToNoOneAllowed by `Boolean`

```js
const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

changeRules.changingAdminActionTakersToNoOneAllowed = false

changeRules.changingAdminActionTakersToNoOneAllowed // -> Boolean
```

___

### `selfChangingAdminActionTakersAllowed`

Allows to read and write selfChangingAdminActionTakersAllowed by `Boolean`

```js
const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

changeRules.selfChangingAdminActionTakersAllowed = false

changeRules.selfChangingAdminActionTakersAllowed // -> Boolean
```

___

## Getters

### `canChangeAdminActionTakers`

Allows to check if we can change admin action takers

```js
const changeRules = new ChangeControlRulesWASM(
  noOne,
  noOne,
  true,
  true,
  true
)

const actionTaker = new ActionTakerWASM('9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn')

changeRules.canChangeAdminActionTakers(
  noOne,
  'CXH2kZCATjvDTnQAPVg28EgPg9WySUvwvnR5ZkmNqY5i',
  1,
  {
    1: {
      '9tSsCqKHTZ8ro16MydChSxgHBukFW36eMLJKKRtebJEn': 11
    }
  },
  actionTaker,
  'ActionCompletion'
) // -> Boolean
```