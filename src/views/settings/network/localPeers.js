const Recipient = require('../../component/recipient')
const { h, computed } = require('mutant')

module.exports = function LocalPeers (opts) {
  const {
    localPeers,
    avatar,
    name
  } = opts

  return h('div.network', [
    computed(localPeers(), local => {
      if (!local.length) return h('p', 'No local peers connected')
      return local.map(feedId => Recipient({ recp: feedId, avatar, name }))
    })
  ])
}
