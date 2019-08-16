// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],

  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  preset: 'ts-jest',

  roots: ['<rootDir>'],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  testPathIgnorePatterns: [
    '\\\\node_modules\\\\',
    '\\\\examples\\\\',
    '\\\\dist\\\\'
  ],

  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1'
  }
}
