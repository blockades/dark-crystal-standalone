const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')
// const bulk = require('bulk-require')
const { plugins, patchbay, patchcore } = require('patchbay/main')

const app = {
  darkCrystal: {
    app: {
      html: {
        app: require('./app/html/app')
      },
      page: {
        index: require('./app/page/dark-crystal-index'),
        // rituals: {
        //   new: require('./app/page/rituals/new'),
        //   index: require('./app/page/rituals/index'),
        //   show: require('./app/page/rituals/show')
        // },
        // othersShards: require('./app/page/others-shards/index'),
        // forward: {
        //   new: require('./app/page/forward/new')
        // }
      }
    },
    router: {
      sync: {
        routes: require('./router/sync/routes')
      }
    },
    styles: {
      mcss: require('./styles/mcss.js')
    }
  }
}

// plugins loaded first will over-ride core modules loaded later
const sockets = combine(
  app,
  // NOTE - the following two plugins are needed because the /calendar page expects things from them. That needs extracting, or these plugins need to provide dummy plugs to stop the app exploding!
  plugins.gatherings,
  plugins.scry,

  patchbay,
  patchcore
)

const api = entry(sockets, nest('app.html.app', 'first'))

document.body.appendChild(api.app.html.app())
