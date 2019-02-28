const nest = require('depnest')
const pull = require('pull-stream')
const pullParamap = require('pull-paramap')
const { get, set, transform } = require('lodash')

const Scuttle = require('scuttle-dark-crystal')
const isShard = require('scuttle-dark-crystal/isShard')
const isRitual = require('scuttle-dark-crystal/isRitual')
const isRequest = require('scuttle-dark-crystal/isRequest')

const { h, Array: MutantArray, throttle } = require('mutant')

pull.paramap = pullParamap

exports.gives = nest('app.actions.crystals.fetch')

exports.needs = nest({
  'sbot.obs.connection': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('app.actions.crystals.fetch', fetch)

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
        //   recipients: [
        //     feedId: string
        //   ],
        //   shards: [
        //     {
        //       id: string,
        //       feedId: string,
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
        scuttle.root.pull.mine({ live: false }),
        pull.paramap((root, done) => {
          set(records, [root.key, 'name'], get(root, 'value.content.name'))
          set(records, [root.key, 'createdAt'], new Date(root.timestamp).toLocaleDateString())

          pull(
            scuttle.root.pull.backlinks(root.key, { live: false }),
            pull.collect((err, msgs) => {
              if (err) throw err
              if (msgs.length === 0) return done(null)

              const ritual = msgs.find(isRitual)
              set(records, [root.key, 'ritualId'], ritual.key)

              const shardMsgs = msgs.filter(isShard)
              const shards = shardMsgs.map(s => ({
                id: s.key,
                feedId: notMe(get(s, 'value.content')),
                shard: get(s, 'value.content').shard
              }))

              set(records, [root.key, 'recipients'], shards.map(s => s.feedId))
              set(records, [root.key, 'shards'], shards)

              done(null)
            })
          )
        }, 10),
        pull.collect((err, crystals) => {
          if (err) throw err
          var recordsArray = transform(records, (acc, value, key, obj) => {
            acc.push({ rootId: key, ...obj[key] })
          }, [])
          store.set(recordsArray)
        })
      )
    }

    function notMe (content) {
      return content.recps.find(recp => recp !== id)
    }

    function watchForUpdates () {
      pull(
        scuttle.root.pull.mine({ old: false, live: true }),
        pull.filter(m => !m.sync),
        pull.drain(m => updateStore())
      )
    }
  }
}
