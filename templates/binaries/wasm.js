import * as protocol from "./wasmCreation.cjs";
/* exports here */ = protocol.default;

// On-demand shielded (threaded proving) loading lives in src/dpp/shielded.ts:
// initShielded() (exported from the package entry, src/wasm.ts) gates on
// SharedArrayBuffer, lazily imports ./shieldedCreation.cjs, calls loadShielded()
// and installs the result as dppProvider.shielded. The shielded bytes are only
// decoded / compiled when proving is actually requested, never at import time.
