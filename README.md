# PSHENMIC-DPP



That module uses [rs-dpp](https://github.com/dashpay/platform) and creates bindings for JavaScript.
Each structure from rs-dpp is represented by a separate package, so you can build not the whole module, but only a part of it

**At this moment available structs:**
- `Document`
- `DocumentsBatch`
- `IdentityPublicKey`
- `PrivateKey`
- `Identity`
- `StateTransition`
- `IdentityTransitions`

## How to build
Default scripts allows to build full module
```
yarn
yarn build:full
```

## Example

```js
import * as wasm from '../wasm/pshenmic_dpp';
import wasmBytes from "../wasm/pshenmic_dpp_bg"

function toHexString(byteArray) {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

let binaryString = atob(wasmBytes);
let bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}

wasm.initSync({module: bytes.buffer})

const document = wasm.DocumentWASM.new(
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

const pubKey = wasm.IdentityPublicKeyWASM.new(
    1,
    wasm.Purpose.AUTHENTICATION,
    wasm.SecurityLevel.HIGH,
    wasm.KeyType.ECDSA_SECP256K1,
    false,
    'your_binary_data_in_hex'
)

const privKey = wasm.PrivateKeyWASM.new('wif_key')

const batch = wasm.DocumentBatchWASM.new(
    wasm.BatchType.CREATE,
    document,
    BigInt(3),
)

batch.sign(privKey, pubKey)

console.log(toHexString(batch.toBuffer()))
```
