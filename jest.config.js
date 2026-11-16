export default {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // Browser e2e (playwright) runs via `npm run test:e2e`, not jest.
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  moduleNameMapper: {
    '^pshenmic-orchard$': '<rootDir>/packages/orchard/dist/index.cjs',
    '^(\\.\\.?\\/.+)\\.js$': '$1'
  },
  // At this moment tests runs in parallel processes with timeout 40 sec
  // If you need single run - uncomment line bellow
  // maxWorkers: 1,
  testEnvironment: 'node',
  testTimeout: 40000,
  extensionsToTreatAsEsm: ['.ts']
}
