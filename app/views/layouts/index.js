const nest = require('depnest')
const { h } = require('mutant')

const NavBar = require('../../components/NavBar')
const Tabs = require('../../components/Tabs')

const { isSecretsNamespace, isShardsNamespace } = require('../../routes')

exports.gives = nest('app.views.layouts.index')
exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.async.suggest': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('app.views.layouts.index', layoutIndex)

  function layoutIndex (request, children = []) {
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
          name: 'secrets',
          onClick: () => api.router.sync.goTo({ path: `/secrets` }),
          class: isSecretsNamespace(request) ? 'active' : ''
        },
        {
          name: 'shards',
          onClick: () => api.router.sync.goTo({ path: `/shards` }),
          class: isShardsNamespace(request) ? 'active' : ''
        }
      ]}),
      ...children
    ])
  }
}
