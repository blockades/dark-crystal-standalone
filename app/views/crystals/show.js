const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

exports.gives = nest('app.views.crystals.show')

exports.needs = nest({
  'app.sync.goTo': 'first',
})

exports.create = (api) => {
  return nest('app.views.crystals.show', crystalsShow)

  function crystalsShow (msg) {
    return h('CrystalsShow', JSON.stringify(msg))
  }
}
