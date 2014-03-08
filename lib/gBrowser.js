const { Cc, Ci } = require('chrome');

let wm = Cc['@mozilla.org/appshell/window-mediator;1']
         .getService(Ci.nsIWindowMediator);
let mainWindow = wm.getMostRecentWindow('navigator:browser');
let gb = mainWindow.gBrowser;

exports.gBrowser = gb;
