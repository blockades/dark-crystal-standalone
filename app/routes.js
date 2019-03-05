const SecretsIndexPath = (request) => request.path === `/secrets`
const SecretsShowPath = (request) => request.secret && request.path === `/secrets/${request.secret.id}`

const SettingsIndexPath = (request) => request.path === `/settings`
const SettingsAccountIndexPath = (request) => request.path === `/settings/account`
const SettingsNetworkIndexPath = (request) => request.path === `/settings/network`

module.exports = {
  SecretsIndexPath,
  SecretsShowPath,
  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath
}
