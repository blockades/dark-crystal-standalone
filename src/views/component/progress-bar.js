const { h } = require('mutant')

module.exports = function ProgressBar (opts) {
  const {
    prepend,
    maximum,
    // middle,
    records = [],
    value,
    title,
    append
  } = opts

  const _value = value || records.length
  const titleText = `${title}: ${value} / ${maximum}`
  return h('ProgressBar', [
    prepend,
    h('progress', { min: 0, max: maximum, value: _value, title: titleText }),
    append
  ])
}
