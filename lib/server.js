/*
*Server related tasks
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const {StringDecoder} = require('string_decoder');
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');


// Instantiate the server module object
let server= {};


// Instatiate the HTTP server

server.httpServer = http.createServer((req, res)=>{
  server.unifiedServer(req,res);

});

// Instantiate the HTTPS server

server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions,(req, res)=>{
  server.unifiedServer(req,res);
});

// All the server logic for both the http and the https server

server.unifiedServer = (req,res) => {

  // Get the URL and parse in
  let parsedUrl = url.parse(req.url, true);
  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath= path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  let headers = req.headers;

  // Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer= '';
  req.on('data', data =>{
    buffer += decoder.write(data);
  });
  req.on('end', ()=>{
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, use the notFound handler

    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject': queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode,payload)=>{
      //Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use the payload balled back by the handler or default to an empty object
      payload =typeof(payload) == 'object' ? payload : {};

      //  Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Send the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log('Returning this response: ', statusCode,payloadString);
    });

  });
};


// Define a request router
server.router = {
  'ping' : handlers.ping,
  'users' : handlers.users,
  'tokens' : handlers.tokens,
  'checks' : handlers.checks
};

// Init script
server.init = ()=>{
  // Start the server, and have it listen on port 3000
  server.httpServer.listen(config.httpPort, ()=>{
    console.log(`The server is listening on port ${config.httpPort}`)
  });
  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, ()=>{
    console.log(`The server is listening on port ${config.httpsPort}`)
  });
};

module.exports = server;
