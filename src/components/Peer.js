const { h } = require('mutant')
const { isFeedId } = require('ssb-ref')

const Avatar = require('./Avatar')

module.exports = function Peer (props = {}, children = []) {
  const {
    feed,
    size = 2.5,
    onClick = noop,
    imageUrl = identity,
    name = identity
  } = props

  if (isFeedId(feed)) {
    return h('div.peer', [
      Avatar({
        id: feed,
        onClick,
        imageUrl,
        size
      })
    ])
  }

  if (!isFeedId(feed.link)) {
    throw new Error('Peer expects { link: feedId, name }')
  }

  return h('div.peer', [
    Avatar({
      id: feed.link,
      onClick,
      imageUrl,
      size
    }),
    h('div.name', [
      isName(feed.name) ? feed.name : name(feed.link)
    ])
  ])
}

function isName (s) { return typeof s === 'string' && s.length }
function identity (id) { return id }
function noop () {}
