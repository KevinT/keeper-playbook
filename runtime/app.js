/* Keeper Playbook — runtime/app.js
   Boot, pack loader (`requires` check), router, views. Reads:
     window.KP.site, window.KP.levels, window.KP.registry, window.KP.packs,
     window.KP.capabilities, window.KP.progress, window.KP.journey, window.KP.dom
   Progress is an append-only event log (runtime/progress.js); every derived view is
   recomputed from it (runtime/journey.js). Capabilities get { emit, query, set } and
   never touch storage or the router. */
(function () {
  'use strict';
  var KP = window.KP = window.KP || {};
  var D = KP.dom, el = D.el, text = D.text, arr = D.arr, num = D.num, isObj = D.isObj, pad = D.pad, esc = D.esc;
  var J = KP.journey, P = KP.progress;
  var SITE = KP.site || {};
  var LEVELS = arr(KP.levels);
  var REGISTRY = arr(KP.registry);
  var ALL_PACKS = arr(KP.packs);
  var CAPS = KP.capabilities || {};
  var PACKS = J.latestPacks(ALL_PACKS);        // one (latest) per id, in registry order
  var PACK_BY_ID = {};
  PACKS.forEach(function (p) { PACK_BY_ID[p.id] = p; });

  /* ------------------------------------------------------------------ */
  /* Progress store + event recording                                    */
  /* ------------------------------------------------------------------ */
  var store = P.createLocalStore(P.KEY);
  var booted = false, refreshQueued = false;
  function record(event) {
    store.append(event);
    if (!booted || refreshQueued) return;
    refreshQueued = true;
    setTimeout(function () { refreshQueued = false; refresh(); }, 0);
  }
  // Site-level facts (settings) carry no pack.
  function emitSite(type, payload) { record(P.stamp(type, payload, null)); }
  function query(fn) { return fn(store.all()); }

  // Capability API for a pack. `set(name)` resolves `ref` sets to the OWNING pack and hands
  // back an `emit` bound to that owner, so shared sets record one fact regardless of where played.
  function apiFor(pack) {
    var ctx = { pack: pack.id, packVersion: pack.version };
    return {
      emit: function (type, payload) { record(P.stamp(type, payload, ctx)); },
      query: query,
      set: function (name) {
        var r = J.resolveSet(ALL_PACKS, pack, name);
        if (!r) return null;
        var ownerCtx = { pack: r.pack.id, packVersion: r.pack.version };
        return {
          name: r.name,
          capability: r.set.capability,
          owner: ownerCtx,
          scenarios: arr(r.set.scenarios),
          set: r.set,
          emit: function (type, payload) { record(P.stamp(type, payload, ownerCtx)); }
        };
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Pack loader: `requires` check                                       */
  /* ------------------------------------------------------------------ */
  function unmetRequires(pack) {
    var out = [];
    var req = isObj(pack.requires) ? pack.requires : {};
    for (var cap in req) {
      var have = CAPS[cap];
      if (!have) out.push({ capability: cap, need: req[cap], have: null });
      else if (!J.satisfies(have.version, req[cap])) out.push({ capability: cap, need: req[cap], have: have.version });
    }
    // Any block type the pack uses that the runtime cannot render also counts.
    arr(pack.sections).forEach(function (s) {
      arr(s.blocks).forEach(function (b) {
        if (b && b.type && !CAPS[b.type] && !out.some(function (u) { return u.capability === b.type; })) out.push({ capability: b.type, need: '*', have: null });
      });
    });
    return out;
  }
  var UNMET = {};
  PACKS.forEach(function (p) { var u = unmetRequires(p); if (u.length) UNMET[p.id] = u; });
  function needsUpdatePanel(pack) {
    var list = UNMET[pack.id] || [];
    return el('div', { class: 'locked-panel needs-update' }, [
      D.padlock(),
      el('div', {}, [
        el('div', { class: 'locked-panel__title', text: 'This pack needs a newer Playbook' }),
        el('p', { text: text(pack.title) + ' v' + text(pack.version) + ' asks for: ' + list.map(function (u) { return u.capability + ' ' + u.need + (u.have ? ' (you have ' + u.have + ')' : ' (missing)'); }).join(', ') + '. Reload once the Playbook has been updated.' }),
        el('a', { class: 'btn btn--sm', href: '#levels', text: 'Back to levels' })
      ])
    ]);
  }

  /* ------------------------------------------------------------------ */
  /* Block rendering                                                     */
  /* ------------------------------------------------------------------ */
  function renderBlock(block, pack, section, index) {
    var type = block && block.type;
    var cap = CAPS[type];
    var wrap = el('div', { class: 'block block--' + (type || 'unknown') });
    if (!cap || typeof cap.render !== 'function') {
      wrap.appendChild(el('div', { class: 'unsupported', html: 'Unsupported block type <code>' + esc(type) + '</code> in section <code>' + esc(pack.id + '/' + section.id) + '</code>.' }));
      return wrap;
    }
    try {
      D.append(wrap, cap.render(block, { pack: pack.id, packVersion: pack.version, section: section.id }, apiFor(pack)));
    } catch (err) {
      wrap.appendChild(el('div', { class: 'unsupported', html: 'Block <code>' + esc(type) + '</code> failed to render: ' + esc(err && err.message) }));
      if (window.console) console.warn('Block render failed', pack.id + '/' + section.id + '#' + index, err);
    }
    return wrap;
  }

  /* ------------------------------------------------------------------ */
  /* Journey (derived from the log on every refresh)                     */
  /* ------------------------------------------------------------------ */
  var journey = null;
  function recompute() { journey = J.computeJourney(store.all(), LEVELS, ALL_PACKS); return journey; }
  function packFor(id) { return journey && journey.packs[id] ? journey.packs[id] : null; }
  function sectionOf(pack, sectionId) {
    var secs = arr(pack && pack.sections);
    for (var i = 0; i < secs.length; i++) if (secs[i].id === sectionId) return secs[i];
    return null;
  }
  function nextPackAfter(pk) {
    var i = journey.packList.indexOf(pk);
    return i >= 0 && i + 1 < journey.packList.length ? journey.packList[i + 1] : null;
  }
  function sectionHref(packId, sectionId) { return '#s/' + packId + '/' + sectionId; }
  function continueHref(pk) {
    if (!pk) return '#levels';
    return pk.nextSection ? sectionHref(pk.id, pk.nextSection) : '#pack/' + pk.id;
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return parseInt(m[3], 10) + ' ' + months[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }
  function stateGlyph(pk) {
    if (pk.complete) return el('span', { class: 'pstate pstate--complete' }, [D.tick(), 'Complete']);
    if (pk.open) return el('span', { class: 'pstate pstate--open' }, [el('i', { class: 'pstate__dot' }), pk.started ? 'In progress' : 'Open']);
    return el('span', { class: 'pstate pstate--locked' }, [D.padlock(), 'Locked']);
  }

  /* ------------------------------------------------------------------ */
  /* Refresh: recompute and repaint everything live                      */
  /* ------------------------------------------------------------------ */
  function refresh() {
    recompute();
    var total = journey.progress.published, n = journey.progress.completed;
    document.getElementById('progress-fill').style.width = journey.progress.pct + '%';
    document.getElementById('footer-status').textContent = total ? n + ' of ' + total + ' packs complete' : '';
    document.querySelectorAll('.complete-toggle').forEach(function (btn) {
      var pk = packFor(btn.getAttribute('data-pack'));
      var on = !!(pk && pk.sectionsDone[btn.getAttribute('data-section')]);
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Section complete' : 'Mark section complete';
    });
    paintNavCurrent();
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
  function buildHero() {
    var headline = Array.isArray(SITE.headline) ? SITE.headline : [text(SITE.headline)];
    var sec = el('section', { class: 'section section--hero view', id: 'view-home', 'data-view': 'home' });
    var cont = el('a', { class: 'btn', id: 'hero-continue', href: '#levels', text: 'Continue' });
    cont.style.display = 'none';
    sec.appendChild(el('div', { class: 'hero' }, [
      SITE.kicker ? el('div', { class: 'eyebrow hero__kicker', text: SITE.kicker }) : null,
      el('h1', { class: 'display hero__headline' }, [
        el('span', { class: 'line-1', text: text(headline[0]) }),
        headline[1] ? el('span', { class: 'line-2', text: text(headline[1]) }) : null
      ]),
      SITE.tagline ? el('p', { class: 'hero__tagline', text: SITE.tagline }) : null,
      el('div', { class: 'hero__actions' }, [
        el('a', { class: 'btn btn--primary', href: '#levels', text: 'Start' }),
        cont
      ]),
      SITE.intro ? el('div', { class: 'hero__intro', html: SITE.intro }) : null
    ]));
    sec.appendChild(el('div', { class: 'where', id: 'where' }));
    // Identity traits: what a keeper who finishes this becomes.
    var traits = arr(SITE.identity);
    if (traits.length) {
      sec.appendChild(el('div', { class: 'identity' }, [
        el('div', { class: 'section__inner identity__inner' }, [
          el('div', { class: 'eyebrow', text: 'What you become' }),
          el('div', { class: 'identity__grid' }, traits.map(function (t) {
            return el('div', { class: 'identity__item' }, [
              el('div', { class: 'identity__word display', text: text(t.word) }),
              el('div', { class: 'identity__text', text: text(t.text) })
            ]);
          }))
        ])
      ]));
    }
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
    row.appendChild(el('div', { class: 'prow__head' }, [
      el('span', { class: 'prow__tag', text: pk.tag }),
      el('span', { class: 'prow__title', text: pk.title }),
      el('span', { class: 'prow__ver', text: 'v' + pk.version })
    ]));
    row.appendChild(el('div', { class: 'prow__promise', text: pk.promise }));
    var foot = el('div', { class: 'prow__foot' }, [stateGlyph(pk)]);
    if (UNMET[pk.id]) {
      foot.appendChild(el('span', { class: 'prow__date', text: 'Needs a newer Playbook' }));
      foot.appendChild(el('span', { class: 'spacer' }));
      foot.appendChild(el('a', { class: 'btn btn--sm btn--ghost', href: '#pack/' + pk.id, text: 'Details' }));
    } else if (pk.complete) {
      foot.appendChild(el('span', { class: 'prow__date', text: (pk.completedAt ? fmtDate(pk.completedAt) + ' · ' : '') + 'v' + pk.version }));
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
      li.appendChild(el('div', { class: 'level__head' }, [
        el('div', { class: 'level__num display', text: String(L.n) }),
        el('div', { class: 'level__text' }, [
          el('div', { class: 'level__name' }, [L.name, L.unlocked ? null : D.padlock()]),
          el('div', { class: 'level__q display', text: L.question }),
          L.ages ? el('div', { class: 'level__ages', text: 'about ' + L.ages.replace(/^about\s+/i, '') + ' — a guide, not a rule' }) : null,
          el('p', { class: 'level__blurb', text: L.blurb })
        ])
      ]));
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
    sel.addEventListener('change', function () { emitSite('journey.startLevel', { level: sel.value || null }); });
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
    var pack = PACK_BY_ID[packId];
    if (!pk || !pack) {
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

    if (UNMET[pk.id]) { inner.appendChild(needsUpdatePanel(pack)); view.appendChild(inner); return; }

    if (pk.locked) {
      inner.appendChild(el('div', { class: 'locked-panel' }, [
        D.padlock(),
        el('div', {}, [
          el('div', { class: 'locked-panel__title', text: 'This pack is locked' }),
          el('p', { text: 'Finish the packs before it to open it. Your coach can also set your starting level under My game.' }),
          el('a', { class: 'btn btn--sm', href: '#levels', text: 'Back to levels' })
        ])
      ]));
    }

    // Steps
    var steps = el('ol', { class: 'steps' });
    arr(pack.sections).forEach(function (sec, i) {
      var done = !!pk.sectionsDone[sec.id];
      var a = el('a', { class: 'step' + (done ? ' is-done' : ''), href: sectionHref(pack.id, sec.id) }, [
        el('span', { class: 'step__num display', text: pad(i + 1) }),
        el('span', { class: 'step__body' }, [
          el('span', { class: 'step__title', text: text(sec.title || sec.nav || sec.id) }),
          sec.lede ? el('span', { class: 'step__sub', text: sec.lede }) : null
        ]),
        el('span', { class: 'step__tick', 'aria-label': done ? 'Done' : 'Not done' }, [D.tick()])
      ]);
      steps.appendChild(el('li', {}, a));
    });
    inner.appendChild(el('div', { class: 'pack__block' }, [el('div', { class: 'eyebrow', text: 'Steps' }), steps]));

    // Gates
    var gates = el('ul', { class: 'gates' });
    pk.gates.forEach(function (g) {
      gates.appendChild(el('li', { class: 'gate' + (g.pass ? ' is-pass' : '') }, [
        el('span', { class: 'gate__mark' }, [g.pass ? D.tick() : null]),
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
          pk.sections.length ? el('a', { class: 'btn btn--ghost', href: sectionHref(pk.id, pk.sections[0]), text: 'Revisit' }) : null
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
  /* Views: section (framed inside its pack) — built on first visit      */
  /* ------------------------------------------------------------------ */
  function sectionElId(packId, sectionId) { return 'sec-' + packId + '--' + sectionId; }
  function buildSection(pack, s) {
    var sec = el('section', { class: 'section view', id: sectionElId(pack.id, s.id), 'data-pack-id': pack.id, 'data-section-id': s.id });
    sec.appendChild(el('div', { class: 'packbar', 'data-role': 'packbar' }));
    sec.appendChild(el('div', { class: 'locked-wrap', 'data-role': 'locked' }));
    var inner = el('div', { class: 'section__inner', 'data-role': 'body' });
    inner.appendChild(el('header', { class: 'section__head' }, [
      s.kicker ? el('div', { class: 'eyebrow', text: s.kicker }) : null,
      el('h2', { class: 'display', text: text(s.title || s.nav) }),
      s.lede ? el('p', { class: 'section__lede', text: s.lede }) : null
    ]));
    if (UNMET[pack.id]) inner.appendChild(needsUpdatePanel(pack));
    else arr(s.blocks).forEach(function (b, j) { inner.appendChild(renderBlock(b, pack, s, j)); });

    var toggle = el('button', { class: 'btn complete-toggle', type: 'button', 'data-pack': pack.id, 'data-section': s.id, 'aria-pressed': 'false', text: 'Mark section complete' });
    toggle.addEventListener('click', function () {
      var pk = packFor(pack.id);
      var on = !!(pk && pk.sectionsDone[s.id]);
      apiFor(pack).emit(on ? 'section.uncompleted' : 'section.completed', { section: s.id });
    });
    inner.appendChild(el('div', { class: 'section__foot' }, [
      toggle,
      el('span', { class: 'spacer' }),
      el('div', { class: 'section__nav', 'data-role': 'stepnav' })
    ]));
    sec.appendChild(inner);
    return sec;
  }
  function ensureSection(pack, s) {
    var existing = document.getElementById(sectionElId(pack.id, s.id));
    if (existing) return existing;
    var sec = buildSection(pack, s);
    var main = document.getElementById('main');
    main.insertBefore(sec, document.getElementById('view-me'));
    return sec;
  }
  // Paint the pack breadcrumb, lock panel, completion toggle and prev/next step buttons.
  function paintSectionFrame(sec) {
    var packId = sec.getAttribute('data-pack-id'), id = sec.getAttribute('data-section-id');
    var pk = packFor(packId), pack = PACK_BY_ID[packId];
    var bar = sec.querySelector('[data-role="packbar"]');
    var lockWrap = sec.querySelector('[data-role="locked"]');
    var body = sec.querySelector('[data-role="body"]');
    var nav = sec.querySelector('[data-role="stepnav"]');
    bar.innerHTML = ''; lockWrap.innerHTML = ''; nav.innerHTML = '';
    if (!pk || !pack) return;
    var locked = !!(pk.locked && !journey.unlockAll);
    body.style.display = locked ? 'none' : '';
    sec.classList.toggle('is-locked', locked);
    var i = pk.sections.indexOf(id);
    bar.appendChild(el('div', { class: 'packbar__inner' }, [
      el('a', { class: 'packbar__crumb', href: '#levels', text: 'Level ' + pk.levelN }),
      el('span', { class: 'packbar__sep', text: '·' }),
      el('a', { class: 'packbar__crumb', href: '#pack/' + pk.id, text: pk.title }),
      el('span', { class: 'packbar__sep', text: '·' }),
      el('span', { class: 'packbar__step', text: 'Step ' + (i + 1) + ' of ' + pk.sections.length }),
      el('span', { class: 'spacer' }),
      el('span', { class: 'packbar__dots', 'aria-hidden': 'true' }, pk.sections.map(function (sid, j) {
        return el('i', { class: (pk.sectionsDone[sid] ? 'is-done' : '') + (j === i ? ' is-here' : '') });
      }))
    ]));
    if (locked) {
      lockWrap.appendChild(el('div', { class: 'section__inner' }, [
        el('div', { class: 'locked-panel' }, [
          D.padlock(),
          el('div', {}, [
            el('div', { class: 'locked-panel__title', text: 'Locked — Level ' + pk.levelN + ' · ' + pk.tag + ' ' + pk.title }),
            el('p', { text: 'This section belongs to a pack you have not reached yet. Finish the packs before it, or ask your coach to set your starting level.' }),
            el('a', { class: 'btn btn--sm', href: '#levels', text: 'See the levels' })
          ])
        ])
      ]));
      return;
    }
    var prev = i > 0 ? sectionOf(pack, pk.sections[i - 1]) : null;
    var next = i + 1 < pk.sections.length ? sectionOf(pack, pk.sections[i + 1]) : null;
    if (prev) nav.appendChild(el('a', { class: 'btn btn--ghost', href: sectionHref(pk.id, prev.id), text: '\u2190 ' + text(prev.nav || prev.title) }));
    else nav.appendChild(el('a', { class: 'btn btn--ghost', href: '#pack/' + pk.id, text: '\u2190 Pack' }));
    if (next) nav.appendChild(el('a', { class: 'btn', href: sectionHref(pk.id, next.id), text: text(next.nav || next.title) + ' \u2192' }));
    else nav.appendChild(el('a', { class: 'btn', href: '#pack/' + pk.id, text: 'Back to pack \u2192' }));
  }

  /* ------------------------------------------------------------------ */
  /* Views: my game                                                      */
  /* ------------------------------------------------------------------ */
  function eachBlock(fn) {
    PACKS.forEach(function (pack) {
      arr(pack.sections).forEach(function (s) {
        arr(s.blocks).forEach(function (b, i) { if (b) fn(pack, s, b, i); });
      });
    });
  }
  function renderMe() {
    var view = document.getElementById('view-me');
    view.innerHTML = '';
    var inner = el('div', { class: 'section__inner' });
    inner.appendChild(el('header', { class: 'section__head' }, [
      el('div', { class: 'eyebrow', text: 'You' }),
      el('h2', { class: 'display', text: 'My game' }),
      el('p', { class: 'section__lede', text: 'Everything you have recorded, in one place.' })
    ]));
    var events = store.all();
    var R = J.reducers;

    // Pack completions
    var comp = el('div', { class: 'me__list' });
    var any = false;
    journey.packList.forEach(function (pk) {
      if (!pk.complete) return;
      any = true;
      comp.appendChild(el('div', { class: 'me__row' }, [
        D.tick(),
        el('span', { class: 'me__row-title', text: 'Level ' + pk.levelN + ' · ' + pk.title }),
        el('span', { class: 'me__row-meta', text: 'v' + pk.version + (pk.completedAt ? ' ' + fmtDate(pk.completedAt) : '') })
      ]));
    });
    if (!any) comp.appendChild(el('div', { class: 'me__empty', text: 'No packs completed yet.' }));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Packs completed' }), comp]));

    // Ladder
    var ladderBox = el('div', { class: 'me__list' });
    var ladderAny = false, ladderHref = '#levels';
    eachBlock(function (pack, s, b) {
      if (b.type !== 'ladder') return;
      ladderHref = sectionHref(pack.id, s.id);
      var v = R.ladderLevel(events, pack.id, b.id);
      if (typeof v !== 'number') return;
      var lv = arr(b.levels)[v];
      ladderAny = true;
      ladderBox.appendChild(el('div', { class: 'me__row' }, [
        el('span', { class: 'me__row-num display', text: String(lv && lv.level !== undefined ? lv.level : v + 1) }),
        el('span', { class: 'me__row-title', text: lv ? text(lv.name) : 'Rung ' + (v + 1) }),
        el('a', { class: 'me__row-meta', href: sectionHref(pack.id, s.id), text: 'Change' })
      ]));
    });
    if (!ladderAny) ladderBox.appendChild(el('div', { class: 'me__empty' }, ['Not placed yet. ', el('a', { href: ladderHref, text: 'Mark where you are on the ladder' }), '.']));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Ladder — where you put yourself' }), ladderBox]));

    // Simulator stats — one row per OWNED set (ref'd sets share the owner's facts).
    var simBox = el('div', { class: 'me__list' });
    var simAny = false;
    var LEVEL_NAMES = (CAPS.simulator && CAPS.simulator.LEVELS ? CAPS.simulator.LEVELS : []).map(function (L) { return L.name; });
    if (!LEVEL_NAMES.length) LEVEL_NAMES = ['No clock', 'Calm', 'Pressure', 'Match speed'];
    PACKS.forEach(function (pack) {
      var sets = isObj(pack.sets) ? pack.sets : {};
      for (var name in sets) {
        var st = sets[name];
        if (!st || st.ref || st.capability !== 'simulator') continue;
        var total = arr(st.scenarios).length;
        var bestAt = R.simBestAt(events, pack.id, name);
        var n = Object.keys(bestAt).length;
        var perLevel = LEVEL_NAMES.map(function (nm, L) { var c = 0; for (var k in bestAt) if (bestAt[k] >= L) c++; return nm + ' ' + c; });
        var title = null;
        eachBlock(function (p2, s2, b2) { if (!title && p2 === pack && b2.type === 'simulator' && b2.set === name) title = b2.title; });
        simAny = true;
        simBox.appendChild(el('div', { class: 'me__row me__row--stack' }, [
          el('span', { class: 'me__row-title', text: text(title || (pack.title + ' — ' + name)) }),
          el('span', { class: 'me__row-meta', text: n + ' of ' + total + ' plays nailed at least once' }),
          el('span', { class: 'me__row-sub', text: 'Best call by pressure: ' + perLevel.join(' · ') })
        ]));
      }
    });
    if (!simAny) simBox.appendChild(el('div', { class: 'me__empty', text: 'No simulator yet.' }));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Simulator' }), simBox]));

    // Reviews
    var revBox = el('div', { class: 'me__list' });
    var revAny = false;
    eachBlock(function (pack, s, b) {
      if (b.type !== 'review') return;
      var entries = R.reviewEntries(events, pack.id, b.id).slice().reverse();
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
      if (!entries.length) revBox.appendChild(el('div', { class: 'me__empty' }, ['No reviews saved yet. ', el('a', { href: sectionHref(pack.id, s.id), text: 'Write one after your next match' }), '.']));
    });
    if (!revAny && !revBox.children.length) revBox.appendChild(el('div', { class: 'me__empty', text: 'No reviews yet.' }));
    inner.appendChild(el('div', { class: 'me__block' }, [el('div', { class: 'eyebrow', text: 'Match reviews' }), revBox]));

    // Settings
    var cfg = R.settings(events);
    var unlock = el('input', { type: 'checkbox', id: 'set-unlock' });
    unlock.checked = !!cfg.unlockAll;
    unlock.addEventListener('change', function () { emitSite('coach.unlockAll', { on: !!unlock.checked }); });
    var slowIn = el('input', { type: 'checkbox', id: 'set-slow' });
    slowIn.checked = !!cfg.values['sim.slow'];
    slowIn.addEventListener('change', function () { emitSite('settings.changed', { key: 'sim.slow', value: !!slowIn.checked }); document.dispatchEvent(new Event('kp:settings')); });
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
    if (window.confirm('Reset all progress? This clears completed sections, quiz scores, simulator results, checklists, saved reviews and settings.')) {
      store.clear(); window.location.hash = ''; window.location.reload();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Routing                                                             */
  /* ------------------------------------------------------------------ */
  function currentHash() {
    var h = (window.location.hash || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    return h;
  }
  // Parse the hash into { view, ... }.
  function parseRoute(h) {
    if (!h || h === 'home') return { view: 'home' };
    if (h === 'levels') return { view: 'levels' };
    if (h === 'me') return { view: 'me' };
    if (h === 'pack') return { view: 'pack', id: journey && journey.current ? journey.current.id : null };
    var m = /^pack\/([^/]+)$/.exec(h);
    if (m) return { view: 'pack', id: m[1] };
    m = /^s\/([^/]+)\/([^/]+)$/.exec(h);
    if (m) return { view: 'section', pack: m[1], id: m[2] };
    m = /^s\/([^/]+)$/.exec(h);
    if (m) {
      // Bare section id: resolve to the first pack that has it (convenience / old links).
      for (var i = 0; i < PACKS.length; i++) if (sectionOf(PACKS[i], m[1])) return { view: 'redirect', to: sectionHref(PACKS[i].id, m[1]) };
    }
    return { view: 'home', unknown: true };
  }
  function showView(id) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('is-active', v.id === id); });
  }
  function route() {
    var r = parseRoute(currentHash());
    if (r.view === 'redirect') { window.location.replace(r.to); return; }
    if (r.unknown) { window.location.replace('#home'); return; }
    recompute();
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
      var pack = PACK_BY_ID[r.pack];
      var s = sectionOf(pack, r.id);
      if (!pack || !s) { window.location.replace('#levels'); return; }
      var sec = ensureSection(pack, s);
      paintSectionFrame(sec);
      showView(sec.id);
      navId = journey.current && journey.current.id === pack.id ? 'pack' : null;
      title = text(s.title || s.nav);
    }
    document.querySelectorAll('[data-nav-id]').forEach(function (a) {
      var on = a.getAttribute('data-nav-id') === navId;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    paintNavCurrent();
    refreshToggles();
    document.title = (title ? title + ' \u2014 ' : '') + text(SITE.title || 'Keeper Playbook');
    closeDrawer();
    window.scrollTo(0, 0);
  }
  function refreshToggles() {
    document.querySelectorAll('.complete-toggle').forEach(function (btn) {
      var pk = packFor(btn.getAttribute('data-pack'));
      var on = !!(pk && pk.sectionsDone[btn.getAttribute('data-section')]);
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? 'Section complete' : 'Mark section complete';
    });
  }
  // Keyboard ←/→: step within the current pack only.
  function go(delta) {
    var r = parseRoute(currentHash());
    if (r.view !== 'section') return;
    var pk = packFor(r.pack);
    if (!pk || (pk.locked && !journey.unlockAll)) return;
    var i = pk.sections.indexOf(r.id), n = i + delta;
    if (n < 0 || n >= pk.sections.length) return;
    window.location.hash = sectionHref(pk.id, pk.sections[n]);
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function boot() {
    var title = text(SITE.title || 'Keeper Playbook');
    document.getElementById('wordmark').textContent = title;
    document.getElementById('footer-mark').textContent = title;
    document.getElementById('wordmark').href = '#home';

    var main = document.getElementById('main');
    buildNav();
    main.appendChild(buildHero());
    main.appendChild(el('section', { class: 'section view', id: 'view-levels', 'data-view': 'levels' }));
    main.appendChild(el('section', { class: 'section view', id: 'view-pack', 'data-view': 'pack' }));
    main.appendChild(el('section', { class: 'section view', id: 'view-me', 'data-view': 'me' }));
    if (!PACKS.length) {
      main.insertBefore(el('div', { class: 'section__inner' }, el('div', { class: 'unsupported', text: 'No packs loaded (window.KP.packs is empty — check packs/registry.js and index.html).' })), main.firstChild);
    }
    // Registry sanity: warn (not break) when a registered pack never arrived.
    REGISTRY.forEach(function (r) {
      if (!ALL_PACKS.some(function (p) { return p.id === r.id && p.version === r.version; }) && window.console) console.warn('Registry lists ' + r.id + '@' + r.version + ' but it did not load (' + r.path + ')');
    });

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
    refresh();
    route();
  }

  // Exposed for tests / console: pure journey + the live store.
  KP.app = { store: store, journey: function () { return journey; }, recompute: recompute, unmet: UNMET, packs: PACKS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
