const { h } = require('mutant')
const { compact } = require('lodash')

module.exports = function ViewTabs (tabs) {
  return h('div.tabs', [
    tabs.map(tab => (
      h('div.tab', { classList: compact([tab.class]), 'ev-click': tab.onClick }, tab.name)
    ))
  ])
}
