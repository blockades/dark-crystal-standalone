const nest = require('depnest')
const pull = require('pull-stream')
const Scuttle = require('scuttle-dark-crystal')
const { h, Array: MutantArray, map, throttle } = require('mutant')

exports.gives = nest('app.actions.crystals.fetch')
exports.needs = nest('sbot.obs.connection', 'first')

exports.create = (api) => {
  return nest('app.actions.crystals.fetch', fetch)

  function fetch (opts = {}) {
    const {
      limit = 100,
      live = true
    } = opts

    const scuttle = Scuttle(api.sbot.obs.connection)
    const store = MutantArray([])

    pull(
      scuttle.root.pull.mine({ live }),
      pull.filter(m => !m.sync),
      pull.drain(root => store.insert(root, 0))
    )

    return throttle(store, limit)
  }
}
