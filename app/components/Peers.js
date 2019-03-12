const { h, map } = require('mutant')
const { isFeedId } = require('ssb-ref')

const Peer = require('./Peer')

module.exports = function Peers (props = {}, children = []) {
  const {
    peers,
    name,
    imageUrl = identity,
    onClick = noop,
    size = 2.5
  } = props

  const peerMap = (peer) => Peer({
    feed: peer,
    name,
    imageUrl,
    size,
    onClick: () =>  onClick(peer)
  })

  return h('div.peers', [
    typeof peers === 'function'
      ? map(peers, peerMap)
      : peers.map(peerMap),
    ...children
  ])
}

function noop () {}
function identity (id) { return id }
