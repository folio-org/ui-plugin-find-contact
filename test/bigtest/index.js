import 'babel-polyfill';

// require all modules ending in "-test" from the current directory and
// all subdirectories
const requireTest = require.context('./tests/', true, /\.e2e/);

requireTest.keys().forEach(requireTest);
