const { h, Value, computed, when } = require('mutant')
const pull = require('pull-stream')

// NOTE - these are currently connect to mcss + state switching
const RECEIVED = 'received'
const REQUESTED = 'requested'
const RETURNED = 'returned'

// these are only bound to state switching
const SHARDS = 'Shards'
const FORWARD = 'Advanced'

module.exports = function FriendsShow (opts) {
  const {
    avatar = identity,
    name = identity,
    friends, // obs
    selectedFriend, // obs
    newForward = noop,
    onCancel,
    scuttle
  } = opts

  return h('DarkCrystalFriendsShow', computed([friends, selectedFriend], (friends, feedId) => {
    const i = friends.findIndex(friend => friend.feedId === feedId)
    function move (newIndex) {
      selectedFriend.set(friends[newIndex].feedId)
    }

    const state = {
      feedId,
      tab: Value(SHARDS),
      shards: friends[i].shards,
      forwards: Value()
    }

    getForwards({ scuttle, state })

    return [
      i !== 0 // PREVIOUS friend <
        ? h('section.left', { 'ev-click': () => move(i - 1) }, h('i.fa.fa-chevron-left'))
        : h('section.left.-disabled', h('i.fa.fa-chevron-left')),
      h('section.body', [
        h('div.avatar', avatar(feedId, 6)),
        h('div.name', name(feedId)),
        Tabs(state),
        computed(state.tab, tab => {
          switch (tab) {
            case SHARDS: return [
              h('div.shards', [
                state.shards.map(shard => ShardDetailed({ scuttle, shard }))
              ])
            ]

            case FORWARD: return [
              h('div.forwards', [
                h('div.history', [
                  h('div.heading', 'history of shards forwarded'),
                  computed(state.forwards, forwards => {
                    if (!forwards) return 'you have not forwarded any of this users shards to anyone'

                    return Object.keys(forwards)
                      .map(feedId => ForwardDetail({ feedId, forwards: forwards[feedId], name, avatar }))
                  })
                ]),
                h('div.actions', [
                  h('button', { 'ev-click': (e) => newForward(state) }, 'Forward all shards')
                ])
              ])
            ]
          }
        }),
        h('div.actions', [
          h('button -subtle', { 'ev-click': onCancel }, 'Cancel')
        ])
      ]),
      i !== friends.length - 1 // NEXT friend >
        ? h('section.right', { 'ev-click': () => move(i + 1) }, h('i.fa.fa-chevron-right'))
        : h('section.right.-disabled', h('i.fa.fa-chevron-right'))
    ]
  }))
}

function Tabs (state) {
  return computed(state.tab, tab => {
    return h('div.tabs', [
      h('div.tab',
        tab === SHARDS ? { className: '-selected' } : { 'ev-click': () => state.tab.set(SHARDS) },
        [ SHARDS, h('span', `(${state.shards.length})`) ]
      ),
      h('div.tab',
        tab === FORWARD ? { className: '-selected' } : { 'ev-click': () => state.tab.set(FORWARD) },
        [ FORWARD ]
      )
    ])
  })
}

function ShardDetailed ({ scuttle, shard }) {
  const { receivedAt, state, request } = shard

  switch (state) {
    case RECEIVED:
      return h('div.shard -received', [
        h('div.rts', receivedAt),
        h('button', { disabled: true, style: { visibility: 'hidden' } }, 'Return Shard')
        // TODO - ability to return without a request
      ])

    case REQUESTED:
      const returning = Value(false)
      const returnShard = () => {
        returning.set(true)
        scuttle.recover.async.reply(request, (err, data) => {
          if (err) throw err

          returning.set(false)
          console.log('shard returned', data)
        })
      }

      return h('div.shard -requested', [
        h('div.rts', receivedAt),
        when(returning,
          h('div.info'),
          h('div.info', [
            h('i.fa.fa-warning'), ' - shard requested'
          ])
        ),
        when(returning,
          h('i.fa.fa-spinner.fa-pulse'),
          h('button -primary', { 'ev-click': returnShard }, 'Return Shard')
        )
      ])

    case RETURNED:
      return h('div.shard -returned', [
        h('div.rts', receivedAt),
        h('div.info', '(returned)')
      ])
  }
}

function ForwardDetail ({ feedId, forwards, name, avatar }) {
  return h('div.forward', [
    h('div.avatar', avatar(feedId, 2)),
    h('div.message', [
      `forwarded ${forwards.length} shards to `,
      name(feedId)
    ])
  ])
}

function getForwards ({ scuttle, state }) {
  const keys = state.shards.map(s => s.root)

  pull(
    scuttle.forward.pull.toOthers(),
    pull.filter(m => keys.includes(m.value.content.root)),
    pull.collect((err, forwards) => {
      if (err) return console.error(err)
      if (!forwards || !forwards.length) return

      const myId = forwards[0].value.author

      // group by recipients
      const groupedForwards = forwards.reduce((acc, forward) => {
        const recp = getRecp(forward, myId)
        if (!acc[recp]) acc[recp] = []

        // TODO dedup multiple forwards of same shard
        // and maybe disable repeat forwarding of same shards in scuttle-dc

        acc[recp].push(forward)
        return acc
      }, {})

      state.forwards.set(groupedForwards)
    })
  )
}

function getRecp (forwardMsg, myId) {
  return forwardMsg.value.content.recps
    .find(feedId => feedId !== myId)
}

function identity (id) { return id }
function noop () {}
