const nest = require('depnest')
const pull = require('pull-stream')
const { clipboard } = require('electron')
const { h, computed, Value } = require('mutant')

const Tabs = require('../../components/Tabs')
const Peers = require('../../components/Peers')
const Secret = require('../../components/Secret')
const History = require('../../components/History')
const Backward = require('../../components/Backward')

exports.gives = nest('app.views.secrets.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.obs.imageUrl': 'first',
})

exports.create = (api) => {
  return nest('app.views.secrets.show', secretsShow)

  function secretsShow (request) {
    const { secret } = request
    console.log(secret)

    const state = {
      tab: Value('history')
    }

    return h('Secrets -show', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section.details', [
          h('div.local', [
            h('div.image', [
              h('i.fa.fa-picture-o.fa-5x')
            ]),
            h('div.name', [
              h('span.name', secret.name)
            ]),
          ]),
          h('div.remote', [
            Peers({
              peers: secret.recipients,
              imageUrl: api.about.obs.imageUrl,
              onClick: (id) => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
            })
          ])
        ]),
        h('section.tabs', [
          Tabs({ tabs: [
            { name: 'history', onClick: () => state.tab.set('history'), class: computed(state.tab, tab => tab === 'history' ? 'active' : '') },
            { name: 'secret', onClick: () => state.tab.set('secret'), class: computed(state.tab, tab => tab === 'secret' ? 'active' : '') }
          ] })
        ]),
        computed(state.tab, tab => {
          if (tab === 'history') return History()
          else if (tab === 'secret')  return Secret({ secret: secret.secret })
          else return null
        })
      ])
    ])
  }
}
