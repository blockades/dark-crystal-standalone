// Define route functions here, then in order to use them, add to router/async/routes.js with the relevant view

const SecretsIndexPath = (request) => request.path === `/secrets`
const SecretsShowPath = (request) => request.secret && request.path === `/secrets/${request.secret.id}`
const SecretsNewPath = (request) => request.path === `/secrets/new`

const SettingsIndexPath = (request) => request.path === `/settings`
const SettingsAccountIndexPath = (request) => request.path === `/settings/account`
const SettingsNetworkIndexPath = (request) => request.path === `/settings/network`

module.exports = {
  SecretsIndexPath,
  SecretsShowPath,
  SecretsNewPath,
  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath
}
