_ = require 'lodash'

###
State instances for StateMachine class

Inspiration:

- https://github.com/PureMVC/puremvc-js-util-statemachine
- https://github.com/aasm/aasm
###

module.exports = (Module)->
  {
    HookedObject
    Utils
  } = Module::

  { co } = Utils

  class State extends HookedObject
    @inheritProtected()
    @module Module

    ipoStateMachine = @private _stateMachine: Object,
      default: null

    iphEvents = @private _events: Object,
      default: null

    ipsBeforeEnter = @private _beforeEnter: String,
      default: null

    ipsEnter = @private _enter: String,
      default: null

    ipsAfterEnter = @private _afterEnter: String,
      default: null

    ipsBeforeExit = @private _beforeExit: String,
      default: null

    ipsExit = @private _exit: String,
      default: null

    ipsAfterExit = @private _afterExit: String,
      default: null

    @public getEvents: Function,
      default: -> @[iphEvents]

    @public name: String,
      default: null

    @public getEvent: Function,
      default: (asEvent) ->
        @[iphEvents][asEvent]

    @public defineTransition: Function,
      default: (asEvent, aoTarget, aoTransition, config = {}) ->
        unless @[iphEvents][asEvent]?
          vpoAnchor = @[Symbol.for '~anchor']
          vhEventConfig = _.assign {}, config,
            target: aoTarget
            transition: aoTransition
          vsEventName = "#{@name}_#{asEvent}"
          @[iphEvents][asEvent] = Module::Event.new vsEventName, vpoAnchor, vhEventConfig
        @[iphEvents][asEvent]

    @public removeTransition: Function,
      default: (asEvent) ->
        if @[iphEvents][asEvent]?
          delete @[iphEvents][asEvent]
        return

    @public doBeforeEnter: Function,
      default: (args...) ->
        @[Symbol.for '~doHook'] @[ipsBeforeEnter], args, 'Specified "beforeEnter" not found', args

    @public doEnter: Function,
      default: (args...) ->
        @[Symbol.for '~doHook'] @[ipsEnter], args, 'Specified "enter" not found', args

    @public doAfterEnter: Function,
      default: (args...) ->
        @[Symbol.for '~doHook'] @[ipsAfterEnter], args, 'Specified "afterEnter" not found', args

    @public doBeforeExit: Function,
      default: (args...) ->
        @[Symbol.for '~doHook'] @[ipsBeforeExit], args, 'Specified "beforeExit" not found', args

    @public doExit: Function,
      default: (args...) ->
        @[Symbol.for '~doHook'] @[ipsExit], args, 'Specified "exit" not found', args

    @public doAfterExit: Function,
      default: (args...) ->
        @[Symbol.for '~doHook'] @[ipsAfterExit], args, 'Specified "afterExit" not found', args

    @public send: Function,
      default: (asEvent, args...) ->
        oldState = @
        co ->
          if asEvent of oldState[iphEvents]
            event = oldState[iphEvents][asEvent]
            try
              yield event.doBefore args...
              eventGuard = yield event.testGuard args...
              eventIf = yield event.testIf args...
              eventUnless = yield event.testUnless args...
              if eventGuard and eventIf and not eventUnless
                { transition } = event
                transitionGuard = yield transition.testGuard args...
                transitionIf = yield transition.testIf args...
                transitionUnless = yield transition.testUnless args...
                if transitionGuard and transitionIf and not transitionUnless
                  yield oldState.doBeforeExit args...
                  yield oldState.doExit args...
                  stateMachine = oldState[ipoStateMachine]
                  yield stateMachine.transitionTo event.target, transition, args...
                yield event.doSuccess args...
              yield event.doAfter args...
            catch err
              yield event.doError err
              throw err
          yield return

    @public init: Function,
      default: (@name, anchor, aoStateMachine, ..., config = {})->
        @super arguments...
        @[iphEvents] = {}
        @[ipoStateMachine] = aoStateMachine
        {
          beforeEnter: @[ipsBeforeEnter]
          enter: @[ipsEnter]
          afterEnter: @[ipsAfterEnter]
          beforeExit: @[ipsBeforeExit]
          exit: @[ipsExit]
          afterExit: @[ipsAfterExit]
        } = config
        @initial = config.initial is yes


  State.initialize()
