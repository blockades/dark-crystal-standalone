const nest = require('depnest')
const { h, computed, resolve } = require('mutant')

const Button = require('../../../components/Button')
const Secret = require('../../../components/Secret')
const Slider = require('../../../components/Slider')
const Backward = require('../../../components/Backward')
const Peers = require('../../../components/Peers')

exports.gives = nest('app.views.secrets.new.submit')

exports.needs = nest({
  'app.actions.secrets.create': 'first',
  'router.sync.goBack': 'first',
  'router.sync.goTo': 'first',
  'about.obs.imageUrl': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new.submit', secretsNew)

  function secretsNew (request) {
    const { state } = request

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section.submit', [
          h('div.container', [
            h('strong', 'Review your submission'),
            h('div.field', [
              h('label', 'Name'),
              h('input', { attributes: { readonly: true, value: resolve(state.secretName) } }),
            ]),
            h('div.field', [
              h('label', 'Custodians'),
              Peers({
                peers: state.peers,
                imageUrl: api.about.obs.imageUrl,
                onClick: (id) => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
              }),
            ]),
            h('div.field', [
              h('label', 'Quorum'),
              h('input', { attributes: { readonly: true, value: resolve(state.quorum) } }),
            ]),
            h('div.field.secret', [
              h('label', 'Secret'),
              Secret({
                secret: resolve(state.secret),
                withActions: false
              })
            ])
          ])
        ]),
        h('div.actions', [
          computed(state, params => {
            var canSubmit = params.secretName
              && params.secret
              && !!params.peers.length
              && params.quorum
              && params.peers.length >= params.quorum

            return canSubmit
              ? Button({
                  text: 'Share',
                  onClick: (e) => api.app.actions.secrets.create({ params })
                })
              : null
          })
        ])
      ])
    ])
  }
}
