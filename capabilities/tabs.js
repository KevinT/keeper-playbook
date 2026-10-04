/* capability: tabs — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.tabs = {
    version: '1.0.0',
    render: function (b) {
      var parts = D.buildTabs(arr(b.items), function (it) {
        return el('div', { html: text(it.html) });
      });
      return [D.blockTitle(b), D.blockIntro(b)].concat(parts);
    }
  };
})();
