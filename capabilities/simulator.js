/* capability: simulator — 1.0.0
   Visual decision simulator (see _build/MOTION-SPEC.md for the motion schema).

   Block: { type:'simulator', set:'<name>', title?, intro? }
   The scenarios come from api.set(block.set) — a named data set on the pack, or a `ref` to
   another pack's set. Decisions are recorded with the set's `emit`, which stamps the set's
   OWNING pack, so "nailed d1 at Match speed" is one fact regardless of which pack it was
   played in.

   Emits: sim.decided { set, scenario, grade:'best'|'ok'|'poor'|'out', pressure:0-3 }
   Reads (via api.query): sim.decided for "seen before" / "nailed" counts;
                          settings.changed { key:'sim.slow' } for the slow-motion default.

   Scenario shape: { id, label, phase?, question,
      // static form:  ball:{x,y}, keeper:{x,y}, us:[{x,y,n?}], them:[{x,y,n?}], arrow?:{from,to}
      // motion form:  setup:{ ball, keeper, us:[{id,x,y,n?}], them:[{id,x,y,n?}] },
      //               play:{ duration, tracks:{ ball|keeper|us.<id>|them.<id>: [{t,x,y,h?}] }, overlays?:[...] },
      options:[{ text, grade:'best'|'ok'|'poor', feedback, outcome?:{ duration, tracks, overlays?, result, caption } }] }
   No clock by default. The player picks the pressure level. With `play`, the scenario animates,
   freezes at the decision frame, then the chosen option's `outcome` plays. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, svgEl = D.svgEl, text = D.text, arr = D.arr, num = D.num;
  var R = window.KP.journey.reducers;
  window.KP.capabilities = window.KP.capabilities || {};

  /* --- motion helpers (shared by every sim block) --- */
  var SIM_POSTS = { left: 44.6, right: 55.4, y: 68 };
  var SIM_KEEPER_HALF_WIDTH = 2.2;
  var simReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function easeInOut(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function easeOut(u) { return 1 - (1 - u) * (1 - u); }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // Normalise a scenario into { setup, play } where setup has ids on every player.
  function simSetupOf(s) {
    var src = s.setup || s;
    function players(list) {
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

  var LEVELS = [
    { name: 'No clock', secs: 0, blurb: 'Take your time. Read everything.' },
    { name: 'Calm', secs: 12, blurb: 'Ball in their half. Time to look.' },
    { name: 'Pressure', secs: 6, blurb: 'Ball in your half. Decide while it travels.' },
    { name: 'Match speed', secs: 3, blurb: 'It is happening now. See, decide, go.' }
  ];
  var RESULTS = {
    goal: { text: 'Goal conceded', cls: 'is-bad' },
    saved: { text: 'Saved', cls: 'is-good' },
    cleared: { text: 'Cleared', cls: 'is-good' },
    kept: { text: 'Kept the ball', cls: 'is-good' },
    lost: { text: 'Possession lost', cls: 'is-neutral' },
    chance: { text: 'Chance conceded', cls: 'is-warn' }
  };

  function render(b, ctx, api) {
    var set = api.set(b.set);
    if (!set) {
      return [D.blockTitle(b), D.blockIntro(b), el('div', { class: 'unsupported', html: 'Simulator set <code>' + D.esc(b.set) + '</code> could not be resolved.' })];
    }
    var scenarios = arr(set.scenarios);
    var owner = set.owner;            // { pack, packVersion } that owns the facts
    var setName = set.name;
    function bestAt() { return api.query(function (events) { return R.simBestAt(events, owner.pack, setName); }); }
    function seen() { return api.query(function (events) { return R.simSeen(events, owner.pack, setName); }); }
    function slowDefault() { return !!api.query(function (events) { return R.settings(events).values['sim.slow']; }); }

    var level = 0, order = D.shuffle(scenarios), idx = 0, run = { best: 0, ok: 0, poor: 0, out: 0 }, timerId = null;
    // Deep link: ?scenario=<id> puts that scenario first (coach / debugging use).
    try {
      var want = new URLSearchParams(window.location.search).get('scenario');
      if (want) order.sort(function (a, b) { return (a.id === want ? -1 : 0) - (b.id === want ? -1 : 0); });
    } catch (e) { /* ignore */ }
    var slow = slowDefault();
    var overlaysOn = true;

    var svg = D.buildPitchSvg();
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
    var cur = null;          // { scenario, setup, startPos (setup), play, decisionPos, overlays, entities:{key:{circle,label}} }
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
      if (!cur.play) {                   // static scenario
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
        el('div', { class: 'quiz__score', text: seen()[s.id] ? 'Seen before' : '' })
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
        // One fact, recorded against the set's owning pack.
        set.emit('sim.decided', { set: setName, scenario: s.id, grade: grade, pressure: level });
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
      slow = !slow; api.emit('settings.changed', { key: 'sim.slow', value: slow }); paintSlow();
    });
    // Settings (My game) can change the slow-motion default while this sim is alive.
    document.addEventListener('kp:settings', function () { slow = slowDefault(); paintSlow(); });
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
      var nailed = Object.keys(bestAt()).length;
      panel.appendChild(el('div', { class: 'quiz__summary' }, [
        el('div', { class: 'eyebrow', text: LEVELS[level].name }),
        el('div', { class: 'quiz__big', html: run.best + '<small> / ' + n + ' best calls</small>' }),
        el('div', { class: 'quiz__best', text: run.ok + ' playable · ' + run.poor + ' poor' + (run.out ? ' · ' + run.out + ' timed out' : '') }),
        el('div', { class: 'quiz__best', text: 'Scenarios you\u2019ve nailed at least once: ' + nailed + ' / ' + scenarios.length }),
        el('button', { class: 'btn btn--primary', type: 'button', text: 'Go again', onclick: function () { order = D.shuffle(scenarios); idx = 0; run = { best: 0, ok: 0, poor: 0, out: 0 }; renderScenario(); } })
      ]));
    }

    // Leak guards: stop everything when this block leaves the screen or the page is hidden.
    // (No router access: visibility is read from layout after the route has settled.)
    window.addEventListener('pagehide', teardown);
    window.addEventListener('hashchange', function () {
      setTimeout(function () {
        var visible = document.body.contains(stage) && stage.offsetParent !== null;
        if (!visible && cur) { finishNow(); stopTimer(); }
      }, 0);
    });

    if (!scenarios.length) panel.appendChild(el('p', { class: 'calls__empty', text: 'No scenarios yet.' }));
    else renderScenario();
    return [D.blockTitle(b), D.blockIntro(b),
      el('div', { class: 'sim__controls' }, [el('div', { class: 'eyebrow', text: 'Pressure — you choose' }), levelChips, levelBlurb]),
      bar,
      el('div', { class: 'pitch-block sim' }, [el('div', {}, [stage, legend, playControls, caption]), panel])];
  }

  window.KP.capabilities.simulator = {
    version: '1.0.0',
    LEVELS: LEVELS,
    render: render
  };
})();
