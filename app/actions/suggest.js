const { isFeedId } = require('ssb-ref')
const addSuggest = require('suggest-box')

module.exports = function Suggest (input, suggest, state, callback) {
  if (!input.parentElement) return setTimeout(() => Suggest(input, suggest, state), 100)

  addSuggest(input, (inputText, cb) => {
    if (state.collection.getLength() >= state.maxRecps) return

    if (isFeedId(inputText)) return

    const searchTerm = inputText.replace(/^@/, '')
    suggest.about(searchTerm, cb)
  }, { cls: 'PatchSuggest' })

  input.addEventListener('suggestselect', callback)
}

