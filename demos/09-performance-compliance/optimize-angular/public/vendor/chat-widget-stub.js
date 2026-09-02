(function () {
  window.demoChatWidget = {
    vendor: 'chat-widget-stub',
    loadedAt: new Date().toISOString(),
    open: false,
    toggle: function () {
      this.open = !this.open;
      return this.open;
    }
  };
  try {
    document.cookie = 'demo_chat_sid=' + Math.random().toString(36).slice(2) + '; path=/; SameSite=Lax';
  } catch (error) {
    void error;
  }
  window.dispatchEvent(new CustomEvent('demo-vendor-ready', { detail: 'chat' }));
})();
