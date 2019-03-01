const nest = require('depnest')

exports.gives = nest('router.sync.goBack')

exports.needs = nest({
  'history.sync.back': 'first'
})

exports.create = (api) => {
  return nest('router.sync.goBack', goBack)

  function goBack () {
    api.history.sync.back()
  }
}
