function disableAltConsole() {
  if (document.getElementById('console-select').value === 'n64' || document.getElementById('console-select').value === 'gcn') {
    document.getElementById('color-select').options.namedItem('console-alt').disabled = true
    if (document.getElementById('color-select').options.namedItem('console-alt').selected) document.getElementById('color-select').options.namedItem('console').selected = true
  } else {
    document.getElementById('color-select').options.namedItem('console-alt').disabled = false
  }
}