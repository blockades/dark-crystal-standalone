const nest = require('depnest')
const pull = require('pull-stream')
const pullParamap = require('pull-paramap')
const { isFeedId } = require('ssb-ref')
const { get, set, transform, pickBy, identity, omitBy } = require('lodash')

const Scuttle = require('scuttle-dark-crystal')
const isShard = require('scuttle-dark-crystal/isShard')
const isRitual = require('scuttle-dark-crystal/isRitual')
const isRequest = require('scuttle-dark-crystal/isRequest')
const isReply = require('scuttle-dark-crystal/isReply')

const { h, Array: MutantArray, throttle } = require('mutant')

pull.paramap = pullParamap

const PENDING = 'pending'
const REQUESTED = 'requested'
const RECEIVED = 'received'

exports.gives = nest('app.actions.secrets.fetch')

exports.needs = nest({
  'sbot.obs.connection': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('app.actions.secrets.fetch', fetch)

  var store = null

  function fetch (opts = {}) {
    const { limit = 100 } = opts

    const scuttle = Scuttle(api.sbot.obs.connection)
    const id = api.keys.sync.id()

    if (!store) {
      store = MutantArray([])
      updateStore()
    }

    watchForUpdates()

    return throttle(store, limit)

    function updateStore () {
      var records = {
        // [rootId]: {
        //   ritualId: string,
        //   name: string,
        //   quorum: integer,
        //   createdAt: datetime,
        //   recipients: [ feedId: string ],
        //   shards: [
        //     {
        //       id: string,
        //       feedId: string,
        //       encrypedShard: string,
        //       state: string,
        //       shard: string,
        //       requests: [
        //         { request },
        //         { request, reply }
        //       ]
        //     }
        //   ]
        // }
      }

      pull(
        scuttle.root.pull.mine({ live: false, reverse: true }),
        pull.paramap((root, done) => {
          set(records, [root.key, 'name'], get(root, 'value.content.name'))
          set(records, [root.key, 'createdAt'], new Date(root.timestamp).toLocaleDateString())

          pull(
            scuttle.root.pull.backlinks(root.key, { live: false }),
            pull.collect((err, msgs) => {
              if (err) throw err
              if (msgs.length === 0) return done(null)

              var ritual = msgs.find(isRitual)
              set(records, [root.key, 'ritualId'], ritual.key)

              var requestMsgs = msgs.filter(isRequest)
              var requests = requestMsgs.map(r => ({
                id: r.key,
                createdAt: new Date(r.value.timestamp).toLocaleDateString(),
                feedId: notMe(get(r, 'value.content.recps')),
              }))

              var replyMsgs = msgs.filter(isReply)
              var replies = replyMsgs.map(r => ({
                id: r.key,
                createdAt: new Date(r.value.timestamp).toLocaleDateString(),
                feedId: notMe(get(r, 'value.content.recps')),
                shard: get(r, 'value.content.body')
              }))

              var shardMsgs = msgs.filter(isShard)
              var shards = shardMsgs.map(s => {
                const { recps, shard: encryptedShard } = get(s, 'value.content')
                const feedId = notMe(recps)
                let state, shardReplies, shardRequests, returnedShard

                shardRequests = requests.filter(r => r.feedId === feedId)
                if (shardRequests.some(r => !!r)) {
                  shardReplies = replies
                    .filter(r => r.feedId === feedId)
                    .map(r => omitBy(r, isFeedId))
                  shardRequests.map(r => omitBy(r, isFeedId))
                  if (replies.some(r => !!r)) {
                    returnedShard = replies[0].shard // only gets the first one.. hmm
                    state = RECEIVED
                  }
                  else state = REQUESTED
                } else state = PENDING

                return pickBy({
                  id: s.key,
                  feedId,
                  encryptedShard,
                  state,
                  requests: shardRequests,
                  replies: shardReplies,
                  shard: returnedShard
                }, identity)
              })

              set(records, [root.key, 'recipients'], shards.map(s => s.feedId))
              set(records, [root.key, 'shards'], shards)

              done(null)
            })
          )
        }, 10),
        pull.collect((err, secrets) => {
          if (err) throw err
          var recordsArray = transform(records, (acc, value, key, obj) => acc.push({ id: key, ...obj[key] }), [])
          store.set(recordsArray)
        })
      )
    }

    function watchForUpdates () {
      pull(
        scuttle.root.pull.mine({ old: false, live: true }),
        pull.filter(m => !m.sync),
        pull.drain(m => updateStore())
      )
    }

    function notMe (recps) {
      return recps.find(recp => recp !== id)
    }
  }
}
