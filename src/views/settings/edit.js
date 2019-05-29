const { h, resolve, Value, computed, when } = require('mutant')

const LocalPeers = require('./network/localPeers')
const AccountEdit = require('./account/edit')

const NETWORK = 'network'
const ACCOUNT = 'account'

module.exports = function SettingsEdit (opts) {
  const {
    feedId,
    onCancel = console.log,
    avatar = identity,
    name = identity,
    publish,
    blobUrl,
    addBlob,
    localPeers
  } = opts

  const state = {
    tab: Value(ACCOUNT),
    isSaving: Value(false),
    name: Value(),
    avatar: Value()
  }


  return h('Settings', [
    h('h1', 'Settings'),
    h('section.body', [
      Tabs(state),
      computed(state.tab, tab => {
        switch (tab) {
          case ACCOUNT: return [
            AccountEdit({
              name,
              avatar,
              addBlob,
              feedId,
              blobUrl,
              onCancel,
              state
            })
          ]
          case NETWORK: return [
            LocalPeers({
              name,
              avatar,
              localPeers
            })
          ]
        }
      })
    ]),
    h('section.actions', when(state.isSaving,
      h('div.spinner', [ h('i.fa.fa-spinner.fa-pulse') ]),
      h('div.buttons', [
        h('button -subtle', { 'ev-click': onCancel }, 'Cancel'),
        h('button -primary', { 'ev-click': () => {
          state.isSaving.set(true)

          const params = {
            name: resolve(state.name),
            image: resolve(state.avatar)
          }

          publish({ type: 'about', about: feedId, ...params }, (err, about) => {
            state.isSaving.set(false)
            if (err) throw err
            else onCancel()
          })
        } }, 'Save')
      ])
    ))
  ])
}

function Tabs (state) {
  return computed(state.tab, tab => {
    return h('div.tabs', [
      h('div.tab',
        tab === ACCOUNT ? { className: '-selected' } : { 'ev-click': () => state.tab.set(ACCOUNT) },
        [ ACCOUNT ]
      ),
      h('div.tab',
        tab === NETWORK ? { className: '-selected' } : { 'ev-click': () => state.tab.set(NETWORK) },
        [ NETWORK ]
      )
    ])
  })
}


function identity (id) { return id }
