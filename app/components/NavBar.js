const { h } = require('mutant')
const { remote } = require('electron')

const Close = require('../components/Close')
const Minimize = require('../components/Minimize')

const { isSettingsNamespace } = require('../routes')

const Search = require('./Search')

module.exports = function NavBar (props = {}, children = []) {
  const {
    routeTo,
    goBack,
    request,
    suggest,
    myId
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
        Search({
          suggest,
          routeTo,
          myId
        })
      ]),
      h('div.right', [
        Minimize({
          onClick: () => {
            var window = remote.getCurrentWindow()
            window.minimize()
          }
        }),
        Close({
          onClick: () => {
            var window = remote.getCurrentWindow()
            window.close()
          }
        })
      ])
    ])
  ])

  function goToPath (ev) {
    if (isSettingsNamespace(request)) routeTo({ path: `/secrets` })
    else routeTo({ path: `/settings` })
  }
}
