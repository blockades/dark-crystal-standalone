const { app, ipcMain } = require('electron')
const { join } = require('path')

const Menu = require('./lib/electron/menu')
const Server = require('./lib/electron/process/server')
const UI = require('./lib/electron/process/ui')

const config = require('./config').create().config.sync.load()

const plugins = ['ssb-about', 'ssb-backlinks', 'ssb-private', 'ssb-query', 'ssb-suggest']

const state = {
  windows: {
    server: null,
    ui: null
  },
  quitting: false
}

app.on('ready', () => {
  Menu()

  app.on('before-quit', () => { state.quitting = true })

  ipcMain.on('open-background-devtools', () => {
    if (state.windows.server) state.windows.server.webContents.openDevTools({ detach: true })
  })

  state.windows.server = Server(config, plugins)

  ipcMain.once('server-started', () => {
    state.windows.ui = UI(join(__dirname, 'src/index'), { width: 1024, height: 768 }, config)

    state.windows.ui.on('close', (e) => {
      if (!state.quitting && process.platform === 'darwin') {
        e.preventDefault()
        state.windows.ui.hide()
      }
    })

    state.windows.ui.on('closed', () => {
      state.windows.ui = null
      if (process.platform !== 'darwin') app.quit()
    })
  })
})

ipcMain.on('server-close', () => {
  if (!state.windows.server) return
  state.windows.server.webContents.send('server-close')
})

ipcMain.on('server-closed', () => {
  state.windows.ui.hide()
  app.quit()
})
