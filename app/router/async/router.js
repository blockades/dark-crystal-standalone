const nest = require('depnest')

exports.gives = nest('router.async.router')

exports.needs = nest({
  'app.views.layouts.index': 'first',
  'router.async.normalise': 'first',
  'router.sync.routes': 'reduce'
})

exports.create = (api) => {
  var router = null

  return nest('router.async.router', (request, cb) => {
    if (!router) router = Router()

    api.router.async.normalise(request, (err, normLocation) => {
      if (err) return cb(err)
      router(normLocation, cb)
    })

    return true
  })

  function Router () {
    const routes = api.router.sync.routes()

    return (request, cb) => {
      const route = routes.find(([validator]) => validator(request))
      if (route) {
        var { view, layout } = route[1]
        if (!layout) layout = api.app.views.layouts.index
        cb(null, layout(request, [ view(request) ]))
      }
    }
  }
}
