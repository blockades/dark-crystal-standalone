const nest = require('depnest')
const { h } = require('mutant')

const NavBar = require('../../components/NavBar')
const ViewTabs = require('../../components/ViewTabs')

exports.gives = nest('app.views.layouts.index')
exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first'
})

exports.create = (api) => {
  return nest('app.views.layouts.index', layoutIndex)

  function layoutIndex (request, children) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        currentPath: request.path
      }),
      ViewTabs([
        { name: 'secrets', routeTo: () => api.router.sync.goTo({ path: `/secrets` }), class: 'active' },
        { name: 'shards', routeTo: () => api.router.sync.goTo({ path: `/shards` }) }
      ]),
      ...children
    ])
  }
}
