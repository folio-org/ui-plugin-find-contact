const commonCofig = require('@folio/stripes-acq-components/jest.config');

module.exports = {
  ...commonCofig,
  testMatch: ['**/findContact/**/?(*.)test.{js,jsx}'],
  collectCoverageFrom: [
    '**/findContact/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**',
  ],
};
