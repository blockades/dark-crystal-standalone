const { h, resolve } = require('mutant')

module.exports = function ProgressBar (opts) {
  const {
    prepend,
    maximum,
    value,
    title = '',
    append,
    classList = []
  } = opts

  return h('ProgressBar', [
    prepend,
    h('progress', { classList, max: maximum, value, title }),
    append
  ])
}
