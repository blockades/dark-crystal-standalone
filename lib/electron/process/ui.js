const WindowState = require('electron-window-state')
const { BrowserWindow } = require('electron')
const { join } = require('path')

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = function UI (path, opts, config) {
  var windowState = WindowState({
    defaultWidth: 360,
    defaultHeight: 650
  })

  opts = Object.assign({
    title: 'Dark Crystal',
    show: true,

    maxWidth: isDevelopment ? null : windowState.width,
    maxHeight: isDevelopment ? null : windowState.height,
    width: windowState.width,
    height: windowState.height,

    autoHideMenuBar: true,
    fullscreen: false,
    fullscreenable: false,

    frame: isDevelopment,
    icon: join(__dirname, '..', 'assets', 'icon_200x200.png')
  }, opts)

  var win = new BrowserWindow(opts)
  windowState.manage(win)

  if (isDevelopment) win.webContents.openDevTools()

  win.webContents.on('dom-ready', function () {
    win.webContents.executeJavaScript(`
      var { webFrame } = require('electron')
      var { h } = require('mutant')
      webFrame.setVisualZoomLevelLimits(1, 1)

      document.documentElement.querySelector('head').appendChild(
        h('title',${JSON.stringify(opts.title)})
      )
      require('${path}')
    `)
  })

  win.loadURL('file://' + join(__dirname, '..', 'assets', 'base.html'))

  return win
}
