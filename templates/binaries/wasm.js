import * as protocol from "./wasmCreation.cjs";
/* exports here */ = protocol.default;

// Shielded (threaded proving) wiring lives in src/dpp/shielded.ts:
// setShielded() (exported from the package entry, src/wasm.ts) installs the
// proving module exported by dash-platform-shielded. The consumer wires the two
// packages explicitly — setShielded(shielded) — with static imports, so no global
// registry is involved. The default orchard entry is eager; use
// dash-platform-shielded/lazy + loadShielded() when the load must be deferred.
