const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')
exports.needs = nest({
  'app.page.darkCrystalIndex': 'first',
  'app.page.darkCrystalShow': 'first'

})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page

    const routes = [
      [ loc => loc.page === 'dark-crystal', pages.darkCrystalIndex ],
      [ loc => isRoot(loc), pages.darkCrystalShow ]
    ]

    return [...sofar, ...routes]
  })
}
