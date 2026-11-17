import * as protocol from "./wasmCreation.cjs";
/* exports here */ = protocol.default;

// On-demand shielded (threaded proving) loading lives in src/dpp/shielded.ts:
// setShielded() (exported from the package entry, src/wasm.ts) installs the
// proving module returned by pshenmic-orchard's loadShielded(). The consumer
// wires the two packages explicitly — setShielded(loadShielded()) — with static
// imports, so no global registry is involved. The shielded bytes are only
// decoded / compiled when proving is requested, never at import.
