const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, Array: MutantArray, map, throttle } = require('mutant')

exports.gives = nest('app.views.crystals.index')

exports.needs = nest({
  'app.actions.crystals.fetch': 'first',
  'app.sync.goTo': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = (api) => {
  return nest('app.views.crystals.index', crystalsIndex)

  function crystalsIndex () {
    return h('CrystalsIndex', [
      map(api.app.actions.crystals.fetch(), Root, { comparer })
    ])
  }

  function Root (root) {
    return h('div.crystal', [
      h('div.overview', { 'ev-click': () => api.app.sync.goTo(root) }, [
        h('div.name', root.value.content.name),
        h('div.started', new Date(root.value.timestamp).toLocaleDateString())
      ])
    ])
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
