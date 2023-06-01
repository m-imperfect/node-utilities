const path = require("path");
const { log } = require("../");
const { FileWriter } = log;

console.log = log.create(log.defaultWriter, log.formatters.label);
console.log("Server", "ready & online"); // output: [Server] ready & online

console.warn = log.create(null, log.formatters.time);
console.warn("%s server is down", "http"); // output: [YYYY-MM-DDTHH:mm:ss.SSSZ] http server is down

let showError = console.error
console.error = log.create(new FileWriter(path.join(__dirname, 'logs/errors.log'), true, { encoding: "ascii" }, (message, error) => {
  console.log('Error Saving', message)
  showError(error?.message ?? error)
}));
console.error(new Error("Something went wrong!"));

const customJSONFormatter = function(...args) {
  return `${JSON.stringify((args.length == 1) ? args[0] : args)}`;
}

const logJSON = log.create(log.defaultWriter, customJSONFormatter);
logJSON('test'); // output: "test"
logJSON(1, 2, 3, 4, 5); // output: [1,2,3,4,5]
logJSON({ x: 14, y: 11 }); // output: {"x":14,"y":11}
