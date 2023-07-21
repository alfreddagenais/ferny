const { ipcRenderer } = require('electron')
const ppath = require('persist-path')('Ferny')
const fs = require('fs')

const saveFileToJsonFolder = require('../modules/saveFileToJsonFolder.js')
const loadTheme = require('../modules/loadTheme.js')
const applyTheme = require('../modules/applyTheme.js')
const applyWinControls = require('../modules/applyWinControls.js')

function updateTheme () {
  loadTheme().then(function (theme) {
    applyTheme(theme)
  })
}

function requestTheme (theme) { // eslint-disable-line no-unused-vars
  saveFileToJsonFolder(null, 'theme', theme).then(function (bool) {
    loadTheme(theme).then(function (themeObj) {
      ipcRenderer.send('request-change-theme', themeObj)
      applyTheme(themeObj)
    })
  })
}

function chooseSlide (i) {
  const dots = document.getElementsByClassName('dot')
  const tabs = document.getElementsByClassName('tab')

  for (let j = 0; j < dots.length; j++) {
    dots[j].classList.remove('active')
    tabs[j].classList.remove('active')
  }

  dots[i].classList.add('active')
  tabs[i].classList.add('active')

  if (i === 0) {
    document.getElementById('prev-btn').classList.add('disable')
  } else {
    document.getElementById('prev-btn').classList.remove('disable')
  }
  if (i === dots.length - 1) {
    document.getElementById('next-btn').classList.add('disable')
    document.getElementById('skip-btn').classList.add('disable')
  } else {
    document.getElementById('next-btn').classList.remove('disable')
    document.getElementById('skip-btn').classList.remove('disable')
  }
}

function nextSlide () {
  const dots = document.getElementsByClassName('dot')
  for (let i = 0; i < dots.length - 1; i++) {
    if (dots[i].classList.contains('active')) {
      chooseSlide(i + 1)
      break
    }
  }
}

function prevSlide () {
  const dots = document.getElementsByClassName('dot')
  for (let i = 1; i < dots.length; i++) {
    if (dots[i].classList.contains('active')) {
      chooseSlide(i - 1)
      break
    }
  }
}

function loadSearchEngine () {
  try {
    const searchEngine = fs.readFileSync(ppath + '/json/searchengine.json')

    const radios = document.getElementsByName('search-engine')
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].value === searchEngine) {
        radios[i].checked = true
        break
      }
    }
  } catch (e) {

  }
}

function tabsWheel (event) { // eslint-disable-line no-unused-vars
  if (event.deltaY < 0) {
    prevSlide()
  }
  if (event.deltaY > 0) {
    nextSlide()
  }
}

function closeWindow () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-close-welcome')
}

function moreSettings (shortcutId) { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-open-settings', shortcutId)
}

function changeWelcome (bool) { // eslint-disable-line no-unused-vars
  if (bool) {
    saveFileToJsonFolder('welcome', 1)
  } else {
    saveFileToJsonFolder('welcome', 0)
  }
}

function openAppPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-open-url-in-new-tab', 'https://moduleart.github.io/ferny')
}

function openDeveloperPage () { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-open-url-in-new-tab', 'https://moduleart.github.io/')
}

function loadStartPage () {
  try {
    const startPage = fs.readFileSync(ppath + '/json/startpage.json')
    document.getElementById('start-page-input').value = startPage
  } catch (e) {

  }
}

function setStartPageLikeHomePage () { // eslint-disable-line no-unused-vars
  try {
    const jsonstr = fs.readFileSync(ppath + '/json/home.json')
    const data = JSON.parse(jsonstr)
    document.getElementById('start-page-input').value = data.url
  } catch (e) {

  }
}

function saveStartPage () { // eslint-disable-line no-unused-vars
  const startPage = document.getElementById('start-page-input').value

  saveFileToJsonFolder('startpage', startPage).then(function () {
    notif('Start page saved: ' + startPage, 'success')

    ipcRenderer.send('request-set-start-page', startPage)
  })
}

function loadBookmarksBar () {
  try {
    const jsonstr = fs.readFileSync(ppath + '/json/bookmarksbar.json')
    const Data = JSON.parse(jsonstr)

    if (Data.on) {
      document.getElementById('bookmarks-bar-checkbox').checked = true
    }

    const radios = document.getElementsByName('bbar-layout')
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].value === Data.layout) {
        radios[i].checked = true
        break
      }
    }
  } catch (e) {

  }
}

function loadHomePage () {
  try {
    const jsonstr = fs.readFileSync(ppath + '/json/home.json')
    const Data = JSON.parse(jsonstr)
    document.getElementById('home-page-input').value = Data.url
    if (Data.on === 1) {
      document.getElementById('home-page-checkbox').checked = true
    }
  } catch (e) {

  }
}

function notif (text, type) {
  const Data = {
    text,
    type
  }
  ipcRenderer.send('request-add-status-notif', Data)
}

function moreInfo (btn) { // eslint-disable-line no-unused-vars
  btn.classList.toggle('active')
  btn.nextElementSibling.classList.toggle('active')
}

function requestSearchEngine (engine) { // eslint-disable-line no-unused-vars
  ipcRenderer.send('request-set-search-engine', engine)
}

function keyDown (e) {
  e = e || window.event

  if (e.keyCode === '37') {
    prevSlide()
  } else if (e.keyCode === '39') {
    nextSlide()
  }
}

function loadWelcome () {
  try {
    const welcomeOn = fs.readFileSync(ppath + '/json/welcome.json')
    if (welcomeOn === 1) {
      document.getElementById('welcome-checkbox').checked = true
    } else {
      document.getElementById('welcome-checkbox').checked = false
    }
  } catch (e) {

  }
}

function saveHomePage () { // eslint-disable-line no-unused-vars
  const url = document.getElementById('home-page-input').value
  let on = document.getElementById('home-page-checkbox').checked

  if (url.length <= 0) {
    notif('First enter the home page URL', 'warning')
  } else {
    if (on) {
      on = 1
    } else {
      on = 0
    }

    if (!fs.existsSync(ppath + '/json')) {
      fs.mkdirSync(ppath + '/json')
    }
    saveFileToJsonFolder('home', JSON.stringify({ url, on })).then(function () {
      notif('Home page saved: ' + url, 'success')

      ipcRenderer.send('request-update-home-page')
    })
  }
}

function requestBookmarksBar (on, layout) { // eslint-disable-line no-unused-vars
  if (on != null) {
    if (on) {
      on = 1
    } else {
      on = 0
    }
  }

  const Data = {
    on,
    layout
  }

  ipcRenderer.send('request-set-bookmarks-bar', Data)
}

ipcRenderer.on('action-set-about', (event, arg) => {
  document.getElementById('version').innerHTML = 'v' + arg.version + ' / ' + arg.arch + ' / ' + arg.platform
})

ipcRenderer.on('action-blur-window', (event, arg) => {
  document.getElementById('titlebar').classList.add('blur')
})

ipcRenderer.on('action-focus-window', (event, arg) => {
  document.getElementById('titlebar').classList.remove('blur')
})

function init () {
  applyWinControls('only-close')

  updateTheme()

  loadSearchEngine()
  loadHomePage()
  loadStartPage()
  loadBookmarksBar()
  loadWelcome()

  ipcRenderer.send('request-set-about')

  document.onkeydown = keyDown
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    init()
  }
}
