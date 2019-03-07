const { BrowserWindow } = require('electron')
const { join } = require('path')

module.exports = function Server (config, plugins) {
  const opts = {
    title: 'Dark Crystal Server',
    show: false,
    visibility: 'hidden',
    connect: false,
    center: true,
    fullscreen: false,
    fullscreenable: false,
    maximizable: false,
    minimizable: false,
    resizable: false,
    skipTaskbar: true,
    useContentSize: true
  }

  const win = new BrowserWindow(opts)

  win.webContents.on('dom-ready', function () {
    win.webContents.executeJavaScript(script(config, plugins))
  })

  win.loadURL('file://' + join(__dirname, '..', 'assets', 'base.html'))

  return win
}

function script (config, plugins = []) {
  return `
    var { ipcRenderer, webFrame } = require('electron')
    var { h } = require('mutant')
    var fs = require('fs')

    webFrame.setVisualZoomLevelLimits(1, 1)

    document.documentElement.querySelector('head').appendChild(
      h('title', 'Dark Crystal')
    )

    var Server = require('ssb-server')
      .use(require('ssb-server/plugins/master'))
      .use(require('ssb-server/plugins/logging'))
      .use(require('ssb-server/plugins/unix-socket'))
      .use(require('ssb-server/plugins/no-auth'))
      .use(require('ssb-server/plugins/local'))

      .use(require('ssb-gossip'))
      .use(require('ssb-replicate'))
      .use(require('ssb-friends'))
      .use(require('ssb-ebt'))

      .use(require('ssb-blobs'))
      .use(require('ssb-ws'))
      .use(require('ssb-invite'))

      ${plugins.map(name => `.use(require('${name}'))`).join('')}

    var server = Server(${JSON.stringify(config)})

    var manifest = server.getManifest()

    fs.writeFileSync(
      '${join(config.path, 'manifest.json')}',
      JSON.stringify(manifest)
    )

    ipcRenderer.send('server-started')

    ipcRenderer.once('server-close', () => {
      console.log('server: RECEIVED << server-close')
      server.close()
      electron.ipcRenderer.send('server-closed')
    })
  `
}
