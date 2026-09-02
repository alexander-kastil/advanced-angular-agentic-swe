(function () {
  var points = [];
  var listener = function (event) {
    points.push({ x: event.clientX, y: event.clientY, at: Date.now() });
  };
  document.addEventListener('pointerdown', listener);
  window.demoHeatmap = {
    vendor: 'heatmap-stub',
    loadedAt: new Date().toISOString(),
    points: function () {
      return points.slice();
    },
    stop: function () {
      document.removeEventListener('pointerdown', listener);
    }
  };
  window.dispatchEvent(new CustomEvent('demo-vendor-ready', { detail: 'heatmap' }));
})();
