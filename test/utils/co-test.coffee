{ expect, assert } = require 'chai'
sinon = require 'sinon'
RC = require.main.require 'lib'
NativePromise = global.Promise
NativeSetTimeout = global.setTimeout
{ co, readFile: read, setTimeout: customSetTimeout } = RC::Utils


cleanNativePromise = ->
  global.Promise = undefined
  global.setTimeout = customSetTimeout
restoreNativePromise = ->
  global.Promise = NativePromise
  global.setTimeout = NativeSetTimeout

context = some: 'thing'

sleep = (ms) ->
  (done) ->
    setTimeout done, ms
    return

work = ->
  yield sleep 50
  return 'yay'

getPromise = (value, err) ->
  RC::Promise.new (resolve, reject) ->
    if err?
      reject err
    else
      resolve value
    return

get = (val, err, error) ->
  (done) ->
    throw error  if error?
    sleep(10) ->
      done err, val

class Pet
  constructor: (name) ->
    @name = name
  something: ->

describe 'Utils.co', ->
  before cleanNativePromise
  after restoreNativePromise
  describe 'co(gen, args)', ->
    it 'should pass the rest of the arguments', ->
      co (num, str, arr, obj, fun) ->
        assert.equal num,  42
        assert.equal str, 'forty-two'
        assert.equal arr[0], 42
        assert.equal obj.value, 42
        assert.instanceOf fun, Function
        return
      , 42, 'forty-two', [ 42 ], { value: 42 }, ->
    return
  describe 'co(* -> yield [])', ->
    it 'should aggregate several promises', ->
      co ->
        a = read __dirname + '/../../lib/index.coffee'
        b = read __dirname + '/../../LICENSE'
        c = read __dirname + '/../../package.json'
        res = yield [ a, b, c ]
        assert.equal 3, res.length
        assert.include res[0], 'exports'
        assert.include res[1], 'LESSER'
        assert.include res[2], 'devDependencies'
        return
    it 'should noop with no args', ->
      co ->
        res = yield []
        assert.equal res.length, 0
        return
    it 'should support an array of generators', ->
      co ->
        val = yield [ do -> 1 ]
        assert.deepEqual val, [ 1 ]
        return
    return
  describe 'co.call(this)', ->
    it 'should pass the context', ->
      co.call context, ->
        assert.equal context, @
        return
    return
  describe 'co(fn*)', ->
    describe 'with a generator function', ->
      it 'should wrap with co()', ->
        co ->
          a = yield work
          b = yield work
          c = yield work
          assert.equal a, 'yay'
          assert.equal b, 'yay'
          assert.equal c, 'yay'
          res = yield [ work, work, work ]
          assert.deepEqual res, [ 'yay', 'yay', 'yay' ]
      it 'should catch errors', ->
        co ->
          yield ->
            throw new Error 'boom'
            yield return
          return
        .then ->
          throw new Error 'wtf'
        .catch (err) ->
          assert.instanceOf err, Error
          assert.equal err.message, 'boom'
          return
    return
  describe 'yield <invalid>', ->
    it 'should throw an error', ->
      co ->
        try
          yield null
          throw new Error 'lol'
        catch err
          assert.instanceOf err, TypeError
          assert.include err.message, 'You may only yield'
        return
    return
  describe 'co(* -> yield {})', ->
    it 'should aggregate several promises', ->
      co ->
        a = read __dirname + '/../../lib/index.coffee'
        b = read __dirname + '/../../LICENSE'
        c = read __dirname + '/../../package.json'
        res = yield { a, b, c }
        assert.equal Object.keys(res).length, 3
        assert.include res.a, 'exports'
        assert.include res.b, 'LESSER'
        assert.include res.c, 'devDependencies'
        return
    it 'should noop with no args', ->
      co ->
        res = yield {}
        assert.equal Object.keys(res).length, 0
        return
    it 'should ignore non-thunkable properties', ->
      co ->
        foo =
          name: first: 'tobi'
          age: 2
          address: read __dirname + '/../../lib/index.coffee'
          tobi: new Pet 'tobi'
          now: new Date()
          falsey: no
          nully: null
          undefinely: undefined
        res = yield foo
        assert.equal res.name.first, 'tobi'
        assert.equal res.age, 2
        assert.equal res.tobi.name, 'tobi'
        assert.equal res.name.first, 'tobi'
        assert.equal res.now, foo.now
        assert.equal res.falsey, no
        assert.equal res.nully, null
        assert.equal res.undefinely, undefined
        assert.include "#{res.address}", 'exports'
        return
    it 'should preserve key order', ->
      co ->
        before =
          sun: sleep 30
          rain: sleep 20
          moon: sleep 10
        after = yield before
        orderBefore = Object.keys(before).join ','
        orderAfter = Object.keys(after).join ','
        assert.equal orderBefore, orderAfter
        return
    return
  describe 'co(* -> yield <promise>', ->
    describe 'with one promise yield', ->
      it 'should work', ->
        co ->
          a = yield getPromise 1
          assert.equal a, 1
      return
    describe 'with several promise yields', ->
      it 'should work', ->
        co ->
          a = yield getPromise 1
          b = yield getPromise 2
          c = yield getPromise 3
          assert.deepEqual [ a, b, c ], [ 1, 2, 3]
      return
    describe 'when a promise is rejected', ->
      it 'should throw and resume', ->
        co ->
          try
            yield getPromise 1, new Error 'boom'
          catch error
          assert.equal error.message, 'boom'
          ret = yield getPromise 1
          assert.equal ret, 1
      return
    describe 'when yielding a non-standard promise-like', ->
      it 'should return a real Promise', ->
        expect co ->
          yield then: ->
        .to.be.instanceOf RC::Promise
      return
    return
  describe 'co(function) -> promise', ->
    it 'return value', ->
      co -> 1
      .then (data) ->
        assert.equal data, 1
    it 'return resolve promise', ->
      co ->
        RC::Promise.resolve 1
      .then (data) ->
        assert.equal data, 1
    it 'return reject promise', ->
      co ->
        RC::Promise.reject 1
      .catch (data) ->
        assert.equal data, 1
    it 'should catch errors', ->
      co ->
        throw new Error 'boom'
      .then ->
        throw new Error 'nope'
      .catch (err) ->
        assert.equal err.message, 'boom'
    return
  describe 'co() recursion', ->
    it 'should aggregate arrays within arrays', ->
      co ->
        a = read __dirname + '/../../lib/index.coffee'
        b = read __dirname + '/../../LICENSE'
        c = read __dirname + '/../../package.json'
        res = yield [ a, [ b, c ] ]
        assert.equal res.length, 2
        assert.include res[0], 'exports'
        assert.equal res[1].length, 2
        assert.include res[1][0], 'LESSER'
        assert.include res[1][1], 'devDependencies'
        return
    it 'should aggregate objects within objects', ->
      co ->
        a = read __dirname + '/../../lib/index.coffee'
        b = read __dirname + '/../../LICENSE'
        c = read __dirname + '/../../package.json'
        res = yield {
          0: a
          1:
            0: b
            1: c
        }
        assert.include res[0], 'exports'
        assert.include res[1][0], 'LESSER'
        assert.include res[1][1], 'devDependencies'
        return
    return
  describe 'co(* -> yield fn(done))', ->
    describe 'with no yields', ->
      it 'should work', ->
        co -> yield return
      return
    describe 'with one yield', ->
      it 'should work', ->
        co ->
          a = yield get 1
          assert.equal a, 1
          return
      return
    describe 'with several yields', ->
      it 'should work', ->
        co ->
          a = yield get 1
          b = yield get 2
          c = yield get 3
          assert.deepEqual [ a, b, c ], [ 1, 2, 3 ]
          return
      return
    describe 'with many arguments', ->
      it 'should return an array', ->
        exec = (cmd) ->
          (done) ->
            done null, 'stdout', 'stderr'
            return
        co ->
          out = yield exec 'something'
          assert.deepEqual out, [ 'stdout', 'stderr' ]
          return
      return
    describe 'when the function throws', ->
      it 'should be caught', ->
        co ->
          try
            a = yield get 1, null, new Error 'boom'
          catch err
            assert.equal err.message, 'boom'
          return
      return
    describe 'when the error is passed then thrown', ->
      it 'should only caught the first error only', ->
        co ->
          yield (done) ->
            done new Error 'first'
            throw new Error 'second'
          return
        .then ->
          throw new Error 'wtf'
        .catch (err) ->
          assert.equal err.message, 'first'
      return
    describe 'when an is passed', ->
      it 'should throw and resume', ->
        co ->
          try
            yield get 1, new Error 'boom'
          catch error
          assert.equal error.message, 'boom'
          ret = yield get 1
          assert.equal ret, 1
          return
      return
    describe 'with nested co()s', ->
      it 'should work', ->
        hit = []
        co ->
          a = yield get 1
          b = yield get 2
          c = yield get 3
          hit.push 'one'
          assert.deepEqual [ a, b, c], [ 1, 2, 3 ]
          yield co ->
            hit.push 'two'
            a = yield get 1
            b = yield get 2
            c = yield get 3
            assert.deepEqual [ a, b, c], [ 1, 2, 3 ]
            yield co ->
              hit.push 'three'
              a = yield get 1
              b = yield get 2
              c = yield get 3
              assert.deepEqual [ a, b, c], [ 1, 2, 3 ]
              return
            return
          yield co ->
            hit.push 'four'
            a = yield get 1
            b = yield get 2
            c = yield get 3
            assert.deepEqual [ a, b, c], [ 1, 2, 3 ]
            return
          assert.deepEqual hit, [ 'one', 'two', 'three', 'four' ]
          return
      return
    describe 'return values', ->
      describe 'with a callback', ->
        it 'should be passed', ->
          co ->
            [
              yield get 1
              yield get 2
              yield get 3
            ]
          .then (res) ->
            assert.deepEqual res, [ 1, 2, 3 ]
        return
      describe 'when nested', ->
        it 'should return the value', ->
          co ->
            other = yield co ->
              [
                yield get 4
                yield get 5
                yield get 6
              ]
            [
              yield get 1
              yield get 2
              yield get 3
            ].concat other
          .then (res) ->
            assert.deepEqual res, [ 1, 2, 3, 4, 5, 6 ]
        return
      return
    describe 'when yielding neither a function nor a promise', ->
      it 'should throw', ->
        errors = []
        co ->
          try
            a = yield 'something'
          catch err
            errors.push err.message
          try
            a = yield 'something'
          catch err
            errors.push err.message
          assert.equal errors.length, 0
          msg = 'yield a function, promise, generator, array, or object'
          assert.equal errors.length, 0, 'Has errors'
          return
      return
    describe 'when errors', ->
      it 'should throw', ->
        errors = []
        co ->
          try
            a = yield get 1, new Error 'foo'
          catch err
            errors.push err.message
          try
            a = yield get 1, new Error 'bar'
          catch err
            errors.push err.message
          assert.deepEqual errors, [ 'foo', 'bar' ]
          return
      it 'should catch errors on .send()', ->
        errors = []
        co ->
          try
            a = yield get 1, null, new Error 'foo'
          catch err
            errors.push err.message
          try
            a = yield get 1, null, new Error 'bar'
          catch err
            errors.push err.message
          assert.deepEqual errors, [ 'foo', 'bar' ]
          return
      it 'should pass future errors to the callback', ->
        co ->
          yield get 1
          yield get 2, null, new Error 'fail'
          assert no
          yield get 3
          return
        .catch (err) ->
          assert.equal err.message, 'fail'
      it 'should pass immediate errors to callback', ->
        co ->
          yield get 1
          yield get 2, new Error 'fail'
          assert no
          yield get 3
          return
        .catch (err) ->
          assert.equal err.message, 'fail'
      it 'should catch errors on the first invocation', ->
        co ->
          throw new Error 'fail'
        .catch (err) ->
          assert.equal err.message, 'fail'
      return
  describe 'co.wrap(fn*)', ->
    it 'should pass context', ->
      context = some: 'thing'
      co.wrap ->
        assert.equal context, @
        yield return
      .call context
    it 'should pass arguments', ->
      co.wrap((a, b, c) ->
        assert.deepEqual [ a, b, c ], [ 1, 2, 3 ]
        yield return
      )(1, 2, 3)
    it 'should expose the underlying generator function', ->
      wrapped = co.wrap (a, b, c) -> yield return
      source = Object.toString.call wrapped.__generatorFunction__
      assert.equal source.indexOf('function*'), 0
      return
    return
