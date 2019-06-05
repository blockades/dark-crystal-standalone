const nest = require('depnest')
const { h } = require('mutant')
const Scuttle = require('scuttle-dark-crystal')
const getContent = require('ssb-msg-content')

const CrystalsShow = require('../views/crystals/show')

exports.gives = nest({
  'app.page.darkCrystalShow': true
})

exports.needs = nest({
  'about.html.avatar': 'first',
  'app.html.modal': 'first',
  'router.sync.goTo': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'app.page.darkCrystalShow': darkCrystalShowPage
  })

  function darkCrystalShowPage (location) {
    const scuttle = Scuttle(api.sbot.obs.connection)
    const { name } = getContent(location)

    const back = () => {
      api.router.sync.goTo({ page: 'dark-crystal' })
      // mix: TODO close the current tab
      // this will be especially important if / when we make the tabs hidden in a standalone install, which I think we should
    }

    const page = h('DarkCrystal -show', { title: `/dark-crystal — ${name}` }, [
      h('h1', ['Dark Crystal', h('i.fa.fa-diamond')]),
      h('h2', name),
      CrystalsShow({
        scuttle,
        root: location,
        routeTo: api.router.sync.goTo,
        avatar: api.about.html.avatar,
        modal: api.app.html.modal
      }),
      h('div.Back', [
        h('i.fa.fa-arrow-left.fa-lg', {
          'ev-click': back,
          'title': 'Back'
        })
      ])
    ])

    return page
  }
}
