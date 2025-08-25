#!/usr/bin/env bash
# shellcheck disable=SC2312

TARGET=wasm32-unknown-unknown

OUTPUT_DIR="${PWD}/wasm"
PROFILE_ARG="--release"
PROFILE=release

OUTPUT_FILE="${PWD}/wasm/pshenmic_dpp_bg.wasm"

RUSTFLAGS="-C link-arg=--initial-memory=2621440 -C link-arg=--max-memory=5242880 -C target-feature=+crt-static -C embed-bitcode=no -C metadata=reduced -C link-dead-code=no -C panic=abort"

BUILD_COMMAND="cargo build --config net.git-fetch-with-cli=true --target=${TARGET} ${PROFILE_ARG}"
STRIP_COMMAND="wasm-snip ${PWD}/target/${TARGET}/${PROFILE}/pshenmic_dpp.wasm -o ${PWD}/target/${TARGET}/${PROFILE}/pshenmic_dpp.wasm --snip-rust-fmt-code --snip-rust-panicking-code"
BINDGEN_COMMAND="wasm-bindgen --typescript --out-dir=${OUTPUT_DIR} --target=web --omit-default-module-path ${PWD}/target/${TARGET}/${PROFILE}/pshenmic_dpp.wasm"

if ! [[ -d ${OUTPUT_DIR} ]]; then
  mkdir -p "${OUTPUT_DIR}"
fi

if [[ "${OSTYPE}" == "darwin"* ]]; then
  AR_PATH=$(command -v llvm-ar)
  CLANG_PATH=$(command -v clang)
  AR=${AR_PATH} CC=${CLANG_PATH} ${BUILD_COMMAND}
  AR=${AR_PATH} CC=${CLANG_PATH} ${STRIP_COMMAND}
  AR=${AR_PATH} CC=${CLANG_PATH} ${BINDGEN_COMMAND}
else
  echo "Build"
  ${BUILD_COMMAND}
  echo "Strip"
  ${STRIP_COMMAND}
  echo "Bindgen"
  ${BINDGEN_COMMAND}
fi

#if command -v wasm-opt &> /dev/null; then
#  echo "Optimizing wasm using Binaryen"
#  wasm-opt \
#    --code-folding \
#    --const-hoisting \
#    --abstract-type-refining \
#    --dce \
#    --strip-producers \
#    -Oz \
#    --generate-global-effects \
#    --enable-bulk-memory \
#    --enable-nontrapping-float-to-int  \
#    -tnh \
#    --flatten \
#    --rereloop \
#    -Oz \
#    --converge \
#    --vacuum \
#    --dce \
#    --gsi \
#    --inlining-optimizing \
#    --merge-blocks \
#    --simplify-locals \
#    --optimize-added-constants \
#    --optimize-casts \
#    --optimize-instructions \
#    --optimize-stack-ir \
#    --remove-unused-brs \
#    --remove-unused-module-elements \
#    --remove-unused-names \
#    --remove-unused-types \
#    --post-emscripten \
#    -Oz \
#    -Oz \
#    "${OUTPUT_FILE}" \
#    -o \
#    "${OUTPUT_FILE}"
#else
#  echo "wasm-opt command not found. Skipping wasm optimization."
#fi