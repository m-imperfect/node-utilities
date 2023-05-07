const path = require("path");
const log = require("../lib/log");

console.log = log.create(log.writers.default(), log.formatters.label);
console.log("Server", "ready & online"); // output: [Server] ready & online

console.warn = log.create(null, log.formatters.time);
console.warn("%s server is down", "http"); // output: [YYYY-MM-DDTHH:mm:ss.sssZ] http server is down

console.error = log.create(log.writers.file(path.join(__dirname, "logs", "errors.log"), true, console.warn, "ascii"));
console.error(new Error("Something went wrong!"));

const customJSONFormatter = function(...args) {
  return `${JSON.stringify((args.length == 1) ? args[0] : args)}`;
}

const logJSON = log.create(log.writers.default(), customJSONFormatter);
logJSON('test'); // output: "test"
logJSON(1, 2, 3, 4, 5); // output: [1,2,3,4,5]
logJSON({ x: 14, y: 11 }); // output: {"x":14,"y":11}