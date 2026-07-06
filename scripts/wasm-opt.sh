#!/usr/bin/env bash
# shellcheck disable=SC2312
set -euo pipefail

# Optimization is NOT optional: the unoptimized wasm is >8MB, and Chrome
# refuses to sync-compile modules larger than 8MB on the main thread — the
# browser build would break at import time. A system binaryen is preferred;
# otherwise the `wasm-opt` npm devDependency provides the binary.
if command -v wasm-opt &> /dev/null; then
  WASM_OPT=wasm-opt
else
  WASM_OPT="npx wasm-opt"
fi

echo "Optimizing wasm using Binaryen (${WASM_OPT})"
${WASM_OPT} \
    --enable-simd \
    --enable-threads \
    --enable-bulk-memory \
    --enable-nontrapping-float-to-int \
    -O3 \
    "${OUTPUT_FILE}" \
    -o \
    "${OUTPUT_FILE}"
