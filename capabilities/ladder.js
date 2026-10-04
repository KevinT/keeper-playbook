/* capability: ladder — 1.0.0
   Emits `ladder.placed { ladder, level }` (level = rung index, or null to clear). */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr, esc = D.esc;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.ladder = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var list = el('ol', { class: 'ladder' });
      var levels = arr(b.levels);
      var rungs = [];
      var here = api.query(function (events) { return R.ladderLevel(events, ctx.pack, b.id); });
      function paint() {
        rungs.forEach(function (r, i) {
          var on = here === i;
          r.el.classList.toggle('is-here', on);
          r.btn.textContent = on ? "I'm here" : 'Mark: I\'m here';
          r.btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
      levels.forEach(function (lv, i) {
        var btn = el('button', { class: 'btn btn--sm btn--ghost rung__here', type: 'button' });
        btn.addEventListener('click', function () {
          here = here === i ? null : i;
          api.emit('ladder.placed', { ladder: b.id, level: here });
          paint();
        });
        var items = el('ul', { class: 'rung__items' });
        arr(lv.items).forEach(function (t) { items.appendChild(el('li', { html: text(t) })); });
        var rung = el('li', { class: 'rung' }, [
          el('div', { class: 'rung__level', html: '<small>Level</small>' + esc(lv.level !== undefined ? lv.level : i + 1) }),
          el('div', {}, [el('div', { class: 'rung__name', text: text(lv.name) }), items]),
          btn
        ]);
        rungs.push({ el: rung, btn: btn });
        list.appendChild(rung);
      });
      paint();
      return [D.blockTitle(b), D.blockIntro(b), list];
    }
  };
})();
