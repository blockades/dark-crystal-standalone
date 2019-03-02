const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')
const ViewTabs = require('../../components/ViewTabs')

const DEFAULT_TAB = `/settings/account`

exports.gives = nest('app.views.settings.index')

exports.needs = nest({
  // 'app.actions.settings.fetch': 'first',
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'sbot.obs.connection': 'first',
  'app.views.settings.account.index': 'first'
})

exports.create = (api) => {
  return nest('app.views.settings.index', settingsIndex)

  var store = Value(DEFAULT_TAB)

  function settingsIndex (request) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        currentPath: request.path
      }),
      ViewTabs(request.path, [
        { name: 'account', class: 'active', click: () => {
          store.set(`/settings/account`)
          routeTo({ path: `/settings/account` })
        } },
        { name: 'network', click: () => {
          store.set(`/settings/network`)
          routeTo({ path: `/settings/network` })
        } }
      ]),
      api.app.views.settings.account.index()
    ])
  }
}
