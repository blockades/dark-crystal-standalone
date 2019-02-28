const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.views.crystals.index': 'first',
  'app.views.crystals.show': 'first',
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const { crystals } = api.app.views

    const routes = [
      [ loc => loc.page === 'crystals', crystals.index ],
      [ loc => isRoot, crystals.show ]
    ]

    return [...sofar, ...routes]
  })
}
