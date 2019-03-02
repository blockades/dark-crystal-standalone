const { h } = require('mutant')

module.exports = function ViewTabs (path, tabs) {
  return h('div.tabs', [
    tabs.map(tab => (
      h('div.tab', { classList: [tab.class], 'ev-click': () => tab.click() }, tab.name)
    ))
  ])
}
