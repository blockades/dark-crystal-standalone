const nest = require('depnest')
const compile = require('micro-css')
const { h, computed } = require('mutant')
const get = require('lodash/get')

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

// 'settings.obs.get': 'first'
//
// const custom = api.settings.obs.get('patchbay.customStyles')
// const accessibility = api.settings.obs.get('patchbay.accessibility')
// document.head.appendChild(
// h('style', {
//   innerHTML: computed(accessibility, a11y => {
//     return compileCss(accessibilityMcss(a11y))
//   })
// })
// )

// ////////////////////////////
// The parts that feed into this are in app/html/settings/accessibility.js

// function accessibilityMcss (settings) {
//   const invert = get(settings, 'invert')
//   const saturation = get(settings, 'saturation', 100)
//   const brightness = get(settings, 'brightness', 100)
//   const contrast = get(settings, 'contrast', 100)

//   const css = `
// body {
//   filter: ${invert ? 'invert()' : ''} saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)

//   (img) {
//     filter: ${invert ? 'invert()' : ''}
//   }
//   (video) {
//     filter: ${invert ? 'invert()' : ''}
//   }
//   (button) {
//     filter: ${invert ? 'invert()' : ''}
//   }
// }
// `
//   return css
// }
// // ////////////////////////////

