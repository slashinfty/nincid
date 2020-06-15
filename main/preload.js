const SerialPort = require('serialport')

document.addEventListener("DOMContentLoaded", () => {
  // Load list of ports
  let PortOptions = new DocumentFragment()
  SerialPort.list().then(ports => {
    ports.forEach(port => {
      if (port.manufacturer != undefined) {
        const PortOptionElement = document.createElement('option')
        PortOptionElement.setAttribute('value', port.path)
        PortOptionElement.innerText = port.path + ' - ' + port.manufacturer
        PortOptions.appendChild(PortOptionElement)
      }
    })
    document.getElementById("port-select").appendChild(PortOptions)
    if (document.getElementById("port-select").length === 0) {
      document.getElementById("start-button").style.display = "none"
      document.getElementById("scan-button").style.display = "blocK"
    }
  })
})