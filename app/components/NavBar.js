const { h } = require('mutant')

// const Tabs = require('./Tabs')

module.exports = function NavBar (opts) {
  const {
    routeTo,
    currentPath
  } = opts

  return h('nav', [
    h('section.top', [
      h('div.left', [
        h('i.fa.fa-cog.fa-2x', { 'ev-click': ()=> routeTo({ path: `/settings` }) })
      ]),
      h('div.middle', [
        h('i.fa.fa-search.fa-lg'),
        h('input')
      ]),
      h('div.right', [
        h('i.fa.fa-minus.fa-lg'),
        h('i.fa.fa-plus.fa-lg')
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
