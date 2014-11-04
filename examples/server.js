// Server script, just logs whatever messages come
var moscow = require('../index.js')
  , server = new moscow.createServer(9000, 'udp')

// Bind to the `message` event to handle incoming messages 
server.on('message', function(address, args) {
  console.log(address, args)
})

// Start the server
server.start(function() {
  console.log('server started')
})