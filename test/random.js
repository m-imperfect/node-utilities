const { random } = require('../lib');

console.log("Random boolean value:", random.boolean());

console.log('');

console.log("Random decimals:", random.decimals());

console.log('');

console.log('Random integer[-10:10]:', random.integer(-10,10));

console.log('');

console.log("Random string:", random.string(6, 'abc123', true));
