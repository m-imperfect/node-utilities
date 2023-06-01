const { string } = require('../');

let ordered = 'abcdefghijkl';
console.log("Original value:", ordered);
console.log("Reversed value:", string.reverse(ordered)); // lkjihgfedcba

console.log('');

let name = 'AAA DDD CCC';
console.log("Original value:", name);
console.log("Between 4,7:", string.between(name, 4,7)); // DDD
console.log("Between 4,7 replaced with \"BBB\":", string.between(name, 4,7, "BBB")); // AAA BBB CCC
