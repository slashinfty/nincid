const SerialPort = require('serialport')

document.addEventListener("DOMContentLoaded", () => {
    let PortOptions = new DocumentFragment()
    SerialPort.list().then(ports => {
      ports.forEach(port => {
        console.log(port) //checking if it works
        if (port.manufacturer != undefined) {
          const PortOptionElement = document.createElement('option')
          PortOptionElement.setAttribute('value', port.path)
          PortOptionElement.innerText = port.path + ' - ' + port.manufacturer
          PortOptions.appendChild(PortOptionElement)
        }
      })
      document.getElementById("port-select").appendChild(PortOptions)
    })

    document.getElementById("version-number").innerText = process.env.npm_package_version
  })