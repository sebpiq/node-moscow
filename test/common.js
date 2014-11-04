var assert = require('assert')
  , _ = require('underscore')
  , async = require('async')
  , moscow = require('../index')

// Helper for asynchronous tests, waiting for `expectedCount` answers and then calling `done`
var waitForAnswers = exports.waitForAnswers = function(expectedCount, done) {
  var received = []
  return function () {
    received.push(_.toArray(arguments))
    if (received.length >= expectedCount) done(received)
  }
}

var assertBufferGetSent = exports.assertBufferGetSent = function(client, buf, done) {
  var server = new moscow.createServer(client.port, client.transport)
  async.waterfall([
    server.start.bind(server),

    function(next) {
      server.once('message', function(address, args) {
        assert.equal(address, '/someBuffer')
        assert.equal(args.length, 1)
        next(null, args[0])
      })
      client.send('/someBuffer', [buf])
    },

    function(buf, next){
      server.stop(function(err) { next(err, buf) })
    }

  ], done)
  return server
}

var serverTestSuite = exports.serverTestSuite = function(transport) {
  describe('OSCServer - ' + transport, function() {

    it('should not cause problem with if starting/stopping several times', function(done) {
      var client = new moscow.createClient('127.0.0.1', 9001, transport)
        , server = new moscow.createServer(9001, transport)
        , messageHandler

      async.series([
        server.start.bind(server),
        function(next) {
          var _messageHandler = waitForAnswers(2, function(received) { next(null, received) })
          messageHandler = function(address, args) { _messageHandler(1, address, args) }
          server.on('message', messageHandler)
          client.send('/blabla', [1, 2, 3])
          client.send('/hello/helli', [])
        },
        server.stop.bind(server),
        server.stop.bind(server),
        server.start.bind(server),
        server.start.bind(server),
        function(next) {
          server.removeListener('message', messageHandler)
          _messageHandler = waitForAnswers(1, function(received) { next(null, received) })
          messageHandler = function(address, args) { _messageHandler(2, address, args) }
          server.on('message', messageHandler)
          client.send('/bloblo', ['hello'])
        }
      ], function(err, results) {
        if (err) throw err
        results.shift()
        assert.deepEqual(results.shift(), [
          [1, '/blabla', [1, 2, 3]],
          [1, '/hello/helli', []]
        ])
        _(4).times(function() { results.shift() })
        assert.deepEqual(results.shift(), [
          [2, '/bloblo', ['hello']]
        ])
        server.stop(done)
      })
    })

    it('should start the server and be able to receive', function(done) {
      var server = new moscow.createServer(9001, transport)
        , client = new moscow.createClient('127.0.0.1', 9001, transport)
        , messageHandler

      messageHandler = waitForAnswers(2, function(received) {
        assert.deepEqual(received, [
          ['/blabla', [1, 2, 3]],
          ['/hello/helli', []],
        ])
        server.stop(done)
      })
      server.on('message', function(address, args) { messageHandler(address, args) })

      server.start(function(err) {
        if (err) throw err
        client.send('/blabla', [1, 2, 3])
        client.send('/hello/helli', [])
      })
    })

  })

}

var clientTestSuite = exports.clientTestSuite = function(transport, extra) {

  describe('OSCClient - ' + transport, function() {

    it('should send small buffers', function(done) {
      var client = new moscow.createClient('127.0.0.1', 4444, transport)
        , buf = new Buffer(10)
      assertBufferGetSent(client, buf, function(err, rBuf) {
        if (err) throw err
        assert.deepEqual(buf, rBuf)
        done()
      })
    })

    if (extra) extra()

  })

}