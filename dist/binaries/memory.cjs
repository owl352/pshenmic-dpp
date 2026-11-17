"use strict";
// Non-shared memory for the BASE (non-threaded) wasm. The base must load
// without cross-origin isolation — i.e. without SharedArrayBuffer — so its
// memory is deliberately NOT shared (dash-platform-extension#219). The
// threaded shielded module uses shieldedMemory.cjs instead.
const memory = new WebAssembly.Memory({
    initial: 1000,
    maximum: 12000,
    shared: false
});
module.exports.default = memory;
