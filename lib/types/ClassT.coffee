# This file is part of RC.
#
# RC is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# RC is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with RC.  If not, see <https://www.gnu.org/licenses/>.

# с помощью этого типа задумана проверка классов - НЕ инстансов классов
# т.е. ClassT(Controller) - не вернет ошибку, если Controller - инстанс класса RC::Class
# этот тип нужен чтобы проверять аргументы тех методов, в которые передается класс как объект (как аргумент)

# идея - чтобы проверить что value - это кастомный класс (не стандартный класс) можно проверить наличие у value ключей, которые объявляет как методы класса CoreObject => это наследник CoreObject класса.

module.exports = (Module)->
  {
    IrreducibleG
    Utils: { _, t }
  } = Module::

  Module.defineType IrreducibleG 'ClassT', (x)->
    _.isFunction(x) and _.isPlainObject(x.meta) and x.meta.kind is 'class'
    # # TODO: вопрос в том, проверять ли только наличие одного ключа - например @[Symbol.for '~metaObject'] isnt null, но такая проверка не защищает от подмены, ИЛИ делать проверку интерфейса целиком - т.е. по всем нижеперечисленным атрибутам и методам.
    # # второй проблемой в подходе с интерфейсом является проверка методов и атрибутов, объявленных на прототипе (ниже с отметкой `@::`)
    # Symbol.for '~metaObject' # attr
    # isExtensible # attr
    # super # Function
    # super # @:: Function
    # wrap # Function
    # wrap # @:: Function
    # metaObject # == @[Symbol.for '~metaObject']
    # inheritProtected # Function
    # new # Function
    # include # Function
    # implements # Function
    # freeze  # Function
    # initialize # Function
    # initializeMixin  # Function
    # initializeInterface # Function
    # async # Function
    # virtual # Function
    # static # Function
    # public # Function
    # protected # Function
    # private # Function
    # const # Function
    # module # Function
    # Module #@:: attr
    # moduleName # Function
    # moduleName # @:: Function
    # CLASS_KEYS # @:: attr
    # INSTANCE_KEYS # @:: attr
    # superclass # Function
    # class # Function
    # class # @:: Function
    # classMethods # attr
    # instanceMethods # attr
    # constants # attr
    # instanceVariables # attr
    # classVariables # attr
    # restoreObject # async Function
    # replicateObject # async Function
    # init # @:: Function
    # constructor # isnt Function
