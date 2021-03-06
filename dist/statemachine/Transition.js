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
  Transition instances for StateMachine class

  Inspiration:

  - https://github.com/PureMVC/puremvc-js-util-statemachine
  - https://github.com/aasm/aasm
  */
  module.exports = function(Module) {
    var FuncG, HookedObject, MaybeG, NilT, PointerT, Transition, TransitionInterface;
    ({NilT, PointerT, MaybeG, FuncG, HookedObject, TransitionInterface} = Module.prototype);
    return Transition = (function() {
      var ipmDoHook, ipsAfter, ipsGuard, ipsIf, ipsSuccess, ipsUnless;

      class Transition extends HookedObject {};

      Transition.inheritProtected();

      Transition.implements(TransitionInterface);

      Transition.module(Module);

      // @public name: String
      ipmDoHook = PointerT(Transition.instanceMethods['~doHook'].pointer);

      ipsGuard = PointerT(Transition.private({
        _guard: MaybeG(String)
      }));

      ipsIf = PointerT(Transition.private({
        _if: MaybeG(String)
      }));

      ipsUnless = PointerT(Transition.private({
        _unless: MaybeG(String)
      }));

      ipsAfter = PointerT(Transition.private({
        _after: MaybeG(String)
      }));

      ipsSuccess = PointerT(Transition.private({
        _success: MaybeG(String)
      }));

      Transition.public(Transition.async({
        testGuard: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsGuard], args, 'Specified "guard" not found', true));
        }
      }));

      Transition.public(Transition.async({
        testIf: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsIf], args, 'Specified "if" not found', true));
        }
      }));

      Transition.public(Transition.async({
        testUnless: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsUnless], args, 'Specified "unless" not found', false));
        }
      }));

      Transition.public(Transition.async({
        doAfter: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsAfter], args, 'Specified "after" not found', args));
        }
      }));

      Transition.public(Transition.async({
        doSuccess: Function
      }, {
        default: function*(...args) {
          return (yield this[ipmDoHook](this[ipsSuccess], args, 'Specified "success" not found', args));
        }
      }));

      Transition.public({
        init: FuncG([String, Object, MaybeG(Object)], NilT)
      }, {
        default: function(name, anchor, ...args1) {
          var config, ref;
          ref = args1, [...args1] = ref, [config] = splice.call(args1, -1);
          if (config === void 0) {
            config = {};
          }
          this.name = name;
          this.super(...arguments);
          ({
            guard: this[ipsGuard],
            if: this[ipsIf],
            unless: this[ipsUnless],
            after: this[ipsAfter],
            success: this[ipsSuccess]
          } = config);
        }
      });

      Transition.initialize();

      return Transition;

    }).call(this);
  };

}).call(this);
