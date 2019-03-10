const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Peers = require('../../components/Peers')
const AddPeer = require('../../components/AddPeer')
const Slider = require('../../components/Slider')
const Button = require('../../components/Button')

exports.gives = nest('app.views.secrets.new')

exports.needs = nest({
  'app.actions.secrets.new': 'first',
  'router.sync.goBack': 'first',
  'about.html.avatar': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new', secretsNew)

  function secretsNew (request) {
    const state = Struct({
      secretName: null,
      secret: null,
      peers: MutantArray([]),
      quorum: null,
      image: null
    })

    return h('Secrets -new', [
      h('div.left', [
        h('i.fa.fa-chevron-left', {
          'ev-click': api.router.sync.goBack
        }),
      ]),
      h('div.main', [
        h('section.name', { title: 'Enter a name for your reference only' }, [
          h('label.name', 'Name'),
          h('input.name', {
            required: true,
            placeholder: 'For your reference only (this is private)',
            'ev-input': ev => state.secretName.set(ev.target.value)
          })
        ]),
        h('section.secret', { title: 'Enter the secret / key you wish to back-up' }, [
          h('label.secret', 'Secret'),
          h('textarea.secret', {
            required: true,
            placeholder: 'Enter the secret / key you wish to back-up',
            value: state.secret,
            'ev-input': ev => state.secret.set(ev.target.value)
          })
        ]),
        h('section.custodians', [
          h('label.custodians', 'Custodians'),
          AddPeer({
            peers: state.peers,
            avatar: api.about.html.avatar,
            suggest: { about: api.about.async.suggest },
            placeholder: 'Select the custodians of your secret from your social network',
            max: 7
          }),
          Peers({ peers: state.peers, avatar: api.about.html.avatar })
        ]),
        Slider({
          required: true,
          collection: state.peers,
          fieldName: 'quorum',
          title: 'Choose a quorum of custodians required to reassemble the secret'
        }),
        h('section.actions', [
          computed(state, state => {
            var canSubmit = state.secretName
              && state.secret
              && !!state.peers.length
              && state.quorum

            if (canSubmit) return Button()
          })
        ])
      ])
    ])
  }
}

