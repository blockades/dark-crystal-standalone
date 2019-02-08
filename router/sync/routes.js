const nest = require('depnest')
const isRoot = require('scuttle-dark-crystal/isRoot')

exports.gives = nest('router.sync.routes')
exports.needs = nest({
  'app.page.darkCrystal': 'first',
  // 'app.page.darkCrystalRitualsIndex': 'first',
  // 'app.page.darkCrystalRitualsNew': 'first',
  // 'app.page.darkCrystalRitualsShow': 'first',
  // 'app.page.darkCrystalOthersShardsIndex': 'first',
  // 'app.page.darkCrystalForwardNew': 'first'
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page

    const routes = [
      [ loc => loc.page === 'dark-crystal', pages.darkCrystal ],
      // [ loc => loc.page === 'dark-crystal/new', pages.darkCrystalRitualsNew ],
      // [ loc => loc.page === 'dark-crystal/rituals', pages.darkCrystalRitualsIndex ],
      // [ loc => isRoot(loc), pages.darkCrystalRitualsShow ],
      // [ loc => loc.page === 'dark-crystal/others-shards', pages.darkCrystalOthersShardsIndex ],
      // [ loc => loc.page === 'dark-crystal/forward/new', pages.darkCrystalForwardNew ]
    ]

    return [...sofar, ...routes]
  })
}
