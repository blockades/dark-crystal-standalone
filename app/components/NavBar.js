const { h } = require('mutant')
const { remote } = require('electron')

const {
  SettingsIndexPath,
  SettingsAccountIndexPath,
  SettingsNetworkIndexPath,
  SecretsIndexPath
} = require('../routes')

module.exports = function NavBar (opts) {
  const {
    routeTo,
    goBack,
    currentPath
  } = opts

  return h('nav', [
    h('section.top', [
      h('div.left', [
        h('i.fa.fa-cog.fa-2x',
          { 'ev-click': goToPath,
            'classList': [isSettingsNamespace() ? 'active' : ''],
            'title': 'Settings'
          }
        )
      ]),
      h('div.middle', [
        h('i.fa.fa-search.fa-lg'),
        h('input')
      ]),
      h('div.right', [
        h('i.fa.fa-minus.fa-lg', {
          'ev-click': () => {
            var window = remote.getCurrentWindow()
            window.minimize()
          },
          'title': 'Minimize'
        }),
        h('i.fa.fa-times.fa-lg', {
          'ev-click': () => {
            var window = remote.getCurrentWindow()
            window.close()
          },
          'title': 'Close'
        })
      ])
    ])
  ])

  function isSettingsNamespace () {
    return currentPath.substring(0, 9) === `/settings`
  }

  function goToPath (ev) {
    if (isSettingsNamespace()) routeTo({ path: `/secrets` })
    else routeTo({ path: `/settings` })
  }
}
