/* capability: field — 1.0.0
   Tasks done or noticed in the real world (ADR 0004). Each task takes dated, honest check-ins.
   Emits `field.checkin { task, date, done:'yes'|'partly'|'no', notes }` and
   `field.checkin.deleted { task, id }` (id = the `t` of the check-in being removed).
   Live check-ins are derived from the log. This is a record, not a scoreboard: no "complete"
   tick — the count is the feedback. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};

  var KIND = { do: 'Do', notice: 'Notice' };
  var WHEN = { session: 'Next session', match: 'Next match', any: 'Any time' };
  var DONE = [{ v: 'yes', label: 'Yes' }, { v: 'partly', label: 'Partly' }, { v: 'no', label: 'No' }];

  function preview(s, n) { s = text(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '\u2026' : s; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  window.KP.capabilities.field = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var tasks = arr(b.tasks).filter(function (t) { return t && t.id; });
      function all() { return api.query(function (events) { return R.fieldCheckins(events, ctx.pack); }); }
      function forTask(id) { return all().filter(function (e) { return e.task === id; }).slice().reverse(); }

      var head = el('div', { class: 'fw__head' });
      function paintHead() {
        var list = all();
        head.textContent = plural(list.length, 'check-in', 'check-ins') + ' \u00b7 ' + plural(R.distinctDates(list), 'distinct date', 'distinct dates');
      }

      var rows = el('div', { class: 'fw' });
      tasks.forEach(function (t) {
        var row = el('div', { class: 'fw__task', 'data-task': t.id });
        var formSlot = el('div', { class: 'fw__formslot' });
        var past = el('div', { class: 'fw__past' });
        var openBtn = el('button', { class: 'btn btn--sm fw__open', type: 'button', text: 'Check in', 'aria-expanded': 'false' });
        var open = false;

        function closeForm() { open = false; formSlot.innerHTML = ''; openBtn.setAttribute('aria-expanded', 'false'); }
        function openForm() {
          open = true; openBtn.setAttribute('aria-expanded', 'true');
          var today = D.todayISO();
          var dateIn = el('input', { class: 'input', type: 'date', 'aria-label': 'Date', max: today });
          dateIn.value = today;
          var doneVal = null;
          var doneBtns = DONE.map(function (d) {
            var btn = el('button', { class: 'chip fw__done', type: 'button', text: d.label, 'aria-pressed': 'false' });
            btn.addEventListener('click', function () {
              doneVal = d.v;
              doneBtns.forEach(function (x, i) { var on = DONE[i].v === doneVal; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
            });
            return btn;
          });
          var notes = el('textarea', { class: 'textarea', rows: 3, 'aria-label': 'Notes', placeholder: text(t.prompt) });
          var msg = el('span', { class: 'fw__msg', 'aria-live': 'polite' });
          var form = el('form', { class: 'fw__form' }, [
            el('div', { class: 'field' }, [el('label', { class: 'label', text: 'Date' }), dateIn]),
            el('div', { class: 'field' }, [el('span', { class: 'label', text: 'Did it happen?' }), el('div', { class: 'chips fw__chips', role: 'group', 'aria-label': 'Did it happen?' }, doneBtns)]),
            el('div', { class: 'field' }, [el('label', { class: 'label', text: 'Notes' }), notes]),
            el('div', { class: 'fw__actions' }, [
              el('button', { class: 'btn btn--primary', type: 'submit', text: 'Save' }),
              el('button', { class: 'btn btn--ghost', type: 'button', text: 'Cancel', onclick: closeForm }),
              msg
            ])
          ]);
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            var date = dateIn.value || today;
            if (date > today) { msg.textContent = 'Pick today or an earlier date.'; return; }
            if (!doneVal) { msg.textContent = 'Say whether it happened.'; return; }
            api.emit('field.checkin', { task: t.id, date: date, done: doneVal, notes: notes.value.trim() });
            closeForm(); paintPast(); paintHead();
          });
          formSlot.innerHTML = ''; formSlot.appendChild(form);
          dateIn.focus();
        }
        openBtn.addEventListener('click', function () { if (open) closeForm(); else openForm(); });

        function paintPast() {
          var list = forTask(t.id);
          past.innerHTML = '';
          if (!list.length) { past.appendChild(el('div', { class: 'fw__empty', text: 'Nothing logged yet. Take this to your next session.' })); return; }
          list.forEach(function (en) {
            var item = el('div', { class: 'fw__entry' });
            var headBtn = el('button', { class: 'fw__entry-head', type: 'button', 'aria-expanded': 'false' }, [
              el('span', { class: 'fw__entry-date', text: en.date }),
              el('span', { class: 'fw__entry-done', text: en.done }),
              el('span', { class: 'fw__entry-preview', text: preview(en.notes, 60) }),
              el('span', { class: 'fw__entry-caret', 'aria-hidden': 'true', text: '\u2192' })
            ]);
            headBtn.addEventListener('click', function () { var o = item.classList.toggle('is-open'); headBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
            var body = el('div', { class: 'fw__entry-body' }, [
              el('p', { class: 'fw__entry-notes', text: en.notes || '\u2014' }),
              el('div', { class: 'fw__entry-foot' }, [
                el('button', { class: 'btn btn--sm btn--ghost', type: 'button', text: 'Delete', onclick: function () {
                  if (window.confirm('Delete this check-in?')) { api.emit('field.checkin.deleted', { task: t.id, id: en.id }); paintPast(); paintHead(); }
                } })
              ])
            ]);
            item.appendChild(headBtn); item.appendChild(body); past.appendChild(item);
          });
        }

        row.appendChild(el('div', { class: 'fw__labels' }, [
          el('span', { class: 'fw__kind fw__kind--' + text(t.kind), text: KIND[t.kind] || text(t.kind) }),
          el('span', { class: 'fw__when', text: WHEN[t.when] || WHEN.any })
        ]));
        row.appendChild(el('div', { class: 'fw__text', text: text(t.text) }));
        if (t.why) row.appendChild(el('div', { class: 'fw__why', text: text(t.why) }));
        row.appendChild(el('div', { class: 'fw__cta' }, [openBtn]));
        row.appendChild(formSlot);
        row.appendChild(past);
        paintPast();
        rows.appendChild(row);
      });
      paintHead();
      return [D.blockTitle(b), D.blockIntro(b), head, rows];
    }
  };
})();
