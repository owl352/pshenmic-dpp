// Shared memory for the SHIELDED (threaded) wasm: wasm threads require a
// shared WebAssembly.Memory, i.e. SharedArrayBuffer / cross-origin isolation
// in browsers. Only required by loader.cjs's loadShielded(), never at import.
const sharedMemory = new WebAssembly.Memory({
  initial: 1000,
  maximum: 12000,
  shared: true
});

module.exports.default = sharedMemory;
