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
  'about.html.avatar': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new.submit', secretsNew)

  function secretsNew (request) {
    const { state } = request

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section', [
          h('div.submission', [
            h('strong', 'Review your submission'),
            h('div.field', [
              h('label', 'Name'),
              h('input', { attributes: { readonly: true, value: resolve(state.secretName) } }),
            ]),
            h('div.field', [
              h('label', 'Custodians'),
              Peers({
                peers: state.peers,
                avatar: api.about.html.avatar
              }),
            ]),
            h('div.field', [
              h('label', 'Quorum'),
              h('input', { attributes: { readonly: true, value: resolve(state.quorum) } }),
            ]),
            h('div.field', [
              h('label', 'Secret'),
              Secret({
                secret: resolve(state.secret),
                withActions: false
              })
            ])
          ])
        ]),
        h('div.actions', [
          computed(state, state => {
            var canSubmit = state.secretName
              && state.secret
              && !!state.peers.length
              && state.quorum
              && state.peers.length >= state.quorum

            return canSubmit
              ? Button({ text: 'Share' })
              : null
          })
        ])
      ])
    ])
  }
}
