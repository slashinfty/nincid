const upath = require('upath');
const ByteLength = require('@serialport/parser-byte-length')
const { dialog } = require('electron').remote
const fs = require('fs')
var skinPath;

const consoleObject = [
  {
    "name": "nes",
    "length": 9,
    "buttons": [
      {"button": "a", "input": 0},
      {"button": "b", "input": 1},
      {"button": "select", "input": 2},
      {"button": "start", "input": 3},
      {"button": "up", "input": 4},
      {"button": "down", "input": 5},
      {"button": "left", "input": 6},
      {"button": "right", "input": 7}
    ]
  },
  {
    "name": "snes",
    "length": 17,
    "buttons": [
      {"button": "b", "input": 0},
      {"button": "y", "input": 1},
      {"button": "select", "input": 2},
      {"button": "start", "input": 3},
      {"button": "up", "input": 4},
      {"button": "down", "input": 5},
      {"button": "left", "input": 6},
      {"button": "right", "input": 7},
      {"button": "a", "input": 8},
      {"button": "x", "input": 9},
      {"button": "l", "input": 10},
      {"button": "r", "input": 11}
    ]
  },
  {
    "name": "n64",
    "length": 33,
    "buttons": [
      {"button": "a", "input": 0},
      {"button": "b", "input": 1},
      {"button": "z", "input": 2},
      {"button": "start", "input": 3},
      {"button": "up", "input": 4},
      {"button": "down", "input": 5},
      {"button": "left", "input": 6},
      {"button": "right", "input": 7},
      {"button": "l", "input": 10},
      {"button": "r", "input": 11},
      {"button": "cup", "input": 12},
      {"button": "cdown", "input": 13},
      {"button": "cleft", "input": 14},
      {"button": "cright", "input": 15}
    ],
    "sticks": [
      {"stick": "stick", "xinput": 16, "yinput": 24}
    ]
  },
  {
    "name": "gcn",
    "length": 65,
    "buttons": [
      {"button": "start", "input": 3},
      {"button": "y", "input": 4},
      {"button": "x", "input": 5},
      {"button": "b", "input": 6},
      {"button": "a", "input": 7},
      {"button": "l", "input": 9},
      {"button": "r", "input": 10},
      {"button": "z", "input": 11},
      {"button": "up", "input": 12},
      {"button": "down", "input": 13},
      {"button": "right", "input": 14},
      {"button": "left", "input": 15}
    ],
    "sticks": [
      {"stick": "stick", "xinput": 16, "yinput": 24},
      {"stick": "cstick", "xinput": 32, "yinput": 40}
    ]
  },
  {
    "name": "sgb",
    "length": 17,
    "buttons": [
      {"button": "a", "input": 0},
      {"button": "b", "input": 1},
      {"button": "select", "input": 2},
      {"button": "start", "input": 3},
      {"button": "up", "input": 4},
      {"button": "down", "input": 5},
      {"button": "left", "input": 6},
      {"button": "right", "input": 7}
    ]
  }
]

function loadDisplay() {
  // Get settings, find object, load background.
  document.getElementById("settings-wrapper").style.display = "none"
  const consul = document.getElementById("console-select").value
  const color = document.getElementById("color-select").value
  skinPath = upath.toUnix(upath.join(__dirname, "../static/skins/", consul))
  const skinJson = require(`${skinPath}/skin.json`)
  const background = skinJson.background.find(skin => skin.name === color).image
  const backPath = upath.toUnix(upath.join(skinPath, background))
  document.body.style.backgroundImage = "url(" + backPath + ")"
  
  // Resize window based on height/width in object.
  const win = require("electron").remote.BrowserWindow.getFocusedWindow();
  win.setMinimumSize(skinJson.width, skinJson.height)
  win.setContentSize(skinJson.width, skinJson.height)

  // Set buttons in place.
  const ButtonHolder = new DocumentFragment()
  skinJson.buttons.forEach(button => {
    const ButtonElement = document.createElement("img")
    const buttonID = button.name
    ButtonElement.setAttribute("id", buttonID)
    const buttonPath = upath.toUnix(upath.join(skinPath, button.image))
    ButtonElement.setAttribute("src", buttonPath.toString())
    const widthHeight = button.hasOwnProperty("width") ? "height:" + button.height + "px;width:" + button.width + "px;" : ""
    const vis = button.hasOwnProperty("range") ? "visibility:visible;" : "visibility:hidden;"
    ButtonElement.setAttribute("style", "position:fixed;left:" + button.x + "px;top:" + button.y + "px;" + vis + widthHeight)
    ButtonHolder.appendChild(ButtonElement)
  })
  document.getElementById("buttons-container").appendChild(ButtonHolder)

  // Open port and start.
  port = new SerialPort(document.getElementById("port-select").value, {
    baudRate: 115200
  });

  readPort(port, consul)
}

