const nest = require('depnest')
const { h } = require('mutant')

const NavBar = require('../../components/NavBar')

exports.gives = nest('views.layouts.index')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.async.suggest': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('views.layouts.index', layoutIndex)

  function layoutIndex (request, children = []) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        suggest: { about: api.about.async.suggest },
        myId: api.keys.sync.id(),
        request
      }),
      ...children
    ])
  }
}
