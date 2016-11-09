'use strict';

var ipc = require('electron').ipcRenderer;

function printToPDF() {
  ipc.send('print-to-pdf');
}

if (module) {
  module.exports = printToPDF;
}
