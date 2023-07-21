const { app, Menu } = require('electron')

const setApplicationMenu = (browser, options) => {
  const isMac = process.platform === 'darwin'

  // const tab = () => browser.getFocusedWindow().getFocusedTab()
  // const tabWc = () => tab().webContents

  // https://www.electronjs.org/fr/docs/latest/api/menu
  const template = [
    // ...(isMac ? [{ role: 'appMenu' }] : []),
    ...(isMac
      ? [{
          label: app.name,
          submenu: [
            // { role: 'about' },
            {
              label: 'About ' + app.name,
              accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
              click: () => {
                options.showAboutWindow()
                // console.log('Electron about rocks! --' + app.getName() + ' == ' +app.getVersion())
              }
            },

            // { type: 'separator' },
            // { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }]
      : []),
    /* {
      label: app.name,
      submenu: [{
        role: 'help',
        accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
        click: () => { console.log(app.name + ' rocks!') }
      }]
    }, */
    { role: 'fileMenu' },
    { role: 'editMenu' },
    /*
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          nonNativeMacOSRole: true,
          click: () => tabWc().reload(),
        },
        {
          label: 'Force Reload',
          accelerator: 'Shift+CmdOrCtrl+R',
          nonNativeMacOSRole: true,
          click: () => tabWc().reloadIgnoringCache(),
        },
        {
          label: 'Toggle Developer Tool asdf',
          accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          nonNativeMacOSRole: true,
          click: () => tabWc().toggleDevTools(),
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    */
    { role: 'windowMenu' }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = {
  setApplicationMenu
}
