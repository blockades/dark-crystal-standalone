const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

exports.gives = nest('app.views.secrets.show')

exports.needs = nest({
  'app.sync.goTo': 'first',
})

exports.create = (api) => {
  return nest('app.views.secrets.show', secretsShow)

  function secretsShow ({ path, secret }) {
    return h('CrystalsShow', [
      h('button', { 'ev-click': () => api.app.sync.goTo('/secrets') }, 'Back'),
      h('div', [
        JSON.stringify(secret)
      ])
    ])
  }
}
