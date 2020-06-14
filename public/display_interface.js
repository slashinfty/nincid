const path = require('path');
const ByteLength = require('@serialport/parser-byte-length')
var activePort;
var skinPath;

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
    const buttonID = button.hasOwnProperty("name") ? button.name : button.xname.slice(0, -2)
    ButtonElement.setAttribute("id", buttonID)
    ButtonElement.setAttribute("src", skinPath + "/" + button.image)
    const widthHeight = button.hasOwnProperty("width") ? "height:" + button.height + "px;width:" + button.width + "px;" : ""
    ButtonElement.setAttribute("style", "position:fixed;left:" + button.x + "px;top:" + button.y + "px;visibility:hidden;" + widthHeight)
    ButtonHolder.appendChild(ButtonElement)
  })
  document.getElementById("buttons-container").appendChild(ButtonHolder)

  // Open port and start
  activePort = new SerialPort(document.getElementById("port-select").value, {
    baudRate: 115200
  });

  controllerDisplay(consoleName)
}

function controllerDisplay(consol) {
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
      ]
    },
    {
      "name": "gcn",
      "buttons": []
    },
    {
      "name": "sgb",
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
  
  const activeConsole = consoleObject.find(obj => obj.name === consol)
  const consoleButtons = activeConsole.buttons
  const parser = activePort.pipe(new ByteLength({length: activeConsole.length}))
  parser.on('data', data => {
    console.log(data);
    consoleButtons.forEach(but => {
      document.getElementById(but.button).style.visibility = data[but.input] === 0 ? "hidden" : "visible"
    })
  })
  //activePort.on('data', data => {
    //console.log(data);
    //activeConsole.forEach(but => {
      //document.getElementById(but.button).style.visibility = data[but.input] === 0 ? "hidden" : "visible"
    //})
  //})
}