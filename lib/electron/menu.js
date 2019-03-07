const defaultMenu = require('electron-default-menu')
const Menu = require('electron').Menu
const { app, shell } = require('electron')

module.exports = function InstallMenu () {
  var menu = defaultMenu(app, shell)

  var view = menu.find(x => x.label === 'View')

  view.submenu = [
    { role: 'reload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]

  var win = menu.find(x => x.label === 'Window')

  win.submenu = [
    { role: 'minimize' },
    { role: 'zoom' },
    { role: 'close', label: 'Close Window', accelerator: 'CmdOrCtrl+Shift+W' },
    { type: 'separator' },
    { type: 'separator' },
    { role: 'front' }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
}
