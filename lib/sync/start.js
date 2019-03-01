const nest = require('depnest')
const { h, computed } = require('mutant')
const Scuttle = require('scuttle-dark-crystal')
const { last } = require('lodash')

const CrystalsIndex = require('../../app/views/secrets/index')

exports.gives = nest('app.sync.start')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'app.sync.initialise': 'first',
  'app.sync.window': 'reduce',
  'history.obs.store': 'first',
  'history.sync.push': 'first',
  'settings.sync.get': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest('app.sync.start', app)

  function app () {
    window = api.app.sync.window(window)

    const scuttle = Scuttle(api.sbot.obs.connection)

    api.router.sync.goTo('/secrets')

    const App = h('main.app', [
      computed(api.history.obs.store(), (history) => {
        if (!history) return h('p', "...Loading...")
        return last(history)
      })
    ])

    api.app.sync.initialise(App)

    return App
  }
}
