const pull = require('pull-stream')
const { h, when, computed, Array: MutantArray, Value, Struct } = require('mutant')
const getContent = require('ssb-msg-content')

const isRitual = require('scuttle-dark-crystal/isRitual')
const isShard = require('scuttle-dark-crystal/isShard')
const isRequest = require('scuttle-dark-crystal/isRequest')
const isReply = require('scuttle-dark-crystal/isReply')

const Secret = require('../component/secret')
const ShardsSummary = require('./shards/summary')
const ShardsRecords = require('./shards/records')

const DETAILS = 'details'
const SHARDS = 'shards'
const SECRET = 'secret'

module.exports = function CrystalsShow (opts) {
  const {
    root,
    scuttle,
    avatar,
    name,
    onCancel
  } = opts

  const rootId = root.key
  const { name: crystalName } = getContent(root)

  const store = Struct({
    ready: Value(false),
    ritual: Value(),
    shardRecords: MutantArray([]),
  })

  const state = {
    tab: Value(DETAILS),
    quorumMet: Value(false),
    hasRequests: Value(false),
    numReplies: Value(0),
    secret: Value(),
    secretLabel: Value(),
    error: Value()
  }

  updateStore()
  watchForUpdates()

  return h('CrystalsShow', { title: '' }, [
    h('h1', crystalName),
    h('section.body', [
      Tabs(state),
      computed(state.tab, tab => {
        switch (tab) {
          case DETAILS: return ShardsSummary({
            ritual: store.ritual,
            shardRecords: store.shardRecords,
            scuttle,
            avatar,
            state
          })
          case SHARDS: return ShardsRecords({
            root,
            records: store.shardRecords,
            scuttle,
            avatar,
            state,
            name
          })
          case SECRET: return SecretTab({
            scuttle,
            state,
            rootId
          })
        }
      })
    ]),
    h('section.actions', [ h('button -primary', { 'ev-click': onCancel }, 'Cancel') ])
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

function Tabs (state) {
  return computed(state.tab, tab => {
    return h('div.tabs', [
      h('div.tab',
        tab === DETAILS ? { className: '-selected' } : { 'ev-click': () => state.tab.set(DETAILS) },
        [ DETAILS ]
      ),
      h('div.tab',
        tab === SHARDS ? { className: '-selected' } : { 'ev-click': () => state.tab.set(SHARDS) },
        [ SHARDS ]
      ),
      when(state.quorumMet,
        h('div.tab',
          tab === SECRET ? { className: '-selected' } : { 'ev-click': () => state.tab.set(SECRET) },
          [ SECRET ]
        ),
        null
      )
    ])
  })
}


function SecretTab ({ scuttle, state, rootId }) {
  const view = Value()

  scuttle.recover.async.recombine(rootId, (err, secret) => {
    if (err) state.error.set(err)
    else {
      let container = h('div.secret', [
        h('div.section', [ Secret({ secret: secret.secret, secretLabel: secret.label }) ])
      ])
      view.set(container)
    }
  })

  return view
}
