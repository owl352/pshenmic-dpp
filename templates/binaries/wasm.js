import * as protocol from "./wasmCreation.cjs";
/* exports here */ = protocol.default;

// On-demand shielded (threaded proving) loading lives in src/dpp/shielded.ts:
// initShielded() (exported from the package entry, src/wasm.ts) gates on
// SharedArrayBuffer, reads the loader registered by the optional pshenmic-orchard
// package on the global symbol Symbol.for('pshenmic-dpp.shielded'), calls
// loadShielded() and installs the result as dppProvider.shielded. The shielded
// bytes are only decoded / compiled when proving is requested, never at import.
