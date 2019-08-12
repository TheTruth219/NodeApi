/*
*Server related tasks
*
*/

// Dependencies
const http = require('http');
// const https = require('https');
const url = require('url');
const {StringDecoder} = require('string_decoder');
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
let util = require('util');
let debug = util.debuglog('server');


// Instantiate the server module object
let server= {};


// Instantiate the HTTP server

server.httpServer = http.createServer((req, res)=>{
  server.unifiedServer(req,res);

});

// // Instantiate the HTTPS server
// server.httpsServerOptions = {
//   'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
//   'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
// };
// server.httpsServer = https.createServer(server.httpsServerOptions,(req, res)=>{
//   server.unifiedServer(req,res);
// });

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

    // If the request is within the public directory, use the public handler instead
    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject': queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    try{
      chosenHandler(data, (statusCode,payload,contentType)=>{
        server.processHandlerResponse(res,method,trimmedPath,statusCode,payload,contentType);

      });
    }catch(e){
     debug(e);
     server.processHandlerResponse(res,method,trimmedPath,500,{'Error': 'An unknown error has occured'},'json');
    }
  });
};

// Process response from handler
server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload, contentType)=>{
  // Determine the type of response (fallback to JSON)
  contentType = typeof(contentType) == 'string' ? contentType : 'json';

  //Use the status code called back by the handler, or default to 200
  statusCode = typeof(statusCode) == 'number' ? statusCode : 200;



  // Return the response parts that are content-specific
  let payloadString = '';
  if(contentType == 'json'){
    res.setHeader('Content-Type', 'application/json');
    // Use the payload called back by the handler or default to an empty object
    payload = typeof(payload) == 'object' ? payload : {};
    //  Convert the payload to a string
    payloadString = JSON.stringify(payload);
  }
  if(contentType == 'html'){
    res.setHeader('Content-Type', 'text/html');
    payloadString = typeof(payload) == 'string' ? payload : '';
  }
  if(contentType == 'favicon'){
    res.setHeader('Content-Type', 'image/x-icon');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'css'){
    res.setHeader('Content-Type', 'text/css');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'png'){
    res.setHeader('Content-Type', 'image/png');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'jpg'){
    res.setHeader('Content-Type', 'image/jpeg');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  if(contentType == 'plain'){
    res.setHeader('Content-Type', 'text/plain');
    payloadString = typeof(payload) !== 'undefined' ? payload : '';
  }
  // Re-run the response-parts that are common to all content types
    res.writeHead(statusCode);
    res.end(payloadString);

  // If the response is 200, print green otherwise print red
  if(statusCode == 200){
    debug('\x1b[32m%s\x1b[0m',`${method.toUpperCase()}/${trimmedPath} ${statusCode}`);
  } else {
    debug('\x1b[31m%s\x1b[0m',`${method.toUpperCase()}/${trimmedPath} ${statusCode}`);
  }

};

// Define a request router
server.router = {
  '' : handlers.index,
  'account/create' : handlers.accountCreate,
  'account/edit' : handlers.accountEdit,
  'account/deleted' : handlers.accountDeleted,
  'session/create' : handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'checks/all' : handlers.checksList,
  'checks/create' : handlers.checksCreate,
  'checks/edit' : handlers.checksEdit,
  'ping' : handlers.ping,
  'api/users' : handlers.users,
  'api/tokens' : handlers.tokens,
  'api/checks' : handlers.checks,
  'favicon.ico' : handlers.favicon,
  'public' : handlers.public,
  'example/error' : handlers.exampleError
};

// Init script
server.init = ()=>{
  // Start the server, and have it listen on port 3000
  server.httpServer.listen(config.httpPort, ()=>{
    console.log('\x1b[36m%s\x1b[0m',`The server is listening on port ${config.httpPort}`)
  });
  // // Start the HTTPS server
  // server.httpsServer.listen(config.httpsPort, ()=>{
  //   console.log('\x1b[35m%s\x1b[0m',`The server is listening on port ${config.httpsPort}`)
  // });
};

module.exports = server;
