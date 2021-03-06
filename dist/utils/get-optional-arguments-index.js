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
    return Module.util({
      getOptionalArgumentsIndex: function(types) {
        var areAllMaybes, end, i, j, ref, type;
        if (types.length === 0) {
          return 0;
        }
        end = types.length;
        areAllMaybes = false;
        for (i = j = ref = end - 1; (ref <= 0 ? j <= 0 : j >= 0); i = ref <= 0 ? ++j : --j) {
          type = types[i];
          if (!Module.prototype.TypeT.is(type) || type.meta.kind !== 'maybe') {
            return i + 1;
          } else {
            areAllMaybes = true;
          }
        }
        if (areAllMaybes) {
          return 0;
        } else {
          return end;
        }
      }
    });
  };

}).call(this);
