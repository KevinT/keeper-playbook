/* Keeper Playbook — app.js
   Plain vanilla JS. No modules, no fetch, works from file://.
   Content arrives as window.PLAYBOOK (see SHELL-SPEC.md). */
(function () {
  'use strict';

  var STORE_KEY = 'keeper-playbook-v1';
  var DATA = window.PLAYBOOK || { meta: {}, sections: [] };
  var META = DATA.meta || {};
  var SECTIONS = Array.isArray(DATA.sections) ? DATA.sections : [];
  var CONTENT_SECTIONS = SECTIONS.filter(function (s) { return !s.hero; });

  /* ------------------------------------------------------------------ */
  /* Persistence                                                         */
  /* ------------------------------------------------------------------ */
  function blankState() {
    return { done: {}, quiz: {}, checklist: {}, tree: {}, reviews: {}, ladder: {}, last: null };
  }
  var state = loadState();

  function loadState() {
    var s = blankState();
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        for (var k in s) if (parsed && parsed[k] !== undefined) s[k] = parsed[k];
      }
    } catch (e) { /* storage unavailable or corrupt — run in-memory */ }
    return s;
  }
  function saveState() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ */
  /* DOM helpers                                                         */
  /* ------------------------------------------------------------------ */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    if (children !== undefined) append(node, children);
    return node;
  }
  function append(node, children) {
    if (children === null || children === undefined || children === false) return node;
    if (Array.isArray(children)) { children.forEach(function (c) { append(node, c); }); return node; }
    if (typeof children === 'string' || typeof children === 'number') { node.appendChild(document.createTextNode(String(children))); return node; }
    node.appendChild(children);
    return node;
  }
  function svgEl(tag, attrs) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function text(s) { return s === undefined || s === null ? '' : String(s); }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function shuffle(a) {
    var out = a.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }
  function blockTitle(block) {
    return block.title ? el('h3', { class: 'block-title', text: block.title }) : null;
  }
  function blockIntro(block) {
    return block.intro ? el('div', { class: 'block-intro', html: block.intro }) : null;
  }

  /* ------------------------------------------------------------------ */
  /* Block renderers — one per type                                      */
  /* ctx = { section, index, key }                                       */
  /* ------------------------------------------------------------------ */
  var renderers = {};

  renderers.prose = function (b) {
    return el('div', { class: 'prose', html: text(b.html) });
  };

  renderers.loop = function (b) {
    var steps = arr(b.steps);
    var wrap = el('div', { class: 'loop', style: '--n:' + Math.max(steps.length, 1) });
    steps.forEach(function (s, i) {
      wrap.appendChild(el('div', { class: 'loop__step' }, [
        el('div', { class: 'loop__num', text: pad(i + 1) }),
        el('div', { class: 'loop__name', text: text(s.name) }),
        el('div', { class: 'loop__text', html: text(s.text) })
      ]));
    });
    return [blockTitle(b), blockIntro(b), wrap];
  };

  renderers.cards = function (b) {
    var cols = b.cols === 2 ? 2 : 3;
    var grid = el('div', { class: 'cards cards--' + cols });
    arr(b.items).forEach(function (it) {
      grid.appendChild(el('div', { class: 'card' }, [
        it.tag ? el('div', { class: 'eyebrow', text: it.tag }) : null,
        el('h4', { class: 'card__title', text: text(it.title) }),
        el('div', { class: 'card__text', html: text(it.text) })
      ]));
    });
    return [blockTitle(b), blockIntro(b), grid];
  };

  function buildTabs(items, panelFor, key) {
    var strip = el('div', { class: 'tabstrip', role: 'tablist' });
    var panels = el('div', { class: 'tabpanels' });
    var tabs = [], panes = [];
    items.forEach(function (it, i) {
      var id = key + '-tab-' + i;
      var tab = el('button', { class: 'tab', type: 'button', role: 'tab', id: id, 'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': id + '-panel', text: text(it.name) });
      var pane = el('div', { class: 'tabpanel' + (i === 0 ? ' is-active' : ''), role: 'tabpanel', id: id + '-panel', 'aria-labelledby': id }, panelFor(it, i));
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault(); e.stopPropagation();
          var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
          select(n); tabs[n].focus();
        }
      });
      tabs.push(tab); panes.push(pane);
      strip.appendChild(tab); panels.appendChild(pane);
    });
    function select(n) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === n ? 'true' : 'false'); });
      panes.forEach(function (p, j) { p.classList.toggle('is-active', j === n); });
      if (tabs[n].scrollIntoView) tabs[n].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    return [strip, panels];
  }

  renderers.tabs = function (b, ctx) {
    var parts = buildTabs(arr(b.items), function (it) {
      return el('div', { html: text(it.html) });
    }, ctx.key);
    return [blockTitle(b), blockIntro(b)].concat(parts);
  };

  renderers.phases = function (b, ctx) {
    var rows = [['where', 'Where am I'], ['see', "What I'm watching"], ['do', 'What I do'], ['say', 'What I say']];
    var parts = buildTabs(arr(b.items), function (it) {
      var wrap = el('div', { class: 'phase-rows' });
      rows.forEach(function (r) {
        wrap.appendChild(el('div', { class: 'phase-row phase-row--' + r[0] }, [
          el('div', { class: 'label', text: r[1] }),
          el('div', { class: 'phase-row__val', html: text(it[r[0]]) })
        ]));
      });
      return wrap;
    }, ctx.key);
    parts.forEach(function (p) { if (p.classList.contains('tabpanels')) p.classList.add('tabpanels--phases'); });
    return [blockTitle(b), blockIntro(b)].concat(parts);
  };

  renderers.tree = function (b, ctx) {
    var box = el('div', { class: 'tree' });
    var crumbs = el('div', { class: 'tree__crumbs', 'aria-label': 'Your answers' });
    var body = el('div', { class: 'tree__body', 'aria-live': 'polite' });
    box.appendChild(crumbs); box.appendChild(body);
    var trail = [];

    function showNode(node) {
      body.innerHTML = '';
      if (!node || !node.q) { body.appendChild(el('p', { class: 'calls__empty', text: 'This branch has no question.' })); return; }
      body.appendChild(el('div', { class: 'tree__q', text: text(node.q) }));
      var opts = el('div', { class: 'tree__opts' });
      arr(node.options).forEach(function (o) {
        opts.appendChild(el('button', { class: 'tree__opt', type: 'button', text: text(o.label), onclick: function () { choose(o); } }));
      });
      body.appendChild(opts);
    }
    function choose(o) {
      trail.push(text(o.label));
      renderCrumbs();
      if (o.next && o.next.q) showNode(o.next);
      else showResult(o);
    }
    function showResult(o) {
      body.innerHTML = '';
      state.tree[ctx.key] = (state.tree[ctx.key] || 0) + 1;
      saveState();
      body.appendChild(el('div', { class: 'tree__result' }, [
        el('div', { class: 'eyebrow', text: 'Decision' }),
        el('div', { class: 'tree__result-text', text: text(o.result || o.label) }),
        o.why ? el('div', { class: 'tree__why', html: text(o.why) }) : null,
        el('button', { class: 'btn', type: 'button', text: 'Start again', onclick: restart })
      ]));
    }
    function renderCrumbs() {
      crumbs.innerHTML = '';
      if (!trail.length) { crumbs.appendChild(el('span', { class: 'tree__crumb', text: 'Start' })); return; }
      trail.forEach(function (t) { crumbs.appendChild(el('span', { class: 'tree__crumb', text: t })); });
    }
    function restart() { trail = []; renderCrumbs(); showNode(b.root); }
    restart();
    return [blockTitle(b), blockIntro(b), box];
  };

  renderers.calls = function (b, ctx) {
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

    var rowEls = rows.map(function (r, i) {
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

    return [blockTitle(b), blockIntro(b), el('div', { class: 'calls' }, [
      el('div', { class: 'calls__tools' }, [chips, input, meta]),
      list, empty
    ])];
  };

  renderers.vocab = function (b) {
    var grid = el('div', { class: 'vocab' });
    arr(b.items).forEach(function (it) {
      grid.appendChild(el('div', { class: 'vocab__item' }, [
        el('div', { class: 'vocab__word', text: text(it.word) }),
        el('div', { class: 'vocab__meaning', html: text(it.meaning) }),
        it.when ? el('div', { class: 'vocab__when', html: text(it.when) }) : null
      ]));
    });
    return [blockTitle(b), blockIntro(b), grid];
  };

  renderers.pitch = function (b) {
    var scenarios = arr(b.scenarios);
    var svg = svgEl('svg', { class: 'pitch-svg', viewBox: '0 0 100 70', role: 'img', 'aria-label': 'Defensive half of the pitch' });
    // Pitch markings (defensive half; goal at bottom, centre line at top).
    // Goal centred x=50, y=68. Goal 7.32m on 68m width ≈ 10.8 units wide.
    svg.appendChild(svgEl('rect', { class: 'line', x: 1, y: 1, width: 98, height: 67 }));
    svg.appendChild(svgEl('line', { class: 'line', x1: 1, y1: 1, x2: 99, y2: 1 }));
    svg.appendChild(svgEl('path', { class: 'line', d: 'M 36.5 1 A 13.5 13.5 0 0 0 63.5 1' }));          // centre circle (half)
    svg.appendChild(svgEl('rect', { class: 'line', x: 20, y: 44, width: 60, height: 24 }));            // 18-yard box
    svg.appendChild(svgEl('rect', { class: 'line', x: 36, y: 60, width: 28, height: 8 }));             // 6-yard box
    svg.appendChild(svgEl('circle', { class: 'spot', cx: 50, cy: 52, r: .6 }));                         // penalty spot
    svg.appendChild(svgEl('path', { class: 'line', d: 'M 38.9 44 A 13.5 13.5 0 0 1 61.1 44' }));        // the D
    svg.appendChild(svgEl('rect', { class: 'goal', x: 44.6, y: 68, width: 10.8, height: 1.6 }));       // goal
    var zone = svgEl('polygon', { class: 'zone', points: '' });
    zone.style.display = 'none';
    svg.appendChild(zone);
    var g1 = svgEl('line', { class: 'guide', x1: 50, y1: 30, x2: 44.6, y2: 68 });
    var g2 = svgEl('line', { class: 'guide', x1: 50, y1: 30, x2: 55.4, y2: 68 });
    svg.appendChild(g1); svg.appendChild(g2);
    var ring = svgEl('circle', { class: 'keeper-ring', cx: 50, cy: 62, r: 3 });
    var keeper = svgEl('circle', { class: 'keeper', cx: 50, cy: 62, r: 1.6 });
    var ball = svgEl('circle', { class: 'ball', cx: 50, cy: 30, r: 1.1 });
    svg.appendChild(ring); svg.appendChild(keeper); svg.appendChild(ball);

    var chips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Scenario' });
    var noteText = el('div', { class: 'pitch__note-text' });
    var noteLabel = el('div', { class: 'eyebrow pitch__note-label' });
    var note = el('div', { class: 'pitch__note' }, [noteLabel, noteText]);
    var chipEls = [];

    function show(s, i) {
      chipEls.forEach(function (c, j) { c.classList.toggle('is-active', j === i); });
      var bx = s.ball && isFinite(s.ball.x) ? s.ball.x : 50, by = s.ball && isFinite(s.ball.y) ? s.ball.y : 30;
      var kx = s.keeper && isFinite(s.keeper.x) ? s.keeper.x : 50, ky = s.keeper && isFinite(s.keeper.y) ? s.keeper.y : 64;
      ball.setAttribute('cx', bx); ball.setAttribute('cy', by);
      keeper.setAttribute('cx', kx); keeper.setAttribute('cy', ky);
      ring.setAttribute('cx', kx); ring.setAttribute('cy', ky);
      g1.setAttribute('x1', bx); g1.setAttribute('y1', by);
      g2.setAttribute('x1', bx); g2.setAttribute('y1', by);
      if (Array.isArray(s.zone) && s.zone.length >= 3) {
        zone.setAttribute('points', s.zone.map(function (p) { return p[0] + ',' + p[1]; }).join(' '));
        zone.style.display = '';
      } else { zone.style.display = 'none'; }
      noteLabel.textContent = text(s.label);
      noteText.innerHTML = text(s.note);
    }
    scenarios.forEach(function (s, i) {
      var c = el('button', { class: 'chip', type: 'button', text: text(s.label || s.id || 'Scenario ' + (i + 1)) });
      c.addEventListener('click', function () { show(s, i); });
      chipEls.push(c); chips.appendChild(c);
    });
    if (scenarios.length) show(scenarios[0], 0);
    else note.style.display = 'none';

    var legend = el('div', { class: 'pitch__legend' }, [
      el('span', {}, [el('i', { class: 'l-ball' }), 'Ball']),
      el('span', {}, [el('i', { class: 'l-keeper' }), 'Keeper'])
    ]);
    return [blockTitle(b), blockIntro(b), chips, el('div', { class: 'pitch-block' }, [
      el('div', {}, [svg, legend]), note
    ])];
  };

  renderers.quiz = function (b, ctx) {
    var items = arr(b.items);
    var box = el('div', { class: 'quiz' });
    var order = shuffle(items);
    var idx = 0, score = 0;

    function best() { return state.quiz[ctx.key] || null; }
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
      if (prev === null || score > prev) { state.quiz[ctx.key] = score; saveState(); }
      box.innerHTML = '';
      box.appendChild(el('div', { class: 'quiz__summary' }, [
        el('div', { class: 'eyebrow', text: 'Final score' }),
        el('div', { class: 'quiz__big', html: score + '<small> / ' + order.length + '</small>' }),
        el('div', { class: 'quiz__best', text: 'Best: ' + Math.max(score, prev || 0) + ' / ' + order.length }),
        el('button', { class: 'btn btn--primary', type: 'button', text: 'Go again', onclick: function () { order = shuffle(items); idx = 0; score = 0; renderQ(); } })
      ]));
    }
    if (!items.length) box.appendChild(el('p', { class: 'calls__empty', text: 'No scenarios yet.' }));
    else renderQ();
    var bestLine = best() !== null ? el('div', { class: 'block-intro', text: 'Best so far: ' + best() + ' / ' + items.length }) : null;
    return [blockTitle(b), blockIntro(b), bestLine, box];
  };

  renderers.checklist = function (b, ctx) {
    var id = b.id || ctx.key;
    var ticks = state.checklist[id] || (state.checklist[id] = {});
    var items = arr(b.items);
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
        saveState(); update();
      });
      list.appendChild(el('li', {}, [el('label', { class: 'check' }, [input, el('span', { class: 'check__box' }), el('span', { class: 'check__text', html: text(t) })])]));
    });
    update();
    return [blockTitle(b), blockIntro(b), list, meta];
  };

  renderers.ladder = function (b, ctx) {
    var list = el('ol', { class: 'ladder' });
    var levels = arr(b.levels);
    var rungs = [];
    function current() { return state.ladder[ctx.key]; }
    function paint() {
      rungs.forEach(function (r, i) {
        var here = current() === i;
        r.el.classList.toggle('is-here', here);
        r.btn.textContent = here ? "I'm here" : 'Mark: I\'m here';
        r.btn.setAttribute('aria-pressed', here ? 'true' : 'false');
      });
    }
    levels.forEach(function (lv, i) {
      var btn = el('button', { class: 'btn btn--sm btn--ghost rung__here', type: 'button' });
      btn.addEventListener('click', function () {
        state.ladder[ctx.key] = current() === i ? null : i; saveState(); paint();
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
    return [blockTitle(b), blockIntro(b), list];
  };

  renderers.review = function (b, ctx) {
    var id = b.id || ctx.key;
    var prompts = arr(b.prompts);
    var entries = state.reviews[id] || (state.reviews[id] = []);

    var dateInput = el('input', { class: 'input', type: 'date', 'aria-label': 'Match date' });
    dateInput.value = todayISO();
    var areas = [];
    var form = el('form', { class: 'review__form' });
    form.appendChild(el('div', { class: 'field' }, [el('label', { class: 'label', text: 'Match date' }), dateInput]));
    prompts.forEach(function (p, i) {
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
      entries.unshift({ date: dateInput.value || todayISO(), saved: new Date().toISOString(), answers: answers });
      saveState();
      areas.forEach(function (a) { a.value = ''; });
      savedMsg.textContent = 'Saved';
      renderPast();
    });

    var past = el('div', { class: 'review__past' });
    function asText(entry) {
      var lines = ['Match review — ' + entry.date, ''];
      prompts.forEach(function (p, i) { lines.push(text(p)); lines.push(entry.answers[i] || '—'); lines.push(''); });
      return lines.join('\n').trim();
    }
    function copyLatest(btn) {
      if (!entries.length) return;
      var t = asText(entries[0]);
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
      past.innerHTML = '';
      var copyBtn = el('button', { class: 'btn btn--sm', type: 'button', text: 'Copy latest as text', disabled: !entries.length });
      copyBtn.addEventListener('click', function () { copyLatest(copyBtn); });
      past.appendChild(el('div', { class: 'review__past-head' }, [
        el('div', { class: 'eyebrow', text: 'Past reviews (' + entries.length + ')' }), copyBtn
      ]));
      if (!entries.length) { past.appendChild(el('div', { class: 'review__empty', text: 'No reviews saved yet.' })); return; }
      entries.forEach(function (entry, i) {
        var rv = el('div', { class: 'rv' });
        var head = el('button', { class: 'rv__head', type: 'button', 'aria-expanded': 'false' }, [
          el('span', { class: 'rv__date', text: entry.date }),
          el('span', { class: 'rv__preview', text: (entry.answers.filter(Boolean)[0] || '') }),
          el('span', { class: 'rv__caret', text: '→' })
        ]);
        head.addEventListener('click', function () {
          var open = rv.classList.toggle('is-open'); head.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        var body = el('div', { class: 'rv__body' });
        prompts.forEach(function (p, j) {
          body.appendChild(el('div', { class: 'rv__entry' }, [el('span', { class: 'label', text: text(p) }), el('p', { text: entry.answers[j] || '—' })]));
        });
        body.appendChild(el('div', { class: 'rv__foot' }, [
          el('button', { class: 'btn btn--sm btn--ghost', type: 'button', text: 'Delete', onclick: function () {
            if (window.confirm('Delete this review?')) { entries.splice(i, 1); saveState(); renderPast(); }
          } })
        ]));
        rv.appendChild(head); rv.appendChild(body);
        past.appendChild(rv);
      });
    }
    renderPast();
    return [blockTitle(b), blockIntro(b), form, past];
  };

  renderers.quote = function (b) {
    return el('blockquote', { class: 'quote' }, [
      el('p', { class: 'quote__text', text: text(b.text) }),
      b.attribution ? el('footer', { class: 'eyebrow quote__attr', text: b.attribution }) : null
    ]);
  };

  renderers.callout = function (b) {
    return el('aside', { class: 'callout' }, [
      blockTitle(b),
      el('div', { class: 'callout__body', html: text(b.html) })
    ]);
  };

  function renderBlock(block, section, index) {
    var key = section.id + ':' + index;
    var type = block && block.type;
    var fn = renderers[type];
    var wrap = el('div', { class: 'block block--' + (type || 'unknown') });
    if (!fn) {
      wrap.appendChild(el('div', { class: 'unsupported', html: 'Unsupported block type <code>' + esc(type) + '</code> in section <code>' + esc(section.id) + '</code>.' }));
      return wrap;
    }
    try {
      append(wrap, fn(block, { section: section, index: index, key: key }));
    } catch (err) {
      wrap.appendChild(el('div', { class: 'unsupported', html: 'Block <code>' + esc(type) + '</code> failed to render: ' + esc(err && err.message) }));
      if (window.console) console.warn('Block render failed', key, err);
    }
    return wrap;
  }

  /* ------------------------------------------------------------------ */
  /* Progress                                                            */
  /* ------------------------------------------------------------------ */
  function doneCount() {
    return CONTENT_SECTIONS.filter(function (s) { return state.done[s.id]; }).length;
  }
  function refreshProgress() {
    var total = CONTENT_SECTIONS.length;
    var n = doneCount();
    var pct = total ? Math.round(n / total * 100) : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('footer-status').textContent = total ? n + ' of ' + total + ' sections complete' : '';
    document.querySelectorAll('[data-nav-id]').forEach(function (a) {
      a.classList.toggle('is-done', !!state.done[a.getAttribute('data-nav-id')]);
    });
    document.querySelectorAll('[data-toc-id]').forEach(function (li) {
      li.classList.toggle('is-done', !!state.done[li.getAttribute('data-toc-id')]);
    });
    document.querySelectorAll('.complete-toggle').forEach(function (btn) {
      var on = !!state.done[btn.getAttribute('data-section')];
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Section complete' : 'Mark section complete';
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation + sections                                               */
  /* ------------------------------------------------------------------ */
  function navLink(s, i, withNum) {
    var a = el('a', { href: '#' + s.id, 'data-nav-id': s.id }, [
      withNum ? el('span', { class: 'nav-num', text: s.hero ? '' : pad(CONTENT_SECTIONS.indexOf(s) + 1) }) : null,
      el('span', { class: 'nav-tick' }),
      text(s.nav || s.title || s.id)
    ]);
    a.addEventListener('click', closeDrawer);
    return a;
  }
  function buildNav() {
    var top = document.getElementById('topnav');
    var drawer = document.getElementById('drawer-nav');
    SECTIONS.forEach(function (s, i) {
      top.appendChild(navLink(s, i, false));
      drawer.appendChild(navLink(s, i, true));
    });
  }
  function openDrawer() {
    document.getElementById('drawer').classList.add('is-open');
    document.getElementById('drawer').setAttribute('aria-hidden', 'false');
    document.getElementById('burger').setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    document.getElementById('drawer').classList.remove('is-open');
    document.getElementById('drawer').setAttribute('aria-hidden', 'true');
    document.getElementById('burger').setAttribute('aria-expanded', 'false');
  }

  function buildHero(s) {
    var headline = Array.isArray(META.headline) ? META.headline : [text(META.headline)];
    var second = SECTIONS[1];
    var sec = el('section', { class: 'section section--hero', id: 'sec-' + s.id, 'data-section-id': s.id });
    var resume = el('a', { class: 'btn', href: '#', text: 'Resume' });
    resume.style.display = 'none';
    if (state.last && state.last !== s.id && findSection(state.last)) { resume.href = '#' + state.last; resume.style.display = ''; }

    sec.appendChild(el('div', { class: 'hero' }, [
      s.kicker ? el('div', { class: 'eyebrow hero__kicker', text: s.kicker }) : null,
      el('h1', { class: 'display hero__headline' }, [
        el('span', { class: 'line-1', text: text(headline[0]) }),
        headline[1] ? el('span', { class: 'line-2', text: text(headline[1]) }) : null
      ]),
      META.tagline ? el('p', { class: 'hero__tagline', text: META.tagline }) : null,
      el('div', { class: 'hero__actions' }, [
        second ? el('a', { class: 'btn btn--primary', href: '#' + second.id, text: 'Start' }) : null,
        resume
      ]),
      META.intro ? el('div', { class: 'hero__intro', html: META.intro }) : null
    ]));

    var list = el('ol', { class: 'toc__list' });
    CONTENT_SECTIONS.forEach(function (cs, i) {
      list.appendChild(el('li', { class: 'toc__item', 'data-toc-id': cs.id }, [
        el('a', { href: '#' + cs.id }, [
          el('span', { class: 'toc__num', text: pad(i + 1) }),
          el('span', {}, [
            el('span', { class: 'toc__title', text: text(cs.title || cs.nav) }),
            cs.lede ? el('span', { class: 'toc__sub', text: cs.lede }) : null
          ]),
          el('span', { class: 'toc__tick', 'aria-hidden': 'true' })
        ])
      ]));
    });
    sec.appendChild(el('div', { class: 'toc' }, [el('div', { class: 'eyebrow', text: 'Contents' }), list]));

    // Hero blocks, if any
    arr(s.blocks).forEach(function (b, i) { sec.appendChild(el('div', { class: 'section__inner' }, renderBlock(b, s, i))); });
    return sec;
  }

  function buildSection(s, i) {
    var sec = el('section', { class: 'section', id: 'sec-' + s.id, 'data-section-id': s.id });
    var inner = el('div', { class: 'section__inner' });
    inner.appendChild(el('header', { class: 'section__head' }, [
      s.kicker ? el('div', { class: 'eyebrow', text: s.kicker }) : null,
      el('h2', { class: 'display', text: text(s.title || s.nav) }),
      s.lede ? el('p', { class: 'section__lede', text: s.lede }) : null
    ]));
    arr(s.blocks).forEach(function (b, j) { inner.appendChild(renderBlock(b, s, j)); });

    var prev = SECTIONS[i - 1], next = SECTIONS[i + 1];
    var toggle = el('button', { class: 'btn complete-toggle', type: 'button', 'data-section': s.id, 'aria-pressed': 'false', text: 'Mark section complete' });
    toggle.addEventListener('click', function () {
      if (state.done[s.id]) delete state.done[s.id]; else state.done[s.id] = true;
      saveState(); refreshProgress();
    });
    inner.appendChild(el('div', { class: 'section__foot' }, [
      toggle,
      el('span', { class: 'spacer' }),
      el('div', { class: 'section__nav' }, [
        prev ? el('a', { class: 'btn btn--ghost', href: '#' + prev.id, text: '← ' + text(prev.nav || prev.title) }) : null,
        next ? el('a', { class: 'btn', href: '#' + next.id, text: text(next.nav || next.title) + ' →' }) : null
      ])
    ]));
    sec.appendChild(inner);
    return sec;
  }

  function findSection(id) {
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) return SECTIONS[i];
    return null;
  }
  function currentId() {
    var h = (window.location.hash || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    return h;
  }
  function route() {
    if (!SECTIONS.length) return;
    var id = currentId();
    var s = findSection(id);
    if (!s) { s = SECTIONS[0]; if (id) { window.location.replace('#' + s.id); return; } }
    document.querySelectorAll('.section').forEach(function (sec) {
      sec.classList.toggle('is-active', sec.getAttribute('data-section-id') === s.id);
    });
    document.querySelectorAll('[data-nav-id]').forEach(function (a) {
      var on = a.getAttribute('data-nav-id') === s.id;
      a.classList.toggle('is-active', on);
      if (on) {
        a.setAttribute('aria-current', 'page');
        if (a.scrollIntoView && a.closest('.topnav')) a.scrollIntoView({ block: 'nearest', inline: 'center' });
      } else a.removeAttribute('aria-current');
    });
    document.title = (s.hero ? '' : text(s.title || s.nav) + ' — ') + text(META.title || 'Keeper Playbook');
    if (!s.hero) { state.last = s.id; saveState(); }
    closeDrawer();
    window.scrollTo(0, 0);
  }
  function go(delta) {
    var id = currentId();
    var i = SECTIONS.indexOf(findSection(id) || SECTIONS[0]);
    var n = i + delta;
    if (n < 0 || n >= SECTIONS.length) return;
    window.location.hash = '#' + SECTIONS[n].id;
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function boot() {
    var title = text(META.title || 'Keeper Playbook');
    document.getElementById('wordmark').textContent = title;
    document.getElementById('footer-mark').textContent = title;
    document.getElementById('wordmark').href = '#' + (SECTIONS[0] ? SECTIONS[0].id : '');

    var main = document.getElementById('main');
    if (!SECTIONS.length) {
      main.appendChild(el('div', { class: 'section__inner' }, el('div', { class: 'unsupported', text: 'No content loaded (window.PLAYBOOK.sections is empty).' })));
    }
    buildNav();
    SECTIONS.forEach(function (s, i) { main.appendChild(s.hero ? buildHero(s) : buildSection(s, i)); });

    document.getElementById('burger').addEventListener('click', function () {
      var open = document.getElementById('drawer').classList.contains('is-open');
      if (open) closeDrawer(); else openDrawer();
    });
    document.getElementById('drawer-scrim').addEventListener('click', closeDrawer);
    document.getElementById('reset-progress').addEventListener('click', function () {
      if (window.confirm('Reset all progress? This clears completed sections, quiz scores, checklists and saved reviews.')) {
        state = blankState(); saveState(); window.location.hash = ''; window.location.reload();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target;
      var tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') closeDrawer();
    });
    window.addEventListener('hashchange', route);
    refreshProgress();
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
