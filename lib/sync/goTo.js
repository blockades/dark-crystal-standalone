const nest = require('depnest')

exports.gives = nest({ 'app.sync.goTo': true })

exports.needs = nest({
  'app.sync.locationId': 'first',
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

    api.router.async.normalise(location, (err, loc) => {
      if (err) throw err
      const locationId = api.app.sync.locationId(loc)

      api.router.async.router(locationId, (err, view) => {
        if (err) throw err
        if (!view) return
        api.history.sync.push(loc)
      })
    })
  }
}
