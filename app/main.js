'use strict';

var fs = require('fs');
var electron = require('electron');

function isDev() {
  var env = process.env.NODE_ENV || "production";
  return env == "development"
}

// Hot-reload on development.
if (isDev()) {
  require('electron-reload')(__dirname, {
    electron: require('electron') // For hard reset...
  });
}

// Module to control application life.
const app = electron.app;

// Module to control dialog creation.
const dialog = electron.dialog;

// Module to control IPC.
const ipc = electron.ipcMain;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Module to create native window menus.
const Menu = electron.Menu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
app.mainWindow = null;

// This method is responsible of creating a default confirmation dialog for
// application closing request.
function showClosingConfirmDialog() {
  return dialog.showMessageBox(
    app.mainWindow, {
    type: 'warning',
    buttons: ['Yes', 'No'],
    title: 'Confirm',
    message: 'Are you sure you want to quit?'
  });
}

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
    if (isDev()) {
      app.mainWindow.webContents.openDevTools();
    } else {
      app.mainWindow.maximize();
    }
    // Show window only when content is ready.
    app.mainWindow.show();
  });

  // Emitted when the window is going to be closed.
  app.mainWindow.on('close', function (evt) {
    var choice = showClosingConfirmDialog();
    if (choice !== 0) {
      // Don't close.
      evt.preventDefault();
    }
  })

  // Emitted when the window is closed.
  app.mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.mainWindow = null;
  })
}

// This method is responsible of creating the main window menu.
function createWindowMenu() {
  var template = [{
    label: 'File',
    submenu: [{
      label: 'Exit',
      click (item, focusedWindow) {
        if (focusedWindow) {
          var choice = showClosingConfirmDialog();
          if (choice === 0) app.quit();
        }
      }
    }]
  }, {
    label: 'Edit',
    submenu: [{
      role: 'undo'
    }, {
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      role: 'cut'
    }, {
      role: 'copy'
    }, {
      role: 'paste'
    }, {
      role: 'selectall'
    }]
  }, {
    label: 'View',
    submenu: [{
      role: 'resetzoom'
    }, {
      role: 'zoomin'
    }, {
      role: 'zoomout'
    }, {
      type: 'separator'
    }, {
      role: 'togglefullscreen'
    }]
  }, {
    role: 'window',
    submenu: [{
      role: 'minimize'
    }, {
      role: 'close'
    }]
  }, {
    role: 'help',
    submenu: [{
      label: 'About',
      click (item, focusedWindow) {
        dialog.showMessageBox(
          app.mainWindow, {
          buttons: ['OK'],
          title: 'About ' + app.getName() + ' - v' + app.getVersion(),
          icon: electron.nativeImage.createFromPath(__dirname + '/ux/images/logo.png'),
          message: 'A user-friendly chinese-to-pinyin converter.',
          detail: fs.readFileSync(__dirname + '/../LICENSE', { encoding: 'utf8'})
        });
      }
    }]
  }];

  if (isDev()) {
    // Window menu.
    template[3].submenu = [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click (item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload();
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click (item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
      }
    }, {
      type: 'separator'
    }].concat(template[3].submenu);
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [{
        role: 'about'
      }, {
        type: 'separator'
      }, {
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        role: 'hide'
      }, {
        role: 'hideothers'
      }, {
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'quit'
      }]
    });

    // Window menu.
    template[4].submenu = [{
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: 'Zoom',
      role: 'zoom'
    }, {
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      role: 'front'
    }];
  }

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow();
  createWindowMenu();
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
  if (app.mainWindow === null) {
    createWindow();
    createWindowMenu();
  }
});

ipc.on('print-to', function (event) {
  var win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.print({});
});
