/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */

var _ = require('underscore')
  , dgram = require('dgram')
  , oscMin = require('osc-min')
  , Client = require('../core/Client')

var UDPClient = module.exports = function (host, port) {
  self = this
  Client.apply(this, arguments)
  this._sock = dgram.createSocket('udp4')
  this._sock.on('error', function(err) { self.emit('error', err) })
}

_.extend(UDPClient.prototype, Client.prototype, {

  transport: 'udp',

  send: function (address, args) {
    args = args || []
    var buf = oscMin.toBuffer({ address: address, args: args })
      , self = this
    this._sock.send(buf, 0, buf.length, this.port, this.host, function(err, bytesSent) {
      if (bytesSent !== buf.length) err = new Error('was not sent properly')
      if (err) self.emit('error', err)
    })
  }

})