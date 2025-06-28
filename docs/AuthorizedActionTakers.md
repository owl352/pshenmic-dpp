# AuthorizedActionTakersWASM

This class allows to create and interact with AuthorizedActionTakers struct

`AuthorizedActionTakersWASM` can be created only via static methods

___

## Navigation

- [Example](#Example)
- [Getters](#getters)
  - [getTakerType](#gettakertype)
  - [getValue](#getValue)
- [Static](#static)
    - [NoOne](#noone)
    - [ContractOwner](#ContractOwner)
    - [Identity](#Identity)
    - [MainGroup](#MainGroup)
    - [Group](#Group)

___

### Example

```js
const noOne = AuthorizedActionTakersWASM.NoOne()
```

___

## Getters

### `getTakerType`

Allows to get AuthorizedActionTakers type

```js
const noOne = AuthorizedActionTakersWASM.NoOne()

noOne.getTakerType() // -> String
```

### `getValue`

Allows to get AuthorizedActionTakers value if exist

```js
const noOne = AuthorizedActionTakersWASM.NoOne()

noOne.getValue() // -> Number | IdentifierWASM | undefined
```

___

## Static

### `NoOne`

Allows to create AuthorizedActionTakers with value `NoOne`

```js
const noOne = AuthorizedActionTakersWASM.NoOne()
```

___

### `ContractOwner`

Allows to create AuthorizedActionTakers with value `ContractOwner`

```js
const contractOwner = AuthorizedActionTakersWASM.ContractOwner()
```

___

### `Identity`

Allows to create AuthorizedActionTakers with value `Identity` by identifier

```js
const identity = AuthorizedActionTakersWASM.Identity('H2pb35GtKpjLinncBYeMsXkdDYXCbsFzzVmssce6pSJ1')
```

___

### `MainGroup`

Allows to create AuthorizedActionTakers with value `MainGroup`

```js
const mainGroup = AuthorizedActionTakersWASM.MainGroup()
```

___

### `Group`

Allows to create AuthorizedActionTakers with value `Group` by group position in `Number`

```js
const group = AuthorizedActionTakersWASM.Group(1)
```
___