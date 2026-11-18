export default {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // Browser e2e (playwright) runs via `npm run test:e2e`, not jest.
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  moduleNameMapper: {
    // Proving lives in the separate dash-platform-shielded repo (devDependency,
    // symlinked into node_modules). Resolve its eager entry and lazy subpath.
    '^dash-platform-shielded$': '<rootDir>/node_modules/dash-platform-shielded/dist/src/index.cjs',
    '^dash-platform-shielded/lazy$': '<rootDir>/node_modules/dash-platform-shielded/dist/src/lazy.cjs',
    '^(\\.\\.?\\/.+)\\.js$': '$1'
  },
  // Proving suites (Shielded*, WebAssembly, InitShielded, Orchard*) each load
  // their own orchard wasm instance whose rayon/emnapi thread pools span ALL
  // cores. Running them fully parallel oversubscribes the CPU ~5x and pushes
  // multi-proof tests past their timeouts (observed: 54s tests > 240s under
  // full parallelism). Two workers keep at most two proving pools racing.
  maxWorkers: 2,
  testEnvironment: 'node',
  testTimeout: 40000,
  extensionsToTreatAsEsm: ['.ts']
}
