const bulk = require('bulk-require')

const patchcore = require('patchcore')
delete patchcore.patchcore.message.html.action.reply

const sync = bulk(__dirname, ['sync/**/*.js'])
const blob = bulk(__dirname, ['blob/**/*.js'])

const settings = require('patch-settings')
const suggest = require('patch-suggest')
const history = require('patch-history')

module.exports = Object.assign(
  sync,
  blob,
  settings,
  suggest,
  history,
  patchcore
)
