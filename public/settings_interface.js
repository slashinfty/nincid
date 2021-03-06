const SerialPort = require('serialport')

// Disables alternate console color selection
function disableAltConsole() {
  if (document.getElementById('console-select').value === 'n64' || document.getElementById('console-select').value === 'gcn' || document.getElementById('console-select').value === 'sgb') {
    document.getElementById('color-select').options.namedItem('console-alt').disabled = true
    if (document.getElementById('color-select').options.namedItem('console-alt').selected) document.getElementById('color-select').options.namedItem('console').selected = true
  } else {
    document.getElementById('color-select').options.namedItem('console-alt').disabled = false
  }
}

// Scans for new devices
function scanPorts() {
  let PortOptions = new DocumentFragment()
  SerialPort.list().then(ports => {
    ports.forEach(port => {
      if (port.manufacturer != undefined) {
        const PortOptionElement = document.createElement('option')
        PortOptionElement.setAttribute('value', port.path)
        PortOptionElement.innerText = port.path
        PortOptions.appendChild(PortOptionElement)
      }
    })
    document.getElementById("port-select").appendChild(PortOptions)
    if (document.getElementById("port-select").length != 0) {
      document.getElementById("scan-button").style.display = "none"
      document.getElementById("load-buttons").style.display = "block"
    }
  })
}