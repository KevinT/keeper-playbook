/* capability: calls — 1.0.0  (the Call Sheet: filterable see → say list) */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr, esc = D.esc;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.calls = {
    version: '1.0.0',
    render: function (b) {
      var groups = arr(b.groups);
      var rows = [];
      groups.forEach(function (g) {
        arr(g.items).forEach(function (it) { rows.push({ group: text(g.name), item: it }); });
      });
      var total = rows.length;
      var activeGroup = 'All';
      var query = '';

      var chips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Filter by group' });
      var chipAll = el('button', { class: 'chip is-active', type: 'button', html: 'All<span class="count">' + total + '</span>', onclick: function () { setGroup('All', chipAll); } });
      chips.appendChild(chipAll);
      groups.forEach(function (g) {
        var n = arr(g.items).length;
        var c = el('button', { class: 'chip', type: 'button', html: esc(g.name) + '<span class="count">' + n + '</span>' });
        c.addEventListener('click', function () { setGroup(text(g.name), c); });
        chips.appendChild(c);
      });

      var input = el('input', { class: 'input', type: 'search', placeholder: 'Filter calls — e.g. "cross", "line"', 'aria-label': 'Filter calls' });
      input.addEventListener('input', function () { query = input.value.trim().toLowerCase(); apply(); });

      var count = el('div', { class: 'calls__count' });
      var meta = el('div', { class: 'calls__meta' }, [count, el('span', { class: 'label', text: 'When you see → you say' })]);
      var list = el('div', { class: 'calls__list' });
      var empty = el('div', { class: 'calls__empty', text: 'No calls match that filter.' });
      empty.style.display = 'none';

      var rowEls = rows.map(function (r) {
        var it = r.item;
        var words = el('div', { class: 'call__words' });
        arr(it.words).forEach(function (w) { words.appendChild(el('span', { class: 'pill', text: w })); });
        var toggle = el('button', { class: 'call__toggle', type: 'button', 'aria-label': 'Expand', 'aria-expanded': 'false' });
        var row = el('div', { class: 'call', 'data-group': r.group });
        toggle.addEventListener('click', function () {
          var open = row.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        row.appendChild(el('div', { class: 'call__left' }, [
          el('div', { class: 'label', text: 'When you see' }),
          el('div', { class: 'call__see', html: text(it.see) })
        ]));
        row.appendChild(el('div', { class: 'call__right' }, [
          el('div', { class: 'label', text: 'You say' }),
          el('div', { class: 'call__head' }, [el('div', { class: 'call__say', html: text(it.say) }), toggle]),
          el('div', { class: 'call__body' }, [
            arr(it.words).length ? words : null,
            it.why ? el('div', { class: 'call__why', html: text(it.why) }) : null
          ])
        ]));
        row._search = [r.group, it.see, it.say, it.why, arr(it.words).join(' ')].map(function (s) { return text(s).toLowerCase(); }).join(' ');
        list.appendChild(row);
        return row;
      });

      function setGroup(name, chip) {
        activeGroup = name;
        Array.prototype.forEach.call(chips.children, function (c) { c.classList.toggle('is-active', c === chip); });
        apply();
      }
      function apply() {
        var shown = 0;
        rowEls.forEach(function (row) {
          var ok = (activeGroup === 'All' || row.getAttribute('data-group') === activeGroup) && (!query || row._search.indexOf(query) !== -1);
          row.classList.toggle('is-hidden', !ok);
          if (ok) shown++;
        });
        count.innerHTML = shown + ' ' + (shown === 1 ? 'call' : 'calls') + (shown !== total ? '<small>of ' + total + '</small>' : '');
        empty.style.display = shown ? 'none' : '';
      }
      apply();

      return [D.blockTitle(b), D.blockIntro(b), el('div', { class: 'calls' }, [
        el('div', { class: 'calls__tools' }, [chips, input, meta]),
        list, empty
      ])];
    }
  };
})();
