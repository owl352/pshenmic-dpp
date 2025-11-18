export default {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1'
  },
  // At this moment tests runs in parallel processes with timeout 40 sec
  // If you need single run - uncomment line bellow
  // maxWorkers: 1,
  testEnvironment: 'node',
  testTimeout: 40000,
  extensionsToTreatAsEsm: ['.ts']
}
