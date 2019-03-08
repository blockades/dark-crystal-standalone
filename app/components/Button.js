const { h } = require('mutant')

module.exports = function Button (props = {}, children = []) {
  const {
    onClick = console.log,
    text = 'submit',
    placeholder = ''
  } = props

  return h('button', { 'ev-click': onClick }, text)
}
