#!/usr/bin/env bash

## Paths to distributive that exposed to library consumers
DIST_DIR="$PWD/dist"
DIST_WASM_DIR="$DIST_DIR/wasm"
DIST_WASM_BINARY_BASE_64="$DIST_WASM_DIR/pshenmic_dpp_bg.js"
DIST_WASM_BINARY_RAW="$DIST_WASM_DIR/pshenmic_dpp_bg.wasm"
DIST_WASM_JS="$DIST_WASM_DIR/pshenmic_dpp.js"
DIST_WASM_JS_INDEX="$DIST_WASM_DIR/index.js"
DIST_WASM_TS_BG="$DIST_WASM_DIR/pshenmic_dpp_bg.wasm.d.ts"
DIST_WASM_TS="$DIST_WASM_DIR/pshenmic_dpp.d.ts"
DIST_WASM_TS_INDEX="$DIST_WASM_DIR/index.d.ts"
DIST_BASE122="$DIST_WASM_DIR/base122.js"


## Paths to wasm files produced by wasm-bindgen
WASM_DIR="$PWD/wasm"
WASM_JS_CODE_PATH="$WASM_DIR/pshenmic_dpp.js"
WASM_BINARY_PATH="$WASM_DIR/pshenmic_dpp_bg.wasm"
WASM_TS_BG_CODE_PATH="$WASM_DIR/pshenmic_dpp_bg.wasm.d.ts"
WASM_TS_CODE_PATH="$WASM_DIR/pshenmic_dpp.d.ts"
WASM_TS_INDEX_CODE_PATH="$PWD/lib/."
MODULE_BASE122="$PWD/utils/base122.mjs"

## String with patch for type checker
TYPE_CHECKER_PATCH='s#if (!(instance instanceof klass)) {#if (!(instance?.__type === klass.__struct)) {#g'

# Create directory in dist to save transpiled wasm code and TS lib
mkdir -p $DIST_WASM_DIR


rm -rf $DIST_WASM_BINARY_BASE_64
rm -rf $DIST_WASM_BINARY_RAW
rm -rf $DIST_WASM_JS_INDEX
rm -rf $DIST_WASM_JS

rm -rf $DIST_WASM_TS_INDEX
rm -rf $DIST_WASM_TS_BG
rm -rf $DIST_WASM_TS

## Converting wasm into base64 and saving it to dist folder

if [[ "${RAW}" == "true" ]]; then
  cp $WASM_BINARY_PATH $DIST_WASM_BINARY_RAW
else
  echo "Converting wasm binary into base122 module"
  npm run convert:base122 --silent "$WASM_BINARY_PATH" > "$DIST_WASM_BINARY_BASE_64"
  cp $MODULE_BASE122 $DIST_BASE122
fi

echo "Copying ES module to dist"
cp $WASM_JS_CODE_PATH $DIST_WASM_JS

echo "Copying lib to dist"
cp -a $WASM_TS_INDEX_CODE_PATH $DIST_WASM_DIR
cp $WASM_TS_BG_CODE_PATH $DIST_WASM_TS_BG
cp $WASM_TS_CODE_PATH $DIST_WASM_TS


echo "Patching assert to custom type checker"
if [[ "$(uname)" == "Darwin" ]]; then
  echo "SYSTEM: Darwin"
  sed -i '' "$TYPE_CHECKER_PATCH" $DIST_WASM_JS
else
  echo "SYSTEM: GNU"
  sed -i "$TYPE_CHECKER_PATCH" $DIST_WASM_JS
fi



echo "Cleaning wasm build"
rm -rf $WASM_DIR

echo "Total build size: "
du -sh $DIST_WASM_DIR
