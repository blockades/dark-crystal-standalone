const { h } = require('mutant')

module.exports = function Tooltip (props = {}, children = []) {
  const {
    text = "Whoops, your tooltip doesn't say anything"
  } = props

  return h('div.tooltip', [
    h('span', text)
  ])
}
