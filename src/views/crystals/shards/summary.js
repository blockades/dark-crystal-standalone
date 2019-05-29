const { h, when, computed, Value } = require('mutant')
const getContent = require('ssb-msg-content')

const ProgressBar = require('../../component/progress-bar')
const getRecp = require('../../lib/get-recp')
const Secret = require('../../component/secret')

module.exports = function DarkCrystalShardsSummary ({ ritual, shardRecords, scuttle, modal, avatar }) {
  const state = {
    recombining: Value(false),
    modalOpen: Value(false),
    secret: Value(),
    secretLabel: Value(),
    error: Value()
  }

  return computed([ritual, shardRecords], (ritual, records) => {
    if (!ritual) return

    const { quorum, root } = getContent(ritual)

    const hasRequests = records.some(r => r.requests.length > 0)
    const numReplies = records.filter(r => r.replies.length > 0).length
    const quorumMet = numReplies >= quorum

    return h('DarkCrystalShardsSummary', [
      h('section.custodians', [
        h('h3', 'Custodians'),
        h('div.custodians', [
          records.map(r => avatar(getRecp(r.shard)))
        ])
      ]),
      h('section.quorum', [
        h('h3', 'Quorum'),
        h('strong', quorum)
      ]),
      when(hasRequests,
        h('section.progress', [
          h('h3', 'Shards summoned'),
          ProgressBar({
            value: numReplies,
            maximum: Math.max(quorum, numReplies),
            title: 'Shards gathered'
          })
        ])
      ),
      when(quorumMet,
        h('section.recombine', [
          // h('span', 'Quorum reached!'),
          h('button -primary',
            { 'ev-click': () => {
              state.recombining.set(true)

              scuttle.recover.async.recombine(root, (err, secretObject) => {
                if (err) state.error.set(err)
                else {
                  state.secret.set(secretObject.secret)
                  if (secretObject.label) state.secretLabel.set(secretObject.label)
                }
                state.recombining.set(false)
                state.modalOpen.set(true)
              })
            } },
            when(state.recombining,
              h('i.fa.fa-spinner.fa-pulse'),
              'Show secret'
            )
          )
        ])
      ),
      modal(Secret(state), { isOpen: state.modalOpen })
    ])
  })
}
