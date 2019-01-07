/*
 * Example TLS Server
 * Listens to port 6000 and sends the word "pong" to clients
 *
 */

 // Dependencies
 const tls = require('tls');
 const fs = require('fs');
 const path = require('path');

 // Server Options
 let options = {
   'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
   'cert' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
 };

 // Create the Server
 let server = tls.createServer(options,(connection)=>{
   let outboundMessage = 'pong';
   connection.write(outboundMessage);

   // When the client writes something, log it out
   connection.on('data',inboundMessage=>{
     let messageString = inboundMessage.toString();
     console.log('I wrote '+outboundMessage+' and they said '+messageString);
   });
 });

// Listen
server.listen(6000);
