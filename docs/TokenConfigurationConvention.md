# TokenConfigurationConventionWASM

This class allows to create and interact with TokenConfigurationConvention struct

`TokenConfigurationConventionWASM` can be created only via constructor

Constructor arguments:

- `localizations -> Object`
- `decimals -> Number`

___

## Navigation

- [Example](#Example)
- [Fields](#fields)
    - [localizations](#localizations)
    - [decimals](#decimals)

___

### Example

```js
const convention = new wasm.TokenConfigurationConventionWASM({
    ru: {
      shouldCapitalize: true,
      singularForm: 'TOKEN',
      pluralForm: 'TOKENS'
    }
  },
  1
)
```

___

## Fields

All fields are readable and writable.

### `localizations`

Allows to read and write localizations of TokenConfigurationConvention in `Object`

```js
const convention = new wasm.TokenConfigurationConventionWASM({
    ru: {
      shouldCapitalize: true,
      singularForm: 'TOKEN',
      pluralForm: 'TOKENS'
    }
  },
  1
)

convention.localizations ={
  en: {
    shouldCapitalize: true,
    singularForm: 'TOKEN',
    pluralForm: 'TOKENS'
  }
} 

convention.localizations // -> Object
```

___

### `decimals`

Allows to get script public key in HEX `String`

```js
const convention = new wasm.TokenConfigurationConventionWASM({
    ru: {
      shouldCapitalize: true,
      singularForm: 'TOKEN',
      pluralForm: 'TOKENS'
    }
  },
  1
)

convention.decimals = 9

convention.decimals // -> Number
```

___