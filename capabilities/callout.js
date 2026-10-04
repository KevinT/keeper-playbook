/* capability: callout — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.callout = {
    version: '1.0.0',
    render: function (b) {
      return el('aside', { class: 'callout' }, [
        D.blockTitle(b),
        el('div', { class: 'callout__body', html: text(b.html) })
      ]);
    }
  };
})();
