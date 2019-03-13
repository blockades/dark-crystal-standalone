const nest = require('depnest')
const scuttle = require('scuttle-dark-crystal')
const { h, computed } = require('mutant')

const Peers = require('../../components/Peers')
const Forward = require('../../components/Forward')

exports.gives = nest('app.views.secrets.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first',
  'about.obs.imageUrl': 'first'
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
      computed(api.app.actions.secrets.fetch(), (secrets) => {
        if (!secrets.length) return h('i.fa.fa-spinner.fa-pulse.fa-2x')
        else return secrets.map((secret) => (
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
                  imageUrl: api.about.obs.imageUrl,
                  onClick: (id) => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
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
      })
    ])
  }
}
