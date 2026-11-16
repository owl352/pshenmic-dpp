// Registration entry for pshenmic-orchard. Importing this package once
// publishes its proving loader on a cross-realm global symbol so pshenmic-dpp's
// initShielded() can discover it WITHOUT resolving this package by name —
// robust to bundler renaming and duplicate dpp copies in a bundle.
//
// In a wasm thread worker loader.cjs exports null; do not register there.
const loader = require('./loader.cjs');

if (loader != null && typeof loader.loadShielded === 'function') {
  globalThis[Symbol.for('pshenmic-dpp.shielded')] = { loadShielded: loader.loadShielded };
}

module.exports = loader;
