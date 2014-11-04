node-moscow
=============

[![Build Status](https://travis-ci.org/sebpiq/node-moscow.svg?branch=master)](https://travis-ci.org/sebpiq/node-moscow)

**node-moscow** is a node package providing **simple, reliable and well tested OSC servers and clients** for node.js. It implements servers and clients for OSC communication on top of **TCP** and **UDP**.

To install it run `npm install moscow`


Minimalist example
--------------------

**server.js**

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

**client.js**

```javascript
// Creates a UDP client sending to host 'localhost' on port 9000
var client = new require('moscow').createClient('localhost', 9000, 'udp')

// Call the `send(address, args)` method to send a message
client.send('/bla/blo', [11, 22, 'hello'])
```

API
------

## moscow

#### createClient(host, port, transport)

Create and return a new OSC client.

```javascript
var udpClient = moscow.createClient('192.168.2.100', 9000, 'udp')
  , tcpClient = moscow.createClient('192.168.2.110', 9001, 'tcp')
```


#### createServer(port, transport)

Create and return a new OSC server.

```javascript
var udpServer = moscow.createServer(9000, 'udp')
  , tcpServer = moscow.createServer(9001, 'tcp')
```


## Server(port)

#### Event: 'message'

Emitted when an OSC message was received by the server. Handlers are passed two arguments `address`, the OSC address, and `args` the list of arguments sent along the message. Example :

```javascript
server.on('message', function(address, args) {
  if (address === '/color')
    console.log('R:' + args[0] + ',G:' + args[1] + ',B:' + args[2])
})

``` 

#### Event: 'error'

Emitted when an unexpected error happened.


#### Server.start(done)

Starts the server and calls `done(err)`.


#### Server.stop(done)

Stops the server and calls `done(err)`.


## Client(host, port)

#### Event: 'error'

Emitted when an unexpected error happened.

#### Client.send(address, args)

Sends an OSC message to `address` with arguments `args`. Example : 

```javascript
client.send('/hello', ['max', new Buffer('sam'), 'john'])
```


FAQ
-------

### What is the difference between UDP and TCP?

UDP is the commonly used with OSC because it is faster than TCP. On the other hand, with UDP you might loose some messages, while TCP ensures all packets are properly received. So this is a trade-off to make, depending on your requirements.


Changelog
-----------

- 0.1.0 Initial release: UDP, TCP client + server.