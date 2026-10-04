/* capability: quiz — 1.0.0
   Emits `quiz.finished { quiz, score, total }` when a run ends. Best score is derived
   from the log (max score for this quiz id), never stored. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.quiz = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var items = arr(b.items);
      var box = el('div', { class: 'quiz' });
      var order = D.shuffle(items);
      var idx = 0, score = 0;

      function best() { return api.query(function (events) { return R.quizBest(events, ctx.pack, b.id); }); }
      function renderQ() {
        box.innerHTML = '';
        var q = order[idx];
        box.appendChild(el('div', { class: 'quiz__counter' }, [
          el('div', { class: 'eyebrow', text: 'Scenario ' + (idx + 1) + ' / ' + order.length }),
          el('div', { class: 'quiz__score', text: 'Score ' + score })
        ]));
        box.appendChild(el('div', { class: 'quiz__situation', html: text(q.situation) }));
        var opts = el('div', { class: 'quiz__opts' });
        var optEls = [];
        var options = arr(q.options);
        options.forEach(function (o, i) {
          var btn = el('button', { class: 'quiz__opt', type: 'button' }, [
            el('span', { class: 'quiz__opt-key', text: String.fromCharCode(65 + i) }),
            el('span', { html: text(o.text) })
          ]);
          btn.addEventListener('click', function () { answer(o, i); });
          optEls.push(btn); opts.appendChild(btn);
        });
        box.appendChild(opts);

        function answer(o, i) {
          var correct = !!o.correct;
          if (correct) score++;
          optEls.forEach(function (be, j) {
            be.disabled = true;
            var isC = !!options[j].correct;
            be.classList.toggle('is-correct', isC);
            be.classList.toggle('is-chosen', j === i);
            be.classList.toggle('is-wrong', j === i && !isC);
            be.classList.toggle('is-dim', j !== i && !isC);
          });
          var correctOpt = options.filter(function (x) { return x.correct; })[0];
          var fb = el('div', { class: 'quiz__feedback' + (correct ? ' is-correct' : '') }, [
            el('div', { class: 'quiz__verdict', text: correct ? 'Good call' : 'Not this one' }),
            el('div', { class: 'quiz__fb-text', html: text(o.feedback) }),
            !correct && correctOpt ? el('div', { class: 'quiz__reveal', html: 'Correct answer: <strong>' + text(correctOpt.text) + '</strong>' + (correctOpt.feedback ? ' — ' + text(correctOpt.feedback) : '') }) : null,
            el('button', { class: 'btn btn--primary', type: 'button', text: idx + 1 < order.length ? 'Next scenario' : 'See score', onclick: next })
          ]);
          box.appendChild(fb);
          fb.querySelector('button').focus();
        }
      }
      function next() {
        idx++;
        if (idx < order.length) renderQ(); else renderSummary();
      }
      function renderSummary() {
        var prev = best();
        if (b.id) api.emit('quiz.finished', { quiz: b.id, score: score, total: order.length });
        box.innerHTML = '';
        box.appendChild(el('div', { class: 'quiz__summary' }, [
          el('div', { class: 'eyebrow', text: 'Final score' }),
          el('div', { class: 'quiz__big', html: score + '<small> / ' + order.length + '</small>' }),
          el('div', { class: 'quiz__best', text: 'Best: ' + Math.max(score, prev || 0) + ' / ' + order.length }),
          el('button', { class: 'btn btn--primary', type: 'button', text: 'Go again', onclick: function () { order = D.shuffle(items); idx = 0; score = 0; renderQ(); } })
        ]));
      }
      if (!items.length) box.appendChild(el('p', { class: 'calls__empty', text: 'No scenarios yet.' }));
      else renderQ();
      var b0 = best();
      var bestLine = b0 !== null ? el('div', { class: 'block-intro', text: 'Best so far: ' + b0 + ' / ' + items.length }) : null;
      return [D.blockTitle(b), D.blockIntro(b), bestLine, box];
    }
  };
})();
