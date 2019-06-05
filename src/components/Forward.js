const { h } = require('mutant')

module.exports = function Forward (props = {}, children = []) {
  const { routeTo } = props

  return h('div.right', { 'ev-click': routeTo }, [
    h('i.fa.fa-chevron-right')
  ])
}
