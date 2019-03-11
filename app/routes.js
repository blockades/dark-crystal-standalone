// Define route functions here, then in order to use them, add to router/async/routes.js with the relevant view

const SecretsIndexPath = (request) => request.path === `/secrets`
const SecretsShowPath = (request) => request.secret && request.path === `/secrets/${request.secret.id}`
const SecretsNewPath = (request) => request.path === `/secrets/new`

const isSecretsNamespace = (request) => request.path.substring(0, 8) === `/secrets`

const ShardsIndexPath = (request) => request.path === `/shards`
const ShardsShowPath = (request) => request.shard && request.path === `/shards/${request.shard.id}`

const isShardsNamespace = (request) => request.path.substring(0, 6) === `/shards`

const SettingsIndexPath = (request) => request.path === `/settings`
const SettingsAccountIndexPath = (request) => request.path === `/settings/account`
const SettingsNetworkIndexPath = (request) => request.path === `/settings/network`

const isSettingsNamespace = (request) => request.path.substring(0, 9) === `/settings`

const PeersShowPath = (request) => request.peer && request.path === `/peers/${request.peer.id}`

const ErrorsShowPath = (request) => request.error && request.path === `/error`
const WarningsShowPath = (request) => request.warning && request.path === `/warning`

module.exports = {
  SecretsIndexPath,
  SecretsShowPath,
  SecretsNewPath,
  ShardsIndexPath,
  ShardsShowPath,
  PeersShowPath,
  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath,
  ErrorsShowPath,
  WarningsShowPath,

  isSettingsNamespace,
  isSecretsNamespace,
  isShardsNamespace
}
