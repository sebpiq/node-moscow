node-moscow
=============

**node-moscow** is a node package providing simple, reliable and well tested OSC servers and clients for node.js. It implements servers and clients for OSC communication on top of **TCP** and **UDP**.

```javascript
// Server script, just logs whatever messages come
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

```javascript
// Client script, sends one message
var client = new require('moscow').createClient('localhost', 9000, 'udp')

// Call the `send(address, args)` method to send a message
client.send('/bla/blo', [11, 22, 'hello'])
```

Installation
--------------

To install **node-moscow** run :

```npm install moscow```


Which protocol to choose for the transport?
---------------------------------------------

OSC is a protocol for communicating between multimedia devices, and can be implemented on top of different transport protocols. In most applications, **UDP** is used, but sometimes other protocols such as **TCP** can be needed, for example if it important not to miss any message.