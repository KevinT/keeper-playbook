/* capability: drill — 1.0.0
   Practice drills (solo / pair / group) with dated session logs (ADR 0004).
   Emits `drill.logged { drill, date, rating:1-5, notes }` and
   `drill.logged.deleted { drill, id }` (id = the `t` of the log being removed).
   Live logs are derived from the log. A record, not a scoreboard. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};

  var MODE = { solo: 'Solo', pair: 'Pair', group: 'Group' };
  var RATING = ['rough', 'patchy', 'okay', 'good', 'nailed it'];

  function preview(s, n) { s = text(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '\u2026' : s; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  window.KP.capabilities.drill = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var drills = arr(b.drills).filter(function (d) { return d && d.id; });
      function all() { return api.query(function (events) { return R.drillLogs(events, ctx.pack); }); }
      function forDrill(id) { return all().filter(function (e) { return e.drill === id; }).slice().reverse(); }

      var head = el('div', { class: 'dr__head' });
      function paintHead() {
        var list = all();
        head.textContent = plural(list.length, 'session', 'sessions') + ' \u00b7 ' + plural(R.distinctDates(list), 'distinct date', 'distinct dates');
      }

      var list = el('div', { class: 'dr' });
      drills.forEach(function (d) {
        var item = el('div', { class: 'dr__item', 'data-drill': d.id });
        var bodyId = D.uid('drill');
        var toggle = el('button', { class: 'dr__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': bodyId }, [
          el('span', { class: 'dr__mode', text: MODE[d.mode] || text(d.mode) }),
          el('span', { class: 'dr__name', text: text(d.name) }),
          d.minutes ? el('span', { class: 'dr__min', text: d.minutes + ' min' }) : null,
          el('span', { class: 'dr__caret', 'aria-hidden': 'true', text: '\u2192' })
        ]);
        var body = el('div', { class: 'dr__body', id: bodyId });
        toggle.addEventListener('click', function () { var o = item.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', o ? 'true' : 'false'); });

        function part(label, content) { return el('div', { class: 'dr__part' }, [el('div', { class: 'label', text: label }), content]); }
        if (d.setup) body.appendChild(part('Set-up', el('p', { text: text(d.setup) })));
        var steps = arr(d.steps);
        if (steps.length) body.appendChild(part('Steps', el('ol', { class: 'dr__steps' }, steps.map(function (s) { return el('li', { text: text(s) }); }))));
        if (d.focus) body.appendChild(part('Focus on', el('p', { class: 'dr__focus', text: text(d.focus) })));
        if (d.gameLink) body.appendChild(part('Why it matters in a match', el('p', { text: text(d.gameLink) })));

        var formSlot = el('div', { class: 'dr__formslot' });
        var past = el('div', { class: 'dr__past' });
        var openBtn = el('button', { class: 'btn btn--sm dr__open', type: 'button', text: 'Log a session', 'aria-expanded': 'false' });
        var open = false;
        function closeForm() { open = false; formSlot.innerHTML = ''; openBtn.setAttribute('aria-expanded', 'false'); }
        function openForm() {
          open = true; openBtn.setAttribute('aria-expanded', 'true');
          var today = D.todayISO();
          var dateIn = el('input', { class: 'input', type: 'date', 'aria-label': 'Date', max: today });
          dateIn.value = today;
          var rating = 0;
          var rBtns = RATING.map(function (lab, i) {
            var btn = el('button', { class: 'chip dr__rate', type: 'button', 'aria-pressed': 'false', 'aria-label': (i + 1) + ' \u2014 ' + lab }, [
              el('span', { class: 'dr__rate-n', text: String(i + 1) }), el('span', { class: 'dr__rate-l', text: lab })
            ]);
            btn.addEventListener('click', function () {
              rating = i + 1;
              rBtns.forEach(function (x, j) { var on = j === i; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
            });
            return btn;
          });
          var notes = el('textarea', { class: 'textarea', rows: 3, 'aria-label': 'Notes', placeholder: 'What did you notice? What changed?' });
          var msg = el('span', { class: 'dr__msg', 'aria-live': 'polite' });
          var form = el('form', { class: 'dr__form' }, [
            el('div', { class: 'field' }, [el('label', { class: 'label', text: 'Date' }), dateIn]),
            el('div', { class: 'field' }, [el('span', { class: 'label', text: 'How did it go?' }), el('div', { class: 'chips dr__chips', role: 'group', 'aria-label': 'How did it go?' }, rBtns)]),
            el('div', { class: 'field' }, [el('label', { class: 'label', text: 'Notes' }), notes]),
            el('div', { class: 'dr__actions' }, [
              el('button', { class: 'btn btn--primary', type: 'submit', text: 'Save' }),
              el('button', { class: 'btn btn--ghost', type: 'button', text: 'Cancel', onclick: closeForm }),
              msg
            ])
          ]);
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            var date = dateIn.value || today;
            if (date > today) { msg.textContent = 'Pick today or an earlier date.'; return; }
            if (!rating) { msg.textContent = 'Say how it went.'; return; }
            api.emit('drill.logged', { drill: d.id, date: date, rating: rating, notes: notes.value.trim() });
            closeForm(); paintPast(); paintHead();
          });
          formSlot.innerHTML = ''; formSlot.appendChild(form);
          dateIn.focus();
        }
        openBtn.addEventListener('click', function () { if (open) closeForm(); else openForm(); });

        function paintPast() {
          var logs = forDrill(d.id);
          past.innerHTML = '';
          if (!logs.length) { past.appendChild(el('div', { class: 'dr__empty', text: 'No sessions logged yet.' })); return; }
          logs.forEach(function (en) {
            var row = el('div', { class: 'dr__entry' });
            var headBtn = el('button', { class: 'dr__entry-head', type: 'button', 'aria-expanded': 'false' }, [
              el('span', { class: 'dr__entry-date', text: en.date }),
              el('span', { class: 'dr__entry-rating', text: en.rating ? en.rating + '/5 ' + (RATING[en.rating - 1] || '') : '' }),
              el('span', { class: 'dr__entry-preview', text: preview(en.notes, 60) }),
              el('span', { class: 'dr__entry-caret', 'aria-hidden': 'true', text: '\u2192' })
            ]);
            headBtn.addEventListener('click', function () { var o = row.classList.toggle('is-open'); headBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
            var eb = el('div', { class: 'dr__entry-body' }, [
              el('p', { class: 'dr__entry-notes', text: en.notes || '\u2014' }),
              el('div', { class: 'dr__entry-foot' }, [
                el('button', { class: 'btn btn--sm btn--ghost', type: 'button', text: 'Delete', onclick: function () {
                  if (window.confirm('Delete this session log?')) { api.emit('drill.logged.deleted', { drill: d.id, id: en.id }); paintPast(); paintHead(); }
                } })
              ])
            ]);
            row.appendChild(headBtn); row.appendChild(eb); past.appendChild(row);
          });
        }

        body.appendChild(el('div', { class: 'dr__cta' }, [openBtn]));
        body.appendChild(formSlot);
        body.appendChild(past);
        paintPast();
        item.appendChild(toggle); item.appendChild(body);
        list.appendChild(item);
      });
      paintHead();
      return [D.blockTitle(b), D.blockIntro(b), head, list];
    }
  };
})();
