/* capability: prose — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.prose = {
    version: '1.0.0',
    render: function (b) {
      return D.el('div', { class: 'prose', html: D.text(b.html) });
    }
  };
})();
