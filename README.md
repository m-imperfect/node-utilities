# Node Utilities
Some useful functions to use in [NodeJS](https://nodejs.org/).

## Args Module
Deals with the executed command line that launched the application.  
example to load the module in commonjs:
```js
const args = require('@m-imperfect/node-utilities/lib/args');
```

### Following Arg Method
A method that returns the following argument to the given argument.  
example to use the method:
```js
args.following('-port');
```

## Log Module
Deals with outputs printing either in console, in a file or anywhere else.  
example to load the module in commonjs:
```js
const Log = require('@m-imperfect/node-utilities/lib/log');
```

### Log Writer
Function that takes a string and print it in a particular place.  
example writer creator:
```js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const formurlencoded = (...args) => import('form-urlencoded').then(({default: formurlencoded}) => formurlencoded(...args));
function createPastepinWriter(apiKey, success, errorsHandler) {
  return async function pastebinWriter(message) {
    try {
      const content = await formurlencoded({
        api_dev_key: apiKey,
        api_paste_code: message,
        api_option: 'paste'
      });
      const response = await fetch('https://pastebin.com/api/api_post.php', {
        method: 'POST',
        body: content,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': content.length
        }
      });
      let text = await response.text();
      if (response.ok)
        success?.(text);
      else
        errorsHandler?.(text);
    } catch (err) {
      errorsHandler?.(err);
    }
  }
}

let myPastepinWriter = createPastepinWriter(
  process.env["PASTEPIN_API_KEY"],
  url => console.log("Logged a message to:" + url),
  console.error
);
```

### Log Formatter
Function that takes the arguments and "merge" them into one string in a particular way.  
example formatter:
```js
function multilineFormatter(...args) {
  return param.map(value => `${value}`).join('\n');
}
```

### Logger
Can be created by `Log.create` function that takes a writer and a formatter then return a "logger" function.  
The logger takes arguments and format them with the formatter. After that, it sends the formatted arguments string to the writer.  
example logger creation and usage:
```js
let pastepinLoggger = Log.create(myPastepinWriter, multilineFormatter);

pastepinLoggger("My random text to be sent.");
```

## Validation Module
Deals with the values and their types.  
example to load the module in commonjs:
```js
const validation = require('@m-imperfect/node-utilities/lib/validation');
```

### Validate Method
Basically `validation.validate` check if the given value type is the same the the given type aka "validator".  
if the value type is the same, the code continue, if not, an error is thrown.
example of usage:
```js
let value1 = "Some random text.";
let value2 = 'A';
let value3 = '';
try {
  validation.validate(value1, 'text');
  console.log("the value1 is a text");

  validation.validate(value2, 'text');
  console.log("the value2 is a text");

  validation.validate(value3, 'text'); // expected to throw an error
  console.log("the value3 is a text"); // won't be printed anyway
} catch (err) {
  console.error(err);
}
```

### Is Valid Method
The same concept as [validate method](#Validate-Method) except this method doesn't throw an error, but instead it returns a boolean value.  
example of usage:
```js
let value1 = Math.sqrt(2)
if (validation.isValid(value1, 'realNumber'))
  console.log("value1 is a real number")
else
  console.log("value1 isn't a real number")

let value2 = Math.sqrt(-1)
if (validation.isValid(value2, 'realNumber'))
  console.log("value2 is a real number")
else
  console.log("value2 isn't a real number")
```

### Define Validator Method
Define a unique key to represent a custom validator.  
example of usage:
```js
validation.define('userID', 'realNumber|text')

console.log(validation.isValid('CA-4', 'userID')) // true
console.log(validation.isValid(1034, 'userID')) // true
console.log(validation.isValid('', 'userID')) // false
```

### Default Validators
- JS [data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).
- **any**: any value is accepted.
- **text**: any string that has one letter or more.
- **realNumber**: all numbers except [NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
- ...

## File Watcher
...

## TODO
- Accept function validators.
- Complete [default validators](#Default-Validators).
- Complete [file watcher](#File-Watcher).

## Plans
- Integer validator.
- Decimal validator.
- Positive/Negative validator.
- validation operator `&` (similar to `|`).
