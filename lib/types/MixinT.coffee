

module.exports = (Module)->
  {
    IrreducibleG
    Utils: { _ }
  } = Module::

  Module.defineType IrreducibleG 'MixinT', (x)->
    _.isFunction(x) and _.isPlainObject(x.meta) and x.meta.kind is 'mixin'