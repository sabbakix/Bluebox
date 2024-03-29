import { app, BrowserWindow, ipcMain, dialog } from 'electron' // Menu
import { createHash } from 'crypto'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs'
import sqlite3 from 'sqlite3'

//
// Sqlite database
//
const db = new sqlite3.Database('base.db')
if (db) {
  console.log('Database connection open.')
}

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
  db.run('INSERT INTO users (name) VALUES ("John Doe")')
  db.run('INSERT INTO users (name) VALUES ("Smith Stev")')
  db.run('INSERT INTO users (name) VALUES ("Hola Mika")')

  // db.each('SELECT * FROM users', (err, row) => {
  //   console.log(
  //     (row as { id: string; name: string }).id,
  //     (row as { id: string; name: string }).name
  //   )
  //   if (err) throw err
  // })
})

db.close((err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Database connection closed.')
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Ipc communication main to render
  function sendMessageToRender(message: string): void {
    const timestamp = Date.now()
    message = 'Hello from main timestamp:' + timestamp.toString()
    const messageHash: string = createHash('sha256').update(message, 'binary').digest('hex')
    message = message + '\n' + messageHash
    mainWindow.webContents.send('message-m2r', message)
  }
  // main event emitter
  setInterval(sendMessageToRender, 1000)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  //
  // open esternl Link
  //
  // mainWindow.webContents.setWindowOpenHandler((details) => {
  //   shell.openExternal(details.url)
  //   return { action: 'deny' }
  // })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open the DevTools.
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.webContents.openDevTools()
  }

  //showMessage(mainWindow, 'app.isPackaged:' + app.isPackaged)
}

/*
// Example of using dialog.showMessageBox
function showMessage(mainWindow, text: string): boolean {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Information',
    message: text,
    buttons: ['OK']
  })
  return true
}
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //
  // write json file
  //
  const config = {
    ip: '1234.22.11',
    port: 3000,
    color: '#333'
  }
  const configSerialized = JSON.stringify(config)
  console.log('config serialized:', configSerialized)
  console.log('config parsed:', JSON.parse(configSerialized))

  const filePath = join(app.getPath('userData'), 'config.json')
  fs.writeFile(filePath, configSerialized, (err) => {
    if (err) throw err
    console.log(join('File has been written to', filePath)),
      // Read from the text file
      fs.readFile(filePath, 'utf-8', (err, contentRead) => {
        if (err) throw err
        console.log('File content:', contentRead)
        console.log(config.color)
      })
  })

  //
  // IPC communication
  //

  // Ipc communication renderer to main
  ipcMain.on('ping', () => {
    const timestamp = Date.now()
    console.log('pong:', timestamp)
  })

  // Ipc communication renderer to main
  function handleSetTitle(event, title): void {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if (win) {
      win.setTitle(title)
    }
  }
  ipcMain.on('set-title', handleSetTitle)

  // Ipc communication renderer to main two-way
  async function handleFileOpen(): Promise<string> {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      return filePaths[0]
    } else {
      return '/'
    }
  }
  ipcMain.handle('dialog:openFile', handleFileOpen)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
