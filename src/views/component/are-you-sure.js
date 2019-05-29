const { h } = require('mutant')

module.exports = function AreYouSure (opts) {
  const {
    message = '',
    onSubmit = noOp,
    onCancel = noOp
  } = opts

  return h('div.warning', [
    message ? h('p', message) : '',
    h('span', 'Are you sure?'),
    h('div.submit', [
      h('button -subtle', { 'ev-click': (e) => onCancel() }, 'No'),
      h('button -subtle', { 'ev-click': (e) => onSubmit() }, 'Yes')
    ])
  ])
}

function noOp () {}
