const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.views.secrets.index': 'first',
  'app.views.secrets.show': 'first',
  'app.views.settings.index': 'first',
  'app.views.settings.account.index': 'first',
  'app.views.settings.network.index': 'first'
})

const SecretsIndexPath = (request) => request.path === `/secrets`
const SecretsShowPath = (request) => request.secret && request.path === `/secrets/${request.secret.id}`

const SettingsIndexPath = (request) => request.path === `/settings`
const SettingsAccountIndexPath = (request) => request.path === `/settings/account`
const SettingsNetworkIndexPath = (request) => request.path === `/settings/network`

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const { secrets, settings } = api.app.views

    const routes = [
      [ SecretsIndexPath, secrets.index ],
      [ SecretsShowPath, secrets.show ],
      [ SettingsIndexPath, settings.index ],
      [ SettingsAccountIndexPath, settings.account.index ],
      [ SettingsNetworkIndexPath, settings.network.index ]
    ]

    return [...sofar, ...routes]
  })
}
