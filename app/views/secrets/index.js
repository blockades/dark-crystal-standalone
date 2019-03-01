const nest = require('depnest')
const pull = require('pull-stream')
const scuttle = require('scuttle-dark-crystal')
const { h, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')

exports.gives = nest('app.views.secrets.index')

exports.needs = nest({
  'app.actions.secrets.fetch': 'first',
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.index', secretsIndex)

  function secretsIndex () {
    return h('article', [
      NavBar({
        routeTo: api.router.sync.goTo,
        selected: `/secrets`
      }),
      h('Secrets -index', [
        map(api.app.actions.secrets.fetch(), Root, { comparer })
      ])
    ])

  }

  function Root (secret) {
    return h('section.secret', {
      'ev-click': () => api.router.sync.goTo({ path: `/secrets/${secret.id}`, secret: secret })
    }, [
      h('div.name', secret.name),
      h('div.started', secret.createdAt)
    ])
  }
}

function comparer (a, b) {
  return a && b && a.key === b.key
}
