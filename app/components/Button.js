const { h } = require('mutant')

module.exports = function Button (props = {}, children = []) {
  const {
    onClick = console.log,
    text = 'submit',
    type = 'primary',
    title = ''
  } = props

  return h('button', {
    'ev-click': onClick,
    classList: [`-${type}`],
    title
  }, text)
}
