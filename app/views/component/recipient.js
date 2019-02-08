const { h } = require('mutant')
const { isFeedId } = require('ssb-ref')

module.exports = function Recipient ({ recp, avatar, name = identity }) {
  if (isFeedId(recp)) {
    return h('DarkCrystalRecipient', [ avatar(recp) ])
  }

  if (!isFeedId(recp.link)) throw new Error('Recipient expects { link: feedId, name }')

  return h('DarkCrystalRecipient', [
    avatar(recp.link),
    h('div.name', [
      isName(recp.name) ? recp.name : name(recp.link)
    ])
  ])
}

function isName (s) { return typeof s === 'string' && s.length }
function identity (i) { return i }
