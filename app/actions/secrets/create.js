const nest = require('depnest')
const Scuttle = require('scuttle-dark-crystal')

const { h, Array: MutantArray, throttle } = require('mutant')

exports.gives = nest('app.actions.secrets.create')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('app.actions.secrets.create', createSecret)

  function createSecret (props = {}) {
    const { params } = props

    const scuttle = Scuttle(api.sbot.obs.connection)

    scuttle.share.async.share(params, (error, data) => {
      if (err) api.router.sync.goTo({ page: `/error`, error })
      else api.router.sync.goTo({ page: `/secrets` })
    })
  }
}
