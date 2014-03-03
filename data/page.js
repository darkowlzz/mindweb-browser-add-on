self.port.on('scrolldown', function() {
  console.log('scrolling down');
  window.scrollBy(0, 50);
});

self.port.on('scrollup', function() {
  console.log('scrolling up');
  window.scrollBy(0, -50);
});
