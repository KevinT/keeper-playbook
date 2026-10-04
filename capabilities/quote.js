/* capability: quote — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.quote = {
    version: '1.0.0',
    render: function (b) {
      return el('blockquote', { class: 'quote' }, [
        el('p', { class: 'quote__text', text: text(b.text) }),
        b.attribution ? el('footer', { class: 'eyebrow quote__attr', text: b.attribution }) : null
      ]);
    }
  };
})();
