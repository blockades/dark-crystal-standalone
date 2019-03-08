const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Peers = require('../../components/Peers')
const AddPeer = require('../../components/AddPeer')

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
      h('section.form', [
        h('div.name', { title: 'Enter a name for your reference only' }, [
          h('label.name', 'Name'),
          h('input.name', {
            placeholder: 'For your reference only (this is private)',
            'ev-input': ev => state.name.set(ev.target.value)
          })
        ]),
        h('div.secret', { title: 'Enter the secret / key you wish to back-up' }, [
          h('label.secret', 'Secret'),
          h('textarea.name', {
            placeholder: 'Enter the secret / key you wish to back-up',
            value: state.secret,
            'ev-input': ev => state.secret.set(ev.target.value)
          })
        ]),
        h('div.custodians', [
          h('label.custodians', 'Custodians'),
          Peers({ peers: state.peers, avatar: api.about.html.avatar }, [
            AddPeer({
              peers: state.peers,
              avatar: api.about.html.avatar,
              suggest: { about: api.about.async.suggest },
              placeholder: 'Select custodians for your secret from your peers',
              max: 7
            })
          ])
        ]),
        computed(state.peers, peers => (
          h('div.quorum', { title: 'Choose a quorum of custodians required to reassemble the secret' }, [
            h('label.quorum', 'Quorum'),
            h('div.slider', [
              h('input.quorum', { type: 'range', min: 2, max: peers.length }),
              h('span.quorum', peers.length)
            ])
          ])
        ))
      ])
    ])
  }
}

