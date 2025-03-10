# PSHENMIC-DPP

That module uses [rs-dpp](https://github.com/dashpay/platform) and creates bindings for JavaScript

**At this moment available classes:**
- `Document`
- `DocumentsBatch`
- `IdentityPublicKey`
- `PrivateKey`


## Example

```js
var binaryString = atob(wasmBytes);
var bytes = new Uint8Array(binaryString.length);
for (var i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}

wasm.initSync({module: bytes.buffer})

const document = await wasm.DocumentWASM.new(
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