function customSkin() {
  // Open dialog to select directory.
  const win = require("electron").remote.getCurrentWindow();
  const dir = dialog.showOpenDialogSync({
    "title": "Select Custom Skin Directory",
    "properties": [
      "openDirectory"
    ]
  })[0]
  const jsonPath = upath.toUnix(upath.join(dir, "skin.json"))
  if (!fs.existsSync(jsonPath)) {
    dialog.showErrorBox("Error Loading Custom Skin", "Can not find " + jsonPath)
  } else {
    try {
      // Get settings and load background.
      document.getElementById("settings-wrapper").style.display = "none"
      let rawSkinData = fs.readFileSync(jsonPath)
      let skinJson = JSON.parse(rawSkinData)
      const allowedConsoles = ["nes", "snes", "n64", "gcn", "sgb"]
      if (!skinJson.hasOwnProperty("console") || !allowedConsoles.includes(skinJson.console)) throw "missing/incorrect console"
      if (!skinJson.hasOwnProperty("background")) throw "missing background"
      const background = upath.toUnix(upath.join(dir, skinJson.background))
      document.body.style.backgroundImage = "url(" + background + ")"

      // Resize window based on height/width in object.
      if (!skinJson.hasOwnProperty("width") || !skinJson.hasOwnProperty("height")) throw "missing height/width"
      win.setMinimumSize(skinJson.width, skinJson.height)
      win.setContentSize(skinJson.width, skinJson.height)

      // Set buttons in place.
      const allowedButtons = ["a", "b", "x", "y", "z", "l", "r", "start", "select", "up", "down", "left", "right", "stick", "cup", "cdown", "cleft", "cright", "cstick"]
      const ButtonHolder = new DocumentFragment()
      skinJson.buttons.forEach(button => {
        if (!allowedButtons.includes(button.name)) throw button.name + " is not a valid button name."
        const ButtonElement = document.createElement("img")
        const buttonID = button.name
        ButtonElement.setAttribute("id", buttonID)
        if (!button.hasOwnProperty("image") || !fs.existsSync(upath.toUnix(upath.join(dir, button.image)))) throw "no image"
        const buttonPath = upath.toUnix(upath.join(dir, button.image))
        ButtonElement.setAttribute("src", buttonPath.toString())
        const widthHeight = button.hasOwnProperty("width") ? "height:" + button.height + "px;width:" + button.width + "px;" : ""
        const vis = button.hasOwnProperty("range") ? "visibility:visible;" : "visibility:hidden;"
        if (button.hasOwnProperty("range")) ButtonElement.dataset.range = button.range;
        if (!button.hasOwnProperty("x") || !button.hasOwnProperty("y")) throw "missing x/y coordinates for " + button.name
        ButtonElement.setAttribute("style", "position:fixed;left:" + button.x + "px;top:" + button.y + "px;" + vis + widthHeight)
        ButtonHolder.appendChild(ButtonElement)
      })
      document.getElementById("buttons-container").appendChild(ButtonHolder)
  

      // Open port and start.
      let port = new SerialPort(document.getElementById("port-select").value, {
        baudRate: 115200
      });
      readPort(port, skinJson.console)
    } catch (error) {
      // Display the error message
      dialog.showErrorBox("Error Loading Custom Skin", error.toString())
      // Set background to black and put up settings
      document.body.style.backgroundImage = "none"
      document.getElementById("settings-wrapper").style.removeProperty("display")
      win.setMinimumSize(650, 300)
      win.setContentSize(650, 300)
      // Remove all buttons and sticks
      document.getElementById("buttons-container").innerHTML = ""
    }
  }
}

function readPort(activePort, consoleName) {
  // Prepare elements based on console.
  const activeConsole = consoleObject.find(obj => obj.name === consoleName)
  const consoleButtons = activeConsole.buttons
  const consoleSticks = activeConsole.hasOwnProperty('sticks') ? activeConsole.sticks : null
  if (consoleSticks != null) { consoleSticks.forEach(stick => {
    const el = document.getElementById(stick.stick)
    stick.left = parseInt(el.style.left)
    stick.top = parseInt(el.style.top)
    stick.range = parseInt(el.dataset.range)
  })}
  
  // Functions for interpreting analog sticks.
  const isHighBit = bit => bit & 0x0F !== 0
  const stickRead = bitArray => {
    let val = 0
    if (consoleName === 'n64') {
      for (let i = 1; i < 8; i++) { if (isHighBit(bitArray[i])) { val |= 1 << (7 - i) } }
      return (isHighBit(bitArray[0]) ? (val - 128) : val) * 0.0078125
    } else {
      for (let i = 0; i < 8; i++) { if (isHighBit(bitArray[i])) { val |= 1 << (7 - i) } }
      return (val - 128) * 0.0078125
    }
  };

  // Read data from the port.
  const parser = activePort.pipe(new ByteLength({ length: activeConsole.length }))
  parser.on('data', data => {
    let offset = data.indexOf(10) + 1
    if (consoleSticks != null) {
      consoleSticks.forEach(stk => {
        let x = stickRead(Array.from({ length: 8 }, (_, i) => data[((stk.xinput + offset) % data.length) + i]))
        let y = stickRead(Array.from({ length: 8 }, (_, i) => data[((stk.yinput + offset) % data.length) + i]))
        let el = document.getElementById(stk.stick)
        el.style.left = ((x * stk.range) + stk.left) + "px"
        el.style.top = (stk.top - (y * stk.range)) + "px"
      })
    }
    consoleButtons.forEach(but => {
      document.getElementById(but.button).style.visibility = data[(but.input + offset) % data.length] === 0 ? "hidden" : "visible"
    })
  })
}