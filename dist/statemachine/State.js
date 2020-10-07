// Generated by CoffeeScript 2.5.1
(function() {
  // This file is part of RC.

  // RC is free software: you can redistribute it and/or modify
  // it under the terms of the GNU Lesser General Public License as published by
  // the Free Software Foundation, either version 3 of the License, or
  // (at your option) any later version.

  // RC is distributed in the hope that it will be useful,
  // but WITHOUT ANY WARRANTY; without even the implied warranty of
  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  // GNU Lesser General Public License for more details.

  // You should have received a copy of the GNU Lesser General Public License
  // along with RC.  If not, see <https://www.gnu.org/licenses/>.
  var splice = [].splice;

  /*
  State instances for StateMachine class

  Inspiration:

  - https://github.com/PureMVC/puremvc-js-util-statemachine
  - https://github.com/aasm/aasm
  */
  module.exports = function(Module) {
    var DictG, EventInterface, FuncG, HookedObject, MaybeG, NilT, PointerT, State, StateInterface, StateMachineInterface, TransitionInterface, _, co;
    ({
      NilT,
      PointerT,
      MaybeG,
      FuncG,
      DictG,
      HookedObject,
      EventInterface,
      TransitionInterface,
      StateInterface,
      StateMachineInterface,
      Utils: {co, _}
    } = Module.prototype);
    return State = (function() {
      var iphEvents, ipmDoHook, ipoStateMachine, ipsAfterEnter, ipsAfterExit, ipsBeforeEnter, ipsBeforeExit, ipsEnter, ipsExit;

      class State extends HookedObject {};

      State.inheritProtected();

      State.implements(StateInterface);

      State.module(Module);

      ipmDoHook = PointerT(State.instanceMethods['~doHook'].pointer);

      ipoStateMachine = PointerT(State.private({
        _stateMachine: StateMachineInterface
      }));

      iphEvents = PointerT(State.private({
        _events: DictG(String, EventInterface)
      }));

      ipsBeforeEnter = PointerT(State.private({
        _beforeEnter: MaybeG(String)
      }));

      ipsEnter = PointerT(State.private({
        _enter: MaybeG(String)
      }));

      ipsAfterEnter = PointerT(State.private({
        _afterEnter: MaybeG(String)
      }));

      ipsBeforeExit = PointerT(State.private({
        _beforeExit: MaybeG(String)
      }));

      ipsExit = PointerT(State.private({
        _exit: MaybeG(String)
      }));

      ipsAfterExit = PointerT(State.private({
        _afterExit: MaybeG(String)
      }));

      State.public({
        getEvents: FuncG([], DictG(String, EventInterface))
      }, {
        default: function() {
          return this[iphEvents];
        }
      });

      // @public name: String
      State.public({
        initial: Boolean
      }, {
        default: false
      });

      State.public({
        getEvent: FuncG(String, MaybeG(EventInterface))
      }, {
        default: function(asEvent) {
          return this[iphEvents][asEvent];
        }
      });

      State.public({
        defineTransition: FuncG([String, StateInterface, TransitionInterface, MaybeG(Object)], EventInterface)
      }, {
        default: function(asEvent, aoTarget, aoTransition, config = {}) {
          var vhEventConfig, vpoAnchor, vsEventName;
          if (this[iphEvents][asEvent] == null) {
            vpoAnchor = this[Symbol.for('~anchor')];
            vhEventConfig = _.assign({}, config, {
              target: aoTarget,
              transition: aoTransition
            });
            vsEventName = `${this.name}_${asEvent}`;
            this[iphEvents][asEvent] = Module.prototype.Event.new(vsEventName, vpoAnchor, vhEventConfig);
          }
          return this[iphEvents][asEvent];
        }
      });

      State.public({
        removeTransition: FuncG(String, NilT)
      }, {
        default: function(asEvent) {
          if (this[iphEvents][asEvent] != null) {
            delete this[iphEvents][asEvent];
          }
        }
      });

      State.public(State.async({
        doBeforeEnter: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsBeforeEnter], args, 'Specified "beforeEnter" not found', args));
        }
      }));

      State.public(State.async({
        doEnter: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsEnter], args, 'Specified "enter" not found', args));
        }
      }));

      State.public(State.async({
        doAfterEnter: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsAfterEnter], args, 'Specified "afterEnter" not found', args));
        }
      }));

      State.public(State.async({
        doBeforeExit: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsBeforeExit], args, 'Specified "beforeExit" not found', args));
        }
      }));

      State.public(State.async({
        doExit: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsExit], args, 'Specified "exit" not found', args));
        }
      }));

      State.public(State.async({
        doAfterExit: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsAfterExit], args, 'Specified "afterExit" not found', args));
        }
      }));

      State.public(State.async({
        send: FuncG(String, NilT)
      }, {
        default: function*(asEvent, ...args) {
          var err, event, eventGuard, eventIf, eventUnless, oldState, stateMachine, transition, transitionGuard, transitionIf, transitionUnless;
          oldState = this;
          if ((event = oldState[iphEvents][asEvent]) != null) {
            try {
              yield event.doBefore(...args);
              eventGuard = (yield event.testGuard(...args));
              eventIf = (yield event.testIf(...args));
              eventUnless = (yield event.testUnless(...args));
              if (eventGuard && eventIf && !eventUnless) {
                ({transition} = event);
                transitionGuard = (yield transition.testGuard(...args));
                transitionIf = (yield transition.testIf(...args));
                transitionUnless = (yield transition.testUnless(...args));
                if (transitionGuard && transitionIf && !transitionUnless) {
                  yield oldState.doBeforeExit(...args);
                  yield oldState.doExit(...args);
                  stateMachine = oldState[ipoStateMachine];
                  yield stateMachine.transitionTo(event.target, transition, ...args);
                }
                yield event.doSuccess(...args);
              }
              yield event.doAfter(...args);
            } catch (error) {
              err = error;
              yield event.doError(err);
              throw err;
            }
          }
        }
      }));

      State.public({
        init: FuncG([String, Object, StateMachineInterface, MaybeG(Object)], NilT)
      }, {
        default: function(name, anchor, aoStateMachine, ...args1) {
          var config, ref;
          ref = args1, [...args1] = ref, [config] = splice.call(args1, -1);
          if (config === void 0) {
            config = {};
          }
          this.name = name;
          this.super(...arguments);
          this[iphEvents] = {};
          this[ipoStateMachine] = aoStateMachine;
          ({
            beforeEnter: this[ipsBeforeEnter],
            enter: this[ipsEnter],
            afterEnter: this[ipsAfterEnter],
            beforeExit: this[ipsBeforeExit],
            exit: this[ipsExit],
            afterExit: this[ipsAfterExit]
          } = config);
          this.initial = config.initial === true;
        }
      });

      State.initialize();

      return State;

    }).call(this);
  };

}).call(this);
