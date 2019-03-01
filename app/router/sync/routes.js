const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.views.secrets.index': 'first',
  'app.views.secrets.show': 'first',
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const { secrets } = api.app.views

    const routes = [
      [ SecretsIndexPath, secrets.index ],
      [ SecretsShowPath, secrets.show ]
    ]

    return [...sofar, ...routes]
  })
}

function SecretsIndexPath (request) {
  return request.path === `/secrets`
}

function SecretsShowPath (request) {
  return request.secret && request.path === `/secrets/${request.secret.id}`
}
