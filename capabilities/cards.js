/* capability: cards — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.cards = {
    version: '1.0.0',
    render: function (b) {
      var cols = b.cols === 2 ? 2 : 3;
      var grid = el('div', { class: 'cards cards--' + cols });
      arr(b.items).forEach(function (it) {
        grid.appendChild(el('div', { class: 'card' }, [
          it.tag ? el('div', { class: 'eyebrow', text: it.tag }) : null,
          el('h4', { class: 'card__title', text: text(it.title) }),
          el('div', { class: 'card__text', html: text(it.text) })
        ]));
      });
      return [D.blockTitle(b), D.blockIntro(b), grid];
    }
  };
})();
