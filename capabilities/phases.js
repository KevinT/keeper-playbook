/* capability: phases — 1.0.0 */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.phases = {
    version: '1.0.0',
    render: function (b) {
      var rows = [['where', 'Where am I'], ['see', "What I'm watching"], ['do', 'What I do'], ['say', 'What I say']];
      var parts = D.buildTabs(arr(b.items), function (it) {
        var wrap = el('div', { class: 'phase-rows' });
        rows.forEach(function (r) {
          wrap.appendChild(el('div', { class: 'phase-row phase-row--' + r[0] }, [
            el('div', { class: 'label', text: r[1] }),
            el('div', { class: 'phase-row__val', html: text(it[r[0]]) })
          ]));
        });
        return wrap;
      });
      parts.forEach(function (p) { if (p.classList.contains('tabpanels')) p.classList.add('tabpanels--phases'); });
      return [D.blockTitle(b), D.blockIntro(b)].concat(parts);
    }
  };
})();
