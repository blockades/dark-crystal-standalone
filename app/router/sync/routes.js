const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'views.root.index': 'first',
  'views.layouts.index': 'first',
  'views.layouts.settings': 'first',
  'views.layouts.blank': 'first',
  'views.secrets.index': 'first',
  'views.secrets.show': 'first',
  'views.secrets.new.name': 'first',
  'views.secrets.new.secret': 'first',
  'views.secrets.new.trust': 'first',
  'views.secrets.new.submit': 'first',
  'views.peers.show': 'first',
  'views.shards.show': 'first',
  'views.settings.account.index': 'first',
  'views.settings.network.index': 'first',
  'views.errors.show': 'first',
  'views.help.index': 'first'
})

const {
  RootPath,

  SecretsIndexPath,
  SecretsShowPath,
  SecretsNewPath,

  SecretsNewNamePath,
  SecretsNewSecretPath,
  SecretsNewTrustPath,
  SecretsNewSubmitPath,

  ShardsShowPath,
  PeersShowPath,
  ErrorsShowPath,
  HelpIndexPath,

  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath
} = require('../../routes')

exports.create = (api) => {
  return nest('router.sync.routes', (acc = []) => {
    const {
      root,
      secrets,
      settings,
      peers,
      shards,
      errors,
      help,
      layouts
    } = api.views

    const routes = [
      [ RootPath, { view: root.index, layout: layouts.blank } ],
      [ SecretsIndexPath, { view: secrets.index } ],
      [ SecretsShowPath, { view: secrets.show } ],
      [ SecretsNewPath, { view: secrets.new.name } ],
      [ SecretsNewNamePath, { view: secrets.new.name } ],
      [ SecretsNewSecretPath, { view: secrets.new.secret } ],
      [ SecretsNewTrustPath, { view: secrets.new.trust } ],
      [ SecretsNewSubmitPath, { view: secrets.new.submit } ],
      [ PeersShowPath, { view: peers.show } ],
      [ ShardsShowPath, { view: shards.show } ],
      [ SettingsIndexPath, { view: settings.account.index, layout: layouts.settings } ],
      [ SettingsAccountIndexPath, { view: settings.account.index, layout: layouts.settings } ],
      [ SettingsNetworkIndexPath, { view: settings.network.index, layout: layouts.settings } ],
      [ ErrorsShowPath, { view: errors.show } ],
      [ HelpIndexPath, { view: help.index } ],
    ]

    return [...acc, ...routes]
  })
}
