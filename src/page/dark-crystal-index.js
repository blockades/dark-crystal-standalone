const nest = require('depnest')
const pull = require('pull-stream')
const Scuttle = require('scuttle-dark-crystal')

const {
  h,
  Value,
  computed,
  when,
  onceTrue,
  Array: MutantArray,
  Struct
} = require('mutant')

// Views
const CrystalsIndex = require('../views/crystals/index')
const CrystalsNew = require('../views/crystals/new')
const CrystalsShow = require('../views/crystals/show')
const FriendsCrystalsIndex = require('../views/friends/crystals/index')
const FriendsCrystalsShow = require('../views/friends/crystals/show')
const FriendsIndex = require('../views/friends/index')
const FriendsShow = require('../views/friends/show')
const ForwardNew = require('../views/forward/new')
const SettingsEdit = require('../views/settings/edit')

// Modes / Tabs
const MINE = 'My Crystals'
const OTHERS = 'Others Shards'
const FORWARDS = 'Others Crystals'

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.darkCrystalIndex': true
})

exports.needs = nest({
  'about.async.suggest': 'first',
  'about.html.avatar': 'first',
  'about.obs.name': 'first',
  'app.html.modal': 'first',
  'router.sync.goTo': 'first',
  'keys.sync.id': 'first',
  'sbot.obs.connection': 'first',
  'blob.sync.url': 'first',
  'message.async.publish': 'first',
  'sbot.async.addBlob': 'first',
  'sbot.obs.localPeers': 'first'
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.darkCrystalIndex': darkCrystalIndexPage
  })

  function menuItem () {
    return h('a', {
      style: { order: 1 },
      'ev-click': () => api.router.sync.goTo({ page: 'dark-crystal' })
    }, '/dark-crystal')
  }

  function darkCrystalIndexPage (location) {
    const server = api.sbot.obs.connection
    const scuttle = Scuttle(server)

    const state = Struct({
      ready: Value(false),
      mode: Value(MINE),
      abouts: MutantArray([])
    })

    // %%TODO%% extract into separate file
    onceTrue(server, server => {
      updateStore()
      watchForUpdates()

      function aboutsQuery () {
        return {
          query: [{
            $filter: {
              value: {
                author: server.id,
                timestamp: { $gt: 0 },
                content: {
                  type: 'about',
                  about: server.id
                }
              }
            }
            // %%TODO%%: Work out why reduce isn't working?
            // $map: ['value', 'content', 'type'],
            // $reduce: { $count: true }
          }]
        }
      }

      function updateStore () {
        pull(
          server.query.read(Object.assign({}, aboutsQuery(), { live: false })),
          pull.collect(
            (err, abouts) => {
              if (err) throw err
              else {
                state.abouts.set(abouts)
                state.ready.set(true)
              }
            }
          )
        )
      }

      function watchForUpdates () {
        pull(
          server.query.read(Object.assign({}, aboutsQuery(), { old: false, live: true })),
          pull.filter(m => !m.sync),
          pull.drain(m => updateStore())
        )
      }
    })

    return h('DarkCrystal -index', { title: '/dark-crystal' }, [
      h('div.header', [
        h('h1', 'Dark Crystal'),
        h('i.fa.fa-diamond.fa-lg'),
        when(state.ready, Settings({ abouts: state.abouts, scuttle }))
      ]),
      when(state.ready,
        [
          h('section.picker', [MINE, OTHERS, FORWARDS].map(m => {
            return h('div', {
              'ev-click': () => state.mode.set(m),
              className: computed(state.mode, mode => mode === m ? '-active' : '')
            }, m)
          })),
          MySecrets({ mode: state.mode, scuttle }),
          OthersShards({ mode: state.mode, scuttle }),
          FriendsCrystals({ mode: state.mode, scuttle })
        ],
        h('i.fa.fa-spinner.fa-pulse.fa-5x')
      )
    ])
  }

  function Settings ({ scuttle, abouts }) {
    const isOpen = Value(false)

    const view = SettingsEdit({
      onCancel: () => isOpen.set(false),
      feedId: api.keys.sync.id(),
      avatar: api.about.html.avatar,
      name: api.about.obs.name,
      publish: api.message.async.publish,
      blobUrl: api.blob.sync.url,
      addBlob: api.sbot.async.addBlob,
      localPeers: api.sbot.obs.localPeers
    })

    const modal = api.app.html.modal(view, { isOpen })

    return [
      h('i.fa.fa-cog.fa-2x', { 'ev-click': () => isOpen.set(true), title: 'Settings' }),
      // %%TODO%%: integrate a tooltip or flash alert system to begin to show warning messages to users...
      computed([abouts], abouts => {
        if (abouts.length === 0) return h('i.fa.fa-warning')
        else return null
      }),
      modal
    ]
  }

  function MySecrets ({ mode, scuttle }) {
    const view = Value('Rabbits!')
    const isOpen = Value(false)
    const modal = api.app.html.modal(view, { isOpen })

    function showCrystal (opts) {
      view.set(CrystalsShow(Object.assign({}, opts, {
        scuttle,
        onCancel: () => isOpen.set(false),
        avatar: api.about.html.avatar,
        name: api.about.obs.name
      })))
      isOpen.set(true)
    }

    function newCrystal (opts) {
      view.set(CrystalsNew(Object.assign({}, opts, {
        scuttle,
        onCancel: () => isOpen.set(false),
        onSubmit: () => isOpen.set(false),
        suggest: { about: api.about.async.suggest },
        name: api.about.obs.name,
        avatar: api.about.html.avatar
      })))
      isOpen.set(true)
    }

    return h('section.content', { className: computed(mode, m => m === MINE ? '-active' : '') }, [
      h('CrystalsIndex', [ CrystalsIndex({ scuttle, showCrystal, newCrystal }) ]),
      modal
    ])
  }

  function OthersShards ({ mode, scuttle }) {
    const view = Value('Dogs are cool')
    const isOpen = Value(false)
    const modal = api.app.html.modal(view, { isOpen })

    function showFriend (opts) {
      view.set(FriendsShow(Object.assign({}, opts, {
        avatar: api.about.html.avatar,
        name: api.about.obs.name,
        scuttle,
        newForward,
        onCancel: () => isOpen.set(false)
      })))
      isOpen.set(true)
    }

    function newForward (opts) {
      view.set(ForwardNew(Object.assign({}, opts, {
        avatar: api.about.html.avatar,
        name: api.about.obs.name,
        suggest: { about: api.about.async.suggest },
        scuttle,
        onCancel: () => isOpen.set(false)
      })))
      isOpen.set(true)
    }

    return h('section.content', { className: computed(mode, m => m === OTHERS ? '-active' : '') }, [
      FriendsIndex({
        scuttle,
        avatar: api.about.html.avatar,
        name: api.about.obs.name,
        showFriend
      }),
      modal
    ])
  }

  function FriendsCrystals ({ mode, scuttle }) {
    const view = Value('Cats always make a comeback!')
    const isOpen = Value(false)
    const modal = api.app.html.modal(view, { isOpen })

    function friendsCrystal (opts) {
      view.set(FriendsCrystalsShow(Object.assign({}, opts, {
        scuttle,
        avatar: api.about.html.avatar,
        name: api.about.obs.name,
        onCancel: () => isOpen.set(false)
      })))
      isOpen.set(true)
    }

    return h('section.content', { className: computed(mode, m => m === FORWARDS ? '-active' : '') }, [
      FriendsCrystalsIndex({
        scuttle,
        avatar: api.about.html.avatar,
        name: api.about.obs.name,
        modal: api.app.html.modal,
        friendsCrystal
      }),
      modal
    ])
  }
}
