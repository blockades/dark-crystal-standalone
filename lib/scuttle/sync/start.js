const path = require('path')
const nest = require('depnest')
const { h, Value, computed } = require('mutant')
const { last } = require('lodash')

exports.gives = nest('app.sync.start')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'app.sync.initialise': 'first',
  'history.obs.store': 'first',
  'history.sync.push': 'first',
  'settings.sync.get': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest('app.sync.start', app)

  function app () {
    const app = h('App', [
      computed(api.history.obs.store(), (history) => {
        if (!history) return h('p', "...Loading...")
        return last(history)
      })
    ])

    api.router.sync.goTo({ page: 'dark-crystal' })

    api.app.sync.initialise(app)

    return app
  }
}
