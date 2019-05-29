const { h, Value, when, computed } = require('mutant')

const Timestamp = require('../../component/timestamp')
const Secret = require('../../component/secret')

const FORWARDS = 'FORWARDS'
const SECRET = 'SECRET'

const RECOVERED = 'recovered'
const V1 = '1.0.0'
const V1_MESSAGE = 'This Dark Crystal was created using an old encryption scheme.' +
  'Our cryptographic sorcery cannot determine whether you have enough shares to ' +
  "reconstruct a valid secret, so you'll have to use your eyes! Once you have " +
  'received the correct quorum of shares, the secret will appear!'

module.exports = function DarkCrystalFriendsCrystalsShow (opts) {
  const {
    scuttle,
    avatar = identity,
    name = identity,
    onCancel = console.log,
    crystal: {
      forwards,
      rootId,
      shareVersion,
      state: crystalState,
      author, // feedId,
      createdAt
    }
  } = opts

  const state = {
    tab: Value(FORWARDS),
    recombining: Value(false),
    showSecret: Value(false),
    secret: Value(),
    secretLabel: Value(),
    error: Value()
  }

  return h('DarkCrystalFriendsCrystalsShow', [
    h('section.left'),
    h('section.body', [
      h('div.header', [
        h('div.author', [
          h('div.avatar', avatar(author, 6)),
          h('div.name', name(author))
        ]),
        h('div.details', [
          h('div.date', [
            h('span', 'Created on '),
            h('span.timestamp', new Date(createdAt).toLocaleDateString())
          ]),
          h('div.root', [ h('span', rootId) ])
        ])
      ]),
      Tabs(state),
      computed(state.tab, tab => {
        switch (tab) {
          case FORWARDS: return ForwardTab()
          case SECRET: return SecretTab()
        }
      }),
      h('div.actions', [ h('button -subtle', { 'ev-click': onCancel }, 'Cancel') ])
    ]),
    h('section.right')
  ])

  function SecretTab () {
    return [
      h('div.secret', [
        when(state.showSecret,
          [
            h('div.actions', [
              h('button -primary', { 'ev-click': (e) => state.showSecret.set(false) }, 'Hide Secret')
            ]),
            h('div.section', [
              computed([state.secret, state.secretLabel, state.error], (secret, secretLabel, error) => (
                [
                  (crystalState === RECOVERED && shareVersion === V1) ? h('div.version', [ h('p', V1_MESSAGE) ]) : null,
                  Secret({ secret, secretLabel, error })
                ]
              ))
            ])
          ],
          [
            h('div.actions', [
              h('button -primary', {
                'ev-click': (e) => {
                  scuttle.recover.async.recombine(rootId, (err, secret) => {
                    if (err) return state.error.set(err)
                    state.secret.set(secret.secret)
                    state.secretLabel.set(secret.label)
                    state.showSecret.set(true)
                  })
                }
              }, 'Display Secret')
            ])
          ]
        )
      ])
    ]
  }

  function ForwardTab () {
    return [ h('div.forwards', [ forwards.map(Forward) ]) ]
  }

  function Forward (forward) {
    const { author: feedId, timestamp } = forward

    return h('div.forward', [
      h('div.author', avatar(feedId, 3)),
      h('div.name', name(feedId)),
      Timestamp({ timestamp })
    ])
  }

  function Tabs (state) {
    return computed(state.tab, tab => {
      return h('div.tabs', [
        h('div.tab',
          tab === FORWARDS ? { className: '-selected' } : { 'ev-click': () => { state.showSecret.set(false); state.tab.set(FORWARDS) } },
          [ FORWARDS, h('span', `(${forwards.length})`) ]
        ),
        h('div.tab',
          tab === SECRET ? { className: '-selected' } : { 'ev-click': () => { state.tab.set(SECRET) } },
          [ SECRET ]
        )
      ])
    })
  }
}

function identity (id) { return id }
