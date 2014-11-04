/* Москва node-moscow Москва
 * Released under the terms of the MIT license.
 * Copyright (c) 2014, Sébastien Piquemal <sebpiq@gmail.com>
 */

var _ = require('underscore')
  , EventEmitter = require('events').EventEmitter

var Server = module.exports = function(port) {
  var self = this
  EventEmitter.call(this)
  this.port = port
  this._status = 'stopped'
  this._createSocket()
}
Server._portsBound = []

_.extend(Server.prototype, EventEmitter.prototype, {
  // There's no way to know with node 0.10 that a port is already bound with UDP.
  // So to make things a bit more safe (especially for tests), we make sure
  // that we don't bind twice to the same port (otherwise unexpected things might happen).
  start: function(done) {
    var self = this
    if (this._status === 'stopped') {
      if (!_.contains(Server._portsBound, this.port)) {

        Server._portsBound.push(this.port)

        this._sock.once('listening', function() {
          self._status = 'started'
          self._sock.removeAllListeners('error')
          self._sock.on('close', function() {
            self.emit('error', new Error('socket closed unexpectedly'))
          })
          self._sock.on('error', function(err) {
            self.emit('error', err)
          })
          if (done) done()
        })

        this._sock.once('error', function(err) {
          self._sock.removeAllListeners('listening')
          if (done) done(err)
          else self.emit('error', err)
        })
        
        this._bindSocket()

      } else {
        var err = new Error('port ' + this.port + ' is already bound')
        if (done) done(err)
        else self.emit('error', err)
      }
    } else if (done) done()
  },

  stop: function(done) {
    var self = this
    if (this._status === 'started') {
      this._sock.removeAllListeners('close')
      this._sock.once('close', function() {
        self._status = 'stopped'
        Server._portsBound = _.without(Server._portsBound, self.port)
        self._createSocket()
        done()
      })
      this._sock.close()
    } else done()
  },

  // This just creates the socket and adds the event handlers for messaging.
  // At this stage the socket is not bound yet
  // _createSocket: function() { throw new Error('Implement me') },

  // This should bind the socket
  // _bindSocket: function() { throw new Error('Implement me') }

})
