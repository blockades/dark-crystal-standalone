const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.views.root.index': 'first',
  'app.views.layouts.index': 'first',
  'app.views.layouts.settings': 'first',
  'app.views.layouts.blank': 'first',
  'app.views.secrets.index': 'first',
  'app.views.secrets.show': 'first',
  'app.views.secrets.new.name': 'first',
  'app.views.secrets.new.secret': 'first',
  'app.views.secrets.new.trust': 'first',
  'app.views.secrets.new.submit': 'first',
  'app.views.peers.show': 'first',
  'app.views.settings.account.index': 'first',
  'app.views.settings.network.index': 'first',
  'app.views.errors.show': 'first',
  'app.views.help.index': 'first'
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
      errors,
      help,
      layouts
    } = api.app.views

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
      [ SettingsIndexPath, { view: settings.account.index, layout: layouts.settings } ],
      [ SettingsAccountIndexPath, { view: settings.account.index, layout: layouts.settings } ],
      [ SettingsNetworkIndexPath, { view: settings.network.index, layout: layouts.settings } ],
      [ ErrorsShowPath, { view: errors.show } ],
      [ HelpIndexPath, { view: help.index } ],
    ]

    return [...acc, ...routes]
  })
}
