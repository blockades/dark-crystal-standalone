// Define route functions here, then in order to use them, add to router/async/routes.js with the relevant view

const SecretsIndexPath = (request) => request.path === `/secrets`
const SecretsShowPath = (request) => request.secret && request.path === `/secrets/${request.secret.id}`

// Saved state between different views for a form - gives better customisability
const SecretsNewPath = (request) => request.path === `/secrets/new`
const SecretsNewNamePath = (request) => request.path === `/secrets/new/name`
const SecretsNewSecretPath = (request) => request.state && request.state.secretName && request.path === `/secrets/new/secret`
const SecretsNewTrustPath = (request) => request.state && request.state.secretName && request.state.secret && request.path === `/secrets/new/trust`

const SecretsNewSubmitPath = (request) => (
  request.state && request.state.secretName && request.state.secret &&
    request.state.quorum && request.state.peers && request.path === `/secrets/new/submit`
)

const SettingsIndexPath = (request) => request.path === `/settings`
const SettingsAccountIndexPath = (request) => request.path === `/settings/account`
const SettingsNetworkIndexPath = (request) => request.path === `/settings/network`

const PeersShowPath = (request) => request.peer && request.path === `/peers/${request.peer.id}`

const NotificationsIndexPath = (request) => request.path === `/notifications`

const ErrorsShowPath = (request) => request.error && request.path === `/error`
const WarningsShowPath = (request) => request.warning && request.path === `/warning`

const isHelpNamespace = (request) => request.path.substring(0, 5) === `/help`
const isSecretsNamespace = (request) => request.path.substring(0, 8) === `/secrets`
const isSettingsNamespace = (request) => request.path.substring(0, 9) === `/settings`

module.exports = {
  SecretsIndexPath,
  SecretsShowPath,
  SecretsNewPath,

  SecretsNewNamePath,
  SecretsNewSecretPath,
  SecretsNewTrustPath,
  SecretsNewSubmitPath,

  PeersShowPath,

  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath,

  ErrorsShowPath,
  WarningsShowPath,

  NotificationsIndexPath,

  isSettingsNamespace,
  isSecretsNamespace,
  isHelpNamespace
}
