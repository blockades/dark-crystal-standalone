const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Button = require('../../../components/Button')
const Backward = require('../../../components/Backward')
const Secret = require('../../../components/Secret')

exports.gives = nest('app.views.secrets.new.secret')

exports.needs = nest({
  'router.sync.goBack': 'first',
  'router.sync.goTo': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new.secret', secretsNew)

  function secretsNew (request) {
    const { state } = request

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section', { title: 'Enter the secret / key you wish to back-up' }, [
          h('div.fieldset.secret', [
            h('div.field.custodians', [
              h('label.secret', 'Secret'),
              h('div.description', [
                h('p.small', 'Enter the secret / key you wish to back-up.'),
                h('p.small', 'This secret will be cryptographically split into multiple pieces.'),
                h('p.small', 'Without quorum, these pieces reveal nothing about the secret text you enter here.'),
              ]),
              h('textarea.secret', {
                required: true,
                value: state.secret,
                'ev-input': (e) => state.secret.set(e.target.value)
              })
            ])
          ])
        ]),
        h('div.actions', [
          computed(state.secret, secret => (
            !!secret && !!secret.length
              ? Button({
                text: 'Next',
                onClick: () => api.router.sync.goTo({ path: `/secrets/new/trust`, state })
              })
              : null
          ))
        ])
      ])
    ])
  }
}
