const data = require('sdk/self').data;
const { Page } = require('sdk/page-worker');
const tabs = require('sdk/tabs');
const { PageMod } = require('sdk/page-mod');
const { Cu, Cc, Ci } = require('chrome');
const { gBrowser } = require('gBrowser');

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
  if (cmds[0] === 'home') {
    console.log('opening home');
    gBrowser.selectedTab = gBrowser.addTab('about:home');
    //tabs.open('about:home');
  }
  else if (cmds[0] === 'open') {
    console.log('opening ' + cmds[1]);
    gBrowser.selectedTab = gBrowser.addTab(cmds[1]);
    //tabs.open(cmds[1]);
  }
  else if (cmds[0] === 'scrolldown') {
    console.log('scrolldown received');
    worker.port.emit('scrolldown');
  }
  else if (cmds[0] === 'scrollup') {
    console.log('scrollup received');
    worker.port.emit('scrollup');
  }
  else if (cmds[0] === 'closetab') {
    console.log('closing tab');
    tabs.activeTab.close();
    //tabs.close();
  }
  else if (cmds[0] === 'reload') {
    console.log('reloading');
    tabs.activeTab.reload();
  }
  else {
    console.log('unknown command');
  }
});

/*
ws_worker.port.on('yolo', function(val) {
  console.log("main received: " + val);
  let cmds = val.split(" ");
  if (cmds[0] == "home") {
    console.log("opening home");
    tabs.open("about:home");
  }
  else if (cmds[0] == "open") {
    console.log("opening " + cmds[1]);
    tabs.open(cmds[1]);
  }
  else {
    console.log("unknown command");
  }
});
*/

console.log('sending foo from add-on script');
ws_worker.port.emit('foo');

ws_worker.port.on('bar', function() {
  console.log('received bar at add-on script');
});
