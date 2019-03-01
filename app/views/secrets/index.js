const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')

exports.gives = nest('app.views.secrets.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'sbot.obs.connection': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.index', secretsIndex)

  function secretsIndex (request) {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        goBack: api.router.sync.goBack,
        currentPath: request.path
      }),
      h('Secrets -index', [
        map(api.app.actions.secrets.fetch(), (secret) => {
          return h('section.secret', {
            'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
          }, [
            h('div.top', [
              h('div.name', secret.name),
              h('div.started', secret.createdAt)
            ]),
            h('div.bottom', [
              h('div.recipients', [
                // %%TODO%% Fix blob get and replace with correct recipient avatar
                // secret.recipients.map(feedId => api.about.html.avatar(feedId, 2))
                secret.recipients.map(feedId => h('i.fa.fa-user.fa-lg', { title: feedId }))
              ]),
              h('div.state', [
                h('span.recps', secret.recipients.length),
                h('span', '/'),
                h('span.quorum', secret.quorum)
              ])
            ])
          ])
        }, { comparer })
      ])
    ])
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
