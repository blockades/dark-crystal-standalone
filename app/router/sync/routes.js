const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.views.layouts.index': 'first',
  'app.views.layouts.peers': 'first',
  'app.views.layouts.settings': 'first',
  'app.views.secrets.index': 'first',
  'app.views.secrets.show': 'first',
  'app.views.secrets.new': 'first',
  'app.views.peers.show': 'first',
  'app.views.settings.account.index': 'first',
  'app.views.settings.network.index': 'first'
})

const {
  SecretsIndexPath,
  SecretsShowPath,
  SecretsNewPath,
  PeersShowPath,
  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath
} = require('../../routes')

exports.create = (api) => {
  return nest('router.sync.routes', (acc = []) => {
    const {
      secrets,
      settings,
      peers,
      layouts
    } = api.app.views

    const routes = [
      [ SecretsIndexPath, { view: secrets.index } ],
      [ SecretsShowPath, { view: secrets.show } ],
      [ SecretsNewPath, { view: secrets.new } ],
      [ PeersShowPath, { view: peers.show, layout: layouts.peers } ],
      [ SettingsIndexPath, { view: settings.account.index, layout: layouts.settings } ],
      [ SettingsAccountIndexPath, { view: settings.account.index, layout: layouts.settings } ],
      [ SettingsNetworkIndexPath, { view: settings.network.index, layout: layouts.settings } ]
    ]

    return [...acc, ...routes]
  })
}
