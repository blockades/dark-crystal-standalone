const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')
const ViewTabs = require('../../components/ViewTabs')

exports.gives = nest('app.views.secrets.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.show', secretsShow)

  function secretsShow (request) {
    const { secret } = request

    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        currentPath: request.path
      }),
      ViewTabs(request.path, [
        { name: 'secrets', click: () => routeTo({ path: `/secrets` }), class: 'active' },
        { name: 'shards', click: () => routeTo({ path: `/shards` }) }
      ]),
      h('Secrets -show', [
        h('div.left', [
          h('i.fa.fa-chevron-left', {
            'ev-click': api.router.sync.goBack
          }),
          h('div')
        ]),
        h('div.main', [
          h('section.secret', [

          ])
        ])
      ])
    ])
  }
}
