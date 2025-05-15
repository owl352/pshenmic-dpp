# CoreScriptWASM

This class allows to create and interact with CoreScript struct.

`CoreScriptWASM` can be created via 3 methods or from other classes

```js
const script = wasm.CoreScriptWASM.fromBytes([118, 169, 20, 195, 219, 253, 64, 231, 248, 164, 132, 92, 47, 142, 134, 138, 22, 124, 152, 64, 73, 118, 73, 136, 172])
// or
const script = wasm.CoreScriptWASM.newP2PKH([195, 219, 253, 64, 231, 248, 164, 132, 92, 47, 142, 134, 138, 22, 124, 152, 64, 73, 118, 73])
// or
const script = wasm.CoreScriptWASM.newP2SH([195, 219, 253, 64, 231, 248, 164, 132, 92, 47, 142, 134, 138, 22, 124, 152, 64, 73, 118, 73])

script.toASMString() // -> ASM String

script.toBytes() // -> Uint8Array
```