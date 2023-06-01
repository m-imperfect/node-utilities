const { join } = require('path');
const { errors } = require('../');
const { CodedError } = errors;

errors.save(new Error("Something went wrong in X."), 'X-%s', "An example.", join(__dirname, 'errors'));

console.error(new CodedError('some-code', 'MASSIVE ERROR!'));
