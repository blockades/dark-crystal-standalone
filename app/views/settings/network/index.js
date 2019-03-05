const nest = require('depnest')
const { computed, h } = require('mutant')

exports.gives = nest('app.views.settings.network.index')

exports.needs = nest({
  'keys.sync.id': 'first',
  'about.html.avatar': 'first',
  'about.obs.name': 'first',
  'message.async.publish': 'first',
  'sbot.async.addBlob': 'first',
  'sbot.obs.localPeers': 'first'
})

exports.create = (api) => {
  return nest('app.views.settings.network.index', settingsNetworkIndex)

  function settingsNetworkIndex (request) {
    return h('Settings Network -index', [
      computed(api.sbot.obs.localPeers(), (peers) => {
        if (!peers.length) return h('p', 'No local peers connected')
        return peers.map(feedId => api.about.html.avatar(feedId))

      })
    ])
  }
}
