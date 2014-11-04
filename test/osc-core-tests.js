var assert = require('assert')
  , moscow = require('../index')
  , serverTestSuite = require('./common').serverTestSuite
  , clientTestSuite = require('./common').clientTestSuite
  , assertBufferGetSent = require('./common').assertBufferGetSent


describe('moscow', function() {

  describe('OSCServer', function() {

    describe('start', function() {

      it('should throw an error if starting twice servers on same port', function(done) {
        var server1 = new moscow.createServer(9001, 'udp')
          , server2 = new moscow.createServer(9001, 'udp')

        server1.start(function(err) {
          if (err) throw err
          server2.start(function(err) {
            assert.ok(err)
            server1.stop(done)
          })
        })
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