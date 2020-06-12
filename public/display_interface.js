const path = require('path');
var activePort;
var skinPath;

function loadDisplay() {
  // Get settings, find JSON, load background.
  document.getElementById("settings-wrapper").style.display = "none"
  const consoleName = document.getElementById("console-select").value
  const color = document.getElementById("color-select").value
  skinPath = consoleName === "sgb" ? path.join(__dirname, "../static/skins/nes") : path.join(__dirname, "../static/skins/", consoleName)
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
      "buttons": []
    },
    {
      "name": "snes",
      "buttons": [
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
      ]
    },
    {
      "name": "n64",
      "buttons": []
    },
    {
      "name": "gcn",
      "buttons": []
    },
    {
      "name": "sgb",
      "buttons": [
        {"button": "down", "input": 0},
        {"button": "left", "input": 1},
        {"button": "right", "input": 2},
        {"button": "a", "input": 3},
        {"button": "b", "input": 4},
        {"button": "select", "input": 5},
        {"button": "start", "input": 6},
        {"button": "up", "input": 7}
      ]
    }
  ]
  
  const activeConsole = consoleObject.find(obj => obj.name === consol).buttons
  activePort.on('data', data => {
    console.log(data);
    //activeConsole.forEach(but => {
      //document.getElementById(but.button).style.visibility = data[but.input] === 0 ? "hidden" : "visible"
    //})
  })
}