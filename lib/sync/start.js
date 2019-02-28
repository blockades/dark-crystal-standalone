const nest = require('depnest')
const { h, computed } = require('mutant')
const Scuttle = require('scuttle-dark-crystal')

const CrystalsIndex = require('../../app/views/crystals/index')

exports.gives = nest('app.sync.start')

exports.needs = nest({
  'app.views.crystals.index': 'first',
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
    window = api.app.sync.window(window)

    const scuttle = Scuttle(api.sbot.obs.connection)

    const App = h('app', [
      computed(api.history.obs.location(), location => {
        return location || api.app.views.crystals.index()
      })
    ])

    api.app.sync.initialise(App)

    return App
  }
}
