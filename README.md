# PSHENMIC-DPP
### **AT THIS MOMENT MODULE UNDER DEVELOPMENT**

## General
Pshenmic-dpp is package with rust bindings for JS 

That module uses [rs-dpp](https://github.com/dashpay/platform) and creates bindings for JavaScript.
Each structure from rs-dpp is represented by a separate package, so you can build not the whole module, but only a part of it.

One of the advantages of this module is that you can build `.wasm` file not with all modules, but only with the ones you are interested in + minimal dependencies for them
___
## How To Install
`yarn add pshenmic-dpp`
___
## Manual Building
### Install dependencies
`yarn`

### Build JS
`yarn build:full`

**NOTE. If you want to use ES6 module without CJS, you need to run `yarn babel`**

### Build with binary instead base64
`yarn build:raw`
Now you can import `.js` with base64 buffer for WebAssembly module, or binary which smaller
___
## Why you need to use `pshenmic-dpp` instead `wasm-dpp`

- `pshenmic-dpp` weighs much less, currently taking up only 2.8 mb in base64 format
- You can build only necessary modules by removing imports from `lib.rs` before building
- More accurately replicates `rs-dpp`
- Some sugar, like enums, which you can pass in string with any case or just use numbers
___

## Current features

**At this moment available structs:**
- `Document`
- `DocumentsBatch`
- `DocumentsBaseTransition`
- `DocumentsTransition`
- `PrefundedVotingBalance`
- DocumentsTransitions:
  - `DocuemntCreateTransition`
  - `DocuemntDeleteTransition`
  - `DocuemntPurchaseTransition`
  - `DocuemntReplaceTransition`
  - `DocumentTransferTransition`
  - `DocumentUpdatePriceTransition`
- `IdentityPublicKey`
- `IdentityCreateTransition`
- `IdentityPublicKeyInCreationWASM`
- `PrivateKey`
- `Identity`
- `StateTransition`
- `DataContract`
- `Enums`

**At this moment available static methods**
- `objectToCbor`
- `cborToObject`
- `generateId` for data contract class
- `generateId` for document class
- 

## How to run unit tests
```
yarn tests
```

## Example

```js
import * as wasm from '../wasm/pshenmic_dpp';
import wasmBytes from "../wasm/pshenmic_dpp_bg"

let binaryString = atob(wasmBytes);
let bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}

wasm.initSync({module: bytes.buffer})

const document = new wasm.DocumentWASM(
    {
        "name": "MyPool",
        "type": "EVONODE",
        "status": "INACTIVE",
        "description": "test pool"
    },
    'pool',
    BigInt(1),
    "6QMfQTdKpC3Y9uWBcTwXeY3KdzRLDqASUsDnQ4MEc9XC",
    "B7kcE1juMBWEWkuYRJhVdAE2e6RaevrGxRsa1DrLCpQH"
)

const pubKey = new wasm.IdentityPublicKeyWASM(
    1,
    wasm.Purpose.AUTHENTICATION,
    wasm.SecurityLevel.HIGH,
    wasm.KeyType.ECDSA_SECP256K1,
    false,
    'your_binary_data_in_hex'
)

const privKey = new wasm.PrivateKeyWASM('your_wif_key')

const createTransition = new wasm.DocumentCreateTransitionWASM(document, BigInt(1), 'preorder')

const documentTransition = createTransition.toDocumentTransition()

const batchTransition = new wasm.DocumentsBatchWASM([documentTransition, documentTransition], Array.from(documentInstance.getOwnerId()), 1)

const st = batchTransition.toStateTransition()

st.sign(privKey, pubKey)

console.log(st.toBytes())
console.log(st.hash(false))
```
