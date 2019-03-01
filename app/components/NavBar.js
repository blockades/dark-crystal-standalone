const { h } = require('mutant')
const { remote } = require('electron')

const ViewTabs = require('./ViewTabs')

module.exports = function NavBar (opts) {
  const {
    routeTo,
    goBack,
    currentPath
  } = opts

  let isSettingsPage = currentPath === `/settings`

  return h('nav', [
    h('section.top', [
      h('div.left', [
        h('i.fa.fa-cog.fa-2x',
          {
            'ev-click': ()=> {
              if (isSettingsPage) goBack()
              else routeTo({ path: `/settings` })
            },
            'classList': [isSettingsPage ? 'active' : ''],
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
    ]),
    !isSettingsPage ? h('section.bottom', [
      ViewTabs(currentPath, [
        { name: 'secrets', routeTo: () => routeTo({ path: `/secrets` }) },
        { name: 'shards', routeTo: () => routeTo({ path: `/shards` }) }
      ])
    ]) : null
  ])
}
