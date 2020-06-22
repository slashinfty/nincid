const { remote } = require('electron')
const { Menu, MenuItem } = remote
var showReturnToSetup = false

const menu = new Menu()
menu.append(new MenuItem(
  {
    label: 'Return to Setup',
    visible: showReturnToSetup,
    click(e, win) {
      document.body.style.backgroundImage = "none"
      document.getElementById("settings-wrapper").style.removeProperty("display")
      win.setSize(500, 275)
      document.getElementById("buttons-container").innerHTML = ""
      showReturnToSetup = false
    }
  }
))
menu.append(new MenuItem(
  {
    label: 'Open Developer Tools',
    role: 'toggleDevTools'
  }
))
menu.append(new MenuItem(
  {
    label: 'Quit NinCID',
    role: 'quit'
  }
))

window.addEventListener('contextmenu', e => {
  e.preventDefault()
  menu.popup({ window: remote.getCurrentWindow() })
}, false)