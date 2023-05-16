const { join } = require('path');
const { saveError } = require('../lib');

saveError(new Error("Something went wrong in X."), 'X-%s', "An example.", join(__dirname, 'errors'));
