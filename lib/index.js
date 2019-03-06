const bulk = require('bulk-require')

const patchcore = require('patchcore')
delete patchcore.patchcore.message.html.action.reply

module.exports = {
  about: bulk(__dirname, ['about/**/*.js']),
  sync: bulk(__dirname, ['sync/**/*.js']),
  sbot: bulk(__dirname, ['sbot/**/*.js']),
  blob: bulk(__dirname, ['blob/**/*.js']),
  settings: require('patch-settings'),
  suggest: require('patch-suggest'),
  history: require('patch-history'),
  patchcore
}
