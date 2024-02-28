import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('base.db')

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
  db.run('INSERT INTO users (name) VALUES ("John Doe")')
  db.run('INSERT INTO users (name) VALUES ("Smith Stev")')
  db.run('INSERT INTO users (name) VALUES ("Hola Mika")')

  db.each('SELECT * FROM users', (err, row) => {
    console.log(row.id, row.name)
  })
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
    width: 940,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // write json file
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

  // Ipc communication renderer to main
  function handleSetTitle(event, title): void {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  }
  ipcMain.on('set-title', handleSetTitle)

  // Ipc communication two-way
  async function handleFileOpen(): any {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      return filePaths[0]
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
