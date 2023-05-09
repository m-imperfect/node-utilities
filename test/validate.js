const { validate, isValid, ValidationError, defineValidator } = require('../lib/validate');

function logIfValidationError(err) {
  if (err instanceof ValidationError) {
    console.log(`Validation Error[${err.code}]: ` + '`' + err.trace.join('.') + '`' + ((err.comparison)?` is not '${err.comparison}'`:''));
  } else {
    console.error(err);
  }
}

let value1 = 25,
value2 = "some text.";
if (isValid(value1, 'number')) console.log(`value1 - 5 = ${value1 - 5}`);
if (isValid(value2, 'number')) console.log(`value2 - 5 = ${value2 - 5}`);
try {
  validate(value1, 'number', 'value1');
  console.log(`value1 + 5 = ${value1 + 5}`);
  validate(value2, 'number', 'value2');
  console.log(`value2 + 5 = ${value2 + 5}`);
} catch (err) {
  logIfValidationError(err);
}

console.log('');
console.log(`null is any: ${isValid(null, 'any')}`);
console.log(`sentence "Hello, World!" is text: ${isValid("Hello, World!", 'text')}`);
console.log(`letter 'c' is text: ${isValid('c', 'text')}`);
console.log(`empty string is text: ${isValid('', 'text')}`);
console.log(`-3.14 is real number: ${isValid(-3.14, 'realNumber')}`);
console.log(`NaN is real number: ${isValid(NaN, 'realNumber')}`);

console.log('');
console.log(`dictionary is object: ${isValid({}, 'object')}`);
console.log(`array is object: ${isValid([], 'object')}`);
console.log(`dictionary is array: ${isValid({}, 'array')}`);
console.log(`array is dictionary: ${isValid([], 'dictionary')}`);

console.log('');
console.log(`[4,6, 'cm'] is ['number', 'number', 'string']: ${isValid([4,6,'cm'], ['number', 'number', 'string'])}`);
console.log(`[4,6, null] is ['number', 'number', 'string']: ${isValid([4,6, null], ['number', 'number', 'string'])}`);
console.log(`[4,6] is ['number', 'number', 'string']: ${isValid([4,6], ['number', 'number', 'string'])}`);
try {;
  validate([4,true, 'cm'], ['number', 'number', 'string'], "([4,true, 'cm'])");
} catch (err) {
  logIfValidationError(err);
}

console.log('');
console.log(`{name: 'steve', age: 20} is {name: 'string', age: 'number'}: ${isValid({name: 'steve', age: 20}, {name: 'string', age: 'number'})}`);
console.log(`{name: 'steve', age: null} is {name: 'string', age: 'number'}: ${isValid([4,6, null], {name: 'string', age: 'number'})}`);
console.log(`{name: 'steve'} is {name: 'string', age: 'number'}: ${isValid([4,6], {name: 'string', age: 'number'})}`);
try {
  validate({name: 'steve', age: '20 yo'}, {name: 'string', age: 'number'}, "({name: 'steve', age: '20 yo'})");
} catch (err) {
  logIfValidationError(err);
}
try {
  validate({name: 'steve', birth: '7-5-1993'}, {name: 'string', age: 'number'}, "({name: 'steve', birth: '7-5-1993'})");
} catch (err) {
  logIfValidationError(err);
}

console.log('');
console.log(`[true, false, true, true] is boolean[]: ${isValid([true, false, true, true], 'boolean[]')}`);
console.log(`[true, true] is boolean[]: ${isValid([true, true], 'boolean[]')}`);
console.log(`[false, false] is boolean[]: ${isValid([false, false], 'boolean[]')}`);
console.log(`[true, false, null] is boolean[]: ${isValid([true, false, null], 'boolean[]')}`);

console.log('');
console.log(`785 is (number|text): ${isValid(785, 'number|text')}`);
console.log(`c1ea5 is (number|text): ${isValid('c1ea5', 'number|text')}`);
console.log(`empty string is (number|text): ${isValid('', 'number|text')}`);

console.log('');
console.log(`['test', 't'] is text[]: ${isValid(['test', 't'], 'text[]')}`);
console.log(`['whatever', '', 'yes'] is text[]: ${isValid(['whatever', null, 'yes'], 'text[]')}`);

console.log('');
console.log(`{anyKey: "Some value."} is string{}: ${isValid({anyKey: "Some value."}, 'string{}')}`);
console.log(`{anyKey: "Some value.", someKey: "Any value."} is string{}: ${isValid({anyKey: "Some value.", someKey: "Any value."}, 'string{}')}`);
console.log(`{whatever: 515} is string{}: ${isValid({whatever: 515}, 'string{}')}`);
try {
  validate({one: 'idc', two:null}, 'string{}', "({one: 'idc', two:null})");
} catch (err) {
  logIfValidationError(err);
}

console.log('');
defineValidator('physicalVolume', ['number', 'number', 'number', 'string'])
console.log("defined physicalVolume to be ['number', 'number', 'number', 'string'] validator")

console.log('');
console.log(`[7,6,3, 'inch'] is physicalVolume: ${isValid([7,6,3,'inch'], 'physicalVolume')}`);
console.log(`[7,6,3, null] is physicalVolume: ${isValid([7,6,3, null], 'physicalVolume')}`);
console.log(`[7,6,3] is physicalVolume: ${isValid([7,6,3], 'physicalVolume')}`);
try {;
  validate([7,true,3, 'inch'], 'physicalVolume', "([7,true,3, 'inch'])");
} catch (err) {
  logIfValidationError(err);
}

console.log('');
defineValidator('vector3Obj', {x: 'number', y: 'number', z: 'number'})
console.log("defined vector3Obj to be {x: 'number', y: 'number', z: 'number'} validator")
defineValidator('vector3Arr', ['number', 'number', 'number'])
console.log("defined vector3Arr to be ['number', 'number', 'number'] validator")
defineValidator('vector3', 'vector3Obj|vector3Arr')
console.log("defined vector3 to be vector3Obj|vector3Arr validator")

console.log('');
console.log(`{x: 35.21, y: 24.5, z: 3.47} is vector3: ${isValid({x: 35.21, y: 24.5, z: 3.47}, 'vector3')}`);
console.log(`[35.21, 24.5, 3.47] is vector3: ${isValid([35.21, 24.5, 3.47], 'vector3')}`);
console.log(`1852.035 is vector3: ${isValid(1852.035, 'vector3')}`);
