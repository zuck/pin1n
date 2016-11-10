'use strict';

var fs = require('fs');
var electron = require('electron');
var env = process.env.NODE_ENV || 'development';

// Hot-reload on development.
if (env == "development") {
  require('electron-reload')(__dirname, {
    // electron: require('electron-prebuilt') // For hard reset...
  });
}

// Module to control application life.
const app = electron.app;

// Module to control IPC
const ipc = electron.ipcMain;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
app.mainWindow = null;

// This method is responsible of creating the main window of the application.
function createWindow () {
  // Create the browser window.
  app.mainWindow = new BrowserWindow({
    width: 1024, height: 768,
    icon: __dirname + "/ux/images/logo.png",
    backgroundColor: '#282c34',
    show: false
  });

  // Load the index.html of the app.
  app.mainWindow.loadURL(`file://${__dirname}/ux/templates/index.html`);
  app.mainWindow.webContents.on('did-finish-load', function() {
    // During development, open the window not maximized and launch dev tools.
    // On production, instead, maximize the window and don't show dev tools.
    if (env == "development") {
      app.mainWindow.webContents.openDevTools();
    } else {
      app.mainWindow.maximize();
    }
    // Show window only when content is ready.
    app.mainWindow.show();
  });

  // Emitted when the window is closed.
  app.mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', function () {
  // Cleanup on quitting...
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (app.mainWindow === null)
    createWindow();
});

ipc.on('print-to', function (event) {
  var win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.print({});
});
