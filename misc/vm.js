/*
 * Example VM running arbitrary commands
 *
 *
 */

 // Dependencies
 const vm = require('vm');

 // Define a context for the script to run in
 let context = {
   'foo' : 25
 };

 // Define the script
 let script = new vm.Script(`

   foo = foo * 2;
   let bar = foo + 1;
   let fizz = 52;
 `);

script.runInNewContext(context);
console.log(context);
