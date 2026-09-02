(function () {
  var queue = [];
  window.demoAnalytics = {
    vendor: 'analytics-stub',
    loadedAt: new Date().toISOString(),
    track: function (event) {
      queue.push({ event: event, at: Date.now() });
      return queue.length;
    },
    queue: function () {
      return queue.slice();
    }
  };
  window.dispatchEvent(new CustomEvent('demo-vendor-ready', { detail: 'analytics' }));
})();
