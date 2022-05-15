const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')
      },
      title: 'NinCID',
      height: 300,
      width: 650,
      maximizable: false,
      resizable: false,
      backgroundColor: '#000'
  })

  // Remove the menu.
  win.setMenu(null);

  // and load the index.html of the app.
  win.loadFile('./public/index.html')
  win.webContents.openDevTools()
  // Links open in native browser.
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // Uncomment next line to enable dev tools.
  // win.webContents.openDevTools()
}

app.allowRendererProcessReuse = false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})