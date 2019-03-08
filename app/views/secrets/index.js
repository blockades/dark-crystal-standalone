const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, computed, Array: MutantArray, map, throttle } = require('mutant')

const Peers = require('../../components/Peers')

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
        h('div.right', {
          'ev-click': () => api.router.sync.goTo({ path: `/secrets/new` })
        }, [ h('i.fa.fa-chevron-right') ])
      ]),
      map(api.app.actions.secrets.fetch(), (secret) => (
        h('section.secret', [
          h('div.main', [
            h('div.top', {
              'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
            }, [
              h('div.name', secret.name),
              h('div.started', secret.createdAt)
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
          h('div.right', {
            'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
          }, [ h('i.fa.fa-chevron-right') ])
        ])
      ), { comparer })
    ])
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
