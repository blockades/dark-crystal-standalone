const { h, resolve } = require('mutant')

module.exports = function ProgressBar (opts) {
  const {
    prepend,
    maximum,
    value,
    title,
    append
  } = opts

  return h('ProgressBar', [
    prepend,
    h('progress', { max: maximum, value, title: '' }),
    append
  ])
}
