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
    return { done: {}, quiz: {}, checklist: {}, tree: {}, reviews: {}, ladder: {}, sim: {}, last: null };
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

  // Shared half-pitch markings (defensive half; goal at bottom, centre line at top).
  // Goal centred x=50, y=68. Goal 7.32m on 68m width ≈ 10.8 units wide.
  function buildPitchSvg() {
    var svg = svgEl('svg', { class: 'pitch-svg', viewBox: '0 0 100 70', role: 'img', 'aria-label': 'Defensive half of the pitch' });
    svg.appendChild(svgEl('rect', { class: 'line', x: 1, y: 1, width: 98, height: 67 }));
    svg.appendChild(svgEl('line', { class: 'line', x1: 1, y1: 1, x2: 99, y2: 1 }));
    svg.appendChild(svgEl('path', { class: 'line', d: 'M 36.5 1 A 13.5 13.5 0 0 0 63.5 1' }));          // centre circle (half)
    svg.appendChild(svgEl('rect', { class: 'line', x: 20, y: 44, width: 60, height: 24 }));            // 18-yard box
    svg.appendChild(svgEl('rect', { class: 'line', x: 36, y: 60, width: 28, height: 8 }));             // 6-yard box
    svg.appendChild(svgEl('circle', { class: 'spot', cx: 50, cy: 52, r: .6 }));                         // penalty spot
    svg.appendChild(svgEl('path', { class: 'line', d: 'M 38.9 44 A 13.5 13.5 0 0 1 61.1 44' }));        // the D
    svg.appendChild(svgEl('rect', { class: 'goal', x: 44.6, y: 68, width: 10.8, height: 1.6 }));       // goal
    return svg;
  }

  renderers.pitch = function (b) {
    var scenarios = arr(b.scenarios);
    var svg = buildPitchSvg();
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

  /* sim: visual decision simulator.
     { type:'sim', id, title, intro?, scenarios:[{ id, label, phase?, question,
        // static (legacy) form:
        ball:{x,y}, keeper:{x,y}, us:[{x,y,n?}], them:[{x,y,n?}], arrow?:{from,to},
        // motion form (see _build/MOTION-SPEC.md):
        setup:{ ball, keeper, us:[{id,x,y,n?}], them:[{id,x,y,n?}] },
        play:{ duration, tracks:{ ball|keeper|us.<id>|them.<id>: [{t,x,y,h?}] }, overlays?:[...] },
        options:[{ text, grade:'best'|'ok'|'poor', feedback,
                   outcome?:{ duration, tracks, overlays?, result, caption } }] }] }
     No clock by default. The player can switch on a timer and pick the pressure level.
     With `play`, the scenario animates first, freezes at the decision frame, then the chosen
     option's `outcome` plays. Without `play`, the static frame is shown (legacy behaviour). */

  /* --- motion helpers (shared by every sim block) --- */
  var SIM_POSTS = { left: 44.6, right: 55.4, y: 68 };
  var SIM_KEEPER_HALF_WIDTH = 2.2;
  var simReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function easeInOut(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function easeOut(u) { return 1 - (1 - u) * (1 - u); }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }

  // Normalise a scenario into { setup, play } where setup has ids on every player.
  function simSetupOf(s) {
    var src = s.setup || s;
    function players(list, prefix) {
      return arr(list).map(function (p, i) {
        return { id: text(p.id || (i + 1)), x: num(p.x, 50), y: num(p.y, 30), n: p.n };
      });
    }
    return {
      ball: { x: num(src.ball && src.ball.x, 50), y: num(src.ball && src.ball.y, 30) },
      keeper: { x: num(src.keeper && src.keeper.x, 50), y: num(src.keeper && src.keeper.y, 64) },
      us: players(src.us), them: players(src.them)
    };
  }
  // Flatten a setup into a positions map keyed by entity key.
  function simPositionsOf(setup) {
    var pos = { ball: { x: setup.ball.x, y: setup.ball.y, h: 0 }, keeper: { x: setup.keeper.x, y: setup.keeper.y } };
    setup.us.forEach(function (p) { pos['us.' + p.id] = { x: p.x, y: p.y }; });
    setup.them.forEach(function (p) { pos['them.' + p.id] = { x: p.x, y: p.y }; });
    return pos;
  }
  function simClonePositions(pos) {
    var out = {};
    for (var k in pos) out[k] = { x: pos[k].x, y: pos[k].y, h: pos[k].h || 0 };
    return out;
  }
  // Sample one entity at time t. start = position at timeline start. keys = sorted keyframes.
  function simSample(key, start, keys, t) {
    if (!keys || !keys.length) return { x: start.x, y: start.y, h: start.h || 0 };
    var prev = { t: 0, x: start.x, y: start.y, h: start.h || 0 }, nextK = null;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (t < k.t) { nextK = k; break; }
      prev = { t: k.t, x: num(k.x, prev.x), y: num(k.y, prev.y), h: num(k.h, 0) };
    }
    if (!nextK) return { x: prev.x, y: prev.y, h: prev.h };
    var span = nextK.t - prev.t;
    var u = span > 0 ? clamp((t - prev.t) / span, 0, 1) : 1;
    var nx = num(nextK.x, prev.x), ny = num(nextK.y, prev.y), nh = num(nextK.h, 0);
    var lofted = key === 'ball' && (prev.h > 0 || nh > 0);
    var e = key === 'ball' ? (lofted ? easeOut(u) : u) : easeInOut(u);
    // Height follows a parabola between keyframes so 0→1→0 reads as a real arc, not a tent.
    var h = prev.h + (nh - prev.h) * u;
    if (lofted && prev.h === 0 && nh === 0) h = 0;
    else if (lofted && (prev.h === 0 || nh === 0)) h = prev.h === 0 ? nh * Math.sin(u * Math.PI / 2) : prev.h * Math.cos(u * Math.PI / 2);
    return { x: prev.x + (nx - prev.x) * e, y: prev.y + (ny - prev.y) * e, h: h };
  }
  function simNormTracks(tracks) {
    var out = {};
    for (var k in (tracks || {})) {
      out[k] = arr(tracks[k]).filter(function (f) { return f && isFinite(f.t); })
        .map(function (f) { return { t: +f.t, x: f.x, y: f.y, h: f.h }; })
        .sort(function (a, b) { return a.t - b.t; });
    }
    return out;
  }
  // Positions of every entity at time t of a timeline.
  function simFrame(startPos, tracks, t) {
    var out = {};
    for (var k in startPos) out[k] = simSample(k, startPos[k], tracks[k], t);
    return out;
  }
  // Cone geometry. Returns { cone:[pts], covered:[pts]|null } in pitch units.
  function simConeGeometry(ball, keeper) {
    var cone = [[ball.x, ball.y], [SIM_POSTS.left, SIM_POSTS.y], [SIM_POSTS.right, SIM_POSTS.y]];
    var dx = keeper.x - ball.x, dy = keeper.y - ball.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.01 || dy <= 0.01 || ball.y >= SIM_POSTS.y - 0.5) return { cone: cone, covered: null };
    // Perpendicular to ball→keeper, scaled to the keeper's half-width.
    var px = -dy / len * SIM_KEEPER_HALF_WIDTH, py = dx / len * SIM_KEEPER_HALF_WIDTH;
    var edges = [[keeper.x + px, keeper.y + py], [keeper.x - px, keeper.y - py]];
    var xs = [];
    for (var i = 0; i < 2; i++) {
      var ex = edges[i][0] - ball.x, ey = edges[i][1] - ball.y;
      if (ey <= 0.01) return { cone: cone, covered: null };   // ray never reaches the goal line
      xs.push(ball.x + ex * (SIM_POSTS.y - ball.y) / ey);
    }
    var lo = Math.min(xs[0], xs[1]), hi = Math.max(xs[0], xs[1]);
    lo = clamp(lo, SIM_POSTS.left, SIM_POSTS.right); hi = clamp(hi, SIM_POSTS.left, SIM_POSTS.right);
    if (hi - lo < 0.01) return { cone: cone, covered: null, lo: lo, hi: hi };
    return { cone: cone, covered: [[ball.x, ball.y], [lo, SIM_POSTS.y], [hi, SIM_POSTS.y]], lo: lo, hi: hi };
  }
  function simPts(pts) { return pts.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' '); }

  renderers.sim = function (b, ctx) {
    var scenarios = arr(b.scenarios);
    var key = (b.id || ctx.key);
    var simState = state.sim[key] || (state.sim[key] = { done: {}, best: {} });
    var LEVELS = [
      { name: 'No clock', secs: 0, blurb: 'Take your time. Read everything.' },
      { name: 'Calm', secs: 12, blurb: 'Ball in their half. Time to look.' },
      { name: 'Pressure', secs: 6, blurb: 'Ball in your half. Decide while it travels.' },
      { name: 'Match speed', secs: 3, blurb: 'It is happening now. See, decide, go.' }
    ];
    var level = 0, order = shuffle(scenarios), idx = 0, run = { best: 0, ok: 0, poor: 0, out: 0 }, timerId = null;
    // Deep link: ?scenario=<id> puts that scenario first (coach / debugging use).
    try {
      var want = new URLSearchParams(window.location.search).get('scenario');
      if (want) order.sort(function (a, b) { return (a.id === want ? -1 : 0) - (b.id === want ? -1 : 0); });
    } catch (e) { /* ignore */ }
    var slow = !!state.sim._slow;
    var overlaysOn = true;

    var svg = buildPitchSvg();
    // Overlay layer sits under the players.
    var overlayG = svgEl('g', { class: 'sim-overlays' });
    var offsideLine = svgEl('line', { class: 'sim-offside', x1: 1, x2: 99, y1: 0, y2: 0 });
    var offsideLabel = svgEl('text', { class: 'sim-offside-label', x: 98.2, y: 0, 'text-anchor': 'end' });
    offsideLabel.textContent = 'line';
    var conePoly = svgEl('polygon', { class: 'sim-cone', points: '' });
    var coveredPoly = svgEl('polygon', { class: 'sim-cone-covered', points: '' });
    var pressureCircle = svgEl('circle', { class: 'sim-pressure', cx: 0, cy: 0, r: 3.5 });
    var trailsG = svgEl('g', { class: 'sim-trails' });
    overlayG.appendChild(conePoly); overlayG.appendChild(coveredPoly);
    overlayG.appendChild(offsideLine); overlayG.appendChild(offsideLabel);
    overlayG.appendChild(pressureCircle); overlayG.appendChild(trailsG);
    svg.appendChild(overlayG);
    var arrow = svgEl('line', { class: 'guide sim-arrow', x1: 0, y1: 0, x2: 0, y2: 0 });
    arrow.style.display = 'none';
    svg.appendChild(arrow);
    var playersG = svgEl('g', {});
    svg.appendChild(playersG);
    var ring = svgEl('circle', { class: 'keeper-ring', cx: 50, cy: 62, r: 3 });
    var keeper = svgEl('circle', { class: 'keeper', cx: 50, cy: 62, r: 1.6 });
    var decideRing = svgEl('circle', { class: 'sim-decide', cx: 50, cy: 62, r: 3 });
    decideRing.style.display = 'none';
    var ballShadow = svgEl('ellipse', { class: 'sim-ball-shadow', cx: 50, cy: 30, rx: 1.1, ry: .7 });
    var ball = svgEl('circle', { class: 'ball', cx: 50, cy: 30, r: 1.1 });
    svg.appendChild(ring); svg.appendChild(keeper); svg.appendChild(decideRing);
    svg.appendChild(ballShadow); svg.appendChild(ball);
    svg.classList.add('pitch-svg--motion');

    // Pitch wrapper so the badge + "watch" cue can sit over it.
    var cue = el('div', { class: 'sim__cue', 'aria-hidden': 'true', text: '\u25B6 Watch the play' });
    cue.style.display = 'none';
    var badge = el('div', { class: 'sim__badge', role: 'status', 'aria-live': 'polite' });
    badge.style.display = 'none';
    var stage = el('div', { class: 'sim__stage' }, [svg, cue, badge]);

    var legend = el('div', { class: 'pitch__legend' }, [
      el('span', {}, [el('i', { class: 'l-ball' }), 'Ball']),
      el('span', {}, [el('i', { class: 'l-keeper' }), 'You']),
      el('span', {}, [el('i', { class: 'l-us' }), 'Us']),
      el('span', {}, [el('i', { class: 'l-them' }), 'Them'])
    ]);
    var replayBtn = el('button', { class: 'btn btn--sm', type: 'button', text: 'Replay' });
    var slowBtn = el('button', { class: 'btn btn--sm btn--ghost', type: 'button', text: 'Slow', 'aria-pressed': slow ? 'true' : 'false' });
    var overlaysBtn = el('button', { class: 'btn btn--sm btn--ghost', type: 'button', text: 'Overlays', 'aria-pressed': 'true' });
    var bestBtn = el('button', { class: 'btn btn--sm btn--primary', type: 'button', text: 'Watch the best option' });
    bestBtn.style.display = 'none';
    var playControls = el('div', { class: 'sim__playbar' }, [replayBtn, slowBtn, overlaysBtn, bestBtn]);
    var caption = el('div', { class: 'sim__caption', 'aria-live': 'polite' });
    caption.style.display = 'none';
    slowBtn.classList.toggle('is-on', slow);
    overlaysBtn.classList.add('is-on');

    var panel = el('div', { class: 'sim__panel' });
    var levelChips = el('div', { class: 'chips sim__levels', role: 'group', 'aria-label': 'Pressure level' });
    var levelBlurb = el('div', { class: 'sim__level-blurb' });
    var levelEls = [];
    LEVELS.forEach(function (L, i) {
      var c = el('button', { class: 'chip' + (i === 0 ? ' is-active' : ''), type: 'button', text: L.name + (L.secs ? ' · ' + L.secs + 's' : '') });
      c.addEventListener('click', function () { level = i; levelEls.forEach(function (e, j) { e.classList.toggle('is-active', j === i); }); levelBlurb.textContent = L.blurb; });
      levelEls.push(c); levelChips.appendChild(c);
    });
    levelBlurb.textContent = LEVELS[0].blurb;
    var bar = el('div', { class: 'sim__timer' }, [el('i')]);
    var barFill = bar.firstChild;

    /* ---------- animation engine ---------- */
    var raf = null, cueTimer = null, decideTimer = null;
    var cur = null;          // { scenario, setup, startPos (setup), playTracks, decisionPos, playing, overlays, entities:{key:{circle,label,cls}} }
    var tl = null;           // active timeline { startPos, tracks, duration, t, overlays, history:{key:[{t,x,y}]}, onEnd }
    var lastNow = 0;

    var lastPos = null;      // last painted frame (for overlay toggles)
    function cancelAnim() {
      if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; }
      if (cueTimer) { clearTimeout(cueTimer); cueTimer = null; }
      if (decideTimer) { clearTimeout(decideTimer); decideTimer = null; }
      tl = null;
    }
    // Jump a running timeline to its end so the UI is never stuck half-played.
    function finishNow() {
      if (cueTimer) { clearTimeout(cueTimer); cueTimer = null; cue.style.display = 'none'; if (cur && cur.play) runTimeline(simClonePositions(cur.startPos), cur.play, cur.overlays, decideCue); }
      if (!tl || tl.frozen) return;
      if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; }
      var t = tl; tl = null;
      var endPos = simFrame(t.startPos, t.tracks, t.duration);
      tl = { t: t.duration, overlays: t.overlays, history: t.history, movers: t.movers, frozen: true };
      paint(endPos);
      if (t.onEnd) t.onEnd(endPos);
    }
    function teardown() { cancelAnim(); stopTimer(); }

    function buildEntities(setup) {
      playersG.innerHTML = '';
      var ents = {};
      function mk(p, prefix, cls) {
        var c = svgEl('circle', { class: cls, cx: p.x, cy: p.y, r: 1.5 });
        playersG.appendChild(c);
        var label = null;
        if (p.n) { label = svgLabel(p); playersG.appendChild(label); }
        ents[prefix + p.id] = { circle: c, label: label };
      }
      setup.us.forEach(function (p) { mk(p, 'us.', 'sim-us'); });
      setup.them.forEach(function (p) { mk(p, 'them.', 'sim-them'); });
      return ents;
    }
    function svgLabel(p) {
      var t = svgEl('text', { class: 'sim-label', x: p.x + 2.1, y: p.y + 0.9 });
      t.textContent = p.n; return t;
    }
    function setPos(node, label, x, y) {
      node.setAttribute('cx', x.toFixed(2)); node.setAttribute('cy', y.toFixed(2));
      if (label) { label.setAttribute('x', (x + 2.1).toFixed(2)); label.setAttribute('y', (y + 0.9).toFixed(2)); }
    }
    function paint(pos) {
      lastPos = pos;
      for (var k in cur.entities) {
        var e = cur.entities[k], p = pos[k];
        if (p) setPos(e.circle, e.label, p.x, p.y);
      }
      var kp = pos.keeper, bp = pos.ball;
      setPos(keeper, null, kp.x, kp.y); setPos(ring, null, kp.x, kp.y); setPos(decideRing, null, kp.x, kp.y);
      var h = clamp(bp.h || 0, 0, 1);
      ball.setAttribute('r', (1.1 * (1 + 0.9 * h)).toFixed(3));
      // Ball is drawn lifted a touch toward the top of the viewBox as it rises; shadow stays on the ground.
      setPos(ball, null, bp.x, bp.y - 2.4 * h);
      ballShadow.setAttribute('cx', (bp.x + 0.5 * h).toFixed(2)); ballShadow.setAttribute('cy', (bp.y + 0.4).toFixed(2));
      ballShadow.setAttribute('rx', (1.1 + 0.6 * h).toFixed(2)); ballShadow.setAttribute('ry', (0.6 + 0.3 * h).toFixed(2));
      ballShadow.style.opacity = (0.45 * (1 - 0.75 * h)).toFixed(3);
      paintOverlays(pos);
    }
    function activeOverlays() {
      if (!overlaysOn) return [];
      if (tl && tl.overlays) return tl.overlays;
      return cur && cur.overlays ? cur.overlays : [];
    }
    function paintOverlays(pos) {
      var ov = activeOverlays();
      var has = function (n) { return ov.indexOf(n) !== -1; };
      // offside
      if (has('offside')) {
        var deepest = -1;
        for (var k in pos) if (k.indexOf('us.') === 0 && pos[k].y > deepest) deepest = pos[k].y;
        if (deepest >= 0) {
          offsideLine.setAttribute('y1', deepest.toFixed(2)); offsideLine.setAttribute('y2', deepest.toFixed(2));
          offsideLabel.setAttribute('y', (deepest - 0.8).toFixed(2));
          offsideLine.style.display = ''; offsideLabel.style.display = '';
        } else { offsideLine.style.display = 'none'; offsideLabel.style.display = 'none'; }
      } else { offsideLine.style.display = 'none'; offsideLabel.style.display = 'none'; }
      // cone
      if (has('cone')) {
        var g = simConeGeometry(pos.ball, pos.keeper);
        conePoly.setAttribute('points', simPts(g.cone)); conePoly.style.display = '';
        if (g.covered) { coveredPoly.setAttribute('points', simPts(g.covered)); coveredPoly.style.display = ''; }
        else coveredPoly.style.display = 'none';
      } else { conePoly.style.display = 'none'; coveredPoly.style.display = 'none'; }
      // pressure
      var carrier = null;
      if (has('pressure')) {
        var bestD = 1.5;
        for (var k2 in pos) if (k2.indexOf('them.') === 0) {
          var d = Math.hypot(pos[k2].x - pos.ball.x, pos[k2].y - pos.ball.y);
          if (d <= bestD) { bestD = d; carrier = pos[k2]; }
        }
      }
      if (carrier) { setPos(pressureCircle, null, carrier.x, carrier.y); pressureCircle.style.display = ''; }
      else pressureCircle.style.display = 'none';
      // run trails
      trailsG.innerHTML = '';
      if (has('run') && tl && tl.history) {
        var cutoff = tl.t - 0.8;
        for (var k3 in tl.history) {
          var hist = tl.history[k3].filter(function (f) { return f.t >= cutoff; });
          if (hist.length < 2) continue;
          var first = hist[0], last = hist[hist.length - 1];
          if (Math.hypot(last.x - first.x, last.y - first.y) < 0.2) continue;
          var cls = k3 === 'ball' ? 'sim-trail--ball' : k3 === 'keeper' ? 'sim-trail--keeper' : k3.indexOf('them.') === 0 ? 'sim-trail--them' : 'sim-trail--us';
          trailsG.appendChild(svgEl('polyline', { class: 'sim-trail ' + cls, points: simPts(hist.map(function (f) { return [f.x, f.y]; })) }));
        }
      }
    }
    function moved(startPos, tracks, k) {
      var ks = tracks[k]; if (!ks || !ks.length) return false;
      var s = startPos[k];
      return ks.some(function (f) { return Math.hypot(num(f.x, s.x) - s.x, num(f.y, s.y) - s.y) > 0.2; });
    }
    function recordHistory(pos) {
      for (var k in pos) {
        if (!tl.movers[k]) continue;
        var h = tl.history[k] || (tl.history[k] = []);
        h.push({ t: tl.t, x: pos[k].x, y: pos[k].y });
        while (h.length && h[0].t < tl.t - 1.2) h.shift();
      }
    }
    // Run a timeline. Resolves (onEnd) with the final positions.
    function runTimeline(startPos, def, overlays, onEnd) {
      cancelAnim();
      var tracks = simNormTracks(def && def.tracks);
      var duration = Math.max(0, num(def && def.duration, 0));
      var movers = {};
      for (var k in startPos) movers[k] = moved(startPos, tracks, k);
      tl = { startPos: startPos, tracks: tracks, duration: duration, t: 0, overlays: overlays, history: {}, movers: movers, onEnd: onEnd };
      if (simReducedMotion || duration === 0) {
        var endPos = simFrame(startPos, tracks, duration);
        tl.t = duration; paint(endPos);
        var cb = tl.onEnd; tl = null;
        if (cb) cb(endPos);
        return;
      }
      lastNow = 0;
      paint(simFrame(startPos, tracks, 0));
      recordHistory(simFrame(startPos, tracks, 0));
      raf = window.requestAnimationFrame(step);
    }
    function step(now) {
      raf = null;
      if (!tl) return;
      if (!lastNow) lastNow = now;
      var dt = Math.min(0.1, (now - lastNow) / 1000) * (slow ? 0.5 : 1);
      lastNow = now;
      tl.t = Math.min(tl.duration, tl.t + dt);
      var pos = simFrame(tl.startPos, tl.tracks, tl.t);
      recordHistory(pos);
      paint(pos);
      if (tl.t >= tl.duration) {
        var cb = tl.onEnd, t = tl; tl = null;
        // keep trails visible on the frozen frame by re-painting with the finished timeline's overlay set
        tl = { t: t.t, overlays: t.overlays, history: t.history, movers: t.movers, frozen: true };
        paint(pos);
        if (cb) cb(pos);
        return;
      }
      raf = window.requestAnimationFrame(step);
    }

    /* ---------- result badge + caption ---------- */
    var RESULTS = {
      goal: { text: 'Goal conceded', cls: 'is-bad' },
      saved: { text: 'Saved', cls: 'is-good' },
      cleared: { text: 'Cleared', cls: 'is-good' },
      kept: { text: 'Kept the ball', cls: 'is-good' },
      lost: { text: 'Possession lost', cls: 'is-neutral' },
      chance: { text: 'Chance conceded', cls: 'is-warn' }
    };
    function showResult(outcome) {
      var r = RESULTS[outcome && outcome.result] || null;
      badge.className = 'sim__badge';
      if (r) {
        badge.textContent = r.text; badge.classList.add(r.cls); badge.style.display = '';
        // restart the fade-in
        badge.classList.remove('is-shown'); void badge.offsetWidth; badge.classList.add('is-shown');
      } else badge.style.display = 'none';
      caption.className = 'sim__caption';
      if (outcome && outcome.caption) {
        caption.innerHTML = text(outcome.caption);
        caption.classList.add(r ? r.cls : 'is-neutral');
        caption.style.display = '';
      } else caption.style.display = 'none';
    }
    function clearResult() { badge.style.display = 'none'; badge.className = 'sim__badge'; caption.style.display = 'none'; }

    /* ---------- timer ---------- */
    function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } bar.style.display = 'none'; }
    function startTimer(onOut) {
      var secs = LEVELS[level].secs;
      if (!secs) { bar.style.display = 'none'; return; }
      bar.style.display = '';
      var t0 = Date.now();
      barFill.style.transform = 'scaleX(1)';
      timerId = setInterval(function () {
        var left = Math.max(0, 1 - (Date.now() - t0) / (secs * 1000));
        barFill.style.transform = 'scaleX(' + left + ')';
        if (left <= 0) { stopTimer(); onOut(); }
      }, 50);
    }

    /* ---------- scenario lifecycle ---------- */
    var optEls = [], answered = false, onDecide = null;

    function setOptionsEnabled(on) {
      optEls.forEach(function (be) { be.disabled = !on || answered; be.classList.toggle('is-waiting', !on && !answered); });
    }
    function decideCue(pos) {
      cur.decisionPos = simClonePositions(pos);
      decideRing.style.display = '';
      decideRing.classList.remove('is-pulse'); void decideRing.getBoundingClientRect(); decideRing.classList.add('is-pulse');
      decideTimer = setTimeout(function () { decideTimer = null; decideRing.classList.remove('is-pulse'); }, 520);
      if (onDecide) onDecide();
    }
    // Play the opening movement from the setup to the decision frame.
    function playOpening() {
      clearResult();
      decideRing.style.display = 'none'; decideRing.classList.remove('is-pulse');
      var setupPos = simClonePositions(cur.startPos);
      if (!cur.play) {                   // legacy static scenario
        tl = null; paint(setupPos); cur.decisionPos = setupPos;
        if (onDecide) onDecide();
        return;
      }
      setOptionsEnabled(false);
      if (simReducedMotion) {
        cue.style.display = 'none';
        runTimeline(setupPos, cur.play, cur.overlays, decideCue);
        return;
      }
      tl = null; paint(setupPos);
      cue.style.display = '';
      cueTimer = setTimeout(function () {
        cueTimer = null; cue.style.display = 'none';
        runTimeline(setupPos, cur.play, cur.overlays, decideCue);
      }, 600);
    }
    function playOutcome(outcome, done) {
      if (!cur.decisionPos) cur.decisionPos = simClonePositions(cur.startPos);
      clearResult();
      decideRing.style.display = 'none';
      var ov = Array.isArray(outcome.overlays) ? outcome.overlays : cur.overlays;
      runTimeline(simClonePositions(cur.decisionPos), outcome, ov, function () { showResult(outcome); if (done) done(); });
    }

    function loadScenario(s) {
      teardown();
      cur = { scenario: s, setup: simSetupOf(s) };
      cur.startPos = simPositionsOf(cur.setup);
      cur.play = s.play && s.play.tracks ? s.play : null;
      cur.overlays = cur.play && Array.isArray(cur.play.overlays) ? cur.play.overlays : [];
      cur.entities = buildEntities(cur.setup);
      cur.decisionPos = null;
      bestBtn.style.display = 'none'; bestBtn.onclick = null;
      if (!cur.play && s.arrow && s.arrow.from && s.arrow.to) {
        arrow.setAttribute('x1', s.arrow.from.x); arrow.setAttribute('y1', s.arrow.from.y);
        arrow.setAttribute('x2', s.arrow.to.x); arrow.setAttribute('y2', s.arrow.to.y);
        arrow.style.display = '';
      } else arrow.style.display = 'none';
      trailsG.innerHTML = '';
    }

    function renderScenario() {
      var s = order[idx];
      answered = false; onDecide = null;
      loadScenario(s);
      panel.innerHTML = '';
      panel.appendChild(el('div', { class: 'quiz__counter' }, [
        el('div', { class: 'eyebrow', text: (s.phase ? s.phase + ' · ' : '') + 'Scenario ' + (idx + 1) + ' / ' + order.length }),
        el('div', { class: 'quiz__score', text: simState.done[s.id] ? 'Seen before' : '' })
      ]));
      panel.appendChild(el('div', { class: 'sim__label', text: text(s.label) }));
      panel.appendChild(el('div', { class: 'quiz__situation', html: text(s.question) }));
      var opts = el('div', { class: 'quiz__opts' });
      optEls = [];
      var options = arr(s.options);
      options.forEach(function (o, i) {
        var btn = el('button', { class: 'quiz__opt', type: 'button' }, [
          el('span', { class: 'quiz__opt-key', text: String.fromCharCode(65 + i) }),
          el('span', { html: text(o.text) })
        ]);
        btn.addEventListener('click', function () { answer(o, i, false); });
        optEls.push(btn); opts.appendChild(btn);
      });
      panel.appendChild(opts);
      var bestOpt = options.filter(function (x) { return x.grade === 'best'; })[0];

      // Timer + options unlock only at the decision frame.
      onDecide = function () {
        setOptionsEnabled(true);
        if (!answered) startTimer(function () { answer(null, -1, true); });
      };
      playOpening();

      function answer(o, i, timedOut) {
        if (answered) return;
        answered = true;
        stopTimer();
        var grade = timedOut ? 'out' : (o.grade || 'poor');
        run[grade]++;
        simState.done[s.id] = true;
        if (grade === 'best') simState.best[s.id] = true;
        saveState();
        optEls.forEach(function (be, j) {
          be.disabled = true; be.classList.remove('is-waiting');
          var g = options[j].grade;
          be.classList.toggle('is-correct', g === 'best');
          be.classList.toggle('is-chosen', j === i);
          be.classList.toggle('is-wrong', j === i && g !== 'best');
          be.classList.toggle('is-dim', j !== i && g !== 'best');
        });
        var verdict = timedOut ? 'No decision — that\u2019s the one that always loses' : grade === 'best' ? 'Best option' : grade === 'ok' ? 'Playable — but there was better' : 'Not this one';
        var fb = el('div', { class: 'quiz__feedback' + (grade === 'best' ? ' is-correct' : '') }, [
          el('div', { class: 'quiz__verdict', text: verdict }),
          timedOut ? el('div', { class: 'quiz__fb-text', text: 'The clock ran out. A late decision and no decision cost the same. Read the picture faster: ball, runner, space.' }) : el('div', { class: 'quiz__fb-text', html: text(o.feedback) }),
          grade !== 'best' && bestOpt ? el('div', { class: 'quiz__reveal', html: 'Best option: <strong>' + text(bestOpt.text) + '</strong>' + (bestOpt.feedback ? ' — ' + text(bestOpt.feedback) : '') }) : null,
          el('button', { class: 'btn btn--primary', type: 'button', text: idx + 1 < order.length ? 'Next scenario' : 'See how you did', onclick: next })
        ]);
        panel.appendChild(fb);
        // Keep the pitch in view while the outcome plays: focus without scrolling,
        // and make sure the board itself is visible (mobile stacks the panel below it).
        try { fb.querySelector('button').focus({ preventScroll: true }); } catch (e) { /* older browsers */ }
        if (o && o.outcome && o.outcome.tracks) {
          var r = svg.getBoundingClientRect();
          if (r.top < 0 || r.bottom > window.innerHeight) svg.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }

        var showBest = grade !== 'best' && bestOpt && bestOpt.outcome && bestOpt.outcome.tracks;
        bestBtn.style.display = showBest ? '' : 'none';
        bestBtn.onclick = showBest ? function () { playOutcome(bestOpt.outcome); } : null;
        if (o && o.outcome && o.outcome.tracks) playOutcome(o.outcome);
        else if (o && o.outcome) { clearResult(); showResult(o.outcome); }
      }
    }
    replayBtn.addEventListener('click', function () {
      if (!cur) return;
      stopTimer();
      playOpening();
    });
    slowBtn.addEventListener('click', function () {
      slow = !slow; state.sim._slow = slow; saveState();
      slowBtn.classList.toggle('is-on', slow); slowBtn.setAttribute('aria-pressed', slow ? 'true' : 'false');
    });
    overlaysBtn.addEventListener('click', function () {
      overlaysOn = !overlaysOn;
      overlaysBtn.classList.toggle('is-on', overlaysOn); overlaysBtn.setAttribute('aria-pressed', overlaysOn ? 'true' : 'false');
      if (cur && lastPos && !(tl && !tl.frozen)) paint(lastPos);   // a running timeline repaints next tick anyway
    });
    function next() { idx++; if (idx < order.length) renderScenario(); else renderSummary(); }
    function renderSummary() {
      teardown();
      panel.innerHTML = '';
      var n = order.length;
      panel.appendChild(el('div', { class: 'quiz__summary' }, [
        el('div', { class: 'eyebrow', text: LEVELS[level].name }),
        el('div', { class: 'quiz__big', html: run.best + '<small> / ' + n + ' best calls</small>' }),
        el('div', { class: 'quiz__best', text: run.ok + ' playable · ' + run.poor + ' poor' + (run.out ? ' · ' + run.out + ' timed out' : '') }),
        el('div', { class: 'quiz__best', text: 'Scenarios you\u2019ve nailed at least once: ' + Object.keys(simState.best).length + ' / ' + scenarios.length }),
        el('button', { class: 'btn btn--primary', type: 'button', text: 'Go again', onclick: function () { order = shuffle(scenarios); idx = 0; run = { best: 0, ok: 0, poor: 0, out: 0 }; renderScenario(); } })
      ]));
    }

    // Leak guards: stop everything when this section is left or the page is hidden.
    window.addEventListener('pagehide', teardown);
    window.addEventListener('hashchange', function () {
      var secEl = stage.closest('.section');
      var active = secEl && secEl.getAttribute('data-section-id') === currentId();
      if (!active && cur) { finishNow(); stopTimer(); }
    });

    if (!scenarios.length) panel.appendChild(el('p', { class: 'calls__empty', text: 'No scenarios yet.' }));
    else renderScenario();
    return [blockTitle(b), blockIntro(b),
      el('div', { class: 'sim__controls' }, [el('div', { class: 'eyebrow', text: 'Pressure — you choose' }), levelChips, levelBlurb]),
      bar,
      el('div', { class: 'pitch-block sim' }, [el('div', {}, [stage, legend, playControls, caption]), panel])];
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
