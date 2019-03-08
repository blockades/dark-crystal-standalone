const { h } = require('mutant')
const { isFeedId } = require('ssb-ref')

module.exports = function Peer ({ feed, avatar, name = identity }) {
  if (isFeedId(feed)) return h('div.peer', [ avatar(feed) ])
  if (!isFeedId(feed.link)) throw new Error('Peer expects { link: feedId, name }')

  return h('div.peer', [
    avatar(feed.link),
    h('div.name', [isName(feed.name) ? feed.name : name(feed.link)])
  ])
}

function isName (s) { return typeof s === 'string' && s.length }
function identity (id) { return id }
