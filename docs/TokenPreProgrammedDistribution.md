# TokenPreProgrammedDistributionWASM

This class allows to create and interact with TokenPreProgrammedDistribution struct

You can create `TokenPreProgrammedDistributionWASM` via constructor

___

## Navigation

- [Example](#Example)
- [Fields](#fields)

___

### Example

```js
const preProgrammedDistribution = new TokenPreProgrammedDistributionWASM(
  {
    1750140416485: {
      PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
    }
  }
)
```

___

## Fields

### `distributions`

Allows to read and write distributions

```js
const preProgrammedDistribution = new TokenPreProgrammedDistributionWASM(
  {
    1750140416485: {
      PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(10000)
    }
  }
)

preProgrammedDistribution.distributions = {
  1111111: {
    PJUBWbXWmzEYCs99rAAbnCiHRzrnhKLQrXbmSsuPBYB: BigInt(1222)
  }
}

preProgrammedDistribution.distributions // -> Object
```