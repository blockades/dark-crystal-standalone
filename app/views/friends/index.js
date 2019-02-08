const pull = require('pull-stream')
const pullParamap = require('pull-paramap')
const { h, Value, computed } = require('mutant')
const set = require('lodash.set')
const transform = require('lodash.transform')
const sortBy = require('lodash.sortby')
const getContent = require('ssb-msg-content')
const isRequest = require('scuttle-dark-crystal/isRequest')
const isReply = require('scuttle-dark-crystal/isReply')
// const sort = require('ssb-sort')

// const DarkCrystalShowShard = require('./show')

// NOTE - these are currently connect to mcss
const RECEIVED = 'received'
const REQUESTED = 'requested'
const RETURNED = 'returned'

module.exports = function FriendsIndex (opts) {
  const {
    avatar = identity,
    name = identity,
    showFriend = noop,
    scuttle
  } = opts

  const state = {
    isLoading: Value(true),
    friends: Value(),
    selectedFriend: Value()
  }

  const refresh = () => getRecords({ scuttle, state })
  watchForUpdates({ scuttle, refresh })
  refresh()

  return h('DarkCrystalFriendsIndex', [
    computed([state.isLoading, state.friends], (isLoading, friends) => {
      if (isLoading) return 'Loading...' // mix: TODO improve this!

      return friends.length > 0 ? friends.map(Friend) : h('p', 'You possess no shards')
    })
  ])

  function Friend ({ feedId, shards }) {
    return h('DarkCrystalFriendShards',
      {
        'ev-click': () => {
          state.selectedFriend.set(feedId)
          showFriend({ friends: state.friends, selectedFriend: state.selectedFriend })
        }
      },
      [
        h('div.avatar', avatar(feedId, 6)),
        h('div.name', name(feedId)),
        h('div.shards', shards.map(Shard))
      ]
    )
  }

  function Shard ({ root, receivedAt, state }) {
    return h('i.DarkCrystalShard.fa.fa-diamond', {
      title: `${receivedAt}\n${root}`,
      className: '-' + state
    })
  }
}

function getRecords ({ scuttle, state }) {
  const newRecords = {
    // [author]: {
    //   [shard]: { // shard.root
    //     receivedAt,
    //     state
    //   }
    // }
  }

  pull(
    // mix: TODO write a tighter query which gets only data needed
    scuttle.shard.pull.fromOthers({ reverse: true, live: false }),
    pullParamap((shard, done) => {
      const { root } = getContent(shard) // root is the unique key for a shard
      set(newRecords, [shard.value.author, root, 'receivedAt'], new Date(shard.timestamp).toLocaleDateString())

      pull(
        scuttle.root.pull.backlinks(root, { reverse: true }),
        pull.filter(m => getContent(m).root === root), // root.pull.backlinks should perhaps do this for us
        pull.collect((err, thread) => {
          if (err) return done(err)

          var state
          var request = thread.find(isRequest)
          // mix: TODO this is not necessarily an unanswered request..., it's just the most recent (backlinks reverse: true)

          if (thread.some(isReply)) state = RETURNED
          else if (request) {
            state = REQUESTED
            set(newRecords, [shard.value.author, root, 'request'], request)
          } else state = RECEIVED
          set(newRecords, [shard.value.author, root, 'state'], state)

          // mix: TODO this is really crude
          // If we ensure invites and replies have `branch` we can sort accurately (might already have?)
          // and make sure we're replying to the most recent request (will be more relevant with ephemeral keys)
          // e.g. sort(thread).reverse().find(isRequest) // most recent request (but is it unanswered?)

          done(null)
        })
      )
    }, 10), // "width 10"
    pull.collect((err) => {
      if (err) return console.error(err)

      // transform is a reduce for object. Iterator signature (acc, value, key, obj)
      var newRecordsArray = transform(newRecords, (acc, shards, feedId) => {
        acc.push({
          feedId,
          shards: transform(shards, (acc, state, root) => {
            acc.push(Object.assign({ root }, state))
          }, [])
        })
      }, [])

      // newRecordsArray Shape
      // [
      //   { feedId, shards: [ { rootId, receivedAt, state }, { rootId, receivedAt, state } ] },
      //   { feedId, shards: [ { rootId, receivedAt, state }, ... ] },
      // ]

      state.friends.set(sortBy(newRecordsArray, [sortFor(REQUESTED), sortFor(RECEIVED)]))
      state.isLoading.set(false)
    })
  )
}

function sortFor (state) {
  return function (a, b) {
    if (!a || !b) return 0

    const _a = a.shards.find(s => s.state === state)
    const _b = b.shards.find(s => s.state === state)

    if (_a && _b) return 0
    if (_a) return -1
    if (_b) return +1
    return 0
  }
}

function watchForUpdates ({ scuttle, refresh }) {
  // anything new comes in, just do a big of redraw

  // watch shards
  pull(
    scuttle.shard.pull.fromOthers({ live: true, old: false }),
    pull.filter(m => !m.sync),
    pull.drain(m => refresh())
  )

  // watch requests
  pull(
    scuttle.recover.pull.requests(null, { live: true, old: false }),
    pull.filter(m => !m.sync),
    pull.through(() => console.log('Request received')),
    pull.drain(m => refresh())
  )

  // watch replies
  pull(
    scuttle.recover.pull.replies(null, { live: true, old: false }),
    pull.filter(m => !m.sync),
    pull.through(() => console.log('DarkCrystal Reply!')),
    pull.drain(m => refresh())
  )
}

function identity (id) { return id }
function noop () {}
