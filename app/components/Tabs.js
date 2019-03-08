const { h } = require('mutant')
const { compact } = require('lodash')

module.exports = function Tabs (props, children = []) {
  return h('div.tabs', [
    props.tabs.map(tab => (
      h('div.tab', { classList: compact([tab.class]), 'ev-click': tab.onClick }, tab.name)
    ))
  ])
}
