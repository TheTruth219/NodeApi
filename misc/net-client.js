/*
 * Example TCP (Net) Client
 * Connects to port 6000 and sends the word "ping" to server
 *
 */

 const net = require('net');


 // Define message to send

 let outboundMessage = 'ping';

 // Create the client

 let client = net.createConnection({'port': 6000},(callback)=>{
   client.write(outboundMessage);
 });

 // When the server writes back, log what it says then kill the client

 client.on('data', inboundMessage=>{
   let messageString = inboundMessage.toString();
    console.log('I wrote '+outboundMessage+' and they said '+messageString);
    client.end();
 });
