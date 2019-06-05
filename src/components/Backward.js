const { h } = require('mutant')

module.exports = function Backward (props = {}, children = []) {
  const { routeTo } = props

  return h('div.left', { 'ev-click': routeTo }, [
    h('i.fa.fa-chevron-left')
  ])
}
