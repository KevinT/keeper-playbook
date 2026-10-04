/* capability: vocab — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.vocab = {
    version: '1.0.0',
    render: function (b) {
      var grid = el('div', { class: 'vocab' });
      arr(b.items).forEach(function (it) {
        grid.appendChild(el('div', { class: 'vocab__item' }, [
          el('div', { class: 'vocab__word', text: text(it.word) }),
          el('div', { class: 'vocab__meaning', html: text(it.meaning) }),
          it.when ? el('div', { class: 'vocab__when', html: text(it.when) }) : null
        ]));
      });
      return [D.blockTitle(b), D.blockIntro(b), grid];
    }
  };
})();
