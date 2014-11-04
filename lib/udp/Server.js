/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */

var _ = require('underscore')
  , dgram = require('dgram')
  , oscMin = require('osc-min')
  , Server = require('../core/Server')

var UDPServer = module.exports = function(port) {
  Server.apply(this, arguments)
}

_.extend(UDPServer.prototype, Server.prototype, {

  transport: 'udp',

  _createSocket: function() {
    var self = this
    if (this._sock) this._sock.removeAllListeners()
    this._sock = dgram.createSocket('udp4')
    this._sock.on('message', function (msg, rinfo) {
      msg = oscMin.fromBuffer(msg)
      self.emit('message', msg.address, _.pluck(msg.args, 'value'), rinfo)
    })
  },

  _bindSocket: function() { this._sock.bind(this.port) }

})