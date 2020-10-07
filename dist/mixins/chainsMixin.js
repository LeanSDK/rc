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
  var indexOf = [].indexOf;

  /*
    Chains
    ```
      @beforeHook 'beforeVerify', only: ['verify']
      @afterHook 'afterVerify', only: ['verify']

      @beforeHook 'beforeCount', only: ['count']
      @afterHook 'afterCount', only: ['count']

      @chains ['verify', 'count'] # если в классе, унаследованном от Model, Controller, CoreObject надо объявить цепи для методов

      constructor: -> # именно в конструкторе надо через методы beforeHook и afterHook объявить методы инстанса класса, которые будут использованы в качестве звеньев цепей
        super

      beforeVerify: ->

      beforeCount: ->

      afterVerify: (data)->
        data

      afterCount: (data)->
        data
    ```
  */
  module.exports = function(Module) {
    var ASYNC, AnyT, CoreObject, EnumG, FuncG, InterfaceG, ListG, MaybeG, Mixin, NilT, PointerT, SubsetG, TupleG, UnionG, _, co;
    ({
      ASYNC,
      AnyT,
      NilT,
      PointerT,
      FuncG,
      UnionG,
      ListG,
      SubsetG,
      TupleG,
      MaybeG,
      InterfaceG,
      EnumG,
      CoreObject,
      Mixin,
      Utils: {co, _}
    } = Module.prototype);
    return Module.defineMixin(Mixin('ChainsMixin', function(BaseClass = CoreObject) {
      return (function() {
        var _Class, cpmChains, cpmDefineHookMethods, i, ipmCallWithChainNameOnArray, ipmCallWithChainNameOnArrayAsync, ipmCallWithChainNameOnSingle, ipmCallWithChainNameOnSingleAsync, len, methodName, ref;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        cpmChains = PointerT(_Class.protected(_Class.static({
          getChains: FuncG([MaybeG(SubsetG(CoreObject))], ListG(String))
        }, {
          default: function(AbstractClass = null) {
            if (AbstractClass == null) {
              AbstractClass = this;
            }
            return Object.keys(AbstractClass.metaObject.getOwnGroup('chains'));
          }
        })));

        _Class.public(_Class.static({
          chains: FuncG([UnionG(String, ListG(String))], NilT)
        }, {
          default: function(alChains) {
            var i, len, vsChainName;
            alChains = _.castArray(alChains);
            for (i = 0, len = alChains.length; i < len; i++) {
              vsChainName = alChains[i];
              this.metaObject.addMetaData('chains', vsChainName, '');
            }
          }
        }));

        _Class.public({
          callAsChain: Function
        }, {
          default: function(methodName, ...args) {
            var afterResult, data, err, initialData, name1, result, self;
            if (this.constructor.instanceMethods[methodName].async === ASYNC) {
              self = this;
              return co(function*() {
                var afterResult, data, err, initialData, name1, result;
                try {
                  initialData = (yield self.initialAction(methodName, ...args));
                  if (initialData == null) {
                    initialData = [];
                  }
                  if (!_.isArray(initialData)) {
                    initialData = [initialData];
                  }
                  data = (yield self.beforeAction(methodName, ...initialData));
                  if (data == null) {
                    data = [];
                  }
                  if (!_.isArray(data)) {
                    data = [data];
                  }
                  result = (yield (typeof self[name1 = Symbol.for(`~chain_${methodName}`)] === "function" ? self[name1](...data) : void 0));
                  afterResult = (yield self.afterAction(methodName, result));
                  return (yield self.finallyAction(methodName, afterResult));
                } catch (error) {
                  err = error;
                  yield self.errorAction(methodName, err);
                  throw err;
                }
              });
            } else {
              try {
                initialData = this.initialAction(methodName, ...args);
                if (initialData == null) {
                  initialData = [];
                }
                if (!_.isArray(initialData)) {
                  initialData = [initialData];
                }
                data = this.beforeAction(methodName, ...initialData);
                if (data == null) {
                  data = [];
                }
                if (!_.isArray(data)) {
                  data = [data];
                }
                result = typeof this[name1 = Symbol.for(`~chain_${methodName}`)] === "function" ? this[name1](...data) : void 0;
                afterResult = this.afterAction(methodName, result);
                return this.finallyAction(methodName, afterResult);
              } catch (error) {
                err = error;
                this.errorAction(methodName, err);
                throw err;
              }
            }
          }
        });

        ipmCallWithChainNameOnSingle = PointerT(_Class.private({
          callWithChainNameOnSingle: FuncG([String, String, MaybeG(AnyT)], MaybeG(AnyT))
        }, {
          default: function(methodName, actionName, singleData) {
            var res;
            if (_.isFunction(this[methodName])) {
              this[methodName].chainName = actionName;
              res = this[methodName](singleData);
              delete this[methodName].chainName;
              return res;
            } else {
              return singleData;
            }
          }
        }));

        ipmCallWithChainNameOnArray = PointerT(_Class.private({
          callWithChainNameOnArray: FuncG([String, String, Array], Array)
        }, {
          default: function(methodName, actionName, arrayData) {
            var res;
            arrayData = _.castArray(arrayData);
            if (_.isFunction(this[methodName])) {
              this[methodName].chainName = actionName;
              res = this[methodName](...arrayData);
              delete this[methodName].chainName;
              return res;
            } else {
              return arrayData;
            }
          }
        }));

        ipmCallWithChainNameOnSingleAsync = PointerT(_Class.private(_Class.async({
          callWithChainNameOnSingleAsync: FuncG([String, String, MaybeG(AnyT)], MaybeG(AnyT))
        }, {
          default: function*(methodName, actionName, singleData) {
            var res;
            if (_.isFunction(this[methodName])) {
              this[methodName].chainName = actionName;
              res = (yield Module.prototype.Promise.resolve(this[methodName](singleData)));
              delete this[methodName].chainName;
              return res;
            } else {
              return singleData;
            }
          }
        })));

        ipmCallWithChainNameOnArrayAsync = PointerT(_Class.private(_Class.async({
          callWithChainNameOnArrayAsync: FuncG([String, String, Array], Array)
        }, {
          default: function*(methodName, actionName, arrayData) {
            var res;
            arrayData = _.castArray(arrayData);
            if (_.isFunction(this[methodName])) {
              this[methodName].chainName = actionName;
              res = (yield Module.prototype.Promise.resolve(this[methodName](...arrayData)));
              delete this[methodName].chainName;
              return res;
            } else {
              return arrayData;
            }
          }
        })));

        cpmDefineHookMethods = PointerT(_Class.private(_Class.static({
          defineHookMethods: FuncG([TupleG(String, Boolean)], NilT)
        }, {
          default: function([asHookName, isArray]) {
            var callWithChainName, vsActionName, vsHookNames;
            vsHookNames = `${asHookName}s`;
            vsActionName = `${asHookName.replace('Hook', '')}Action`;
            this.public(this.static({
              [`${asHookName}`]: FuncG([
                String,
                MaybeG(InterfaceG({
                  only: MaybeG(UnionG(String,
                ListG(String))),
                  except: MaybeG(UnionG(String,
                ListG(String)))
                }))
              ], NilT)
            }, {
              default: function(method, options = {}) {
                switch (false) {
                  case options.only == null:
                    this.metaObject.appendMetaData('hooks', vsHookNames, {
                      method: method,
                      type: 'only',
                      actions: options.only
                    });
                    break;
                  case options.except == null:
                    this.metaObject.appendMetaData('hooks', vsHookNames, {
                      method: method,
                      type: 'except',
                      actions: options.except
                    });
                    break;
                  default:
                    this.metaObject.appendMetaData('hooks', vsHookNames, {
                      method: method,
                      type: 'all'
                    });
                }
              }
            }));
            this.public(this.static({
              [`${vsHookNames}`]: FuncG([], ListG(InterfaceG({
                method: String,
                type: EnumG('only', 'except', 'all'),
                actions: MaybeG(UnionG(String, ListG(String)))
              })))
            }, {
              default: function() {
                var ref;
                return _.uniqWith((ref = this.metaObject.getGroup('hooks')[vsHookNames]) != null ? ref : [], function(first, second) {
                  var ref1, ref2;
                  return first.method === second.method && first.type === second.type && ((ref1 = first.actions) != null ? ref1.join(',') : void 0) === ((ref2 = second.actions) != null ? ref2.join(',') : void 0);
                });
              }
            }));
            callWithChainName = FuncG([MaybeG(Boolean)], PointerT)(function(isAsync = false) {
              if (isArray) {
                if (isAsync) {
                  return ipmCallWithChainNameOnArrayAsync;
                } else {
                  return ipmCallWithChainNameOnArray;
                }
              } else {
                if (isAsync) {
                  return ipmCallWithChainNameOnSingleAsync;
                } else {
                  return ipmCallWithChainNameOnSingle;
                }
              }
            });
            this.public({
              [`${vsActionName}`]: Function
            }, {
              default: function(action, ...data) {
                var self, vlHooks;
                if (!isArray) {
                  data = data[0];
                }
                vlHooks = this.constructor[vsHookNames]();
                self = this;
                if (this.constructor.instanceMethods[action].async === ASYNC) {
                  return co(function*() {
                    var actions, i, len, method, type;
                    for (i = 0, len = vlHooks.length; i < len; i++) {
                      ({method, type, actions} = vlHooks[i]);
                      data = (yield* (function*() {
                        switch (false) {
                          case type !== 'all':
                          case !(type === 'only' && indexOf.call(actions, action) >= 0):
                          case !(type === 'except' && indexOf.call(actions, action) < 0):
                            return (yield self[callWithChainName(true)](method, action, data));
                          default:
                            return data;
                        }
                      })());
                    }
                    return data;
                  });
                } else {
                  vlHooks.forEach(function({method, type, actions}) {
                    data = (function() {
                      switch (false) {
                        case type !== 'all':
                        case !(type === 'only' && indexOf.call(actions, action) >= 0):
                        case !(type === 'except' && indexOf.call(actions, action) < 0):
                          return self[callWithChainName()](method, action, data);
                        default:
                          return data;
                      }
                    })();
                  });
                  return data;
                }
              }
            });
          }
        })));

        ref = [['initialHook', true], ['beforeHook', true], ['afterHook', false], ['finallyHook', false], ['errorHook', false]];
        for (i = 0, len = ref.length; i < len; i++) {
          methodName = ref[i];
          _Class[cpmDefineHookMethods](methodName);
        }

        _Class.public(_Class.static({
          defineChains: Function
        }, {
          default: function() {
            var instanceMethods, j, len1, self, vlChains;
            vlChains = this[cpmChains]();
            if (!_.isEmpty(vlChains)) {
              ({instanceMethods} = self = this);
              for (j = 0, len1 = vlChains.length; j < len1; j++) {
                methodName = vlChains[j];
                (function(methodName, self, proto) {
                  var descriptor, meta, name, pointer;
                  name = `chain_${methodName}`;
                  pointer = Symbol.for(`~${name}`);
                  meta = instanceMethods[methodName];
                  if ((meta != null) && !meta.wrapper.isChain) {
                    descriptor = {
                      configurable: true,
                      enumerable: true,
                      value: meta.wrapper
                    };
                    Reflect.defineProperty(descriptor.value, 'name', {
                      value: name,
                      configurable: true
                    });
                    Reflect.defineProperty(descriptor.value, 'pointer', {
                      value: pointer,
                      configurable: true,
                      enumerable: true
                    });
                    Reflect.defineProperty(descriptor.value.body, 'name', {
                      value: name,
                      configurable: true
                    });
                    Reflect.defineProperty(descriptor.value.body, 'pointer', {
                      value: pointer,
                      configurable: true,
                      enumerable: true
                    });
                    // unless (Symbol.for "~chain_#{methodName}") of self::
                    Reflect.defineProperty(proto, pointer, descriptor);
                    if (meta.async === ASYNC) {
                      self.public(self.async({
                        [`${methodName}`]: meta.attrType
                      }, {
                        default: function*(...args) {
                          return (yield this.callAsChain(methodName, ...args));
                        }
                      }));
                    } else {
                      self.public({
                        [`${methodName}`]: meta.attrType
                      }, {
                        default: function(...args) {
                          return this.callAsChain(methodName, ...args);
                        }
                      });
                    }
                    return self.prototype[methodName].isChain = true;
                  }
                })(methodName, self, self.prototype);
              }
            }
          }
        }));

        _Class.public(_Class.static({
          initialize: Function
        }, {
          default: function(...args) {
            this.super(...args);
            this.defineChains();
            return this;
          }
        }));

        _Class.public(_Class.static({
          initializeMixin: Function
        }, {
          default: function(...args) {
            this.super(...args);
            this.defineChains();
            return this;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
