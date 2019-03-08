const nest = require('depnest')
const pull = require('pull-stream')
// const { clipboard } = require('electron')
const { h, computed, Value } = require('mutant')

const Peers = require('../../components/Peers')
const Peer = require('../../components/Peer')

exports.gives = nest('app.views.peers.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.peers.show', peersShow)

  function peersShow (request, children = []) {
    const state = {
      id: request.peer.id
    }

    return h('Peers -show', [
      Peer({
        feed: state.id,
        avatar: api.about.html.avatar
      })
    ])
  }
}
