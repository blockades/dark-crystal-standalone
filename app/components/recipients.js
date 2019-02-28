const { h, map, resolve } = require('mutant')
const addSuggest = require('suggest-box')
const { isFeedId } = require('ssb-ref')
const Recipient = require('./recipient')

module.exports = function Recipients (opts) {
  const {
    state,
    suggest,
    name,
    avatar,
    maxRecps = 7,
    placeholder = '',
    onChange = console.log
  } = opts

  const avatarSmall = (feedId) => avatar(feedId, 2.5)

  return h('DarkCrystalRecipients', [
    map(state.recps, recp => Recipient({ recp, name, avatar: avatarSmall })),
    RecipientInput({ state, suggest, maxRecps, placeholder, onChange })
  ])
}

function RecipientInput (opts) {
  const {
    state: { recps },
    suggest,
    maxRecps,
    placeholder = '',
    onChange
  } = opts

  const state = {
    recps,
    minRecps: 0,
    maxRecps,
    isEmpty: true
  }

  const input = h('input', { placeholder })
  suggestify(input, suggest, state)

  input.addEventListener('keydown', (e) => {
    if (state.recps.getLength() >= maxRecps && !isBackspace(e)) {
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

    if (isBackspace(e) && state.isEmpty && state.recps.getLength() > state.minRecps) {
      recps.pop()
      onChange()
    }

    wasEmpty = e.target.value.length === 0
  })

  return [
    input,
    h('i.fa.fa-times', {
      'ev-click': (e) => state.recps.set([]),
      'style': { 'cursor': 'pointer' },
      'title': 'Clear'
    })
  ]
}

function suggestify (input, suggest, state) {
  // TODO use a legit module to detect whether ready
  if (!input.parentElement) return setTimeout(() => suggestify(input, suggest, state), 100)

  addSuggest(input, (inputText, cb) => {
    if (state.recps.getLength() >= state.maxRecps) return
    // TODO - tell the user they're only allowed 6 (or 7?!) people in a message

    if (isFeedId(inputText)) return
    // suggest mention not needed, handled by eventListener above

    const searchTerm = inputText.replace(/^@/, '')
    suggest.about(searchTerm, cb)
  }, {cls: 'PatchSuggest'})

  input.addEventListener('suggestselect', (e) => {
    const { id: link, title: name } = e.detail
    addRecp({ state, link, name }, (err) => {
      if (err) console.error(err)

      e.target.value = ''
      e.target.placeholder = ''
    })
  })
}

function addRecp ({ state, link, name }, cb) {
  const isAlreadyPresent = resolve(state.recps).find(r => r === link || r.link === link)
  if (isAlreadyPresent) return cb(new Error('can only add each recp once'))

  if (state.recps.getLength() >= state.maxRecps) return cb(new Error(`cannot add any more recps, already at maxRecps (${state.maxRecps})`))

  state.recps.push({ link, name })
  cb(null)
}

function isBackspace (e) {
  return e.code === 'Backspace' || e.key === 'Backspace' || e.keyCode === 8
}

// function isEnter (e) {
//   return e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13
// }
// }
