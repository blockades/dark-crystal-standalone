const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')

exports.gives = nest('app.views.settings.index')

exports.needs = nest({
  // 'app.actions.settings.fetch': 'first',
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = (api) => {
  return nest('app.views.settings.index', settingsIndex)

  function settingsIndex (request) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        currentPath: request.path
      }),
      h('h1', 'Settings')
    ])
  }
}
