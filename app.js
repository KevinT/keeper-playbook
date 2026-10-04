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
  var HERO = SECTIONS.filter(function (s) { return s.hero; })[0] || null;
  var PACKS = window.PACKS || { version: 0, levels: [] };

  /* ------------------------------------------------------------------ */
  /* Persistence                                                         */
  /* State is only ever extended (never reset) when the shape grows.     */
  /* ------------------------------------------------------------------ */
  function blankState() {
    return {
      done: {}, quiz: {}, checklist: {}, tree: {}, reviews: {}, ladder: {}, sim: {}, last: null,
      journey: { startLevel: null },      // level id chosen by the keeper / coach
      coach: { unlockAll: false },        // coach preview: ignore locks
      packs: {}                           // packId -> { version, completedAt, completions:[{version, at}] }
    };
  }
  var state = loadState();
  persist();   // write the (possibly extended) shape back so new keys exist on disk — never resets anything

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
  function loadState() {
    var s = blankState();
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        for (var k in s) if (parsed && parsed[k] !== undefined) s[k] = parsed[k];
      }
    } catch (e) { /* storage unavailable or corrupt — run in-memory */ }
    if (!isObj(s.journey)) s.journey = { startLevel: null };
    if (!isObj(s.coach)) s.coach = { unlockAll: false };
    if (!isObj(s.packs)) s.packs = {};
    ['done', 'quiz', 'checklist', 'tree', 'reviews', 'ladder', 'sim'].forEach(function (k) { if (!isObj(s[k])) s[k] = {}; });
    return s;
  }
  function persist() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  var booted = false, refreshQueued = false;
  function saveState() {
    persist();
    // Any state change can move a gate: recompute the journey on the next tick (debounced).
    if (!booted || refreshQueued) return;
    refreshQueued = true;
    setTimeout(function () { refreshQueued = false; refreshProgress(); }, 0);
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
    var simState = state.sim[key] || (state.sim[key] = { done: {}, best: {}, bestAt: {} });
    if (!isObj(simState.done)) simState.done = {};
    if (!isObj(simState.best)) simState.best = {};
    if (!isObj(simState.bestAt)) simState.bestAt = {};
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
        if (grade === 'best') {
          simState.best[s.id] = true;                                   // legacy map, kept in sync
          simState.bestAt[s.id] = Math.max(num(simState.bestAt[s.id], -1), level);   // highest pressure level nailed
        }
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
    function paintSlow() { slowBtn.classList.toggle('is-on', slow); slowBtn.setAttribute('aria-pressed', slow ? 'true' : 'false'); }
    slowBtn.addEventListener('click', function () {
      slow = !slow; state.sim._slow = slow; saveState(); paintSlow();
    });
    // Settings (My game) can change the slow-motion default while this sim is alive.
    document.addEventListener('kp:slow', function () { slow = !!state.sim._slow; paintSlow(); });
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
      var active = secEl && secEl.getAttribute('data-section-id') === activeSectionId();
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
  /* Journey: levels, packs, gates                                       */
  /* computeJourney() is pure — state + manifest + content in, facts out. */
  /* ------------------------------------------------------------------ */
  function sectionById(sections, id) {
    for (var i = 0; i < sections.length; i++) if (sections[i].id === id) return sections[i];
    return null;
  }
  // Resolve a gate key: an exact block key ("<sectionId>:<idx>") or a section id (all matching blocks in it).
  function gateBlockKeys(key, type, sections) {
    if (!key) return [];
    var k = String(key);
    if (k.indexOf(':') !== -1) return [k];
    var sec = sectionById(sections, k);
    if (!sec) return [k];
    var out = [];
    arr(sec.blocks).forEach(function (b, i) { if (b && b.type === type) out.push(sec.id + ':' + i); });
    return out.length ? out : [k];
  }
  function checklistItemCount(id, sections) {
    for (var i = 0; i < sections.length; i++) {
      var blocks = arr(sections[i].blocks);
      for (var j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        if (b && b.type === 'checklist' && (b.id || sections[i].id + ':' + j) === id) return arr(b.items).length;
      }
    }
    return 0;
  }
  function simScenarioCount(id, sections) {
    for (var i = 0; i < sections.length; i++) {
      var blocks = arr(sections[i].blocks);
      for (var j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        if (b && b.type === 'sim' && (b.id || sections[i].id + ':' + j) === id) return arr(b.scenarios).length;
      }
    }
    return 0;
  }
  function evalGate(gate, pack, st, sections) {
    var g = { type: gate.type, label: gate.label || '', pass: false, have: 0, need: 0 };
    var min, n;
    switch (gate.type) {
      case 'sections':
        g.need = pack.sections.length;
        g.have = pack.sections.filter(function (id) { return !!st.done[id]; }).length;
        g.pass = g.have >= g.need;
        if (!gate.label) g.label = 'All ' + g.need + ' steps marked complete';
        break;
      case 'quiz':
        min = num(gate.min, 1); g.need = min;
        var keys = gateBlockKeys(gate.key, 'quiz', sections);
        var best = null;
        keys.forEach(function (k) { var v = st.quiz[k]; if (typeof v === 'number' && (best === null || v > best)) best = v; });
        g.have = best === null ? 0 : best;
        g.pass = best !== null && best >= min;
        if (!gate.label) g.label = 'Quiz best score ' + min + '+';
        break;
      case 'sim':
        min = num(gate.min, 1); g.need = min;
        var lvl = num(gate.level, 0);
        var sim = st.sim[gate.id] || {};
        var bestAt = isObj(sim.bestAt) ? sim.bestAt : {};
        var legacy = isObj(sim.best) ? sim.best : {};
        n = 0;
        var seen = {};
        for (var id in bestAt) { seen[id] = true; if (num(bestAt[id], -1) >= lvl) n++; }
        // Pre-bestAt progress only proves "best at some level" — count it for level-0 gates.
        if (lvl === 0) for (var id2 in legacy) if (!seen[id2] && legacy[id2]) n++;
        g.have = n; g.pass = n >= min;
        if (!gate.label) g.label = 'Simulator ' + gate.id + ' — ' + min + ' best calls';
        break;
      case 'reviews':
        min = num(gate.min, 1); g.need = min;
        g.have = arr(st.reviews[gate.id]).length;
        g.pass = g.have >= min;
        if (!gate.label) g.label = min + ' saved reviews';
        break;
      case 'checklist':
        g.need = checklistItemCount(gate.id, sections);
        var ticks = isObj(st.checklist[gate.id]) ? st.checklist[gate.id] : {};
        n = 0;
        for (var i = 0; i < g.need; i++) if (ticks[i]) n++;
        g.have = n; g.pass = g.need > 0 && n >= g.need;
        if (!gate.label) g.label = 'Checklist all ticked';
        break;
      default:
        g.label = g.label || ('Unknown gate ' + gate.type);
        g.pass = false;
    }
    return g;
  }

  function computeJourney(st, packs, playbook) {
    st = st || {};
    ['done', 'quiz', 'checklist', 'reviews', 'sim', 'packs'].forEach(function (k) { if (!isObj(st[k])) st[k] = {}; });
    var sections = arr(playbook && playbook.sections);
    var unlockAll = !!(st.coach && st.coach.unlockAll);
    var levels = arr(packs && packs.levels).slice().sort(function (a, b) { return num(a.n, 0) - num(b.n, 0); });
    var withPacks = levels.filter(function (L) { return arr(L.packs).length; });
    var startId = st.journey && st.journey.startLevel;
    var startLevel = null;
    levels.forEach(function (L) { if (L.id === startId) startLevel = L; });
    if (!startLevel) startLevel = withPacks[0] || null;
    var startN = startLevel ? num(startLevel.n, 0) : 0;

    var out = { levels: [], packs: {}, packList: [], current: null, startLevel: startLevel ? startLevel.id : null, startChosen: !!(startId && levels.some(function (L) { return L.id === startId; })), unlockAll: unlockAll, completed: 0, published: 0 };
    var lowerAllComplete = true;       // every pack in every lower level-with-packs is complete
    var firstLevelWithPacks = withPacks[0] || null;

    levels.forEach(function (L) {
      var lv = { id: L.id, n: num(L.n, 0), name: text(L.name), question: text(L.question), ages: text(L.ages), blurb: text(L.blurb), packs: [], hasPacks: arr(L.packs).length > 0, unlocked: false, complete: false };
      lv.unlocked = lv.n <= startN || lowerAllComplete || unlockAll;
      var prevInLevelComplete = true;
      var allComplete = true;
      arr(L.packs).forEach(function (P, i) {
        var sectionsIn = arr(P.sections).slice();
        var gates = arr(P.gates).map(function (g) { return evalGate(g, { sections: sectionsIn }, st, sections); });
        var complete = gates.length > 0 && gates.every(function (g) { return g.pass; });
        var passed = gates.filter(function (g) { return g.pass; }).length;
        var open = (lv.unlocked && prevInLevelComplete) || unlockAll;
        var rec = isObj(st.packs[P.id]) ? st.packs[P.id] : null;
        var stepsDone = sectionsIn.filter(function (id) { return !!st.done[id]; }).length;
        var nextSection = null;
        for (var j = 0; j < sectionsIn.length; j++) if (!st.done[sectionsIn[j]]) { nextSection = sectionsIn[j]; break; }
        var pk = {
          id: P.id, levelId: L.id, levelN: lv.n, levelName: lv.name, version: text(P.version), title: text(P.title), tag: text(P.tag), promise: text(P.promise),
          index: i, sections: sectionsIn, gates: gates, gatesPassed: passed, gateCount: gates.length,
          pct: gates.length ? Math.round(passed / gates.length * 100) : 0,
          stepsDone: stepsDone, nextSection: nextSection,
          state: complete ? 'complete' : open ? 'open' : 'locked',
          complete: complete, open: open, locked: !open && !complete,
          completedAt: rec && rec.completedAt ? rec.completedAt : null,
          completedVersion: rec && rec.version ? rec.version : null,
          started: stepsDone > 0 || passed > 0
        };
        lv.packs.push(pk); out.packs[P.id] = pk; out.packList.push(pk);
        out.published++;
        if (complete) out.completed++;
        if (!complete) { allComplete = false; prevInLevelComplete = false; }
        if (!out.current && pk.state === 'open') out.current = pk;
      });
      lv.complete = lv.hasPacks && allComplete;
      if (lv.hasPacks && !allComplete) lowerAllComplete = false;
      out.levels.push(lv);
    });
    // If every pack is complete the "current" pack is the last one.
    if (!out.current && out.packList.length) out.current = out.packList[out.packList.length - 1];
    out.firstLevelWithPacks = firstLevelWithPacks ? firstLevelWithPacks.id : null;
    // The level the keeper is "on": the current pack's level, else the start level.
    out.currentLevel = out.current ? out.current.levelId : out.startLevel;
    return out;
  }
  window.computeJourney = computeJourney;

  var journey = null;
  function recomputeJourney() {
    journey = computeJourney(state, PACKS, DATA);
    // Persist first completion per version (never overwrite earlier completions).
    var changed = false;
    journey.packList.forEach(function (pk) {
      if (!pk.complete) return;
      var rec = isObj(state.packs[pk.id]) ? state.packs[pk.id] : null;
      var completions = rec && Array.isArray(rec.completions) ? rec.completions : [];
      var already = completions.some(function (c) { return c && c.version === pk.version; });
      if (already && rec && rec.version === pk.version) return;
      var at = todayISO();
      if (!already) completions.push({ version: pk.version, at: at });
      var mine = completions.filter(function (c) { return c && c.version === pk.version; })[0];
      state.packs[pk.id] = { version: pk.version, completedAt: mine ? mine.at : at, completions: completions };
      pk.completedAt = state.packs[pk.id].completedAt; pk.completedVersion = pk.version;
      changed = true;
    });
    if (changed) persist();
    return journey;
  }
  function packOfSection(id) {
    if (!journey) recomputeJourney();
    for (var i = 0; i < journey.packList.length; i++) if (journey.packList[i].sections.indexOf(id) !== -1) return journey.packList[i];
    return null;
  }
  function packFor(id) { return journey && journey.packs[id] ? journey.packs[id] : null; }
  function nextPackAfter(pk) {
    var i = journey.packList.indexOf(pk);
    return i >= 0 && i + 1 < journey.packList.length ? journey.packList[i + 1] : null;
  }
  function continueHref(pk) {
    if (!pk) return '#levels';
    return pk.nextSection ? '#s/' + pk.nextSection : '#pack/' + pk.id;
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return parseInt(m[3], 10) + ' ' + months[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  /* ------------------------------------------------------------------ */
  /* Small SVG glyphs (no emoji, no icon fonts)                          */
  /* ------------------------------------------------------------------ */
  function padlock() {
    var s = svgEl('svg', { class: 'glyph glyph--lock', viewBox: '0 0 12 12', width: 12, height: 12, 'aria-hidden': 'true', focusable: 'false' });
    s.appendChild(svgEl('rect', { x: 1.5, y: 5.5, width: 9, height: 6, rx: .5 }));
    s.appendChild(svgEl('path', { d: 'M3.5 5.5V3.75a2.5 2.5 0 0 1 5 0V5.5', fill: 'none' }));
    return s;
  }
  function tick(cls) {
    var s = svgEl('svg', { class: 'glyph glyph--tick' + (cls ? ' ' + cls : ''), viewBox: '0 0 12 12', width: 12, height: 12, 'aria-hidden': 'true', focusable: 'false' });
    s.appendChild(svgEl('path', { d: 'M2 6.5l2.6 2.5L10 3.5', fill: 'none' }));
    return s;
  }
  function stateGlyph(pk) {
    if (pk.complete) return el('span', { class: 'pstate pstate--complete' }, [tick(), 'Complete']);
    if (pk.open) return el('span', { class: 'pstate pstate--open' }, [el('i', { class: 'pstate__dot' }), pk.started ? 'In progress' : 'Open']);
    return el('span', { class: 'pstate pstate--locked' }, [padlock(), 'Locked']);
  }

  /* ------------------------------------------------------------------ */
  /* Progress                                                            */
  /* ------------------------------------------------------------------ */
  function refreshProgress() {
    recomputeJourney();
    var total = journey.published, n = journey.completed;
    var pct = total ? Math.round(n / total * 100) : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('footer-status').textContent = total ? n + ' of ' + total + ' packs complete' : '';
    document.querySelectorAll('.complete-toggle').forEach(function (btn) {
      var on = !!state.done[btn.getAttribute('data-section')];
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Section complete' : 'Mark section complete';
    });
    paintNavCurrent();
    // Re-render the live views that depend on the journey.
    renderHomeCard();
    if (document.getElementById('view-levels').classList.contains('is-active')) renderLevels();
    var pv = document.getElementById('view-pack');
    if (pv.classList.contains('is-active') && pv.getAttribute('data-pack-id')) renderPack(pv.getAttribute('data-pack-id'));
    document.querySelectorAll('.section.is-active[data-section-id]').forEach(function (sec) { paintSectionFrame(sec); });
    if (document.getElementById('view-me').classList.contains('is-active')) renderMe();
  }

  /* ------------------------------------------------------------------ */
  /* Navigation                                                          */
  /* ------------------------------------------------------------------ */
  var NAV = [
    { id: 'levels', label: 'Levels', href: '#levels' },
    { id: 'pack', label: 'Current pack', href: '#pack' },
    { id: 'me', label: 'My game', href: '#me' }
  ];
  function navLink(item) {
    var a = el('a', { href: item.href, 'data-nav-id': item.id, text: item.label });
    a.addEventListener('click', closeDrawer);
    return a;
  }
  function buildNav() {
    var top = document.getElementById('topnav');
    var drawer = document.getElementById('drawer-nav');
    NAV.forEach(function (it) { top.appendChild(navLink(it)); drawer.appendChild(navLink(it)); });
  }
  function paintNavCurrent() {
    var cur = journey && journey.current;
    document.querySelectorAll('[data-nav-id="pack"]').forEach(function (a) {
      a.href = cur ? '#pack/' + cur.id : '#levels';
      a.textContent = cur ? 'Current pack' : 'Current pack';
      a.title = cur ? cur.title : '';
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

  /* ------------------------------------------------------------------ */
  /* Views: home                                                         */
  /* ------------------------------------------------------------------ */
  function buildHero(s) {
    var headline = Array.isArray(META.headline) ? META.headline : [text(META.headline)];
    var sec = el('section', { class: 'section section--hero view', id: 'view-home', 'data-view': 'home', 'data-section-id': 'home' });
    var cont = el('a', { class: 'btn', id: 'hero-continue', href: '#levels', text: 'Continue' });
    cont.style.display = 'none';
    sec.appendChild(el('div', { class: 'hero' }, [
      s && s.kicker ? el('div', { class: 'eyebrow hero__kicker', text: s.kicker }) : null,
      el('h1', { class: 'display hero__headline' }, [
        el('span', { class: 'line-1', text: text(headline[0]) }),
        headline[1] ? el('span', { class: 'line-2', text: text(headline[1]) }) : null
      ]),
      META.tagline ? el('p', { class: 'hero__tagline', text: META.tagline }) : null,
      el('div', { class: 'hero__actions' }, [
        el('a', { class: 'btn btn--primary', href: '#levels', text: 'Start' }),
        cont
      ]),
      META.intro ? el('div', { class: 'hero__intro', html: META.intro }) : null
    ]));
    sec.appendChild(el('div', { class: 'where', id: 'where' }));
    // Hero blocks, if any
    if (s) arr(s.blocks).forEach(function (b, i) { sec.appendChild(el('div', { class: 'section__inner' }, renderBlock(b, s, i))); });
    return sec;
  }
  function renderHomeCard() {
    var box = document.getElementById('where');
    var cont = document.getElementById('hero-continue');
    if (!box) return;
    box.innerHTML = '';
    var cur = journey.current;
    var started = journey.startChosen || journey.packList.some(function (p) { return p.started || p.complete; });
    if (cont) {
      cont.style.display = started && cur ? '' : 'none';
      if (cur) cont.href = continueHref(cur);
    }
    if (!started || !cur) {
      box.appendChild(el('div', { class: 'where__card' }, [
        el('div', { class: 'eyebrow', text: 'Start here' }),
        el('div', { class: 'where__title', text: 'Find your level' }),
        el('p', { class: 'where__text', text: 'The playbook is a journey in levels. Each level is a set of packs with a gate at the end. Pick where you start — your coach will tell you where — and work through them in order.' }),
        el('div', { class: 'where__actions' }, [el('a', { class: 'btn btn--primary', href: '#levels', text: 'See the levels' })])
      ]));
      return;
    }
    var lv = journey.levels.filter(function (L) { return L.id === cur.levelId; })[0];
    box.appendChild(el('div', { class: 'where__card' }, [
      el('div', { class: 'eyebrow', text: 'Where you are' }),
      el('div', { class: 'where__row' }, [
        el('div', { class: 'where__num display', text: String(cur.levelN) }),
        el('div', {}, [
          el('div', { class: 'where__level', text: 'Level ' + cur.levelN + ' · ' + (lv ? lv.name : '') }),
          el('div', { class: 'where__title', text: cur.tag + ' — ' + cur.title }),
          el('div', { class: 'where__meta', text: (cur.complete ? 'Complete' : cur.gatesPassed + ' of ' + cur.gateCount + ' gates met · ' + cur.pct + '%') })
        ])
      ]),
      el('div', { class: 'bar', 'aria-hidden': 'true' }, [el('i', { style: 'width:' + cur.pct + '%' })]),
      el('div', { class: 'where__actions' }, [
        el('a', { class: 'btn btn--primary', href: continueHref(cur), text: cur.complete ? 'Open pack' : 'Continue' }),
        el('a', { class: 'btn btn--ghost', href: '#levels', text: 'All levels' })
      ])
    ]));
  }

  /* ------------------------------------------------------------------ */
  /* Views: levels (journey map)                                         */
  /* ------------------------------------------------------------------ */
  function packRow(pk) {
    var row = el('div', { class: 'prow prow--' + pk.state });
    var head = el('div', { class: 'prow__head' }, [
      el('span', { class: 'prow__tag', text: pk.tag }),
      el('span', { class: 'prow__title', text: pk.title }),
      el('span', { class: 'prow__ver', text: 'v' + pk.version })
    ]);
    row.appendChild(head);
    row.appendChild(el('div', { class: 'prow__promise', text: pk.promise }));
    var foot = el('div', { class: 'prow__foot' }, [stateGlyph(pk)]);
    if (pk.complete) {
      foot.appendChild(el('span', { class: 'prow__date', text: (pk.completedAt ? fmtDate(pk.completedAt) + ' · ' : '') + 'v' + (pk.completedVersion || pk.version) }));
      foot.appendChild(el('span', { class: 'spacer' }));
      foot.appendChild(el('a', { class: 'btn btn--sm btn--ghost', href: '#pack/' + pk.id, text: 'Open' }));
    } else if (pk.open) {
      foot.appendChild(el('span', { class: 'prow__date', text: pk.gatesPassed + '/' + pk.gateCount + ' gates' }));
      foot.appendChild(el('span', { class: 'spacer' }));
      foot.appendChild(el('a', { class: 'btn btn--sm', href: '#pack/' + pk.id, text: pk.started ? 'Continue' : 'Start' }));
    } else {
      foot.appendChild(el('span', { class: 'spacer' }));
      foot.appendChild(el('a', { class: 'btn btn--sm btn--ghost', href: '#pack/' + pk.id, text: 'Preview' }));
    }
    row.appendChild(foot);
    return row;
  }
  function renderLevels() {
    var view = document.getElementById('view-levels');
    view.innerHTML = '';
    var inner = el('div', { class: 'section__inner' });
    inner.appendChild(el('header', { class: 'section__head' }, [
      el('div', { class: 'eyebrow', text: 'The journey' }),
      el('h2', { class: 'display', text: 'Levels' }),
      el('p', { class: 'section__lede', text: 'Five stages of a goalkeeper. Each level is made of packs; each pack has a gate. Finish the gate, unlock the next.' })
    ]));
    if (!journey.startChosen) {
      inner.appendChild(el('div', { class: 'placement' }, [
        el('div', { class: 'eyebrow', text: 'Where do you start?' }),
        el('p', { text: 'Your coach will tell you where to start. If you are not sure, start at the first level with a pack.' }),
        startLevelSelect('placement-select'),
        el('p', { class: 'placement__hint', text: 'You can change this later under My game.' })
      ]));
    }
    var map = el('ol', { class: 'levels' });
    var curLevel = journey.currentLevel;
    var reached = true;
    journey.levels.forEach(function (L) {
      var isCurrent = L.id === curLevel;
      var cls = 'level' + (L.unlocked ? ' is-unlocked' : ' is-locked') + (isCurrent ? ' is-current' : '') + (L.complete ? ' is-complete' : '') + (reached ? ' is-reached' : '');
      if (isCurrent) reached = false;
      var li = el('li', { class: cls });
      var head = el('div', { class: 'level__head' }, [
        el('div', { class: 'level__num display', text: String(L.n) }),
        el('div', { class: 'level__text' }, [
          el('div', { class: 'level__name' }, [L.name, L.unlocked ? null : padlock()]),
          el('div', { class: 'level__q display', text: L.question }),
          L.ages ? el('div', { class: 'level__ages', text: 'about ' + L.ages.replace(/^about\s+/i, '') + ' — a guide, not a rule' }) : null,
          el('p', { class: 'level__blurb', text: L.blurb })
        ])
      ]);
      li.appendChild(head);
      var packs = el('div', { class: 'level__packs' });
      if (!L.hasPacks) packs.appendChild(el('div', { class: 'level__none', text: 'No pack published yet' }));
      else L.packs.forEach(function (pk) { packs.appendChild(packRow(pk)); });
      li.appendChild(packs);
      map.appendChild(li);
    });
    inner.appendChild(map);
    view.appendChild(inner);
  }
  function startLevelSelect(id) {
    var sel = el('select', { class: 'input select', id: id, 'aria-label': 'Starting level' });
    sel.appendChild(el('option', { value: '', text: 'Choose a level' }));
    journey.levels.forEach(function (L) {
      sel.appendChild(el('option', { value: L.id, text: 'Level ' + L.n + ' · ' + L.name + (L.hasPacks ? '' : ' (no pack yet)') }));
    });
    sel.value = journey.startChosen ? journey.startLevel : '';
    sel.addEventListener('change', function () {
      state.journey.startLevel = sel.value || null;
      saveState();
    });
    return sel;
  }

  /* ------------------------------------------------------------------ */
  /* Views: pack                                                         */
  /* ------------------------------------------------------------------ */
  function renderPack(packId) {
    var view = document.getElementById('view-pack');
    view.setAttribute('data-pack-id', packId || '');
    view.innerHTML = '';
    var inner = el('div', { class: 'section__inner' });
    var pk = packFor(packId);
    if (!pk) {
      inner.appendChild(el('header', { class: 'section__head' }, [el('div', { class: 'eyebrow', text: 'Pack' }), el('h2', { class: 'display', text: 'Not found' })]));
      inner.appendChild(el('p', {}, [el('a', { href: '#levels', text: 'Back to levels' })]));
      view.appendChild(inner); return;
    }
    var lv = journey.levels.filter(function (L) { return L.id === pk.levelId; })[0];
    inner.appendChild(el('header', { class: 'section__head pack__head' }, [
      el('div', { class: 'eyebrow pack__crumbs' }, [el('a', { class: 'crumb', href: '#levels', text: 'Level ' + pk.levelN + ' · ' + (lv ? lv.name : '') }), el('span', { text: ' · ' + pk.tag })]),
      el('h2', { class: 'display', text: pk.title }),
      el('p', { class: 'section__lede', text: pk.promise }),
      el('div', { class: 'pack__meta' }, [stateGlyph(pk), el('span', { class: 'pack__ver', text: 'Version ' + pk.version })])
    ]));

    if (pk.locked) {
      inner.appendChild(el('div', { class: 'locked-panel' }, [
        padlock(),
        el('div', {}, [
          el('div', { class: 'locked-panel__title', text: 'This pack is locked' }),
          el('p', { text: 'Finish the packs before it to open it. Your coach can also set your starting level under My game.' }),
          el('a', { class: 'btn btn--sm', href: '#levels', text: 'Back to levels' })
        ])
      ]));
    }

    // Steps
    var steps = el('ol', { class: 'steps' });
    pk.sections.forEach(function (id, i) {
      var sec = findSection(id);
      var done = !!state.done[id];
      var a = el('a', { class: 'step' + (done ? ' is-done' : ''), href: '#s/' + id }, [
        el('span', { class: 'step__num display', text: pad(i + 1) }),
        el('span', { class: 'step__body' }, [
          el('span', { class: 'step__title', text: sec ? text(sec.title || sec.nav) : id }),
          sec && sec.lede ? el('span', { class: 'step__sub', text: sec.lede }) : null
        ]),
        el('span', { class: 'step__tick', 'aria-label': done ? 'Done' : 'Not done' }, [tick()])
      ]);
      steps.appendChild(el('li', {}, a));
    });
    inner.appendChild(el('div', { class: 'pack__block' }, [el('div', { class: 'eyebrow', text: 'Steps' }), steps]));

    // Gates
    var gates = el('ul', { class: 'gates' });
    pk.gates.forEach(function (g) {
      gates.appendChild(el('li', { class: 'gate' + (g.pass ? ' is-pass' : '') }, [
        el('span', { class: 'gate__mark' }, [g.pass ? tick() : null]),
        el('span', { class: 'gate__label', text: g.label }),
        el('span', { class: 'gate__count', text: g.have + ' / ' + g.need })
      ]));
    });
    inner.appendChild(el('div', { class: 'pack__block' }, [
      el('div', { class: 'eyebrow', text: 'What completes this pack' }),
      el('div', { class: 'pack__progress' }, [
        el('div', { class: 'bar', 'aria-hidden': 'true' }, [el('i', { style: 'width:' + pk.pct + '%' })]),
        el('span', { class: 'pack__pct', text: pk.gatesPassed + ' of ' + pk.gateCount + ' gates · ' + pk.pct + '%' })
      ]),
      gates
    ]));

    if (pk.complete) {
      var nx = nextPackAfter(pk);
      inner.appendChild(el('div', { class: 'complete-panel' }, [
        el('div', { class: 'eyebrow', text: 'Pack complete' }),
        el('div', { class: 'complete-panel__title display', text: 'Level ' + pk.levelN + ' · ' + pk.title + ' v' + pk.version }),
        el('div', { class: 'complete-panel__date', text: pk.completedAt ? 'Completed ' + fmtDate(pk.completedAt) : '' }),
        el('div', { class: 'where__actions' }, [
          nx ? el('a', { class: 'btn btn--primary', href: '#pack/' + nx.id, text: 'Next pack' }) : el('a', { class: 'btn btn--primary', href: '#levels', text: 'All levels' }),
          el('a', { class: 'btn btn--ghost', href: '#s/' + pk.sections[0], text: 'Revisit' })
        ])
      ]));
    } else if (!pk.locked) {
      inner.appendChild(el('div', { class: 'pack__actions' }, [
        el('a', { class: 'btn btn--primary', href: continueHref(pk), text: pk.started ? 'Continue' : 'Start' }),
        el('a', { class: 'btn btn--ghost', href: '#levels', text: 'All levels' })
      ]));
    }
    view.appendChild(inner);
  }

  /* ------------------------------------------------------------------ */
  /* Views: section (framed inside its pack)                             */
  /* ------------------------------------------------------------------ */
  function buildSection(s) {
    var sec = el('section', { class: 'section view', id: 'sec-' + s.id, 'data-section-id': s.id });
    sec.appendChild(el('div', { class: 'packbar', 'data-role': 'packbar' }));
    sec.appendChild(el('div', { class: 'locked-wrap', 'data-role': 'locked' }));
    var inner = el('div', { class: 'section__inner', 'data-role': 'body' });
    inner.appendChild(el('header', { class: 'section__head' }, [
      s.kicker ? el('div', { class: 'eyebrow', text: s.kicker }) : null,
      el('h2', { class: 'display', text: text(s.title || s.nav) }),
      s.lede ? el('p', { class: 'section__lede', text: s.lede }) : null
    ]));
    arr(s.blocks).forEach(function (b, j) { inner.appendChild(renderBlock(b, s, j)); });

    var toggle = el('button', { class: 'btn complete-toggle', type: 'button', 'data-section': s.id, 'aria-pressed': 'false', text: 'Mark section complete' });
    toggle.addEventListener('click', function () {
      if (state.done[s.id]) delete state.done[s.id]; else state.done[s.id] = true;
      saveState(); refreshProgress();
    });
    inner.appendChild(el('div', { class: 'section__foot' }, [
      toggle,
      el('span', { class: 'spacer' }),
      el('div', { class: 'section__nav', 'data-role': 'stepnav' })
    ]));
    sec.appendChild(inner);
    return sec;
  }
  // Paint the pack breadcrumb, lock panel and prev/next step buttons for a section element.
  function paintSectionFrame(sec) {
    var id = sec.getAttribute('data-section-id');
    var pk = packOfSection(id);
    var bar = sec.querySelector('[data-role="packbar"]');
    var lockWrap = sec.querySelector('[data-role="locked"]');
    var body = sec.querySelector('[data-role="body"]');
    var nav = sec.querySelector('[data-role="stepnav"]');
    bar.innerHTML = ''; lockWrap.innerHTML = ''; nav.innerHTML = '';
    var locked = !!(pk && pk.locked && !journey.unlockAll);
    body.style.display = locked ? 'none' : '';
    sec.classList.toggle('is-locked', locked);
    if (pk) {
      var i = pk.sections.indexOf(id);
      bar.appendChild(el('div', { class: 'packbar__inner' }, [
        el('a', { class: 'packbar__crumb', href: '#levels', text: 'Level ' + pk.levelN }),
        el('span', { class: 'packbar__sep', text: '·' }),
        el('a', { class: 'packbar__crumb', href: '#pack/' + pk.id, text: pk.title }),
        el('span', { class: 'packbar__sep', text: '·' }),
        el('span', { class: 'packbar__step', text: 'Step ' + (i + 1) + ' of ' + pk.sections.length }),
        el('span', { class: 'spacer' }),
        el('span', { class: 'packbar__dots', 'aria-hidden': 'true' }, pk.sections.map(function (sid, j) {
          return el('i', { class: (state.done[sid] ? 'is-done' : '') + (j === i ? ' is-here' : '') });
        }))
      ]));
      if (locked) {
        lockWrap.appendChild(el('div', { class: 'section__inner' }, [
          el('div', { class: 'locked-panel' }, [
            padlock(),
            el('div', {}, [
              el('div', { class: 'locked-panel__title', text: 'Locked — Level ' + pk.levelN + ' · ' + pk.tag + ' ' + pk.title }),
              el('p', { text: 'This section belongs to a pack you have not reached yet. Finish the packs before it, or ask your coach to set your starting level.' }),
              el('a', { class: 'btn btn--sm', href: '#levels', text: 'See the levels' })
            ])
          ])
        ]));
        return;
      }
      var prev = i > 0 ? findSection(pk.sections[i - 1]) : null;
      var next = i + 1 < pk.sections.length ? findSection(pk.sections[i + 1]) : null;
      if (prev) nav.appendChild(el('a', { class: 'btn btn--ghost', href: '#s/' + prev.id, text: '\u2190 ' + text(prev.nav || prev.title) }));
      else nav.appendChild(el('a', { class: 'btn btn--ghost', href: '#pack/' + pk.id, text: '\u2190 Pack' }));
      if (next) nav.appendChild(el('a', { class: 'btn', href: '#s/' + next.id, text: text(next.nav || next.title) + ' \u2192' }));
      else nav.appendChild(el('a', { class: 'btn', href: '#pack/' + pk.id, text: 'Back to pack \u2192' }));
    } else {
      bar.appendChild(el('div', { class: 'packbar__inner' }, [el('span', { class: 'packbar__step', text: 'Not in a pack yet' }), el('span', { class: 'spacer' }), el('a', { class: 'packbar__crumb', href: '#levels', text: 'Levels' })]));
      nav.appendChild(el('a', { class: 'btn btn--ghost', href: '#levels', text: '\u2190 Levels' }));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Views: my game                                                      */
  /* ------------------------------------------------------------------ */
  function renderMe() {
    var view = document.getElementById('view-me');
    view.innerHTML = '';
    var inner = el('div', { class: 'section__inner' });
    inner.appendChild(el('header', { class: 'section__head' }, [
      el('div', { class: 'eyebrow', text: 'You' }),
      el('h2', { class: 'display', text: 'My game' }),
      el('p', { class: 'section__lede', text: 'Everything you have recorded, in one place.' })
    ]));

    // Pack completions
    var comp = el('div', { class: 'me__list' });
    var any = false;
    journey.packList.forEach(function (pk) {
      var rec = isObj(state.packs[pk.id]) ? state.packs[pk.id] : null;
      var comps = rec && Array.isArray(rec.completions) ? rec.completions : [];
      if (!pk.complete && !comps.length) return;
      any = true;
      comp.appendChild(el('div', { class: 'me__row' }, [
        tick(),
        el('span', { class: 'me__row-title', text: 'Level ' + pk.levelN + ' · ' + pk.title }),
        el('span', { class: 'me__row-meta', text: comps.length ? comps.map(function (c) { return 'v' + c.version + ' ' + fmtDate(c.at); }).join(' · ') : 'v' + pk.version })
      ]));
    });
    if (!any) comp.appendChild(el('div', { class: 'me__empty', text: 'No packs completed yet.' }));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Packs completed' }), comp]));

    // Ladder
    var ladderBox = el('div', { class: 'me__list' });
    var ladderAny = false;
    CONTENT_SECTIONS.forEach(function (s) {
      arr(s.blocks).forEach(function (b, i) {
        if (!b || b.type !== 'ladder') return;
        var k = s.id + ':' + i, v = state.ladder[k];
        if (typeof v !== 'number') return;
        var lv = arr(b.levels)[v];
        ladderAny = true;
        ladderBox.appendChild(el('div', { class: 'me__row' }, [
          el('span', { class: 'me__row-num display', text: String(lv && lv.level !== undefined ? lv.level : v + 1) }),
          el('span', { class: 'me__row-title', text: lv ? text(lv.name) : 'Rung ' + (v + 1) }),
          el('a', { class: 'me__row-meta', href: '#s/' + s.id, text: 'Change' })
        ]));
      });
    });
    if (!ladderAny) ladderBox.appendChild(el('div', { class: 'me__empty' }, ['Not placed yet. ', el('a', { href: '#s/ladder', text: 'Mark where you are on the ladder' }), '.']));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Ladder — where you put yourself' }), ladderBox]));

    // Sim stats
    var simBox = el('div', { class: 'me__list' });
    var simAny = false;
    var LEVEL_NAMES = ['No clock', 'Calm', 'Pressure', 'Match speed'];
    CONTENT_SECTIONS.forEach(function (s) {
      arr(s.blocks).forEach(function (b, i) {
        if (!b || b.type !== 'sim') return;
        var id = b.id || s.id + ':' + i;
        var st = isObj(state.sim[id]) ? state.sim[id] : null;
        var total = arr(b.scenarios).length;
        var bestAt = st && isObj(st.bestAt) ? st.bestAt : {};
        var legacy = st && isObj(st.best) ? st.best : {};
        var nailed = {};
        for (var k in legacy) if (legacy[k]) nailed[k] = true;
        for (var k2 in bestAt) nailed[k2] = true;
        var n = Object.keys(nailed).length;
        var perLevel = LEVEL_NAMES.map(function (nm, L) { var c = 0; for (var k3 in bestAt) if (num(bestAt[k3], -1) >= L) c++; return nm + ' ' + c; });
        simAny = true;
        simBox.appendChild(el('div', { class: 'me__row me__row--stack' }, [
          el('span', { class: 'me__row-title', text: text(b.title || id) }),
          el('span', { class: 'me__row-meta', text: n + ' of ' + total + ' plays nailed at least once' }),
          el('span', { class: 'me__row-sub', text: 'Best call by pressure: ' + perLevel.join(' · ') })
        ]));
      });
    });
    if (!simAny) simBox.appendChild(el('div', { class: 'me__empty', text: 'No simulator yet.' }));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Simulator' }), simBox]));

    // Reviews
    var revBox = el('div', { class: 'me__list' });
    var revAny = false;
    CONTENT_SECTIONS.forEach(function (s) {
      arr(s.blocks).forEach(function (b, i) {
        if (!b || b.type !== 'review') return;
        var id = b.id || s.id + ':' + i;
        var entries = arr(state.reviews[id]);
        var prompts = arr(b.prompts);
        entries.forEach(function (e) {
          revAny = true;
          var rv = el('div', { class: 'rv' });
          var head = el('button', { class: 'rv__head', type: 'button', 'aria-expanded': 'false' }, [
            el('span', { class: 'rv__date', text: text(e.date) }),
            el('span', { class: 'rv__preview', text: arr(e.answers).filter(Boolean)[0] || '' }),
            el('span', { class: 'rv__caret', text: '\u2192' })
          ]);
          head.addEventListener('click', function () { var o = rv.classList.toggle('is-open'); head.setAttribute('aria-expanded', o ? 'true' : 'false'); });
          var body = el('div', { class: 'rv__body' });
          prompts.forEach(function (p, j) { body.appendChild(el('div', { class: 'rv__entry' }, [el('span', { class: 'label', text: text(p) }), el('p', { text: arr(e.answers)[j] || '\u2014' })])); });
          rv.appendChild(head); rv.appendChild(body); revBox.appendChild(rv);
        });
        if (!entries.length) revBox.appendChild(el('div', { class: 'me__empty' }, ['No reviews saved yet. ', el('a', { href: '#s/' + s.id, text: 'Write one after your next match' }), '.']));
      });
    });
    if (!revAny && !revBox.children.length) revBox.appendChild(el('div', { class: 'me__empty', text: 'No reviews yet.' }));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Match reviews' }), revBox]));

    // Settings
    var unlock = el('input', { type: 'checkbox', id: 'set-unlock' });
    unlock.checked = !!state.coach.unlockAll;
    unlock.addEventListener('change', function () { state.coach.unlockAll = unlock.checked; saveState(); });
    var slowIn = el('input', { type: 'checkbox', id: 'set-slow' });
    slowIn.checked = !!state.sim._slow;
    slowIn.addEventListener('change', function () { state.sim._slow = slowIn.checked; saveState(); document.dispatchEvent(new Event('kp:slow')); });
    var resetBtn = el('button', { class: 'btn btn--ghost', type: 'button', text: 'Reset progress' });
    resetBtn.addEventListener('click', resetProgress);
    inner.appendChild(el('div', { class: 'me__block settings' }, [
      el('div', { class: 'eyebrow', text: 'Settings' }),
      el('div', { class: 'field' }, [
        el('label', { class: 'label', for: 'set-start', text: 'Starting level' }),
        startLevelSelect('set-start'),
        el('div', { class: 'field__hint', text: 'Your coach will tell you where to start.' })
      ]),
      el('label', { class: 'check check--setting', for: 'set-unlock' }, [unlock, el('span', { class: 'check__box' }), el('span', { class: 'check__text', text: 'Unlock everything (coach preview)' })]),
      el('label', { class: 'check check--setting', for: 'set-slow' }, [slowIn, el('span', { class: 'check__box' }), el('span', { class: 'check__text', text: 'Slow motion by default in the simulator' })]),
      el('div', { class: 'settings__reset' }, [resetBtn])
    ]));
    view.appendChild(inner);
  }
  function resetProgress() {
    if (window.confirm('Reset all progress? This clears completed sections, quiz scores, checklists, saved reviews and pack completions.')) {
      state = blankState(); persist(); window.location.hash = ''; window.location.reload();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Routing                                                             */
  /* ------------------------------------------------------------------ */
  function findSection(id) {
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) return SECTIONS[i];
    return null;
  }
  function currentHash() {
    var h = (window.location.hash || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    return h;
  }
  // Parse the hash into { view, id }.
  function parseRoute(h) {
    if (!h || h === 'home' || (HERO && h === HERO.id)) return { view: 'home' };
    if (h === 'levels') return { view: 'levels' };
    if (h === 'me') return { view: 'me' };
    if (h === 'pack') return { view: 'pack', id: journey && journey.current ? journey.current.id : null };
    var m = /^pack\/(.+)$/.exec(h);
    if (m) return { view: 'pack', id: m[1] };
    m = /^s\/(.+)$/.exec(h);
    if (m) return { view: 'section', id: m[1] };
    if (findSection(h) && !findSection(h).hero) return { view: 'redirect', to: '#s/' + h };
    return { view: 'home', unknown: true };
  }
  // Section id currently on screen (used by the sim leak guard).
  function activeSectionId() {
    var r = parseRoute(currentHash());
    return r.view === 'section' ? r.id : null;
  }
  function showView(id) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('is-active', v.id === id); });
  }
  function route() {
    var r = parseRoute(currentHash());
    if (r.view === 'redirect') { window.location.replace(r.to); return; }
    if (r.unknown) { window.location.replace('#home'); return; }
    recomputeJourney();
    var navId = null, title = '';
    if (r.view === 'home') { showView('view-home'); renderHomeCard(); }
    else if (r.view === 'levels') { renderLevels(); showView('view-levels'); navId = 'levels'; title = 'Levels'; }
    else if (r.view === 'me') { renderMe(); showView('view-me'); navId = 'me'; title = 'My game'; }
    else if (r.view === 'pack') {
      if (!r.id) { window.location.replace('#levels'); return; }
      renderPack(r.id); showView('view-pack');
      var pk = packFor(r.id);
      navId = journey.current && journey.current.id === r.id ? 'pack' : null;
      title = pk ? pk.title : 'Pack';
    } else if (r.view === 'section') {
      var s = findSection(r.id);
      if (!s || s.hero) { window.location.replace('#levels'); return; }
      var sec = document.getElementById('sec-' + s.id);
      paintSectionFrame(sec);
      showView(sec.id);
      var pk2 = packOfSection(s.id);
      navId = pk2 && journey.current && journey.current.id === pk2.id ? 'pack' : null;
      title = text(s.title || s.nav);
      state.last = s.id; persist();
    }
    document.querySelectorAll('[data-nav-id]').forEach(function (a) {
      var on = a.getAttribute('data-nav-id') === navId;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    paintNavCurrent();
    document.title = (title ? title + ' \u2014 ' : '') + text(META.title || 'Keeper Playbook');
    closeDrawer();
    window.scrollTo(0, 0);
  }
  // Keyboard ←/→: step within the current pack only.
  function go(delta) {
    var r = parseRoute(currentHash());
    if (r.view !== 'section') return;
    var pk = packOfSection(r.id);
    if (!pk || (pk.locked && !journey.unlockAll)) return;
    var i = pk.sections.indexOf(r.id), n = i + delta;
    if (n < 0 || n >= pk.sections.length) return;
    window.location.hash = '#s/' + pk.sections[n];
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function boot() {
    var title = text(META.title || 'Keeper Playbook');
    document.getElementById('wordmark').textContent = title;
    document.getElementById('footer-mark').textContent = title;
    document.getElementById('wordmark').href = '#home';

    var main = document.getElementById('main');
    if (!SECTIONS.length) {
      main.appendChild(el('div', { class: 'section__inner' }, el('div', { class: 'unsupported', text: 'No content loaded (window.PLAYBOOK.sections is empty).' })));
    }
    buildNav();
    main.appendChild(buildHero(HERO));
    main.appendChild(el('section', { class: 'section view', id: 'view-levels', 'data-view': 'levels' }));
    main.appendChild(el('section', { class: 'section view', id: 'view-pack', 'data-view': 'pack' }));
    CONTENT_SECTIONS.forEach(function (s) { main.appendChild(buildSection(s)); });
    main.appendChild(el('section', { class: 'section view', id: 'view-me', 'data-view': 'me' }));

    document.getElementById('burger').addEventListener('click', function () {
      var open = document.getElementById('drawer').classList.contains('is-open');
      if (open) closeDrawer(); else openDrawer();
    });
    document.getElementById('drawer-scrim').addEventListener('click', closeDrawer);
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
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
    booted = true;
    refreshProgress();
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
