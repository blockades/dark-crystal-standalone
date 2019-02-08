const pull = require('pull-stream')
const { h, Array: MutantArray, Value, Struct } = require('mutant')
const getContent = require('ssb-msg-content')

const isRitual = require('scuttle-dark-crystal/isRitual')
const isShard = require('scuttle-dark-crystal/isShard')
const isRequest = require('scuttle-dark-crystal/isRequest')
const isReply = require('scuttle-dark-crystal/isReply')

const ShardsSummary = require('./shards/summary')
const ShardsRecords = require('./shards/records')

module.exports = function CrystalsShow ({ root, scuttle, avatar, modal }) {
  const rootId = root.key

  const store = Struct({
    ready: Value(false),
    ritual: Value(),
    shardRecords: MutantArray([])
  })

  updateStore()
  watchForUpdates()

  return h('DarkCrystalCrystalsShow', { title: '' }, [ // title blank stops everything inside getting a generic tooltip
    ShardsSummary({
      ritual: store.ritual,
      shardRecords: store.shardRecords,
      scuttle,
      modal,
      avatar
    }),
    ShardsRecords({
      root,
      records: store.shardRecords,
      scuttle,
      modal,
      avatar
    })
  ])

  function updateStore () {
    pull(
      scuttle.root.pull.backlinks(rootId, { live: false }),
      pull.collect(
        (err, msgs) => {
          if (err) throw err

          const ritual = msgs.find(isRitual)
          store.ritual.set(ritual)

          // recorvery is a "dialogue" between you and each friend
          // gather all messages related to each dialogue into a "record" of form { root, shard, requests, replies }
          const shardRecords = msgs
            .filter(isShard)
            .map(shard => joinInvitesAndReplies(shard, msgs))

          store.shardRecords.set(shardRecords)
        },
        () => store.ready.set(true)
      )
    )
  }

  function watchForUpdates () {
    // when any new messages come int related to this root, just get all the data again and write over it.
    // triggering a big render of who page...
    pull(
      scuttle.root.pull.backlinks(rootId, { live: true, old: false }), // old: false means start from now on
      pull.filter(m => !m.sync),
      // pull.through(m => console.log('NEW MSG! update the page!!!', m)),
      pull.drain(m => updateStore())
    )
  }
}

function getDialogue (shard, msgs) {
  const dialogueKey = recpsKey(shard)

  return msgs.filter(msg => recpsKey(msg) === dialogueKey)
}

function recpsKey (msg) {
  const content = getContent(msg)
  if (!content.recps) return null
  return content.recps.sort().join('')
}

function joinInvitesAndReplies (shard, msgs) {
  const dialogueMsgs = getDialogue(shard, msgs)

  return {
    shard,
    requests: dialogueMsgs.filter(isRequest),
    replies: dialogueMsgs.filter(isReply)
  }
}
