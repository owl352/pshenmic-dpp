#!/usr/bin/env bash
# shellcheck disable=SC2312

if command -v wasm-opt &> /dev/null; then
  echo "Optimizing wasm using Binaryen"
  wasm-opt \
    --enable-threads \
    --code-folding \
    --const-hoisting \
    --abstract-type-refining \
    --dce \
    --strip-producers \
    -Oz \
    --generate-global-effects \
    --enable-bulk-memory \
    --enable-nontrapping-float-to-int  \
    -tnh \
    --flatten \
    --rereloop \
    -Oz \
    --converge \
    --vacuum \
    --dce \
    --gsi \
    --inlining-optimizing \
    --merge-blocks \
    --simplify-locals \
    --optimize-casts \
    --optimize-instructions \
    --optimize-stack-ir \
    --remove-unused-brs \
    --remove-unused-module-elements \
    --remove-unused-names \
    --remove-unused-types \
    --gufa \
    --once-reduction \
    -Oz \
    -Oz \
    "${OUTPUT_FILE}" \
    -o \
    "${OUTPUT_FILE}"

else
  echo "wasm-opt command not found. Skipping wasm optimization."
fi
