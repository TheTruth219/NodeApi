/*
 * Example TCP (Net) Server
 * Listens to port 6000 and sends the word "pong" to clients
 *
 */

 // Dependencies
 const net = require('net');

 // Create the Server
 let server = net.createServer((connection)=>{
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
