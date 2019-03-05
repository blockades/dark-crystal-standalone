const { h } = require('mutant')

module.exports = function mainLayout (props, children) {
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
