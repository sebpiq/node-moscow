/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */
 
var UDPClient = require('./lib/udp/Client')
  , UDPServer = require('./lib/udp/Server')
  , TCPClient = require('./lib/tcp/Client')
  , TCPServer = require('./lib/tcp/Server')

exports.createClient = function(host, port, transport) {
  if (transport === 'udp') {
    return new UDPClient(host, port)
  } else if (transport === 'tcp') {
    return new TCPClient(host, port)
  } else throw new Error('invalid transport ' + transport)
}

exports.createServer = function(port, transport) {
  if (transport === 'udp') {
    return new UDPServer(port)
  } else if (transport === 'tcp') {
    return new TCPServer(port)
  } else throw new Error('invalid transport ' + transport)
}