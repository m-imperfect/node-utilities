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
const { log: Log } = require('@m-imperfect/node-utilities');
```

### Log Writer
Function that takes a string and print it in a particular place.  
example writer creator:
```js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const formurlencoded = (...args) => import('form-urlencoded').then(({default: formurlencoded}) => formurlencoded(...args));
class PastepinWriter extends Log.WriterClass {
  constructor(apiKey, success, errorsHandler) {
    super(async (message) => {
      try {
        const content = await formurlencoded({
          api_dev_key: this.apiKey,
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
    });

    this.apiKey = apiKey;
  }
}

let myPastepinWriter = new PastepinWriter(
  process.env["PASTEPIN_API_KEY"],
  url => console.log("Logged a message to: " + url),
  console.error
);
```

### Built-in Log Writers
...

### Log Formatter
Function that takes the arguments and "merge" them into one string in a particular way.  
example formatter:
```js
function multilineFormatter(...param) {
  return param.map(value => `${value}`).join('\n');
}
```

### Built-in Log Formatters
...

### Logger
Can be created by `Log.create` function that takes a writer and a formatter then return a "logger" function.  
The logger takes arguments and format them with the formatter. After that, it sends the formatted arguments string to the writer.  
example logger creation and usage:
```js
let pastepinLogger = Log.create(myPastepinWriter, multilineFormatter);

pastepinLogger(
  "My text that will reach the writer.",
  "Another parameter to test the formatter.",
  "Should be uploaded."
);
```

## Save Error Module
...

## String Module
Deals with strings modifying.  
example to load the module in commonjs:
```js
const { string } = require('@m-imperfect/node-utilities');
```

### Reverse Method
Reverses a string by making the first letter is the last one and vice versa.  
example of usage:
```js
let value = 'abcdef';
console.log(ordered);
console.log(string.reverse(ordered)); // fedcba
```

## Random Module
Deals with randomizing (numbers, strings, etc...).  
example to load the module in commonjs:
```js
const { random } = require('@m-imperfect/node-utilities');
```

### Boolean Method
Randomizes a boolean value `true`|`false`.  
example of usage:
```js
if (random.boolean()) {
  console.log("action1 as random is true")
} else {
  console.log("action2 as random is false")
}
```

### Integer Method
Randomizes an integer number in a given range [min, max].  
Note: min and max is included in the range, so the returned value could be the min/max value.  
example of usage:
```js
console.log(random.integer(0,9)); // could be 0 or 9 or any integer between them
```

### Decimals Method
Same as `Math.random`, returns a pseudorandom number between 0 and 1.  
Note: the returned number is never gonna be 0 or 1 but any number in between.  
example of usage:
```js
console.log(random.decimals());
```

### String Method
Randomizes a string using an array of characters.  

parameters:  
- **length**: number of characters in the string.
- **characters**: the array of characters to be used in randomizing.
- **unique**: whether should the string be a unique characters string.  
  
example of usage:
```js
console.log(random.string()); // ATzx1, B, jSdfqZ183
console.log(random.string(5)); // mPLJF, ipf9Z, IistX
console.log(random.string(7, 'ab12')); // abb2a1, aaaabb, 11221b
console.log(random.string(6, 'abc123', true)); // b2ac31, a23c1b, c2b31a
```

## Validation Module
Deals with the values and their types.  
example to load the module in commonjs:
```js
const { validation } = require('@m-imperfect/node-utilities');
```
...

## File Watcher
...

## TODO
- Complete:
  - [Built-in Log Writers](#Built-in-Log-Writers).
  - [Built-in Log Formatters](#Built-in-Log-Formatters).
  - [Save Error Module](#Save-Error-Module).
  - [Validation Module](#Validation-Module).
  - [Validation Testing](https://github.com/m-imperfect/node-utilities/blob/master/test/validate.js).
  - [File Watcher](#File-Watcher).

## Plans
- Integer validator.
- Decimal validator.
- Positive/Negative validator.
- validation operator `&` (similar to `|`).
