const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Peers = require('../../../components/Peers')
const AddPeer = require('../../../components/AddPeer')
const Button = require('../../../components/Button')
const Slider = require('../../../components/Slider')
const Backward = require('../../../components/Backward')

exports.gives = nest('app.views.secrets.new.trust')

exports.needs = nest({
  'router.sync.goBack': 'first',
  'router.sync.goTo': 'first',
  'about.html.avatar': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.new.trust', secretsNew)

  function secretsNew (request) {
    const { state } = request

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section', [
          h('div.fieldset.trust', [
            h('div.field.custodians', [
              h('label.custodians', 'Custodians'),
              h('div.description', [
                h('p', 'Each custodian you select will receive a fully encrypted private message containing a piece of the secret.')
              ]),
              AddPeer({
                peers: state.peers,
                avatar: api.about.html.avatar,
                suggest: { about: api.about.async.suggest },
                placeholder: 'Select the custodians of your secret from your social network',
                max: 12
              }),
              Peers({
                peers: state.peers,
                avatar: api.about.html.avatar
              })
            ]),
            h('div.field.quorum', [
              h('label.quorum', 'Quorum'),
              h('div.description', [
                h('p', 'To recover the secret you entered, you will need to collect a quorum of shards from your chosen custodians.'),
                h('p', 'Setting a high quorum implies a low level of trust.'),
                h('p', 'Setting a low quorum implies a high level of trust.'),
              ]),
              Slider({
                required: true,
                collection: state.peers,
                value: state.quorum,
                title: 'Choose a quorum of custodians required to reassemble the secret'
              })
            ])
          ])
        ]),
        h('div.actions', [
          computed([state.quorum, state.peers], (quorum, peers) => (
            !!quorum && !!peers.length
            ? Button({
              text: 'Next',
              onClick: () => api.router.sync.goTo({ path: `/secrets/new/submit`, state })
            })
            : null
          ))
        ])
      ])
    ])
  }
}

