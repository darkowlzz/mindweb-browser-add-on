var net = require('net');
var client = net.connect({port: 13854},
  function() {
    console.log('client connected');
    msg = {
      "appKey": "c40975447149c129bb8e269efc5427620acfc82b",
      "appName": "brain-web"
    }
    client.write(JSON.stringify(msg));
  }
);

client.on('data', function(data) {
  try {
    var d = data.toString();
    d = d.split('\r');
    d.forEach(function(item) { 
      var val = JSON.parse(item);
      if (val.blinkStrength) {
        console.log(val);
      } else if (val.eSense) {
        console.log(val);
      }
    });
  }
  catch (err) {
    //console.log('error: ' + err);
  }
});

client.on('end', function() {
  console.log('client disconnected');
});
