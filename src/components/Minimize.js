const { h } = require('mutant')

module.exports = function Minimize (props = {}, children = []) {
  const {
    onClick = console.log,
    title = 'Minimize'
    // size
  } = props

  return h('i.fa.fa-minus.fa-lg', { 'ev-click': onClick, title })
}
