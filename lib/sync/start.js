const path = require('path')
const nest = require('depnest')
const { h, Value, computed } = require('mutant')
const { last } = require('lodash')

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

    const loading = Value(false)
    const banner = Value()

    const App = h('main.app', [
      computed(api.history.obs.store(), (history) => {
        if (!history) return h('p', "...Loading...")
        return last(history)
      })

      // computed(loading, (ready) => {
      //   if (ready) {
      //     return         }
      //   else {
      //     setTimeout(() => loading.set(true), 5000)
      //     // loading.set(true)
      //     return h('img', { src: path.join(__dirname, '..', '..', 'assets', 'banner.jpeg'), style: { width: '100%' } })
      //   }
      // })
    ])

    api.router.sync.goTo('/secrets')

    api.app.sync.initialise(App)

    return App
  }
}
