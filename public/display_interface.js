const path = require('path');
const ByteLength = require('@serialport/parser-byte-length')
var activePort;
var skinPath;

const consoleObject = [
  {
    "name": "nes",
    "length": 9,
    "buttons": []
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
    "buttons": []
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
    const buttonID = button.name // fix gcn json
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

  const activeConsole = consoleObject.find(obj => obj.name === consoleName)
  const consoleButtons = activeConsole.buttons
  const consoleSticks = activeConsole.hasOwnProperty('sticks') ? activeConsole.sticks : null
  if (consoleSticks != null) { consoleSticks.forEach(stick => {
    const el = document.getElementById(stick.stick)
    stick.left = parseInt(el.style.left)
    stick.top = parseInt(el.style.top)
    stick.range = parseInt(skinJson.buttons.find(o => o.name === stick.stick).range)
  })}
  const parser = activePort.pipe(new ByteLength({length: activeConsole.length}))

  /*
  let stickRead = bitArray => {
    let byte = 0
    bitArray.forEach((bit, index) => {
      if (bit & 0x0F != 0) { byte |= 1 << (7 - index) }
    })
    console.log('byte: ' + byte)
    byte = byte > 127 ? -1 * (256 - byte) : byte
    console.log('signed: ' + byte)
    console.log(parseFloat(byte / 128))
    return parseFloat(byte / 128)
  }
  */

  const isHighBit = bit => bit & 0x0F !== 0

  const stickRead = bitArray => {
    let val = 0
    for (let i = 1; i < 8; i++) { if (isHighBit(bitArray[i])) { val |= 1 << (7 - i) } }
    return (isHighBit(bitArray[0]) ? (val - 128) : val) / 128
  };

  parser.on('data', data => {
    //console.log(data);
    let offset = data.indexOf(10) + 1
    if (consoleSticks != null) {
      consoleSticks.forEach(stk => {
        let x = stickRead(data.slice((stk.xinput + offset) % data.length, (stk.xinput + offset + 8) % data.length))
        let y = stickRead(data.slice((stk.yinput + offset) % data.length, (stk.yinput + offset + 8) % data.length))
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