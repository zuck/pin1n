'use strict';

var ipc = require('electron').ipcRenderer;

function printTo() {
  ipc.send('print-to');
}

if (module) {
  module.exports = printTo;
}
