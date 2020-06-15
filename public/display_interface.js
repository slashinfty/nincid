const path = require('path');
const ByteLength = require('@serialport/parser-byte-length')
var activePort;
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
      {"stick": "lstick", "xinput": 16, "yinput": 24},
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
  // Get settings, find JSON, load background.
  document.getElementById("settings-wrapper").style.display = "none"
  const consoleName = document.getElementById("console-select").value
  const color = document.getElementById("color-select").value
  skinPath = path.join(__dirname, "../static/skins/", consoleName)
  const skinJson = require(`${skinPath}/skin.json`)
  const background = skinJson.background.find(skin => skin.name === color).image
  document.body.style.backgroundImage = "url(" + skinPath + "/" + background + ")"
  
  // Resize window based on height/width in JSON.
  const win = require("electron").remote.BrowserWindow.getFocusedWindow();
  win.setSize(skinJson.width, skinJson.height)

  // Set buttons in place
  let buttonArray = [];
  const ButtonHolder = new DocumentFragment()
  skinJson.buttons.forEach(button => {
    const ButtonElement = document.createElement("img")
    const buttonID = button.name
    ButtonElement.setAttribute("id", buttonID)
    ButtonElement.setAttribute("src", skinPath + "/" + button.image)
    const widthHeight = button.hasOwnProperty("width") ? "height:" + button.height + "px;width:" + button.width + "px;" : ""
    const vis = button.hasOwnProperty("range") ? "visibility:visible;" : "visibility:hidden;"
    ButtonElement.setAttribute("style", "position:fixed;left:" + button.x + "px;top:" + button.y + "px;" + vis + widthHeight)
    ButtonHolder.appendChild(ButtonElement)
  })
  document.getElementById("buttons-container").appendChild(ButtonHolder)

  // Open port and start
  activePort = new SerialPort(document.getElementById("port-select").value, {
    baudRate: 115200
  });

  // Prepare elements based on console
  const activeConsole = consoleObject.find(obj => obj.name === consoleName)
  const consoleButtons = activeConsole.buttons
  const consoleSticks = activeConsole.hasOwnProperty('sticks') ? activeConsole.sticks : null
  if (consoleSticks != null) { consoleSticks.forEach(stick => {
    const el = document.getElementById(stick.stick)
    stick.left = parseInt(el.style.left)
    stick.top = parseInt(el.style.top)
    stick.range = parseInt(skinJson.buttons.find(o => o.name === stick.stick).range)
  })}
  
  // Functions for interpreting analog sticks
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

  // Read data from the port
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