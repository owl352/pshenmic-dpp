# DataContractCreateTransitionWASM

This class allows to create DataContractCreateTransition and interact

`DataContractCreateTransitionWASM` can be created via constructor, bytes and state transition

Constructor arguments:

- `dataContract -> DataContractWASM`
- `identityContractNonce -> BigInt`
- `platformVersion -> ?PlatformVersionEnum`

___

## Navigation

- [Example](#example)
- [Getters methods](#getters-methods)
  - [getFeatureVersion](#getfeatureversion)
  - [verifyProtocolVersion](#verifyprotocolversion)
  - [getDataContract](#getdatacontract)
- [Setters methods](#setters-methods)
  - [setDataContract](#setdatacontract)

___

## Example

```js
const dataContract = DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

const dataContractTransition = new DataContractCreateTransitionWASM(dataContract, BigInt(1))
```

___

## Getters methods

### `getFeatureVersion`

Returns feature version of transition in `Number`

```js
dataContractTransition.getFeatureVersion() // -> Number
```

___

### `verifyProtocolVersion`

Returns `Boolean` if selected protocol version equal protocol version in transition

```js
dataContractTransition.verifyProtocolVersion(1) // -> Boolean
```

___

### `getDataContract`

Returns DataContract in `DataContractWASM`

Arguments:

- `pltaformVersion -> PlatformVersionEnum`
- `fullValidation -> Boolean`

```js
dataContractTransition.getDataContract('PLATFORM_V1', true) // -> DataContractWASM 
```

___

## Setters methods

### `setDataContract`

Allows to set DataContract in `DataContractWASM` with `PlatformVersionEnum`

```js
const dataContract = DataContractWASM.fromValue(value, false, PlatformVersionWASM.PLATFORM_V1)

dataContractTransition.setDataContract('PLATFORM_V1')
```
