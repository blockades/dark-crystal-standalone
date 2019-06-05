const { h } = require('mutant')

module.exports = function Close (props = {}, children = []) {
  const {
    onClick = console.log,
    title = 'Close'
    // size
  } = props

  return h('i.fa.fa-times.fa-lg', { 'ev-click': onClick, title })
}
