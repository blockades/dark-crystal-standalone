const nest = require('depnest')

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
    ])
  }
}
