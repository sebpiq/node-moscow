/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */
 
var _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

var Client = module.exports = function (host, port) {
  EventEmitter.call(this)
  this.host = host
  this.port = port
}

_.extend(Client.prototype, EventEmitter.prototype, {

  // Sends a message
  // send: function(address, args) { throw new Error('Implement me') }

})