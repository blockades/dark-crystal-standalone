const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array: MutantArray, map, throttle } = require('mutant')

const NavBar = require('../../components/NavBar')
const ViewTabs = require('../../components/ViewTabs')

exports.gives = nest('app.views.secrets.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.show', secretsShow)

  function secretsShow (request) {
    const { secret } = request

    return h('Secrets -show', [
      h('div.left', [
        h('i.fa.fa-chevron-left', {
          'ev-click': api.router.sync.goBack
        }),
        h('div')
      ]),
      h('div.main', [
        h('section.secret', [

        ])
      ])
    ])
  }
}
