module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  };
  