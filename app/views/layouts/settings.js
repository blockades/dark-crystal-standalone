const nest = require('depnest')
const { h } = require('mutant')

const NavBar = require('../../components/NavBar')
const Tabs = require('../../components/Tabs')

const {
  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath
} = require('../../routes')

exports.gives = nest('app.views.layouts.settings')
exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.async.suggest': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('app.views.layouts.settings', layoutSettingsIndex)

  function layoutSettingsIndex (request, children = []) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        suggest: { about: api.about.async.suggest },
        myId: api.keys.sync.id(),
        request
      }),
      Tabs({ tabs: [
        {
          name: 'account',
          class: SettingsIndexPath(request) || SettingsAccountIndexPath(request) ? 'active' : '',
          onClick: () => api.router.sync.goTo({ path: `/settings/account` })
        },
        {
          name: 'network',
          class: SettingsNetworkIndexPath(request) ? 'active' : '',
          onClick: () => api.router.sync.goTo({ path: `/settings/network` })
        }
      ]}),
      ...children
    ])
  }
}

// %%TODO%% We can make this better. If we extract to 'controllers' after the routes and before the views,
// we can cache any relevant values as observables and store the previous state of the nested views.
// For example, /settings would be able to remember values for /settings/account and /settings/network
// That way, when a user leaves /settings/network to /secrets then gets routed to /settings,
// the controller would direct them to the /settings/network view based on the previous value
// This way we can begin to store state outside of the views.
