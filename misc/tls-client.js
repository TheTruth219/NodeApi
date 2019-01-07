/*
 * Example TLS  Client
 * Connects to port 6000 and sends the word "ping" to server
 *
 */

 // Dependencies
 const tls = require('tls');
 const fs = require('fs');
 const path = require('path');


 // Server Options
 let options = {
   'ca' : fs.readFileSync(path.join(__dirname,'/../https/cert.pem')) // Only required because we're using a self-signed certificate
 };

 // Define message to send

 let outboundMessage = 'ping';

 // Create the client

 let client = tls.connect({'port': 6000},options,(callback)=>{
   client.write(outboundMessage);
 });

 // When the server writes back, log what it says then kill the client

 client.on('data', inboundMessage=>{
   let messageString = inboundMessage.toString();
    console.log('I wrote '+outboundMessage+' and they said '+messageString);
    client.end();
 });
