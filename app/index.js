const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')
const bulk = require('bulk-require')

require('setimmediate')

const app = {
  controllers: bulk(__dirname, ['controllers/**/*.js']),
  views: { root: require('./views/root/index') }, // bulk(__dirname, ['views/**/*.js']),
  router: bulk(__dirname, ['router/**/*.js']),
  ...require('../lib')
}

const sockets = combine(app)
const api = entry(sockets, nest('app.sync.start', 'first'))
const App = api.app.sync.start

document.body.appendChild(App())
