{ expect, assert } = require 'chai'
RC = require '../lib'
{
  Class
  Utils: { co }
} = RC::

describe 'Class', ->
  describe '.new', ->
    it 'should create new class', ->
      co ->
        class Test extends RC
          @inheritProtected()
        Test.initialize()

        Test::MyClass = Class.new 'MyClass',
          Module: Test
        Test::MyClass.initialize()
        myInstance = Test::MyClass.new()
        assert.instanceOf myInstance, Test::MyClass, 'Cannot instantiate class MyClass'
        yield return
    it 'should create new class with instance methods', ->
      co ->
        class Test extends RC
          @inheritProtected()
        Test.initialize()

        Test::MyClass = Class.new 'MyClass',
          Module: Test
          InstanceMethods:
            test: ->
        Test::MyClass.initialize()
        myInstance = Test::MyClass.new()
        myInstance.test()
        yield return
    it 'should create new class with class methods', ->
      expect ->
        class Test extends RC
          @inheritProtected()
        Test.initialize()

        Test::MyClass = Class.new 'MyClass',
          Module: Test
          ClassMethods:
            test: ->
        Test::MyClass.initialize()
        Test::MyClass.test()
      .to.not.throw Error
  describe '.clone', ->
    it 'should clone specified class', ->
      expect ->
        class Test extends RC
          @inheritProtected()
        Test.initialize()
        class MyClass extends RC::CoreObject
          @inheritProtected()
          @module Test
        MyClass.initialize()
        Test::MyClassClone = RC::Class.clone Test::MyClass
        assert.notEqual Test::MyClass, Test::MyClassClone, 'Classes are same'
        assert.equal Test::MyClass.name, Test::MyClassClone.name, 'Class name is different'
        assert.equal Test::MyClass.__super__, Test::MyClassClone.__super__, 'Classes super proto not similar'
      .to.not.throw Error
  describe '.replicateObject', ->
    it 'should replicate specified class', ->
      co ->
        class Test extends RC
          @inheritProtected()
        Test.initialize()
        class MyClass extends RC::CoreObject
          @inheritProtected()
          @module Test
        MyClass.initialize()
        replica = yield RC::Class.replicateObject MyClass
        assert.equal replica.type, 'class', 'Replica type isn`t `class`'
        assert.equal replica.class, 'MyClass', 'Class name is different'
        yield return
  describe '.restoreObject', ->
    it 'should restore specified class by replica', ->
      co ->
        class Test extends RC
          @inheritProtected()
        Test.initialize()
        class MyClass extends RC::CoreObject
          @inheritProtected()
          @module Test
        MyClass.initialize()
        vcRestoredClass = yield RC::Class.restoreObject Test, type: 'class', class: 'MyClass'
        assert.equal vcRestoredClass, MyClass, 'Classes are different'
        yield return
