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
  const ButtonHolder = new DocumentFragment()
  skinJson.buttons.forEach(button => {
    const ButtonElement = document.createElement("img")
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
  activePort.on('data', data => {
    if(data[0] !== 0) console.log("down");
    if(data[3] !== 0) console.log("A");
  })
}