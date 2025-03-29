const wasm = require('../../dist/wasm/pshenmic_dpp')
const wasmBytes = require('../../dist/wasm/pshenmic_dpp_bg')

module.exports = () => {
  const binaryString = atob(wasmBytes)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  wasm.initSync({ module: bytes.buffer })

  return wasm
}
