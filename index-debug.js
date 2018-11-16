/*
*Primiary file for API
*
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
let app = {};

// Init function
app.init = ()=>{
  // Start the server
  debugger;
  server.init();
  debugger;

  // Start the workers
  debugger;
  workers.init();
  debugger;

  // Start the CLI, but make sure it starts last
  debugger;
  setTimeout( ()=> {
    cli.init();
    debugger;
  }, 50);
  debugger;
// Set foo at 1
debugger;
let foo = 1;
console.log("Just assigned 1 to foo");
debugger;
// Increment foo

foo++;
debugger;
console.log("Just incremented foo");
// Square foo

foo= foo * foo;
console.log("Just squared foo")
debugger;
// Convert foo to string

foo = foo.toString();
debugger;
// call the init script that will throw
exampleDebuggingProblem.init();
debugger;
};

// Execute
app.init();


// Export the app

module.exports = app;
