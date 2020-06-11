const fs = require('fs');
const path = require('path');
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

    activePort = new SerialPort(document.getElementById("port-select").value, {
      baudRate: 115200
    });
    activePort.on('data', function (data) {
      console.log('Data:', data)
    })
}