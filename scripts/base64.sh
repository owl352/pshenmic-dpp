#!/usr/bin/env bash

WASM_DIR="${PWD}/wasm"
BASE64_NAME="pshenmic_dpp_bg.js"
BINARY_NAME="pshenmic_dpp_bg.wasm"
WASM_BINARY_PATH="${WASM_DIR}/${BINARY_NAME}"
WASM_BASE64_PATH="${WASM_DIR}/${BASE64_NAME}"

WASM_BUILD_BASE_64=$(base64 -i "$WASM_BINARY_PATH")
echo 'module.exports = "'${WASM_BUILD_BASE_64}'"' > "$WASM_BASE64_PATH"

rm $WASM_BINARY_PATH