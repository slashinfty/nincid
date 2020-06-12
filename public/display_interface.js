const fs = require('fs');
const path = require('path');
const readline = require('readline');
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
  //activePort.on('data', data => {
    //document.getElementById("down").style.visibility = data[0] === 0 ? "hidden" : "visible"
    //if(data[3] !== 0) console.log("A");
  //})
}

function controllerDisplay(consol) {
  const consoleObject = {
    "nes": [

    ],
    "snes": [
      {"button": "down", "input": 0},
      {"button": "left", "input": 1},
      {"button": "right", "input": 2},
      {"button": "a", "input": 3},
      {"button": "x", "input": 4},
      {"button": "l", "input": 5},
      {"button": "r", "input": 6},
      {"button": "b", "input": 12},
      {"button": "y", "input": 13},
      {"button": "select", "input": 14},
      {"button": "start", "input": 15},
      {"button": "up", "input": 16}
    ],
    "n64": [

    ],
    "gcn": [

    ]
  }
  activePort.on('data', data => {
    consoleObject.consol.forEach(but => {
      document.getElementById(but.button).style.visibility = data[but.input] === 0 ? "hidden" : "visible"
    })
  })
}