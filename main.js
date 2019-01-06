const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')
// const bulk = require('bulk-require')
const { plugins, patchbay, patchcore } = require('patchbay/main')
const thisApp = require('./plugs')

// plugins loaded first will over-ride core modules loaded later
const sockets = combine(
  thisApp,
  plugins.darkCrystal,

  // NOTE - the following two plugins are needed because the /calendar page expects things from them. That needs extracting, or these plugins need to provide dummy plugs to stop the app exploding!
  plugins.gatherings,
  plugins.scry,
  patchbay,
  patchcore
)

const api = entry(sockets, nest('app.html.app', 'first'))

const initialTabs = ['/dark-crystal']
document.body.appendChild(api.app.html.app(initialTabs))
