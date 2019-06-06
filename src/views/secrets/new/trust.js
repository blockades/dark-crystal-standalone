const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Peers = require('../../../components/Peers')
const AddPeer = require('../../../components/AddPeer')
const Button = require('../../../components/Button')
const Slider = require('../../../components/Slider')
const Backward = require('../../../components/Backward')
const ProgressBar = require('../../../components/ProgressBar')

exports.gives = nest('views.secrets.new.trust')

exports.needs = nest({
  'router.sync.goBack': 'first',
  'router.sync.goTo': 'first',
  'about.obs.imageUrl': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('views.secrets.new.trust', secretsNew)

  function secretsNew (request) {
    const { state } = request

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section', [
          h('div.fieldset.trust', [
            h('div.field.quorum', [
              h('label.quorum', 'Quorum'),
              h('div.description', [
                h('p.small', 'To recover the secret you entered, you will need to collect a quorum of shards from your chosen custodians.')
              ]),
              Slider({
                required: true,
                collection: state.peers,
                value: state.quorum,
                title: 'Choose a quorum of custodians required to reassemble the secret'
              })
            ]),
            h('div.field.trust', [
              h('label.trust', 'Trust Indicator'),
              ProgressBar({
                maximum: computed(state.peers, (peers) => peers.length * 100),
                value: computed([state.quorum, state.peers], (quorum, peers) => (peers.length / quorum) * 100),
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

