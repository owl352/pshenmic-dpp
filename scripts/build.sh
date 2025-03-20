#!/usr/bin/env bash
# shellcheck disable=SC2312

RED='\033[0;31m'
NC='\033[0m'

TARGET=wasm32-unknown-unknown

OUTPUT_DIR="${PWD}/wasm"
PROFILE_ARG="--release"
PROFILE=release

OUTPUT_FILE="${PWD}/wasm/pshenmic_dpp_bg.wasm"

FEATURES_BASE="--features="
FEATURES_DEFAULT="all"
FEATURES_ARG="${FEATURES_BASE}${FEATURES_DEFAULT}"

if [ -n "$FEATURES" ]; then
  echo -e "using feature: ${RED}'${FEATURES}'${NC}"
  FEATURES_ARG="${FEATURES_BASE}${FEATURES}"
else
  echo -e "using default feature: ${RED}'all'${NC}"
fi

BINDGEN_COMMAND="wasm-pack build --out-dir=${OUTPUT_DIR}  ${PROFILE_ARG} --mode=normal --target=web -- --target=${TARGET} ${FEATURES_ARG}"

if ! [[ -d ${OUTPUT_DIR} ]]; then
  mkdir -p "${OUTPUT_DIR}"
fi

if [[ "${OSTYPE}" == "darwin"* ]]; then
  AR_PATH=$(command -v llvm-ar)
  CLANG_PATH=$(command -v clang)
  AR=${AR_PATH} CC=${CLANG_PATH} ${BINDGEN_COMMAND}
else
  ${BINDGEN_COMMAND}
fi