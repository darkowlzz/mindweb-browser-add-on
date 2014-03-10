const data = require('sdk/self').data;
const { Page } = require('sdk/page-worker');
const tabs = require('sdk/tabs');
const { PageMod } = require('sdk/page-mod');
const { Cu, Cc, Ci } = require('chrome');
const { gBrowser } = require('gBrowser');
const notifications = require('sdk/notifications');

let mindModeIndex = 0;

let mindMode = {
  '0': 'OFF',
  '1': 'SCROLL',
  '2': 'TABS',
  '3': 'RELOAD'
}

function mindModeChange() {
  mindModeIndex++;
  if (mindModeIndex > 3) {
    mindModeIndex = 0;
  }
  notifications.notify({
    title: "Mind-web interface",
    text: "Mind Mode: " + mindMode[mindModeIndex]
  });
}

// page worker which hosts websocket client
ws_worker = Page({
  contentScriptFile: data.url('worker.js'),
  contentURL: data.url('worker.html')
});

// pagemod to perform on page actions
PageMod({
  include: '*',
  contentScriptFile: data.url('page.js'),
  attachTo: ['existing', 'top'],
  onAttach: function(worker) {
    console.log('attached!!');

  }
});


// Listen and respond to ws request
ws_worker.port.on('yolo', function(val) {
  console.log('command received: ' + val);
  let cmds = val.split(' ');
  switch (cmds[0]) {
    case 'home':
      console.log('opening home');
      gBrowser.selectedTab = gBrowser.addTab('about:home');
      break;

    case 'open':
      console.log('opening ' + cmds[1]);
      gBrowser.selectedTab = gBrowser.addTab(cmds[1]);
      break;

    case 'scrolldown':
      console.log('scrolling down');
      break;

    case 'scrollup':
      console.log('scrolling up');
      break;

    case 'closetab':
      console.log('closing tab');
      break;

    case 'reload':
      console.log('reloading');
      break;

    case 'changemode':
      console.log('change mode');
      mindModeChange();
      break;
  }
});


console.log('sending foo from add-on script');
ws_worker.port.emit('foo');

ws_worker.port.on('bar', function() {
  console.log('received bar at add-on script');
});
