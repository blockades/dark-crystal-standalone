const nest = require('depnest')
const { h, computed, Array: MutantArray, map, Struct } = require('mutant')

const Peers = require('../../../components/Peers')
const AddPeer = require('../../../components/AddPeer')
const Button = require('../../../components/Button')
const Slider = require('../../../components/Slider')
const Backward = require('../../../components/Backward')
const ProgressBar = require('../../../components/ProgressBar')

exports.gives = nest('views.secrets.new.custodians')

exports.needs = nest({
  'router.sync.goBack': 'first',
  'router.sync.goTo': 'first',
  'about.obs.imageUrl': 'first',
  'about.async.suggest': 'first'
})

exports.create = (api) => {
  return nest('views.secrets.new.custodians', secretsNew)

  function secretsNew (request) {
    const { state } = request

    return h('Secrets -new', [
      Backward({ routeTo: api.router.sync.goBack }),
      h('div.main', [
        h('section', [
          h('div.fieldset', [
            h('div.field.custodians', [
              h('label.custodians', 'Custodians'),
              h('div.description', [
                h('p.small', 'Each custodian you select will receive a fully encrypted private message containing a piece of the secret.')
              ]),
              AddPeer({
                peers: state.peers,
                suggest: { about: api.about.async.suggest },
                placeholder: 'Select the custodians of your secret from your social network',
                max: 12
              }),
              Peers({
                peers: state.peers,
                imageUrl: api.about.obs.imageUrl,
                onClick: (id) => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
              })
            ])
          ])
        ]),
        h('div.actions', [
          computed([state.quorum, state.peers], (quorum, peers) => (
            !!quorum && !!peers.length
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

