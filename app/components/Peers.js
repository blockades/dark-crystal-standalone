const { h, map } = require('mutant')
const { isFeedId } = require('ssb-ref')

const Peer = require('./Peer')

module.exports = function Peers (props, children = []) {
  const {
    peers,
    name,
    avatar
  } = props

  // If we're dealing with an observable
  if (typeof peers === 'function') {
    return h('div.peers', [
      map(peers, peer => (
        Peer({
          feed: peer,
          name,
          avatar: (feedId) => avatar(feedId, 2.5)
        })
      )),
      ...children
    ])
  // else we've just got a regular array
  } else {
    return h('div.peers', [
      peers.map(peer => (
        Peer({
          feed: peer,
          name,
          avatar: (feedId) => avatar(feedId, 2.5)
        })
      )),
      ...children
    ])
  }
}
