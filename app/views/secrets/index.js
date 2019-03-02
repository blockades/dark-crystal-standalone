const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, computed, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')
const ViewTabs = require('../../components/ViewTabs')

exports.gives = nest('app.views.secrets.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'sbot.obs.connection': 'first',
  'about.html.avatar': 'first',
  'about.obs.imageUrl': 'first',
  'blob.sync.url': 'first'
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
      ViewTabs(request.path, [
        { name: 'secrets', routeTo: () => routeTo({ path: `/secrets` }), class: 'active' },
        { name: 'shards', routeTo: () => routeTo({ path: `/shards` }) }
      ]),
      h('Secrets -index', [
        map(api.app.actions.secrets.fetch(), (secret) => {
          return h('section.secret', [
            h('div.main', [
              h('div.top', {
                'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
              }, [
                h('div.name', secret.name),
                h('div.started', secret.createdAt)
              ]),
              h('div.bottom', [
                h('div.recipients', [
                  secret.recipients.map(feedId => api.about.html.avatar(feedId)) //(
                    // computed(api.about.obs.imageUrl(feedId), (blob) => (
                    //   h('img', { src: blob })
                    // ))
                  // ))
                  // secret.recipients.map(feedId => h('i.fa.fa-user.fa-lg', { title: feedId }))
                ]),
                h('div.state', [
                  h('span.recps', secret.recipients.length),
                  h('span', '/'),
                  h('span.quorum', secret.quorum)
                ])
              ])
            ]),
            h('div.right', {
              'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
            }, [ h('i.fa.fa-chevron-right') ])
          ])
        }, { comparer })
      ])
    ])
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
