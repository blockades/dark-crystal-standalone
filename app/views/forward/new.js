const { h, Value, computed, Array: MutantArray, resolve } = require('mutant')
const pull = require('pull-stream')

const Recipients = require('../component/recipients')
const Recipient = require('../component/recipient')
const AreYouSure = require('../component/are-you-sure')

module.exports = function DarkCrystalForwardNew (opts) {
  const {
    scuttle,
    suggest,
    avatar = identity,
    name = identity,
    onCancel = console.log,
    feedId,
    shards
  } = opts

  const state = {
    confirmed: Value(false),
    publishing: Value(false),
    completed: Value(false), // TODO: Render a success or failure message and reset the UI back to home page...
    recps: MutantArray([])
  }

  const avatarBig = (feedId) => avatar(feedId, 5)

  return h('DarkCrystalForwardNew', [
    h('section.inputs', [
      h('div.select', [
        h('label.recps', 'Forward to:'),
        Recipients({
          state,
          suggest,
          avatar,
          maxRecps: 1,
          placeholder: `a known alternative identity / trusted party`,
          onChange: (e) => state.confirmed.set(false)
        })
      ])
    ]),
    h('section.description', [
      h('div.from.description', 'Shards belonging to...'),
      h('div.from.feedId', Recipient({ recp: feedId, avatar: avatarBig })),
      h('div.between', [
        h('i.fa.fa-arrow-right.fa-lg')
      ]),
      h('div.to.description', 'will be forwarded to...'),
      computed([state.recps], (recps) => {
        if (recps.length < 1) return
        return h('div.to.feedId', [
          Recipient({ recp: recps[0].link, avatar: avatarBig })
        ])
      })
    ]),
    h('section.actions', [
      FirstCheck(),
      SecondCheck()
    ])
  ])

  function FirstCheck () {
    return computed([state.confirmed, state.recps], (confirmed, recps) => {
      const recp = recps[0]
      if (confirmed || !recp) return

      // For clarity's sake...
      const source = { name: resolve(name(feedId)), id: feedId }
      const destination = { name: recp.name || 'unknown', id: recp.link }

      return AreYouSure({
        message: `Are you sure that ${source.name} and ${destination.name} are the same person?`,
        onSubmit: (e) => state.confirmed.set(true),
        onCancel
      })
    })
  }

  function SecondCheck () {
    return computed([state.confirmed, state.recps, state.publishing], (confirmed, recps, publishing) => {
      const recp = recps[0]
      if (!confirmed || !recp) return
      if (publishing) return // hide buttons to block any double-clicks!

      return AreYouSure({
        message: 'Final Check. Do you have sufficient consent to proceed?',
        onSubmit: (e) => publishForwards(recp.link),
        onCancel: (e) => state.confirmed.set(false)
      })
    })
  }

  function publishForwards (feedId) {
    state.publishing.set(true)

    pull(
      pull.values(shards),
      pull.map(shard => shard.root),
      pull.asyncMap((root, cb) => scuttle.forward.async.publish(root, feedId, cb)),
      pull.collect((err, forwards) => {
        // TODO handle this better
        if (err) return console.err(err)

        // Just exit modal for the moment...
        onCancel()
        state.publishing.set(false)
      })
    )
  }
}

function identity (id) { return id }
