# Node Utilities
Some useful functions to use in [NodeJS](https://nodejs.org/).

## Args Module
Deals with the executed command line that launched the application.  
example to load the module in commonjs:
```js
const { args } = require('@m-imperfect/node-utilities');
```

### Following Arg Method
A method that returns the following argument to the given argument.  
example to use the method:
```js
args.following('-port');
```
in case the commands was:
```
node myapp.js -port 8081
```
the previous method would return `"8081"` as a value.

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
Writers that are attached with the package.

#### File Writer
Writer that writes into a selected file path.  
example file writer:
```js
let keysWriter = new Log.FileWriter('logs/keys.log', true, { encoding: 'base64' }, console.error);
let keysLog = Log.create(keysWriter);

keysLog('ABC-DEF');
keysLog('FED-CBA');
keysLog('XYZ-IJK');
```

### Log Formatter
Function that takes the arguments and "merge" them into one string in a particular way.  
example formatter:
```js
function multilineFormatter(...param) {
  return param.map(value => `${value}`).join('\n');
}
```

### Built-in Log Formatters
Formatters that are attached with the package.

#### Default Formatter
Equivalent for `utils.format`.

#### Label Formatter
Labeling a message.  
formatting example:
```js
Log.formatters.label('Dictionary', 'Globalization', 'is', 'a word') // [Dictionary] Globalization is a word
```

#### Time Formatter
Labeling a message with ISO time string.  
formatting example:
```js
let status = 200; // just for the example
Log.formatters.time('127.0.0.1', `(${status})`) // [YYYY-MM-DDTHH:mm:ss.SSSZ] 127.0.0.1 (200)
```

#### Labeled Time Formatter
Labeling a message in addition to ISO time string.  
formatting example:
```js
Log.formatters.labeledTime('API', 'POST /create', `success`) // [YYYY-MM-DDTHH:mm:ss.SSSZ][API] POST /create success
```

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

## Errors Module
Deals with errors in general.  
example to load the module in commonjs:
```js
const { errors } = require('@m-imperfect/node-utilities');
``` 

### Save Method
Saves an error in a specific path.  
parameters:  
- **error**: any kind of errors, TypeError, SyntaxError, etc...
- **key**: the key which error will be saved with, %s to will be replaced with a random string with 8 ASCII charset.
- **title**: the title that will be in the head of the message in the file.
- **dir**: a directory path to save the error file in.  
example of usage:
```js
try {
  throw new Error("Something went wrong in Y.");
} catch (err) {
  errors.save(err, 'Y-%s', "The example title.", 'Errors');
  // the error is saved in ~/Errors/Y-D2Aq1eEC
}
```

### Coded Error
An error class with a code.  
example of usage:
```js
const { CodedError } = errors;

function mayCauseError() {
  if (Math.random() > 0.5) throw new Error("Usual error.")
}

try {
  mayCauseError();
  throw new CodedError('MY_CODE', "Warning message that have a lot to say.")
} catch (err) {
  if (err.code == 'MY_CODE') {
    console.log("Friendly warning message.");
  } else {
    console.error(err);
  }
}
```

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

### Between Method
Gives a piece of a string or replaces it.  
example of usage:
```js
let value = 'John Example Doe';
console.log("Original value:", value);
console.log("Between 5,12:", string.between(value, 5,12)); // Example
console.log("Between 5,12 replaced with \"son of\":", string.between(value, 5,12, "son of")); // John son of Doe
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
Listening to any change that occurs to a specific file.  
usage example:
```js
const { FileWatcher } = require('@m-imperfect/node-utilities');

new FileWatcher('./logs/errors.log')
.on('update', () => console.log('The file has been changed'))
.on('warning', console.warn)
.on('error', console.error)
.watch();
```

## TODO
- Complete:
  - [Validation Module](#Validation-Module).
  - [Validation Testing](https://github.com/m-imperfect/node-utilities/blob/master/test/validate.js).

## Plans
- watch file, wait for creation option.
- save error, event instead of warning.
