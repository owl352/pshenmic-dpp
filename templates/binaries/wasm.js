import * as protocol from "./wasmCreation.cjs";
/* exports here */ = protocol.default;

// On-demand shielded (threaded proving) loading — placeholder for Task 6,
// which adds the SharedArrayBuffer gate, idempotency and provider wiring.
// Delegates to shieldedCreation.cjs so the shielded bytes are only decoded /
// compiled when proving is actually requested, never at import time.
export async function initShielded() {
  const { default: shieldedCreation } = await import("./shieldedCreation.cjs");
  return shieldedCreation.loadShielded();
}
