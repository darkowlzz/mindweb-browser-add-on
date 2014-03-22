var WebSocketServer = require('ws').Server,
    net = require('net'),
    wss = new WebSocketServer({port: 54014, host:'127.0.0.1'}),
    w = new WebSocketServer({port: 54015, host: '127.0.0.1'});

console.log('ws1: listening to port 54014');
console.log('ws2: listening to port 54015');

wss.broadcast = function(data) {
  console.log('ws1: broadcasting...');
  for (var i in this.clients) {
    console.log('ws1: client '+ i);
    this.clients[i].send(JSON.stringify(data));
  }
};

wss.on('connection', function(ws) {
  console.log('54014: new client connected');
});

w.on('connection', function(ws) {
  console.log("54015: new client");
  ws.on('message', function(message) {
    console.log("54015: received " + message);
    wss.broadcast(message);
  });
});

// Client for mindwave connector server.
var client = net.connect({port: 13854},
  function() {
    console.log('connected to mindwave connector');
    msg = {
      "appKey": "c40975447149c129bb8e269efc5427620acfc82b",
      "appName": "brain-web"
    }
    client.write(JSON.stringify(msg));
  }
);

// On receiving data from mindwave
client.on('data', function(data) {
  try {
    var d = data.toString();
    // tokenize the received stream
    d = d.split('\r');
    // parse each token as JSON object
    d.forEach(function(item) { 
      var val = JSON.parse(item);
      //console.log(val);
      
      if (val.eSense) {
        console.log(val);
        wss.broadcast(val);
      }
      /**
       * For controlling the browser
       *
      if (val.blinkStrength) {
        //console.log(val);
        blink();
      } else if (val.eSense) {
        console.log('mode: ' + mindModeIndex);
        if (mindModeIndex === 1) {
          console.log('meditation: ' + val.eSense['meditation']);
          console.log('attention: ' + val.eSense['attention']);
          if (val.eSense['meditation'] > 60) {
            wss.broadcast('home');
            console.log('home opened');
          }
        }
        //console.log(val);
      }
       */
    });
  }
  catch (err) {
    //console.log('error: ' + err);
  }
});

client.on('end', function() {
  console.log('client disconnected');
});


var mindModeIndex = 0;
var mindMode = {
  '0': 'OFF',
  '1': 'SCROLL',
  '2': 'TAB',
  '3': 'RELOAD'
}

var blinkCounter = 0;
var timer = 0;

/**
 * Called when a blink is detected.
 * Spawns a timer only when there is no timer instance.
 */
function blink() {
  console.log('blinked');
  blinkCounter++;
  if (timer === 0) {
    timer = 1;
    setTimeout(function() {
      console.log('TIMEOUT!!');
      console.log('blinkCounter: ' + blinkCounter);
      if (blinkCounter === 3) {
        console.log('it is 3 blinks');
        wss.broadcast('changemode');
        mindModeIndex++;
        if (mindModeIndex > 3) {
          mindModeIndex = 0;
        }
        console.log('mode: ' + mindMode[mindModeIndex]);
      }
      console.log('blinkCounter reset');
      blinkCounter = 0;
      // Set timer instance counter to 0
      timer = 0;
    }, 3000);
  }
}
