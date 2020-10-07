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
  module.exports = function(Module) {
    var CACHE, Generic, PRODUCTION, SOFT, _, assert, createByType, getTypeName, typesCache, valueIsType;
    ({
      PRODUCTION,
      CACHE,
      SOFT,
      Generic,
      Utils: {
        _,
        // uuid
        t: {assert},
        getTypeName,
        createByType,
        valueIsType
      }
    } = Module.prototype);
    // typesDict = new Map()
    typesCache = new Map();
    return Module.defineGeneric(Generic('UnionG', function(...Types) {
      var Union, UnionID, cachedType, displayName;
      if (Module.environment !== PRODUCTION) {
        assert(Types.length > 0, 'UnionG must be call with Array or many arguments');
      }
      if (Types.length === 1) {
        Types = Types[0];
      }
      if (Module.environment !== PRODUCTION) {
        assert(_.isArray(Types) && Types.length >= 2, `Invalid argument Types ${assert.stringify(Types)} supplied to UnionG(Types) (expected an array of at least 2 types)`);
      }
      // _ids = []
      Types = Types.map(function(Type) {
        var t;
        return t = Module.prototype.AccordG(Type);
      });
      // unless (id = CACHE.get t)?
      //   id = uuid.v4()
      //   CACHE.set t, id
      // _ids.push id
      // t
      // UnionID = _ids.join()
      if (Module.environment !== PRODUCTION) {
        assert(Types.every(_.isFunction), `Invalid argument Types ${assert.stringify(Types)} supplied to UnionG(Types) (expected an array of functions)`);
      }
      displayName = Types.map(getTypeName).join(' | ');
      UnionID = Types.map(function(T) {
        return T.ID;
      }).join(' | ');
      if ((cachedType = typesCache.get(UnionID)) != null) {
        return cachedType;
      }
      Union = function(value, path) {
        var Type;
        if (Module.environment === PRODUCTION) {
          return value;
        }
        Union.isNotSample(this);
        if (Union.has(value)) {
          return value;
        }
        Type = Union.dispatch(value);
        if (!Type && Union.is(value)) {
          return value;
        }
        if (path == null) {
          path = [Union.displayName];
        }
        assert(_.isFunction(Type), `Invalid value ${assert.stringify(value)} supplied to ${path.join('.')} (no Type returned by dispatch)`);
        path[path.length - 1] += `(${getTypeName(Type)})`;
        createByType(Type, value, path);
        Union.keep(value);
        return value;
      };
      // Reflect.defineProperty Union, 'cache',
      //   configurable: no
      //   enumerable: yes
      //   writable: no
      //   value: new Set()
      Reflect.defineProperty(Union, 'cacheStrategy', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: SOFT
      });
      Reflect.defineProperty(Union, 'ID', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: UnionID
      });
      Module.prototype.SOFT_CACHE.set(UnionID, new Set());
      Reflect.defineProperty(Union, 'has', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: function(value) {
          return Module.prototype.SOFT_CACHE.get(UnionID).has(value);
        }
      });
      Reflect.defineProperty(Union, 'keep', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: function(value) {
          return Module.prototype.SOFT_CACHE.get(UnionID).add(value);
        }
      });
      Reflect.defineProperty(Union, 'name', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: displayName
      });
      Reflect.defineProperty(Union, 'displayName', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: displayName
      });
      Reflect.defineProperty(Union, 'is', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: function(x) {
          var result;
          if (Union.has(x)) {
            return true;
          }
          result = Types.some(function(type) {
            return valueIsType(x, type);
          });
          if (result) {
            Union.keep(x);
          }
          return result;
        }
      });
      Reflect.defineProperty(Union, 'dispatch', {
        configurable: false,
        enumerable: true,
        writable: true,
        value: function(x) {
          var dispatchedType, i, len, type;
          for (i = 0, len = Types.length; i < len; i++) {
            type = Types[i];
            if (Module.prototype.TypeT.is(type) && type.meta.kind === 'union') {
              dispatchedType = type.dispatch(x);
              if (dispatchedType != null) {
                return dispatchedType;
              }
            } else if (valueIsType(x, type)) {
              return type;
            }
          }
        }
      });
      Reflect.defineProperty(Union, 'meta', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: {
          kind: 'union',
          types: Types,
          name: Union.displayName,
          identity: true
        }
      });
      Reflect.defineProperty(Union, 'isNotSample', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: Module.prototype.NotSampleG(Union)
      });
      typesCache.set(UnionID, Union);
      CACHE.set(Union, UnionID);
      return Union;
    }));
  };

}).call(this);
