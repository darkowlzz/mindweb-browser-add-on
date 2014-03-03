var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 54014, host:'127.0.0.1'}),
  w = new WebSocketServer({port: 54015, host: '127.0.0.1'});
console.log('listening to port 54014');
console.log('listening to port 54015');

wss.broadcast = function(data) {
  console.log('broadcasting...');
  for (var i in this.clients) {
    console.log('client '+ i);
    this.clients[i].send(data);
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

/*
w.on('message', function(message) {
  console.log("54015: received " + message);
  wss.broadcast(message);
});
*/
