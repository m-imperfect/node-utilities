const args = require('../lib/args');
console.log("Traget: " + (args.following("--target") ?? "Not Set"))
