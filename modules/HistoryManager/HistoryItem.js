const { join } = require('path')
const EventEmitter = require('events')
const GetAvColor = require('color.js')
const { ipcRenderer, clipboard } = require('electron')
const parsePath = require('parse-path')
const fileExtension = require('file-extension')

const extToImagePath = require(join(__dirname, '/../extToImagePath.js'))
const rgbToRgbaString = require(join(__dirname, '/../rgbToRgbaString.js'))
const epochToDate = require(join(__dirname, '/../epochToDate.js'))
const epochToTime = require(join(__dirname, '/../epochToTime.js'))

class HistoryItem extends EventEmitter {
  history = []
  node = null
  url = null
  id = null
  time = null
  title = null

  constructor (id, url, time, title) {
    super()

    this.id = id
    this.url = url
    this.time = time
    this.title = title

    this.node = document.createElement('button')
    this.node.classList.add('history-item')
    this.node.name = id
    this.node.id = 'history-' + id
    this.node.innerHTML = `
            <label class='history-title'>${title}</label>
            <label class='history-url'>${url}</label>
            <label class="history-time">${epochToDate(time)} / ${epochToTime(time)}</label>
        `
    this.node.onclick = () => {
      this.open()
    }
    this.node.onauxclick = (event) => {
      event.preventDefault()
      if (event.which === 2) {
        ipcRenderer.send('tabManager-addTab', url, false)
      }
    }
    this.node.onkeyup = (event) => {
      event.preventDefault()
    }

    const historyIcon = document.createElement('img')
    historyIcon.classList.add('history-icon')
    if (parsePath(url).protocol === 'file') {
      historyIcon.src = extToImagePath(fileExtension(url))
      const fileName = url.replace(/^.*[\\/]/, '')
      this.setTitle(fileName)
    } else {
      historyIcon.src = 'http://www.google.com/s2/favicons?domain=' + url
      historyIcon.onerror = () => {
        historyIcon.src = join(__dirname, '/../../imgs/old-icons16/history.png')
        this.updateHistoryIconColor()
      }
      if (title.substring(0, 4) === 'http') {
        this.loadTitle().then((text) => {
          this.setTitle(text)
        })
      }
    }
    this.node.appendChild(historyIcon)
    this.updateHistoryIconColor()

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.classList.add('history-checkbox')
    checkbox.onclick = (event) => {
      event.stopPropagation()
    }
    this.node.appendChild(checkbox)

    const copyBtn = document.createElement('button')
    copyBtn.classList.add('history-copy')
    copyBtn.title = 'Copy URL'
    copyBtn.innerHTML = '<img name="copy-12" class="theme-icon">'
    copyBtn.onclick = (event) => {
      event.stopPropagation()
      this.copyURL()
    }
    this.node.appendChild(copyBtn)
  }

  updateHistoryIconColor () {
    const icon = this.node.getElementsByClassName('history-icon')[0]
    const color = new GetAvColor(icon)
    color.mostUsed((result) => {
      if (Array.isArray(result)) {
        icon.parentNode.style.backgroundColor = rgbToRgbaString(result[0])
      } else {
        icon.parentNode.style.backgroundColor = rgbToRgbaString(result)
      }
    })
  }

  loadTitle () {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          // resolve(xhr.responseText);

          const jsonResponse = xhr.response
          if (jsonResponse.title) {
            resolve(jsonResponse.title)
          }

          // var jsonResponseParse = JSON.parse(xhr.responseText);
          // if (jsonResponseParse.title) {
          //  resolve(jsonResponseParse.title);
          // }
        }
      }
      // TODO : Review this URL to get the correct JSON
      // https://www.cluemediator.com/how-to-get-title-and-meta-tags-from-url-using-php
      // https://www.learnwappler.com/psweb_get_external_seo_content.php
      // https://www.learnwappler.com/psweb_get_external_seo_content.php?remote_query_string=https://www.pukkatravels.com
      // http://textance.herokuapp.com/title/
      xhr.responseType = 'json'
      xhr.open('GET', 'https://www.learnwappler.com/psweb_get_external_seo_content.php?remote_query_string=' + this.url, true)
      xhr.send(null)
    })
  }

  open () {
    ipcRenderer.send('tabManager-addTab', this.url, true)
    return null
  }

  getNode () {
    return this.node
  }

  getId () {
    return this.id
  }

  getURL () {
    return this.url
  }

  getTime () {
    return this.time
  }

  getTitle () {
    return this.title
  }

  setTitle (text) {
    this.title = text
    this.node.getElementsByClassName('history-title')[0].innerHTML = text
    this.emit('title-updated', text)
  }

  isSelected () {
    return this.node.getElementsByClassName('history-checkbox')[0].checked
  }

  copyURL () {
    clipboard.writeText(this.url)
    return null
  }
}

module.exports = HistoryItem
