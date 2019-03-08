const nest = require('depnest')

exports.gives = nest('router.sync.goTo')

exports.needs = nest({
  'history.obs.store': 'first',
  'history.sync.push': 'first',
  'router.async.normalise': 'first',
  'router.async.router': 'first'
})

exports.create = function (api) {
  return nest('router.sync.goTo', goTo)

  function goTo (request, options = {}) {
    api.router.async.router(request, (err, view) => {
      if (err) throw err
      if (!view) return
      api.history.sync.push(view)
    })
  }
}
