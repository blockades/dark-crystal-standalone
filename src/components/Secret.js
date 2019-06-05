const { h, Value, computed } = require('mutant')
const { pickBy, identity } = require('lodash')

const Button = require('./Button')
const CopyToClipboard = require('./CopyToClipboard')

module.exports = function Secret (props = {}, children = []) {
  const {
    secret = Value(''),
    onInput = noop,
    withActions = true,
    readonly = true,
    placeholder = 'secret placeholder'
  } = props

  const state = {
    hidden: Value('hidden')
  }

  // Remove readonly entirely from attributes if false otherwise it applies itself anyway
  let attributes = pickBy({ readonly }, identity)

  let mainStyles = { 'grid-template-rows': withActions ? '1fr auto' : 'auto' }
  let containerStyles = { 'grid-template-rows': computed(state.hidden, (hidden) => hidden === 'hidden' ? 'auto' : 'auto 1fr') }

  return h('div.secret', { style: mainStyles }, [
    h('div.container', { style: containerStyles }, [
      h('div.down', [
        h('i.fa.fa-chevron-down', { 'ev-click': () => state.hidden.set(state.hidden() === 'hidden' ? '' : 'hidden') }),
      ]),
      h('div.secret', { style: { display: computed(state.hidden, (hidden) => hidden === 'hidden' ? 'none' : 'grid') } }, [
        h('textarea', {
          'ev-input': onInput,
          classList: computed(state.hidden, (hidden) => hidden),
          placeholder,
          attributes
        }, typeof secret === 'function'
          ? computed(secret, secret => secret)
          : secret
        )
      ])
    ]),
    withActions ? h('div.actions', [
      CopyToClipboard({ value: secret, size: 'small' }),
      Button({
        text: 'Reset',
        title: 'Click to delete the secret locally. You can still recover this again from your peers',
        type: 'subtle'
      })
    ]) : null
  ])
}

function noop () {}
