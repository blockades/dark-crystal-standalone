const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Button = require('../../../components/Button')
const Backward = require('../../../components/Backward')

exports.gives = nest('app.views.secrets.new.name')

exports.needs = nest({
  'app.actions.secrets.new': 'first',
  'router.sync.goBack': 'first',
  'router.sync.goTo': 'first',
  'about.html.avatar': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new.name', secretsNew)

  function secretsNew (request) {
    const state = Struct({
      secretName: null,
      secret: null,
      peers: MutantArray([]),
      quorum: 2,
      image: null
    })

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section', [
          h('div.fieldset', [
            h('div.field', [
              h('label.name', 'Name'),
              h('div.description', [
                h('p', 'Enter a name for your secret. '),
                h('p', 'This is for your reference only. '),
                h('p', 'Information stored is fully encrypted and completely private. ')
              ]),
              h('input.name', {
                required: true,
                placeholder: 'For your reference only (this is private)',
                'ev-input': (e) => state.secretName.set(e.target.value)
              })
            ])
          ])
        ]),
        h('div.actions', [
          computed(state.secretName, name => (
            !!name && !!name.length
              ? Button({
                text: 'Next',
                onClick: () => api.router.sync.goTo({ path: `/secrets/new/secret`, state })
              })
              : null
          ))
        ])
      ])
    ])
  }
}
