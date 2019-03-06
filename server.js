var fs = require('fs')
var Path = require('path')
var electron = require('electron')

console.log('STARTING SBOT')

var createSbot = require('ssb-server')
  .use(require('ssb-server/plugins/master'))
  .use(require('ssb-server/plugins/logging'))
  .use(require('ssb-server/plugins/unix-socket'))
  .use(require('ssb-server/plugins/no-auth'))
  .use(require('ssb-server/plugins/local'))

  .use(require('ssb-gossip'))
  .use(require('ssb-replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-invite'))

  .use(require('ssb-blobs'))
  .use(require('ssb-ws'))

  .use(require('ssb-about'))
  .use(require('ssb-backlinks'))
  .use(require('ssb-ebt'))
  .use(require('ssb-private'))
  .use(require('ssb-query'))
  .use(require('ssb-suggest'))

var config = require('./config').create().config.sync.load()

var server = createSbot(config)
var manifest = server.getManifest()
fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest))
electron.ipcRenderer.send('server-started')
