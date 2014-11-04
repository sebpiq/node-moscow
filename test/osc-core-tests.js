var assert = require('assert')
  , EventEmitter = require('events').EventEmitter
  , _ = require('underscore')
  , async = require('async')
  , moscow = require('../index')
  , Server = require('../lib/core/Server')
  , serverTestSuite = require('./common').serverTestSuite
  , clientTestSuite = require('./common').clientTestSuite
  , assertBufferGetSent = require('./common').assertBufferGetSent


describe('moscow', function() {

  it('should throw an error for an invalid transport', function() {
    assert.throws(function() {
      moscow.createServer(5000, 'dontexist')
    })
    assert.throws(function() {
      moscow.createClient(5000, 'blabla', 'dontexist')
    })
  })

  describe('core.Server', function() {

    var FakeServer = function() { Server.apply(this) }
    _.extend(FakeServer.prototype, Server.prototype, {
      _createSocket: function() { this._sock = new EventEmitter() },
      _bindSocket: function() {},
      start: function() {
        Server.prototype.start.apply(this, arguments)
        this._sock.emit('listening')
      }
    })
    var FakeServer2 = function() { Server.apply(this) }
    _.extend(FakeServer2.prototype, Server.prototype, {
      _createSocket: function() { this._sock = new EventEmitter() },
      _bindSocket: function() {},
      start: function() {
        Server.prototype.start.apply(this, arguments)
      }
    })


    afterEach(function() {
      Server._portsBound = []
    })

    describe('start', function() {

      it('should return an error in callback if starting twice servers on same port', function(done) {
        var server1 = new FakeServer(9001)
          , server2 = new FakeServer(9001)

        server1.start(function(err) {
          if (err) throw err
          server2.start(function(err) {
            assert.ok(err)
            done()
          })
        })
      })

      it('should return an error in callback if starting twice servers on same port', function(done) {
        var server1 = new FakeServer(9001)
          , server2 = new FakeServer(9001)

        server1.start(function(err) {
          if (err) throw err
          server2.on('error', function(err) {
            assert.ok(err)
            done()
          })
          server2.start()
        })
      })

      it('should return an error in callback if connection fails', function(done) {
        var server = new FakeServer2()
        server.start(function(err) {
          assert.ok(err)
          done()
        })
        server._sock.emit('error', 'wow')
      })

      it('should emit an error if connection fails', function(done) {
        var server = new FakeServer2()
        server.on('error', function(err) {
          assert.ok(err)
          done()
        })
        server.start()
        server._sock.emit('error', 'wow')
      })

    })

    describe('errors', function() {

      it('should throw an error if connection closed unexpectedly', function(done) {
        var server = new FakeServer()
        server.start(function() {
          server.on('error', function(err) {
            assert.ok(err)
            done()
          })
          server._sock.emit('close')
        })
        server._sock.emit('listening')
      })

      it('should throw an error if the socket receives an error while running', function(done) {
        var server = new FakeServer()
        server.start(function() {
          server.on('error', function(err) {
            assert.ok(err)
            done()
          })
          server._sock.emit('error', 'wow')
        })
        server._sock.emit('listening')
      })

    })

  })

  serverTestSuite('udp')
  clientTestSuite('udp', function() {

    it('should fail to send big buffers', function(done) {
      var client = new moscow.createClient('127.0.0.1', 4444, 'udp')
        , buf = new Buffer(Math.pow(2, 16))
        , server
      server = assertBufferGetSent(client, buf, function(err, rBuf) {
        if (err) throw err
        done(new Error('shouldnt come here'))
      })
      setTimeout(server.stop.bind(server, done), 1000)
    })

  })

  serverTestSuite('tcp')
  clientTestSuite('tcp', function() {

    it('should send big buffers', function(done) {
      var client = new moscow.createClient('127.0.0.1', 4444, 'tcp')
        , buf = new Buffer(Math.pow(2, 16))
      assertBufferGetSent(client, buf, function(err, rBuf) {
        if (err) throw err
        assert.deepEqual(buf, rBuf)
        done()
      })
    })

  })


})