const nest = require('depnest')
const pull = require('pull-stream')
const pullParamap = require('pull-paramap')
const { isFeedId } = require('ssb-ref')
const { get, set, transform, sortBy } = require('lodash')

const Scuttle = require('scuttle-dark-crystal')
const isRequest = require('scuttle-dark-crystal/isRequest')
const isReply = require('scuttle-dark-crystal/isReply')

const { h, Array: MutantArray, throttle } = require('mutant')

pull.paramap = pullParamap

const RECEIVED = 'received'
const REQUESTED = 'requested'
const RETURNED = 'returned'

exports.gives = nest('app.actions.shards.fetch')

exports.needs = nest({
  'sbot.obs.connection': 'first'
})

// %%TODO%% Reorganise this dataset so that the view can easily render based on 3 tabs:
//
// 1. Requested - shards with an outstanding request
// 2. Received - shards we're holding but haven't received a request
// 3. Returned - shards we've sent (that don't have a pending outstanding request...)
//
// RETHINK:
// We want to be able to render a list of the shard's request / reply history
// We want to be able to highlight outstanding requests
// There is no 'final' 'returned' state of a shard with ephemeral returns - shards can be returned multiple times
// A return simply tells those involved that it was sent back at least once
//
// If the peersShow view displays a list of the shards, organised by their current 'state', either received or requested
// We want to make 'requested' shards prominent in the interface
// We want to have a notifications appear when a shard has been requested
// We want to make 'received' shards less prominent but still visible, as there is no immediate action to be taken by the user
// We want to make 'requested' shards return to 'received' when they have been sent
// We want to make a 'forward request' _really prominent_ and add warnings to get the user to check out of band

exports.create = (api) => {
  return nest('app.actions.shards.fetch', fetch)

  // store is an observable that returns an array of structure:
  // [
  //   { feedId, shards: [ { rootId, receivedAt, state  }, { rootId, receivedAt, state  }  ]  },
  //   { feedId, shards: [ { rootId, receivedAt, state  }, ...  ]  },
  // ]

  var store = null

  function fetch (props = {}) {
    const { limit = 100 } = props

    const scuttle = Scuttle(api.sbot.obs.connection)

    if (!store) {
      store = MutantArray([])
      updateStore()
    }

    watchForUpdates()

    return throttle(store, limit)

    function updateStore () {
      const records = {
        // [author]: {
        //   [rootId]: {
        //     receivedAt,
        //     state
        //   }
        // }
      }

      pull(
        scuttle.shard.pull.fromOthers({ reverse: true, live: false  }),
        pull.paramap((shard, done) => {
          const id = shard.key
          const author = get(shard, 'value.author')
          const root = get(shard, 'value.content.root')

          set(records, [author, root, 'id'], id)
          set(records, [author, root, 'sentAt'], new Date(shard.value.timestamp).toLocaleDateString())

          pull(
            scuttle.root.pull.backlinks(root, { reverse: true  }),
            pull.filter(msg => get(msg, 'value.content.root') === root), // root.pull.backlinks should do this for us
            pull.collect((err, thread) => {
              if (err) return done(err)

              var state
              var request = thread.find(isRequest)
              // mix: TODO this is not necessarily an unanswered request..., it's just the most recent (backlinks reverse: true)

              if (thread.some(isReply)) state = RETURNED
              else if (request) {
                state = REQUESTED
                set(records, [author, root, 'request'], request)
              } else state = RECEIVED
              set(records, [author, root, 'state'], state)

              // mix: TODO this is really crude
              // If we ensure invites and replies have `branch` we can sort accurately (might already have?)
              // and make sure we're replying to the most recent request (will be more relevant with ephemeral keys)
              // e.g. sort(thread).reverse().find(isRequest) // most recent request (but is it unanswered?)

              done(null)
            })
          )
        }, 10),
        pull.collect((err) => {
          if (err) return console.error(err)

          var recordsArray = transform(records, (acc, shards, id) => {
            acc.push({
              id,
              shards: transform(shards, (acc, state, root) => {
                acc.push(Object.assign({ root }, state))
              }, [])
            })
          }, [])

          store.set(sortBy(recordsArray, [sortFor(REQUESTED), sortFor(RECEIVED)]))
        })
      )
    }

    function watchForUpdates () {
      pull(
        scuttle.shard.pull.fromOthers({ live: true, old: false  }),
        pull.filter(m => !m.sync),
        pull.drain(m => updateStore())
      )

      pull(
        scuttle.recover.pull.requests(null, { live: true, old: false  }),
        pull.filter(m => !m.sync),
        pull.drain(m => updateStore())
      )

      pull(
        scuttle.recover.pull.replies(null, { live: true, old: false  }),
        pull.filter(m => !m.sync),
        pull.drain(m => updateStore())
      )
    }
  }
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
