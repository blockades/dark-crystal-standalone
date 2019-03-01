const nest = require('depnest')

exports.gives = nest('router.async.router')

exports.needs = nest({
  'router.async.normalise': 'first',
  'router.sync.routes': 'reduce'
})

exports.create = (api) => {
  var router = null

  return nest('router.async.router', (request, cb) => {
    if (!router) router = Router(api.router.sync.routes())

    api.router.async.normalise(request, (err, normLocation) => {
      if (err) return cb(err)
      router(normLocation, cb)
    })

    return true
  })
}

function Router (routes) {
  return (request, cb) => {
    const route = routes.find(([validator]) => validator(request))
    if (route) {
      const view = route[1]
      cb(null, view(request))
    }
  }
}
