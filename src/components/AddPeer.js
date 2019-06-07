const { h, Value, computed, resolve } = require('mutant')
const addSuggest = require('suggest-box')
const { isFeedId } = require('ssb-ref')

module.exports = function AddPeer (props = {}, children = []) {
  const {
    selected,
    suggest,
    secrets = Value(),
    max = 1,
    placeholder = '',
    onChange = console.log,
    onSubmit = console.log,
    canClear = false
  } = props

  var theSecrets = secrets()

  const state = {
    selected,
    min: 0,
    max,
    isEmpty: true
  }

  const input = h('input', { placeholder })
  suggestify(input, suggest, state, (e) => {
    var matched = e.detail

    select({ state, matched }, (err) => {
      if (err) console.error(err)

      e.target.value = ''
      e.target.placeholder = ''
      onSubmit()
    })
  })

  input.addEventListener('keydown', (e) => {
    if (state.selected.getLength() >= max && !isBackspace(e)) {
      e.preventDefault()
      return false
    }
  })

  let wasEmpty
  input.addEventListener('keyup', (e) => {
    state.isEmpty = wasEmpty && e.target.value.length === 0

    if (isFeedId(e.target.value)) {
      select({ state, link: e.target.value }, (err) => {
        if (err) console.error(err)

        e.target.value = ''
        e.target.placeholder = ''
      })
      return
    }

    if (isBackspace(e) && state.isEmpty && state.selected.getLength() > state.min) {
      selected.pop()
      onChange()
    }

    wasEmpty = e.target.value.length === 0
  })

  return h('div.add-peer', {
    style: {
      'grid-template-columns': canClear ? '1fr auto' : 'auto'
    }
  }, [
    input,
    canClear ? h('i.fa.fa-times', {
      'ev-click': (e) => state.selected.set([]),
      'style': { 'cursor': 'pointer' },
      'title': 'Clear'
    }) : h('div'),
    ...children
  ])

  function suggestify (input, suggest, state, callback) {
    if (!input.parentElement) return setTimeout(() => suggestify(input, suggest, state, callback), 100)

    addSuggest(input, (inputText, cb) => {
      if (state.selected.getLength() >= state.max) return

      if (isFeedId(inputText)) return

      if (inputText.match(/^@/)) {
        const searchTerm = inputText.replace(/^@/, '')
        suggest.about(searchTerm, cb)
      } else {
        secrets = resolve(theSecrets)
        if (!secrets) return

        var secrets = secrets
          .filter(secret => secret.name.startsWith(inputText))
          .map(s => Object.assign(s, { title: s.name, subtitle: s.createdAt, value: s.id }))

        if (secrets.length) cb(null, secrets)
      }
    }, {cls: 'PatchSuggest'})

    input.addEventListener('suggestselect', callback)
  }
}

function select ({ state, matched }, cb) {
  const isAlreadyPresent = resolve(state.selected).find(r => r === matched.link || r.link === matched.link)
  if (isAlreadyPresent) return cb(new Error('can only add each peer once'))

  if (state.selected.getLength() >= state.max) return cb(new Error(`cannot add any more selected, already at max (${state.max})`))

  state.selected.push(matched)
  cb(null)
}

function isBackspace (e) {
  return e.code === 'Backspace' || e.key === 'Backspace' || e.keyCode === 8
}
