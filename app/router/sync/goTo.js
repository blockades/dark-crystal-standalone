const nest = require('depnest')

exports.gives = nest('app.sync.goTo')

exports.needs = nest({
  'history.obs.store': 'first',
  'history.sync.push': 'first',
  'router.async.normalise': 'first',
  'router.async.router': 'first'
})

exports.create = function (api) {
  return nest('app.sync.goTo', goTo)

  function goTo (location, options = {}) {
    // const {
    //   openBackground = false,
    //   split = false
    // } = options

    api.router.async.router(location, (err, view) => {
      if (err) throw err
      if (!view) return
      api.history.sync.push(view)
    })
  }
}
