const { h, Value, computed } = require('mutant')

const Button = require('./Button')
const CopyToClipboard = require('./CopyToClipboard')

module.exports = function Secret (props = {}, children = []) {
  const { secret } = props

  const state = {
    hidden: Value('hidden')
  }

  return h('section.secret', [
    h('div.container', [
      h('div.down', [
        h('i.fa.fa-chevron-down', { 'ev-click': () => state.hidden.set(state.hidden() === 'hidden' ? '' : 'hidden') }),
      ]),
      h('div.secret', [
        h('textarea', {
          classList: computed(state.hidden, (hidden) => hidden),
          placeholder: 'secret placeholder',
          attributes: { readonly: true }
        }, secret.secret)
      ])
    ]),
    h('div.actions', [
      CopyToClipboard({ value: secret, size: 'small' }),
      Button({ text: 'Reset', type: 'subtle' })
    ])
  ])
}
