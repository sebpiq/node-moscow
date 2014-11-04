/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */

var _ = require('underscore')
  , net = require('net')
  , oscMin = require('osc-min')
  , Client = require('../core/Client')


var TCPClient = module.exports = function (host, port) {
  Client.apply(this, arguments)
}

_.extend(TCPClient.prototype, Client.prototype, {

  transport: 'tcp',

  send: function (address, args) {
    args = args || []
    var self = this
      , buf = oscMin.toBuffer({ address: address, args: args })
      , i = -1
      , size = 512
      , sock = net.connect(this.port, this.host)
    sock.on('error', function(err) { self.emit('error', err) })

    var writeNextPacket = function() {
      if ((size * i) < buf.length) {
        i++
        if (sock.write(buf.slice(size * i, size * (i + 1)))) writeNextPacket()
        else sock.once('drain', writeNextPacket)
      } else sock.end()
    }
    sock.on('connect', writeNextPacket)
  }

})