const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')
const bulk = require('bulk-require')

require('setimmediate')

const app = {
  about: bulk(__dirname, ['about/**/*.js']),
  app: bulk(__dirname, ['app/**/*.js']),
  message: bulk(__dirname, ['message/**/*.js']),
  page: bulk(__dirname, ['page/**/*.js']),
  router: bulk(__dirname, ['router/**/*.js']),
  styles: bulk(__dirname, ['styles/**/*.js']),
  ...require('../lib/scuttle')
}

console.log(app)

const sockets = combine(app)
const api = entry(sockets, nest('app.sync.start', 'first'))
const App = api.app.sync.start

document.body.appendChild(App())
