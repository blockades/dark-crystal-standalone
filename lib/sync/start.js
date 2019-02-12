const nest = require('depnest')
const { h } = require('mutant')
const Scuttle = require('scuttle-dark-crystal')

const CrystalsIndex = require('../../app/views/crystals/index')

exports.gives = nest('app.sync.start')

exports.needs = nest({
  'app.sync.goTo': 'first',
  'app.sync.initialise': 'first',
  'app.sync.window': 'reduce',
  'history.obs.location': 'first',
  'history.sync.push': 'first',
  'settings.sync.get': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest('app.sync.start', app)

  function app () {
    console.log('STARTING app')

    window = api.app.sync.window(window)

    const scuttle = Scuttle(api.sbot.obs.connection)

    const App = h('App', [
      CrystalsIndex({
        scuttle,
        routeTo: api.app.sync.goTo
      })
    ])

    api.app.sync.initialise(App)

    api.history.obs.location()(loc => {
      api.app.sync.goTo(loc || {})
    })

    return App
  }
}
