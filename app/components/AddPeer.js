const { h, resolve } = require('mutant')
const addSuggest = require('suggest-box')
const { isFeedId  } = require('ssb-ref')

module.exports = function AddPeer (props = {}, children = []) {
  const {
    peers,
    suggest,
    max = 1,
    placeholder = '',
    onChange = console.log,
    onSubmit = console.log
  } = props

  const state = {
    peers,
    min: 0,
    max,
    isEmpty: true
  }

  const input = h('input', { placeholder })
  suggestify(input, suggest, state, ({ state, link, name, e }) => {
    addRecp({ state, link, name }, (err) => {
      if (err) console.error(err)

      e.target.value = ''
      e.target.placeholder = ''
      onSubmit()
    })
  })

  input.addEventListener('keydown', (e) => {
    if (state.peers.getLength() >= max && !isBackspace(e)) {
      e.preventDefault()
      return false
    }
  })

  let wasEmpty
  input.addEventListener('keyup', (e) => {
    state.isEmpty = wasEmpty && e.target.value.length === 0

    if (isFeedId(e.target.value)) {
      addRecp({ state, link: e.target.value }, (err) => {
        if (err) console.error(err)

        e.target.value = ''
        e.target.placeholder = ''
      })
      return
    }

    if (isBackspace(e) && state.isEmpty && state.peers.getLength() > state.min) {
      peers.pop()
      onChange()
    }

    wasEmpty = e.target.value.length === 0
  })

  return [
    input,
    h('i.fa.fa-times', {
      'ev-click': (e) => state.peers.set([]),
      'style': { 'cursor': 'pointer' },
      'title': 'Clear'
    })
  ]
}

function suggestify (input, suggest, state, callback) {
  // TODO use a legit module to detect whether ready
  if (!input.parentElement) return setTimeout(() => suggestify(input, suggest, state, callback), 100)

  addSuggest(input, (inputText, cb) => {
    if (state.peers.getLength() >= state.max) return
    // TODO - tell the user they're only allowed 6 (or 7?!) people in a message

    if (isFeedId(inputText)) return
    // suggest mention not needed, handled by eventListener above

    const searchTerm = inputText.replace(/^@/, '')
    suggest.about(searchTerm, cb)
  }, {cls: 'PatchSuggest'})

  input.addEventListener('suggestselect', (e) => {
    const { id: link, title: name } = e.detail
    callback({ state, link, name, e })
  })
}

function addRecp ({ state, link, name }, cb) {
  const isAlreadyPresent = resolve(state.peers).find(r => r === link || r.link === link)
  if (isAlreadyPresent) return cb(new Error('can only add each peer once'))

  if (state.peers.getLength() >= state.max) return cb(new Error(`cannot add any more peers, already at max (${state.max})`))

  state.peers.push({ link, name })
  cb(null)
}

function isBackspace (e) {
  return e.code === 'Backspace' || e.key === 'Backspace' || e.keyCode === 8
}
