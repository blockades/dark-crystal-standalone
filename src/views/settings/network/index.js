const nest = require('depnest')
const { computed, h, Struct } = require('mutant')

const Peers = require('../../../components/Peers')

exports.gives = nest('views.settings.network.index')

exports.needs = nest({
  'keys.sync.id': 'first',
  'about.obs.imageUrl': 'first',
  'about.obs.name': 'first',
  'router.sync.goTo': 'first',
  'sbot.obs.localPeers': 'first',
  'sbot.obs.connectedPeers': 'first'
})

exports.create = (api) => {
  return nest('views.settings.network.index', settingsNetworkIndex)

  function settingsNetworkIndex (request) {
    const state = {
      local: {
        peers: api.sbot.obs.localPeers()
      },
      remote: {
        peers: api.sbot.obs.connectedPeers()
      }
    }

    return h('Settings Network -index', [
      h('div.local', [
        h('label.local', 'Local Peers'),
        h('p.small', 'Peers on the same LAN connection'),
        computed(state.local.peers, (peers) => (
          !peers.length ? h('p.small', 'None currently connected') : null
        )),
        Peers({
          peers: state.local.peers,
          name: api.about.obs.name,
          imageUrl: api.about.obs.imageUrl,
          onClick: (id) => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
        })
      ]),
      h('div.remote', [
        h('label.remote', 'Remote Peers'),
        h('p.small', 'Pubs connected via the internet'),
        computed(state.remote.peers, (peers) => (
          !peers.length ? h('p.small', 'None currently connected') : null
        )),
        Peers({
          peers: state.remote.peers,
          name: api.about.obs.name,
          imageUrl: api.about.obs.imageUrl,
          onClick: (id) => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
        })
      ])
    ])
  }
}
