const { args } = require('../');
console.log("Traget: " + (args.following("--target") ?? "Not Set"))
