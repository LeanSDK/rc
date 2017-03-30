{ expect, assert } = require 'chai'
sinon = require 'sinon'
RC = require.main.require 'lib'
{ co, request } = RC::Utils


describe 'Utils.request', ->
  describe 'request("https://google.com")', ->
    it 'should send request and print result', ->
      co ->
        result = yield request 'GET', 'https://google.com'
        assert.isOk result.body, 'No body received'
        assert.equal result.status, 302, 'Status differs from 302'
        yield return
  describe 'request("https://raw.githubusercontent.com/npm/npm/latest/package.json")', ->
    it 'should send request and print JSON result', ->
      co ->
        result = yield request 'GET', 'https://raw.githubusercontent.com/npm/npm/latest/package.json', json: yes
        assert.isOk result.body, 'No body received'
        assert.equal result.status, 200, 'Status differs from 200'
        yield return
    return
  describe 'request("https://google.comm")', ->
    it 'should send request and handle connection error', ->
      co ->
        result = yield request 'GET', 'https://google.comm'
        assert.equal result.status, 500, 'Error response status is not valid'
        yield return
  describe 'request("https://google.com/mmm")', ->
    it 'should send request and handle HTTP error', ->
      co ->
        result = yield request 'GET', 'https://google.com/mmm'
        assert.isOk result.body, 'No body received'
        assert.equal result.status, 404, 'Status differs from 302'
        yield return
  describe 'request.head("https://google.com")', ->
    it 'should send request and print result', ->
      co ->
        result = yield request.head 'https://google.com'
        assert.lengthOf result.body, 0, 'Unexpected body received'
        assert.equal result.status, 302, 'Status differs from 302'
        yield return
  describe 'request.get("https://google.com")', ->
    it 'should send request and print result', ->
      co ->
        result = yield request.get 'https://google.com'
        assert.isOk result.body, 'No body received'
        assert.equal result.status, 302, 'Status differs from 302'
        yield return
