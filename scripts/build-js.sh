#!/usr/bin/env bash

## Paths to distributive that exposed to library consumers
DIST_DIR="$PWD/dist"
DIST_WASM_DIR="$DIST_DIR/wasm"
DIST_WASM_BINARY_BASE_64="$DIST_WASM_DIR/pshenmic_dpp_bg.js"
DIST_WASM_BINARY_RAW="$DIST_WASM_DIR/pshenmic_dpp_bg.wasm"
DIST_WASM_JS="$DIST_WASM_DIR/pshenmic_dpp.js"

## Paths to wasm files produced by wasm-bindgen
WASM_DIR="$PWD/wasm"
WASM_JS_CODE_PATH="$WASM_DIR/pshenmic_dpp.js"
WASM_BINARY_PATH="$WASM_DIR/pshenmic_dpp_bg.wasm"

# Create directory in dist to save transpiled wasm code and TS typings
mkdir -p $DIST_WASM_DIR

## Converting wasm into base64 and saving it to dist folder

rm -rf $DIST_WASM_BINARY_BASE_64
rm -rf $DIST_WASM_BINARY_RAW
rm -rf $DIST_WASM_JS

if [[ "${RAW}" == "true" ]]; then
  cp $WASM_BINARY_PATH $DIST_WASM_BINARY_RAW
else
  echo "Converting wasm binary into base64 module"
  WASM_BUILD_BASE_64=$(base64 -i "$WASM_BINARY_PATH")
  echo 'module.exports = "'${WASM_BUILD_BASE_64}'"' > "$DIST_WASM_BINARY_BASE_64"
fi

## Transpile ES Modules code to Common JS
## and save directly to dist folder to avoid re-generating TS declarations
echo "Transpiling wasm ES Modules to CommonJS"
cp $WASM_JS_CODE_PATH $DIST_WASM_JS

echo "Cleaning wasm build"
rm -rf $WASM_DIR