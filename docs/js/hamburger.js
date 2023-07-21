function toggleMenu () { // eslint-disable-line no-unused-vars
  const menuIcon = document.getElementById('hamburger').getElementsByTagName('img')[0]
  const header = document.getElementById('header')

  if (header.classList.contains('show')) {
    header.classList.remove('show')
    menuIcon.src = 'imgs/icons/menu.png'
  } else {
    header.classList.add('show')
    menuIcon.src = 'imgs/icons/close.png'
  }
}

function buttonOff (button) { // eslint-disable-line no-unused-vars
  button.classList.remove('show')
}

function buttonToggle (button) { // eslint-disable-line no-unused-vars
  button.classList.toggle('show')
}

function toggleUpdate (div) { // eslint-disable-line no-unused-vars
  div.parentNode.classList.toggle('expand')
}

function moreUpdates () { // eslint-disable-line no-unused-vars
  document.getElementById('more-updates').style.display = 'none'
  const updates = document.getElementsByClassName('update')
  for (let i = 0; i < updates.length; i++) {
    if (!updates[i].classList.contains('show')) {
      updates[i].classList.add('show')
    }
  }
}
