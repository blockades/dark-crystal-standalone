const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, computed, Array: MutantArray, map, throttle } = require('mutant')

const Peers = require('../../components/Peers')
const Forward = require('../../components/Forward')

exports.gives = nest('app.views.secrets.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.index', secretsIndex)

  function secretsIndex (request) {
    return h('Secrets -index', [
      h('section.secret.new', { title: 'Share a new Secret' }, [
        h('div.main', {
          'ev-click': () => api.router.sync.goTo({ path: `/secrets/new` })
        }, [
          h('div.new', [
            h('i.fa.fa-plus.fa-lg')
          ])
        ]),
        Forward({ routeTo: () => api.router.sync.goTo({ path: `/secrets/new` }) })
      ]),
      map(api.app.actions.secrets.fetch(), (secret) => (
        h('section.secret', [
          h('div.main', {
            'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
          }, [
            h('div.top', [
              h('div.name', secret.name),
              h('div.createdAt', secret.createdAt)
            ]),
            h('div.bottom', [
              Peers({
                peers: secret.recipients,
                avatar: api.about.html.avatar
              }),
              h('div.state', [
                h('span.shards', secret.shards.filter(s => s.body).length),
                h('span', '/'),
                h('span.quorum', secret.quorum)
              ])
            ])
          ]),
          Forward({ routeTo: () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret }) })
        ])
      ), { comparer: (a, b) => a && b && a.key === b.key })
    ])
  }
}
