const nest = require('depnest')
const compile = require('micro-css')
const { h, computed } = require('mutant')
const { get } = require('lodash')

exports.gives = nest('app.sync.initialise')

exports.needs = nest({
  'styles.mcss': 'reduce',
  'styles.css': 'reduce'
})

exports.create = function (api) {
  return nest('app.sync.initialise', styles)

  function styles () {
    const css = Object.values(api.styles.css()).join('\n')
    const mcss = Object.values(api.styles.mcss()).join('\n')

    document.head.appendChild(
      h('style', { innerHTML: css })
    )

    document.head.appendChild(
      h('style', { innerHTML: compile(mcss) })
    )
  }
}
