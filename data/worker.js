var ws = new WebSocket('ws://localhost:54014');
ws.onmessage = function(ev) {
  console.log('Received at ws: ' + ev.data);
  self.port.emit("yolo", ev.data);
};

self.port.on('foo', function() {
  console.log('received foo');
  console.log('sending bar');
  self.port.emit('bar');
});
