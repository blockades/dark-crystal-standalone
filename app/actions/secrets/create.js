const nest = require('depnest')
const Scuttle = require('scuttle-dark-crystal')

const { h, Array: MutantArray, throttle } = require('mutant')

exports.gives = nest('app.actions.secrets.create')

exports.needs = nest({
  'sbot.obs.connection': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('app.actions.secrets.create', createSecret)

  function createSecret (opts = {}) {
    const scuttle = Scuttle(api.sbot.obs.connection)

    const publish = scuttle.share.async.share
  }
}
