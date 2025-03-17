#!/usr/bin/env bash
# shellcheck disable=SC2312

TARGET=wasm32-unknown-unknown

OUTPUT_DIR="${PWD}/wasm"
PROFILE_ARG="--release"
PROFILE=release

OUTPUT_FILE="${PWD}/wasm/pshenmic_dpp_bg.wasm"

BUILD_COMMAND="cargo build --config net.git-fetch-with-cli=true --target=${TARGET} ${PROFILE_ARG}"
BINDGEN_COMMAND="wasm-bindgen --out-dir=${OUTPUT_DIR} --target=web --omit-default-module-path ${PWD}/target/${TARGET}/${PROFILE}/pshenmic_dpp.wasm"

if ! [[ -d ${OUTPUT_DIR} ]]; then
  mkdir -p "${OUTPUT_DIR}"
fi

if [[ "${OSTYPE}" == "darwin"* ]]; then
  AR_PATH=$(command -v llvm-ar)
  CLANG_PATH=$(command -v clang)
  AR=${AR_PATH} CC=${CLANG_PATH} ${BUILD_COMMAND}
  AR=${AR_PATH} CC=${CLANG_PATH} ${BINDGEN_COMMAND}
else
  ${BUILD_COMMAND}
  ${BINDGEN_COMMAND}
fi

if command -v wasm-opt &> /dev/null; then
  echo "Optimizing wasm using Binaryen"
  wasm-opt -tnh --flatten --rereloop -Oz --gufa -Oz --gufa -Oz  "$OUTPUT_FILE" -o "${OUTPUT_FILE}"
else
  echo "wasm-opt command not found. Skipping wasm optimization."
fi