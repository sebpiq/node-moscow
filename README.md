node-moscow
=============

**node-moscow** is a node package providing **simple, reliable and well tested OSC servers and clients** for node.js. It implements servers and clients for OSC communication on top of **TCP** and **UDP**.

To install it run :

```npm install moscow```


Minimalist example
--------------------

Script **server.js**

```javascript
// Creates a UDP server, listening on port 9000
var server = new require('moscow').createServer(9000, 'udp')

// Bind to the `message` event to handle incoming messages 
server.on('message', function(address, args) {
  console.log(address, args)
})

// Start the server
server.start(function() {
  console.log('server started')
})
```

Script **client.js**

```javascript
// Creates a UDP client sending to host 'localhost' on port 9000
var client = new require('moscow').createClient('localhost', 9000, 'udp')

// Call the `send(address, args)` method to send a message
client.send('/bla/blo', [11, 22, 'hello'])
```

FAQ
---------------------------------------------

### What is the difference between UDP and TCP?

UDP is the most commonly used because it is faster than TCP. On the other hand, with UDP you might loose some messages, while TCP ensures all packets are properly received. So this is a trade-off to make.
