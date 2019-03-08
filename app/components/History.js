const { h } = require('mutant')

module.exports = function History (props, children = []) {
  return h('section.history', [
    h('h1', 'History')
  ])
}
