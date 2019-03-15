const nest = require('depnest')
const Inject = require('scuttle-inject')

const { h, Array: MutantArray, throttle, onceTrue } = require('mutant')

// Quick 'scuttle' pattern for publishing about messages
const about = nest({
  'about.async.publish': function (server) {
    return function (params = {}, callback = console.log) {
      const content = {
        type: 'about',
        id: server.id,
        ...params
      }

      server.publish(content, callback)
    }
  }
})

exports.gives = nest('app.actions.about.create')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first',
  'keys.sync.id': 'first',
})

exports.create = (api) => {
  return nest('app.actions.about.create', createAbout)

  function createAbout (props = {}) {
    const {
      params,
      onSubmit = (error, about) => {
        if (error) api.router.sync.goTo({ path: '/error', error })
        else console.log(about) // updateAbout()
      }
    } = props

    const scuttle = Inject(about, api.sbot.obs.connection)

    scuttle.about.async.publish(params, onSubmit)
  }
}


