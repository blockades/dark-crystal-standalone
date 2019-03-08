const { h } = require('mutant')
const { remote } = require('electron')

const { isSettingsNamespace } = require('../routes')

const Search = require('./Search')

module.exports = function NavBar (props, children = []) {
  const {
    routeTo,
    goBack,
    request,
    suggest
  } = props

  return h('nav', [
    h('section.top', [
      h('div.left', [
        h('i.fa.fa-cog.fa-2x',
          { 'ev-click': goToPath,
            classList: [isSettingsNamespace(request) ? 'active' : ''],
            title: 'Settings'
          }
        )
      ]),
      h('div.middle', [
        Search({ suggest, routeTo })
      ]),
      h('div.right', [
        h('i.fa.fa-minus.fa-lg', {
          'ev-click': () => {
            var window = remote.getCurrentWindow()
            window.minimize()
          },
          title: 'Minimize'
        }),
        h('i.fa.fa-times.fa-lg', {
          'ev-click': () => {
            var window = remote.getCurrentWindow()
            window.close()
          },
          title: 'Close'
        })
      ])
    ])
  ])

  function goToPath (ev) {
    if (isSettingsNamespace(request)) routeTo({ path: `/secrets` })
    else routeTo({ path: `/settings` })
  }
}
