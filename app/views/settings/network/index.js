const nest = require('depnest')
const { computed, h, Struct } = require('mutant')

const Peers = require('../../../components/Peers')

exports.gives = nest('app.views.settings.network.index')

exports.needs = nest({
  'keys.sync.id': 'first',
  'about.html.avatar': 'first',
  'about.obs.name': 'first',
  'message.async.publish': 'first',
  'sbot.async.addBlob': 'first',
  'sbot.obs.localPeers': 'first',
  'sbot.obs.connectedPeers': 'first'
})

exports.create = (api) => {
  return nest('app.views.settings.network.index', settingsNetworkIndex)

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
      h('div.local', { title: '~ peers on the same LAN connection ~' }, [
        h('label.local', 'Local Peers'),
        computed(state.local.peers, (peers) => (
          !peers.length ? h('p', 'No local peers connected') : null
        )),
        Peers({
          peers: state.local.peers,
          avatar: api.about.html.avatar
        })
      ]),
      h('div.remote', { title: '~ pubs connected via the internet ~' }, [
        h('label.remote', 'Remote Peers'),
        computed(state.remote.peers, (peers) => (
          !peers.length ? h('p', 'No remote peers / pubs connected') : null
        )),
        Peers({
          peers: state.remote.peers,
          avatar: api.about.html.avatar
        })
      ])
    ])
  }
}
