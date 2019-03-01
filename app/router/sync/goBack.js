const nest = require('depnest')

exports.gives = nest('router.sync.goBack')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'history.sync.back': 'first'
})

exports.create = (api) => {
  return nest('router.sync.goBack', goBack)

  function goBack () {
    var last = api.history.sync.back()
    api.history.sync.push(last)
  }
}
