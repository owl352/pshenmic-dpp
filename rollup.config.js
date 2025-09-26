export default {
  input: 'wasm/pshenmic_dpp.js',
  output: {
    file: 'wasm/pshenmic_dpp_bundle.js',
    format: 'umd',
    name: 'pshenmic-dpp',
    exports: 'named',
    compact: true,
  },
};
