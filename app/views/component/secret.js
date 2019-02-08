const { h, Value, when, computed } = require('mutant')

const CopyToClipboard = require('./copy-to-clipboard')

module.exports = function Secret (opts) {
  // Ensure we have all required opts set as defaults
  const {
    error = Value(),
    modalOpen = Value(),
    secretLabel = Value(),
    secret = Value()
  } = opts

  return h('DarkCrystalSecret', when(error, renderError(), renderSecret()))

  function renderSecret () {
    return [
      h('h1', 'Your secret'),
      when(secretLabel, [ h('h3', 'Label'), h('pre', secretLabel) ]),
      h('h3', 'Secret'),
      h('pre', secret),
      h('div.actions', [
        CopyToClipboard({ toCopy: secret }),
        when(modalOpen, h('button -subtle', { 'ev-click': () => modalOpen.set(false) }, 'close'), [])
      ])
    ]
  }

  function renderError () {
    return [
      h('h1', [ 'Error combining shards!!!' ]),
      h('pre', computed(error, e => (e || '').toString())),
      h('div.actions', [
        when(modalOpen, h('button -subtle', { 'ev-click': () => modalOpen.set(false) }, 'close'), [])
      ])
    ]
  }
}
