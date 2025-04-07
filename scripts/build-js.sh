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


rm -rf $DIST_WASM_BINARY_BASE_64
rm -rf $DIST_WASM_BINARY_RAW
rm -rf $DIST_WASM_JS

## Converting wasm into base64 and saving it to dist folder

if [[ "${RAW}" == "true" ]]; then
  cp $WASM_BINARY_PATH $DIST_WASM_BINARY_RAW
else
  echo "Converting wasm binary into base64 module"
  WASM_BUILD_BASE_64=$(base64 -i "$WASM_BINARY_PATH")
  echo 'export default "'${WASM_BUILD_BASE_64}'"' > "$DIST_WASM_BINARY_BASE_64"
fi

echo "Copying ES module to dist"
cp $WASM_JS_CODE_PATH $DIST_WASM_JS

echo "Cleaning wasm build"
rm -rf $WASM_DIR

echo "Total build size: "
du -sh $DIST_WASM_DIR
