const { ipcRenderer } = require('electron')

const loadTheme = require('../modules/loadTheme.js')
const applyTheme = require('../modules/applyTheme.js')
const applyWinControls = require('../modules/applyWinControls.js')
const loadWinControlsModule = require('../modules/loadWinControls.js')

function openLicenseFile () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'file://' + __dirname + '/../LICENSE', true)
}

function loadAbout () {
  document.getElementById('about-electron').innerHTML = 'Electron: v' + process.versions.electron
  document.getElementById('about-chrome').innerHTML = 'Chrome: v' + process.versions.chrome
  document.getElementById('about-node').innerHTML = 'Node: ' + process.version

  ipcRenderer.send('request-set-about')
}

function openIssuesPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://github.com/ModuleArt/ferny/issues', true)
}

function openDonatePage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://www.patreon.com/moduleart', true)
}

function openDeveloperPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://moduleart.github.io/', true)
}

function openAppPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://moduleart.github.io/ferny', true)
}

function openReleasesPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://github.com/ModuleArt/ferny/releases', true)
}

function openPlannerPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://trello.com/b/cb5lXUgS/ferny', true)
}

function openSourcePage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://github.com/ModuleArt/ferny', true)
}

function openElectronPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://electronjs.org/releases', true)
}

function openChromePage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://chromereleases.googleblog.com', true)
}

function openNodePage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://nodejs.org/en/download/releases', true)
}

function openDiscordPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://discord.gg/9q4D8SJ', true)
}

function openLicensePage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-addTab', 'https://github.com/ModuleArt/ferny/blob/master/LICENSE', true)
}

function checkForUpdates () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-checkForUpdates')
}

function updateTheme () {
  loadTheme().then(({ theme, dark }) => {
    console.log(theme)
    applyTheme(theme, dark)
  })
}

function closeWindow () {
  ipcRenderer.send('about-closeWindow')
}

ipcRenderer.on('action-set-about', (event, arg) => {
  document.getElementById('about-app').innerHTML = 'Beta v' + arg.version + '<br>' + arg.platform + ' / ' + arg.arch
})

ipcRenderer.on('window-blur', (event) => {
  document.getElementById('titlebar').classList.add('blur')
})

ipcRenderer.on('window-focus', (event) => {
  document.getElementById('titlebar').classList.remove('blur')
})

function init () {
  loadWinControlsModule().then((winControls) => {
    applyWinControls(winControls.systemTitlebar, 'only-close')
  })

  updateTheme()

  loadAbout()
}

document.onkeyup = function (e) {
  if (e.which === 27) {
    closeWindow()
  }
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    init()
  }
}
