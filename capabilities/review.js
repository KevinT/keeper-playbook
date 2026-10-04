/* capability: review — 1.0.0
   Emits `review.saved { review, entry:{ id, date, answers } }` and `review.deleted { review, id }`.
   Live entries = saved minus deleted, derived from the log. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};
  function newId() {
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  window.KP.capabilities.review = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var prompts = arr(b.prompts);
      function entries() {
        // newest first for display
        return api.query(function (events) { return R.reviewEntries(events, ctx.pack, b.id); }).slice().reverse();
      }

      var dateInput = el('input', { class: 'input', type: 'date', 'aria-label': 'Match date' });
      dateInput.value = D.todayISO();
      var areas = [];
      var form = el('form', { class: 'review__form' });
      form.appendChild(el('div', { class: 'field' }, [el('label', { class: 'label', text: 'Match date' }), dateInput]));
      prompts.forEach(function (p) {
        var ta = el('textarea', { class: 'textarea', 'aria-label': text(p), rows: 3 });
        areas.push(ta);
        form.appendChild(el('div', { class: 'field' }, [el('label', { class: 'label', text: text(p) }), ta]));
      });
      var savedMsg = el('span', { class: 'review__saved', 'aria-live': 'polite' });
      form.appendChild(el('div', { class: 'review__actions' }, [
        el('button', { class: 'btn btn--primary', type: 'submit', text: 'Save review' }),
        savedMsg
      ]));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var answers = areas.map(function (a) { return a.value.trim(); });
        if (!answers.some(function (a) { return a; })) { savedMsg.textContent = 'Write something first.'; return; }
        api.emit('review.saved', { review: b.id, entry: { id: newId(), date: dateInput.value || D.todayISO(), answers: answers } });
        areas.forEach(function (a) { a.value = ''; });
        savedMsg.textContent = 'Saved';
        renderPast();
      });

      var past = el('div', { class: 'review__past' });
      function asText(entry) {
        var lines = ['Match review — ' + entry.date, ''];
        prompts.forEach(function (p, i) { lines.push(text(p)); lines.push(arr(entry.answers)[i] || '—'); lines.push(''); });
        return lines.join('\n').trim();
      }
      function copyLatest(btn) {
        var list = entries();
        if (!list.length) return;
        var t = asText(list[0]);
        var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy latest as text'; }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { fallbackCopy(t); done(); });
        else { fallbackCopy(t); done(); }
      }
      function fallbackCopy(t) {
        var ta = el('textarea', { class: 'sr-only' }); ta.value = t; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
      }
      function renderPast() {
        var list = entries();
        past.innerHTML = '';
        var copyBtn = el('button', { class: 'btn btn--sm', type: 'button', text: 'Copy latest as text', disabled: !list.length });
        copyBtn.addEventListener('click', function () { copyLatest(copyBtn); });
        past.appendChild(el('div', { class: 'review__past-head' }, [
          el('div', { class: 'eyebrow', text: 'Past reviews (' + list.length + ')' }), copyBtn
        ]));
        if (!list.length) { past.appendChild(el('div', { class: 'review__empty', text: 'No reviews saved yet.' })); return; }
        list.forEach(function (entry) {
          var rv = el('div', { class: 'rv' });
          var head = el('button', { class: 'rv__head', type: 'button', 'aria-expanded': 'false' }, [
            el('span', { class: 'rv__date', text: text(entry.date) }),
            el('span', { class: 'rv__preview', text: (arr(entry.answers).filter(Boolean)[0] || '') }),
            el('span', { class: 'rv__caret', text: '→' })
          ]);
          head.addEventListener('click', function () {
            var open = rv.classList.toggle('is-open'); head.setAttribute('aria-expanded', open ? 'true' : 'false');
          });
          var body = el('div', { class: 'rv__body' });
          prompts.forEach(function (p, j) {
            body.appendChild(el('div', { class: 'rv__entry' }, [el('span', { class: 'label', text: text(p) }), el('p', { text: arr(entry.answers)[j] || '—' })]));
          });
          body.appendChild(el('div', { class: 'rv__foot' }, [
            el('button', { class: 'btn btn--sm btn--ghost', type: 'button', text: 'Delete', onclick: function () {
              if (window.confirm('Delete this review?')) { api.emit('review.deleted', { review: b.id, id: entry.id }); renderPast(); }
            } })
          ]));
          rv.appendChild(head); rv.appendChild(body);
          past.appendChild(rv);
        });
      }
      renderPast();
      return [D.blockTitle(b), D.blockIntro(b), form, past];
    }
  };
})();
