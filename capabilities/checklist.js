/* capability: checklist — 1.0.0
   Emits `checklist.ticked { checklist, item, on }` per toggle. Current ticks are derived
   from the log. `item` is the item index within the block's `items`. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.checklist = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var items = arr(b.items);
      var ticks = api.query(function (events) { return R.checklistTicks(events, ctx.pack, b.id); });
      var list = el('ul', { class: 'checklist' });
      var meta = el('div', { class: 'checklist__meta' });
      function update() {
        var n = items.filter(function (_, i) { return ticks[i]; }).length;
        meta.textContent = n + ' of ' + items.length + ' ticked';
      }
      items.forEach(function (t, i) {
        var input = el('input', { type: 'checkbox' });
        input.checked = !!ticks[i];
        input.addEventListener('change', function () {
          if (input.checked) ticks[i] = true; else delete ticks[i];
          api.emit('checklist.ticked', { checklist: b.id, item: i, on: !!input.checked });
          update();
        });
        list.appendChild(el('li', {}, [el('label', { class: 'check' }, [input, el('span', { class: 'check__box' }), el('span', { class: 'check__text', html: text(t) })])]));
      });
      update();
      return [D.blockTitle(b), D.blockIntro(b), list, meta];
    }
  };
})();
