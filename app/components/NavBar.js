const { h } = require('mutant')
const { remote } = require('electron')

// const Tabs = require('./Tabs')

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
          {
            'ev-click': ()=> {
              if (currentPath === `/settings`) goBack()
              else routeTo({ path: `/settings` })
            },
            'classList': [
              currentPath === '/settings' ? 'bg-black white' : 'bg-white black'
            ]
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
          }
        }),
        h('i.fa.fa-times.fa-lg', {
          'ev-click': () => {
            var window = remote.getCurrentWindow()
            window.close()
          }
        })
      ])
    ]),
    h('section.bottom', [
      // Tabs(currentPath, [
      //   { name: 'secrets', routeTo: () => routeTo({ path: `/secrets` }) },
      //   { name: 'shards', routeTo: () => routeTo({ path: `/shards` }) }
      // ])
    ])
  ])
}
