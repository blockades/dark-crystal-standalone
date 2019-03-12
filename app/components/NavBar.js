const { h } = require('mutant')
const { remote } = require('electron')

const Close = require('../components/Close')
const Minimize = require('../components/Minimize')

const { isSettingsNamespace, isHelpNamespace } = require('../routes')

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
        h('i.fa.fa-cog.fa-2x', {
          'ev-click': goToPath,
          classList: [isSettingsNamespace(request) ? 'active' : ''],
          title: 'Settings'
        }),
        h('i.fa.fa-question-circle.fa-2x', {
          'ev-click': () => routeTo({ path: `/help` }),
          classList: [isHelpNamespace(request) ? 'active' : ''],
          title: 'Help'
        }),
        h('i.fa.fa-bell.fa-2x', {
          'ev-click': () => routeTo({ path: `/notifications` }),
          classList: [''],
          title: 'Notifications'
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
    ]),
    h('section.bottom', [
      Search({
        suggest,
        routeTo,
        myId
      })
    ])
  ])

  function goToPath (ev) {
    if (isSettingsNamespace(request)) routeTo({ path: `/secrets` })
    else routeTo({ path: `/settings` })
  }
}
