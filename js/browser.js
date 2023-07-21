const { ipcRenderer } = require('electron')
const dragula = require('dragula')

const applyTheme = require('../modules/applyTheme.js')
const loadTheme = require('../modules/loadTheme.js')
const applyWinControls = require('../modules/applyWinControls.js')
const loadWinControlsModule = require('../modules/loadWinControls.js')

const NotificationManager = require('../modules/NotificationManager/NotificationManager.js')
const TabRenderer = require('../modules/TabManager/TabRenderer.js')

function updateTheme () {
  loadTheme().then(({ theme, dark }) => {
    applyTheme(theme, dark)
  })
}

const notificationManager = new NotificationManager(document.getElementById('notif-panel'))

notificationManager.on('notif-added', (notif) => {
  updateTheme()
})

const tabRenderer = new TabRenderer()

const tabDrag = dragula([tabRenderer.getTabContainer()], {
  direction: 'horizontal'
})

tabDrag.on('drag', function (el, source) {
  const div = el.getElementsByClassName('tabman-tab-preview')[0]
  if (div != null) {
    div.parentNode.removeChild(div)
  }
})

tabDrag.on('drop', function (el, target, source, sibling) {
  tabRenderer.updateTabsPositions()
})

function prevDef (event) { // eslint-disable-line no-unused-vars
  event.preventDefault()
}

function popupInfoContextMenu () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-info-contextmenu')
}

function requestSideMenu () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-side-menu')
}

function installUpdate () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-installUpdate')
}

function downloadUpdate () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-downloadUpdate')
}

function clearDownloads () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-clearDownloads')
}

function clearHistory () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-clearHistory')
}

function cancelUpdate () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-cancelUpdate')
  notificationManager.addStatusNotif('Update cancelled', 'error')
}

function checkForUpdates () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-checkForUpdates')
}

function exitAppAnyway () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-exit-app-anyway')
}

function maximizeWindow () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-maximize-window')
}

function minimizeWindow () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-minimize-window')
}

function restoreWindow () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-unmaximize-window')
}

function closeWindow () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-quit-app')
}

function zoomIn () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-zoomIn')
}

function zoomOut () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-zoomOut')
}

function zoomToActualSize () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-zoomToActualSize')
}

function focusSearch () {
  const s = document.getElementById('search-input')
  s.focus()
  s.select()
}

function createBookmark () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-bookmarkThisPage')
}

function bookmarkAllTabs () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-bookmarkAllTabs')
}

function popupTabHistory () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-popupTabHistory')
}

function popupHomePageOptions () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('main-popupHomePageOptions')
}

function showOverlay () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-show')
}

function showOverlayButtonMenu () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-showButtonMenu')
}

function goToSearch (text, selectionStart) { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-goToSearch', text, selectionStart)
}

function removeFolder (id) { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-removeFolder', id)
}

function showOverlayMenu () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('overlay-showMenu')
}

function newTab () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-newTab')
}

function newBackgroundTab (event) { // eslint-disable-line no-unused-vars
  event.preventDefault()
  if (event.which === 2) {
    ipcRenderer.send('tabManager-newBackgroundTab')
  }
}

function showTabList () { // eslint-disable-line no-unused-vars
  tabRenderer.showTabList()
}

function goBack () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-goBack')
}

function goForward () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-goForward')
}

function reload () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-reload')
}

function reloadIgnoringCache () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-reloadIgnoringCache')
}

function stop () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('tabManager-stop')
}

function newTabDrop (event) { // eslint-disable-line no-unused-vars
  event.preventDefault()
  const textData = event.dataTransfer.getData('Text')
  if (textData) {
    ipcRenderer.send('tabManager-addTab', 'file://' + textData, false)
  } else if (event.dataTransfer.files.length > 0) {
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      ipcRenderer.send('tabManager-addTab', 'file://' + event.dataTransfer.files[i].path, false)
    }
  }
}

function tabsWheel (event) { // eslint-disable-line no-unused-vars
  if (event.deltaY < 0) {
    tabRenderer.scrollLeft()
  }
  if (event.deltaY > 0) {
    tabRenderer.scrollRight()
  }
}

function goHome () {
  ipcRenderer.send('tabManager-goHome')
}

function findNext () {
  document.getElementById('find-container').classList.add('show')
  const findInput = document.getElementById('find-input')
  findInput.focus()
  if (findInput.value.length > 0) {
    ipcRenderer.send('tabManager-findInPage', findInput.value, true)
  }
}

function findPrev () {
  document.getElementById('find-container').classList.add('show')
  const findInput = document.getElementById('find-input')
  findInput.focus()
  if (findInput.value.length > 0) {
    ipcRenderer.send('tabManager-findInPage', findInput.value, false)
  }
}

function findInputKeyUp () { // eslint-disable-line no-unused-vars
  const findInput = document.getElementById('find-input')
  if (findInput.value.length <= 0) {
    ipcRenderer.send('tabManager-stopFindInPage', false)
  }
}

function closeFindPanel () {
  document.getElementById('find-container').classList.remove('show')
  ipcRenderer.send('tabManager-stopFindInPage', true)
}

ipcRenderer.on('findInPage-findNext', (event) => {
  findNext()
})

