const transformIgnorePatterns = [
  '/dist/',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  'node_modules/(?!.*@(babel|ant-design))(?!array-move)[^/]+?/(?!(es|node_modules)/)'
];

module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // setupFiles: ['jest-useragent-mock'],
  setupFilesAfterEnv: ['./test/setupAfterEnv.ts', './test/setupFilesMocks.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'],
  modulePathIgnorePatterns: ['<rootDir>/package.json'],
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  transformIgnorePatterns,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsConfig: 'tsconfig.json', diagnostics: true, useESM: true }],
    '^.+\\.ts?$': ['ts-jest', { tsConfig: 'tsconfig.json', diagnostics: true, useESM: true }]
  },
  testMatch: [
    '<rootDir>/**/(*.)test.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage'
};
