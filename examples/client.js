// Client script, sends one message
var moscow = require('../index.js')
  , client = new moscow.createClient('localhost', 9000, 'udp')

// Call the `send(address, args)` method to send a message
client.send('/bla/blo', [11, 22, 'hello'])