ipcRenderer.on('findInPage-findPrev', (event) => {
  findPrev()
})

ipcRenderer.on('findInPage-updateFindInPage', (event) => {
  if (document.getElementById('find-container').classList.contains('show')) {
    const findInput = document.getElementById('find-input')
    if (findInput.value.length > 0) {
      findNext()
    }
  }
})

ipcRenderer.on('notificationManager-addStatusNotif', (event, arg) => {
  notificationManager.addStatusNotif(arg.text, arg.type)
})

ipcRenderer.on('notificationManager-addQuestNotif', (event, arg) => {
  notificationManager.addQuestNotif(arg.text, arg.ops)
})

ipcRenderer.on('notificationManager-refreshZoomNotif', (event, zoomFactor) => {
  notificationManager.refreshZoomNotif(zoomFactor)
})

ipcRenderer.on('console-log', (event, text) => {
  console.log(text)
})

ipcRenderer.on('action-page-focussearch', (event, arg) => {
  focusSearch()
})

ipcRenderer.on('window-updateTheme', (event) => {
  updateTheme()
})

ipcRenderer.on('window-blur', (event) => {
  document.body.classList.add('blur')
})

ipcRenderer.on('window-focus', (event) => {
  document.body.classList.remove('blur')
})

ipcRenderer.on('window-maximize', (event) => {
  document.getElementById('drag-zone').classList.add('maximize')
  document.getElementById('max-btn').style.display = 'none'
  document.getElementById('restore-btn').style.display = ''
})

ipcRenderer.on('window-unmaximize', (event) => {
  document.getElementById('drag-zone').classList.remove('maximize')
  document.getElementById('max-btn').style.display = ''
  document.getElementById('restore-btn').style.display = 'none'
})

ipcRenderer.on('overlay-toggleButton', (event, bool) => {
  if (bool) {
    document.getElementById('overlay-btn').classList.add('active')
    document.getElementById('titlebar').style.display = 'none'
  } else {
    document.getElementById('overlay-btn').classList.remove('active')
    document.getElementById('titlebar').style.display = ''
  }
})

ipcRenderer.on('tabRenderer-addTab', (event, arg) => {
  tabRenderer.addTab(arg.id, arg.url, arg.active)
})

ipcRenderer.on('tabRenderer-activateTab', (event, id) => {
  tabRenderer.activateTab(id)
})

ipcRenderer.on('tabRenderer-closeTab', (event, id) => {
  tabRenderer.closeTab(id)
})

ipcRenderer.on('tabRenderer-setTabTitle', (event, arg) => {
  tabRenderer.setTabTitle(arg.id, arg.title)
})

ipcRenderer.on('tabRenderer-setTabIcon', (event, arg) => {
  tabRenderer.setTabIcon(arg.id, arg.icon)
})

ipcRenderer.on('tabRenderer-updateNavigationButtons', (event, arg) => {
  tabRenderer.updateNavigationButtons(arg.canGoBack, arg.canGoForward, arg.isLoading)
})

ipcRenderer.on('tabRenderer-updateAddressBar', (event, url) => {
  tabRenderer.updateAddressBar(url)
  ipcRenderer.send('overlay-checkIfBookmarked', url)
})

ipcRenderer.on('tabRenderer-updateBookmarkedButton', (event, exists, id) => {
  tabRenderer.updateBookmarkedButton(exists, id)
})

ipcRenderer.on('tabRenderer-unactivateAllTabs', (event) => {
  tabRenderer.unactivateAllTabs()
})

ipcRenderer.on('tabRenderer-updateTargetURL', (event, url) => {
  tabRenderer.updateTargetURL(url)
})

ipcRenderer.on('tabRenderer-moveTabBefore', (event, id, beforeId) => {
  tabRenderer.moveTabBefore(id, beforeId)
})

ipcRenderer.on('tabRenderer-moveTabToEnd', (event, id) => {
  tabRenderer.moveTabToEnd(id)
})

ipcRenderer.on('tabRenderer-setHomePage', (event, homePage) => {
  const btn = document.getElementById('home-btn')
  if (homePage.on === 1) {
    btn.style.display = ''
    btn.onclick = () => {
      goHome()
    }
    btn.title = 'Go home\n(' + homePage.url + ')'
  } else {
    btn.style.display = 'none'
  }
})

ipcRenderer.on('tabRenderer-setTabVisibility', (event, id, bool) => {
  tabRenderer.setTabVisibility(id, bool)
})

ipcRenderer.on('tabRenderer-updateTabsPositions', (event) => {
  tabRenderer.updateTabsPositions()
})

ipcRenderer.on('tabRenderer-showTabPreview', (event, id, title, url) => {
  tabRenderer.showTabPreview(id, title, url)
})

function init () {
  loadWinControlsModule().then((winControls) => {
    applyWinControls(winControls.systemTitlebar)
  })

  updateTheme()
}

document.onkeyup = function (e) {
  if (document.getElementById('find-input') === document.activeElement) {
    if (e.which === 27) {
      closeFindPanel()
    }
    if (e.which === 13) {
      if (e.shiftKey) {
        findPrev()
      } else {
        findNext()
      }
    }
    if (e.which === 38) {
      e.preventDefault()
      findPrev()
    }
    if (e.which === 40) {
      e.preventDefault()
      findNext()
    }
  }
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    init()
  }
}
