/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */

var _ = require('underscore')
  , net = require('net')
  , oscMin = require('osc-min')
  , Server = require('../core/Server')

var TCPServer = module.exports = function(port) {
  Server.apply(this, arguments)
}

_.extend(TCPServer.prototype, Server.prototype, {

  transport: 'tcp',

  _createSocket: function() {
    var self = this
    if (this._sock) this._sock.removeAllListeners()
    this._sock = net.createServer()
    this._sock.on('connection', function(connection) {
      var buffers = []
      connection.on('data', function(buf) { buffers.push(buf) })
      connection.on('end', function() {
        var msg = oscMin.fromBuffer(Buffer.concat(buffers))
        self.emit('message', msg.address, _.pluck(msg.args, 'value'))
      })
    })
  },

  _bindSocket: function() { this._sock.listen(this.port) }

})