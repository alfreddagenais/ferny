const { join } = require('path')

const rgbToRgbaString = require(join(__dirname, '/../../rgbToRgbaString.js'))

const TextNotification = require(join(__dirname, '/TextNotification.js'))

class QuestNotification extends TextNotification {
  constructor (id, autoClose, text, buttons) {
    super(id, autoClose, text)

    const img = document.createElement('img')
    img.classList.add('notif-icon', 'theme-icon')
    img.name = 'about-16'
    super.getNode().getElementsByClassName('notif-container')[0].style.backgroundColor = rgbToRgbaString('rgb(255, 168, 1)')

    super.getNode().appendChild(img)

    const buttonsContainer = document.createElement('div')
    buttonsContainer.classList.add('notif-buttons')
    super.getNode().appendChild(buttonsContainer)

    for (let i = 0; i < buttons.length; i++) {
      const btn = document.createElement('buttons')
      btn.classList.add('nav-btn', 'with-border')
      btn.innerHTML = `<img name='${buttons[i].icon}' class='theme-icon'><label>${buttons[i].text}</label>`
      btn.onclick = () => {
        eval(buttons[i].click) // eslint-disable-line no-eval
        super.close()
      }
      buttonsContainer.appendChild(btn)
    }
  }
}

module.exports = QuestNotification
