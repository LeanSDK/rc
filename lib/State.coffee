
###
State instances for StateMachine class

Inspiration:

- https://github.com/PureMVC/puremvc-js-util-statemachine
- https://github.com/aasm/aasm
###

module.exports = (RC)->
  class RC::State extends RC::CoreObject
    @inheritProtected()

    @Module: RC

    @public name: String,
      default: null

    constructor: (@name, config = {})->
      super arguments...


  return RC::State.initialize()
