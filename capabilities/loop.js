/* capability: loop — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.loop = {
    version: '1.0.0',
    render: function (b) {
      var steps = arr(b.steps);
      var wrap = el('div', { class: 'loop', style: '--n:' + Math.max(steps.length, 1) });
      steps.forEach(function (s, i) {
        wrap.appendChild(el('div', { class: 'loop__step' }, [
          el('div', { class: 'loop__num', text: D.pad(i + 1) }),
          el('div', { class: 'loop__name', text: text(s.name) }),
          el('div', { class: 'loop__text', html: text(s.text) })
        ]));
      });
      return [D.blockTitle(b), D.blockIntro(b), wrap];
    }
  };
})();
