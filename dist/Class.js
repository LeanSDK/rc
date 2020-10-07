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
  var hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf;

  module.exports = function(RC) {
    var CLASS_KEYS, CoreObject, INSTANCE_KEYS, _, assert, ref, ref1, t;
    ({CoreObject} = RC.prototype);
    ({CLASS_KEYS, INSTANCE_KEYS} = CoreObject.prototype);
    _ = (ref = RC.prototype._) != null ? ref : RC.prototype.Utils._;
    t = (ref1 = RC.prototype.t) != null ? ref1 : RC.prototype.Utils.t;
    ({assert} = t);
    RC.prototype.Class = (function() {
      class Class extends CoreObject {};

      Class.inheritProtected();

      Class.module(RC);

      Reflect.defineProperty(Class, 'new', {
        enumerable: true,
        value: function(name, object) {
          var _k, _v, k, ref2, ref3, reserved_words, v, vClass;
          vClass = this.clone(CoreObject, {
            name,
            parent: CoreObject
          });
          reserved_words = Object.keys(CoreObject);
          ref2 = object.ClassMethods;
          for (k in ref2) {
            if (!hasProp.call(ref2, k)) continue;
            v = ref2[k];
            if (indexOf.call(reserved_words, k) < 0) {
              vClass[k] = v;
            }
          }
          ref3 = object.InstanceMethods;
          for (_k in ref3) {
            if (!hasProp.call(ref3, _k)) continue;
            _v = ref3[_k];
            if (indexOf.call(INSTANCE_KEYS, _k) < 0) {
              vClass.prototype[_k] = _v;
            }
          }
          if (object.Module != null) {
            vClass.Module = object.Module;
          }
          Reflect.setPrototypeOf(vClass.prototype, new CoreObject());
          return vClass;
        }
      });

      Reflect.defineProperty(Class, 'restoreObject', {
        enumerable: true,
        value: function(Module, replica) {
          var ref2;
          assert(replica != null, "Replica cann`t be empty");
          assert(replica.class != null, "Replica type is required");
          assert((replica != null ? replica.type : void 0) === 'class', `Replica type isn\`t \`class\`. It is \`${replica.type}\``);
          return ((ref2 = this.Module.prototype.Promise) != null ? ref2 : RC.prototype.Promise).resolve(Module.prototype[replica.class]);
        }
      });

      Reflect.defineProperty(Class, 'replicateObject', {
        enumerable: true,
        value: function(acClass) {
          var ref2, replica;
          assert(acClass != null, "Argument cann`t be empty");
          replica = {
            type: 'class',
            class: acClass.name
          };
          return ((ref2 = this.Module.prototype.Promise) != null ? ref2 : RC.prototype.Promise).resolve(replica);
        }
      });

      Reflect.defineProperty(Class, 'clone', {
        enumerable: true,
        value: function(klass, options = {}) {
          var Class, SuperClass, parent, ref2, ref3;
          assert(_.isFunction(klass), 'Not a constructor function');
          if (options.name == null) {
            options.name = klass.name;
          }
          SuperClass = Reflect.getPrototypeOf(klass);
          parent = (ref2 = (ref3 = options.parent) != null ? ref3 : SuperClass) != null ? ref2 : klass.prototype.constructor;
          Class = this;
          return (function(original, parentPrototype, options) {
            var clone;
            clone = class extends original {};
            Reflect.defineProperty(clone, 'name', {
              value: options.name
            });
            if (options.initialize) {
              if (typeof clone.initialize === "function") {
                clone.initialize();
              }
            }
            return clone;
          })(klass, parent.prototype, options);
        }
      });

      return Class;

    }).call(this);
    // надо объявить и методы из Class и из Module - которые в Ruby
    RC.prototype.Class.constructor = RC.prototype.Class;
    return RC.prototype.Class;
  };

}).call(this);
