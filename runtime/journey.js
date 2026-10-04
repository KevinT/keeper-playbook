/* Keeper Playbook — runtime/journey.js
   PURE. No DOM, no storage, no window access beyond registering itself.
   computeJourney(events, levels, packs) -> { levels:[...], current, progress, ... }

   Unlock rules
   - Levels are ordered by `n`. A level is unlocked when its n <= the chosen start level,
     or every pack in every lower level that has packs is complete, or coach unlockAll is on.
   - Within a level, packs open in order: a pack is open when its level is unlocked and
     every pack before it in the level is complete (or unlockAll).
   - A pack is complete when it has >= 1 gate and every gate passes.
   - `current` is the first open-but-incomplete pack, else the last published pack.

   Gates (evaluated over the event log; events from ANY version of the pack count)
     { type:'sections' }                 every section has a net section.completed
     { type:'quiz', quiz, min }          max quiz.finished.score for that quiz id >= min
     { type:'sim', set, min, pressure? } distinct scenarios with a sim.decided grade:'best'
                                         at pressure >= given, >= min — counted against the
                                         set's OWNING pack (so a `ref` set shares facts)
     { type:'checklist', checklist }     every item of that checklist currently on
     { type:'reviews', review, min }     live review entries (saved minus deleted) >= min
     { type:'field', task?, min, distinctDates?, done?:['yes','partly'] }
                                         live field.checkin events for this pack (optionally one
                                         task; optionally only those whose `done` is listed);
                                         count events, or distinct `date`s if distinctDates; >= min
     { type:'drills', drill?, min, distinctDates? }
                                         same over drill.logged
   Field/drill events are stamped with the pack they were emitted in (a block inside pack P
   records against P), so ownership is the event's `pack` — the same rule `sim` applies to a
   set's owning pack.

   Gate groups: 'pitch' (field, drills, reviews — real-world evidence) and 'playbook'
   (sections, quiz, sim, checklist). The pitch group is listed first: it is the priority. */
(function (root) {
  'use strict';

  function arr(a) { return Array.isArray(a) ? a : []; }
  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
  function text(s) { return s === undefined || s === null ? '' : String(s); }
  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

  /* ---------------- semver (tiny) ---------------- */
  function parseVer(v) {
    var m = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(text(v).trim());
    if (!m) return null;
    return [parseInt(m[1], 10), parseInt(m[2] || '0', 10), parseInt(m[3] || '0', 10)];
  }
  function cmpVer(a, b) {
    var pa = parseVer(a) || [0, 0, 0], pb = parseVer(b) || [0, 0, 0];
    for (var i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
    return 0;
  }
  // Supports: "*", "^1", "^1.2.0", "~1.2", "1", "1.2", "1.2.3", ">=1.2.0". Space-separated terms AND together.
  function satisfies(version, range) {
    var v = parseVer(version);
    if (!v) return false;
    var r = text(range).trim();
    if (!r || r === '*' || r === 'x') return true;
    return r.split(/\s+/).every(function (term) {
      var op = /^(\^|~|>=|<=|>|<|=)?(.*)$/.exec(term);
      var sym = op[1] || '', rest = op[2];
      var parts = rest.split('.'), given = parts.filter(function (p) { return p !== 'x' && p !== '*' && p !== ''; }).length;
      var p = parseVer(rest.replace(/[x*]/g, '0'));
      if (!p) return false;
      var c = cmpVer(v, p);
      if (sym === '>=') return c >= 0;
      if (sym === '>') return c > 0;
      if (sym === '<=') return c <= 0;
      if (sym === '<') return c < 0;
      if (sym === '~') return v[0] === p[0] && v[1] === p[1] && c >= 0;
      if (sym === '^') {
        if (p[0] > 0) return v[0] === p[0] && c >= 0;
        if (p[1] > 0) return v[0] === 0 && v[1] === p[1] && c >= 0;
        return v[0] === 0 && v[1] === 0 && v[2] === p[2];
      }
      // bare / "=": partial versions match their prefix ("1" == "1.x.x")
      if (given <= 1) return v[0] === p[0];
      if (given === 2) return v[0] === p[0] && v[1] === p[1];
      return c === 0;
    });
  }

  /* ---------------- pack catalogue ---------------- */
  // Latest version of each pack id, in first-seen (registry) order.
  function latestPacks(packs) {
    var byId = {}, order = [];
    arr(packs).forEach(function (p) {
      if (!p || !p.id) return;
      if (!byId[p.id]) { byId[p.id] = p; order.push(p.id); }
      else if (cmpVer(p.version, byId[p.id].version) > 0) byId[p.id] = p;
    });
    return order.map(function (id) { return byId[id]; });
  }
  // Resolve a named set on a pack, following `ref: "<packId>/<setName>"` to the owning pack.
  // Returns { pack, name, set } or null. `pack` is the OWNING pack (where progress is recorded).
  function resolveSet(packs, pack, name) {
    var latest = latestPacks(packs);
    var byId = {};
    latest.forEach(function (p) { byId[p.id] = p; });
    var cur = pack, curName = name, hops = 0;
    while (cur && hops < 8) {
      var s = isObj(cur.sets) ? cur.sets[curName] : null;
      if (!s) return null;
      if (!s.ref) return { pack: cur, name: curName, set: s };
      var m = /^([^/]+)\/(.+)$/.exec(text(s.ref));
      if (!m) return null;
      cur = byId[m[1]] || null; curName = m[2]; hops++;
    }
    return null;
  }
  function findBlock(pack, type, id) {
    var secs = arr(pack && pack.sections);
    for (var i = 0; i < secs.length; i++) {
      var blocks = arr(secs[i].blocks);
      for (var j = 0; j < blocks.length; j++) {
        var b = blocks[j];
        if (b && b.type === type && b.id === id) return b;
      }
    }
    return null;
  }

  /* ---------------- log reducers ---------------- */
  // Last-write-wins net state for a pack's sections.
  function sectionsDone(events, packId) {
    var done = {};
    events.forEach(function (e) {
      if (e.pack !== packId) return;
      if (e.type === 'section.completed') done[e.section] = true;
      else if (e.type === 'section.uncompleted') delete done[e.section];
    });
    return done;
  }
  function quizBest(events, packId, quizId) {
    var best = null;
    events.forEach(function (e) {
      if (e.type === 'quiz.finished' && e.pack === packId && e.quiz === quizId) {
        var s = num(e.score, 0);
        if (best === null || s > best) best = s;
      }
    });
    return best;
  }
  // scenarioId -> highest pressure at which a 'best' call was made (owning pack + set).
  function simBestAt(events, ownerId, setName) {
    var bestAt = {};
    events.forEach(function (e) {
      if (e.type !== 'sim.decided' || e.pack !== ownerId || e.set !== setName || e.grade !== 'best') return;
      var p = num(e.pressure, 0);
      if (!(e.scenario in bestAt) || p > bestAt[e.scenario]) bestAt[e.scenario] = p;
    });
    return bestAt;
  }
  function simSeen(events, ownerId, setName) {
    var seen = {};
    events.forEach(function (e) {
      if (e.type === 'sim.decided' && e.pack === ownerId && e.set === setName) seen[e.scenario] = true;
    });
    return seen;
  }
  function checklistTicks(events, packId, checklistId) {
    var on = {};
    events.forEach(function (e) {
      if (e.type !== 'checklist.ticked' || e.pack !== packId || e.checklist !== checklistId) return;
      if (e.on) on[e.item] = true; else delete on[e.item];
    });
    return on;
  }
  function reviewEntries(events, packId, reviewId) {
    var live = [], index = {};
    events.forEach(function (e) {
      if (e.pack !== packId || e.review !== reviewId) return;
      if (e.type === 'review.saved' && isObj(e.entry)) {
        var entry = e.entry;
        if (index[entry.id] !== undefined) live[index[entry.id]] = entry;      // re-save replaces
        else { index[entry.id] = live.length; live.push(entry); }
      } else if (e.type === 'review.deleted') {
        var i = index[e.id];
        if (i !== undefined) { live.splice(i, 1); index = {}; live.forEach(function (en, j) { index[en.id] = j; }); }
      }
    });
    return live;
  }
  // Live (not deleted) dated entries of one event type. `deleted` events carry { id } where id is
  // the `t` of the entry they remove; `key` is the payload field naming the task/drill.
  function liveEntries(events, packId, type, key, keyId) {
    var live = [], index = {};
    var delType = type + '.deleted';
    events.forEach(function (e) {
      if (e.pack !== packId) return;
      if (keyId !== undefined && keyId !== null && e[key] !== keyId) return;
      if (e.type === type) {
        var id = text(e.t);
        if (index[id] !== undefined) return;                   // duplicate stamp: keep the first
        var entry = { id: id, t: id, date: text(e.date), notes: text(e.notes), packVersion: e.packVersion || null };
        entry[key] = e[key];
        if (type === 'field.checkin') entry.done = text(e.done);
        if (type === 'drill.logged') entry.rating = num(e.rating, 0);
        index[id] = live.length; live.push(entry);
      } else if (e.type === delType) {
        var i = index[text(e.id)];
        if (i !== undefined) { live.splice(i, 1); index = {}; live.forEach(function (en, j) { index[en.id] = j; }); }
      }
    });
    return live;
  }
  // field.checkin entries for a pack (optionally one task). Oldest first.
  function fieldCheckins(events, packId, taskId) { return liveEntries(events, packId, 'field.checkin', 'task', taskId); }
  // drill.logged entries for a pack (optionally one drill). Oldest first.
  function drillLogs(events, packId, drillId) { return liveEntries(events, packId, 'drill.logged', 'drill', drillId); }
  function distinctDates(entries) {
    var seen = {}, n = 0;
    entries.forEach(function (e) { if (e.date && !seen[e.date]) { seen[e.date] = true; n++; } });
    return n;
  }
  function ladderLevel(events, packId, ladderId) {
    var lvl = null;
    events.forEach(function (e) { if (e.type === 'ladder.placed' && e.pack === packId && e.ladder === ladderId) lvl = e.level; });
    return lvl;
  }
  function settings(events) {
    var s = { startLevel: null, unlockAll: false, values: {} };
    events.forEach(function (e) {
      if (e.type === 'journey.startLevel') s.startLevel = e.level || null;
      else if (e.type === 'coach.unlockAll') s.unlockAll = !!e.on;
      else if (e.type === 'settings.changed') s.values[e.key] = e.value;
    });
    return s;
  }

  /* ---------------- gates ---------------- */
  function evalGate(gate, pack, events, packs) {
    var g = { type: gate.type, label: gate.label || '', pass: false, have: 0, need: 0 };
    var min, n;
    switch (gate.type) {
      case 'sections': {
        var ids = arr(pack.sections).map(function (s) { return s.id; });
        var done = sectionsDone(events, pack.id);
        g.need = ids.length;
        g.have = ids.filter(function (id) { return !!done[id]; }).length;
        g.pass = g.need > 0 && g.have >= g.need;
        if (!gate.label) g.label = 'All ' + g.need + ' steps marked complete';
        break;
      }
      case 'quiz': {
        min = num(gate.min, 1); g.need = min;
        var best = quizBest(events, pack.id, gate.quiz);
        g.have = best === null ? 0 : best;
        g.pass = best !== null && best >= min;
        if (!gate.label) g.label = 'Quiz best score ' + min + '+';
        break;
      }
      case 'sim': {
        min = num(gate.min, 1); g.need = min;
        var pressure = num(gate.pressure, 0);
        var res = resolveSet(packs, pack, gate.set);
        g.owner = res ? res.pack.id : null;
        g.total = res ? arr(res.set.scenarios).length : 0;
        if (res) {
          var bestAt = simBestAt(events, res.pack.id, res.name);
          n = 0;
          for (var id in bestAt) if (bestAt[id] >= pressure) n++;
          g.have = n;
        }
        g.pass = g.have >= min;
        if (!gate.label) g.label = 'Simulator ' + text(gate.set) + ' — ' + min + ' best calls' + (pressure ? ' at pressure ' + pressure : '');
        break;
      }
      case 'checklist': {
        var block = findBlock(pack, 'checklist', gate.checklist);
        g.need = block ? arr(block.items).length : 0;
        var on = checklistTicks(events, pack.id, gate.checklist);
        n = 0;
        for (var i = 0; i < g.need; i++) if (on[i]) n++;
        g.have = n; g.pass = g.need > 0 && n >= g.need;
        if (!gate.label) g.label = 'Checklist all ticked';
        break;
      }
      case 'reviews': {
        min = num(gate.min, 1); g.need = min;
        g.have = reviewEntries(events, pack.id, gate.review).length;
        g.pass = g.have >= min;
        if (!gate.label) g.label = min + ' saved reviews';
        break;
      }
      case 'field': {
        min = num(gate.min, 1); g.need = min;
        var fc = fieldCheckins(events, pack.id, gate.task);
        if (Array.isArray(gate.done) && gate.done.length) {
          fc = fc.filter(function (en) { return gate.done.indexOf(en.done) !== -1; });
        }
        g.have = gate.distinctDates ? distinctDates(fc) : fc.length;
        g.pass = g.have >= min;
        if (!gate.label) {
          var fWhat = gate.task ? 'Field task ' + text(gate.task) : 'Field tasks';
          g.label = fWhat + ' — ' + min + (gate.distinctDates ? ' check-ins on different days' : ' check-ins');
        }
        break;
      }
      case 'drills': {
        min = num(gate.min, 1); g.need = min;
        var dl = drillLogs(events, pack.id, gate.drill);
        g.have = gate.distinctDates ? distinctDates(dl) : dl.length;
        g.pass = g.have >= min;
        if (!gate.label) {
          var dWhat = gate.drill ? 'Drill ' + text(gate.drill) : 'Drills';
          g.label = dWhat + ' — ' + min + (gate.distinctDates ? ' sessions on different days' : ' sessions logged');
        }
        break;
      }
      default:
        g.label = g.label || ('Unknown gate ' + gate.type);
        g.pass = false;
    }
    g.group = gateGroup(gate.type);
    return g;
  }
  var PITCH_GATES = { field: true, drills: true, reviews: true };
  function gateGroup(type) { return PITCH_GATES[type] ? 'pitch' : 'playbook'; }

  // Does this field/drill block have an unmet gate? A failing `field` gate with no `task`
  // covers every field block in the pack; with a `task` it covers the block holding that task.
  // Likewise `drills` / `drill`.
  function blockGateUnmet(block, gates) {
    if (!block) return false;
    var key = block.type === 'field' ? 'tasks' : block.type === 'drill' ? 'drills' : null;
    if (!key) return false;
    var gtype = block.type === 'field' ? 'field' : 'drills';
    var sel = block.type === 'field' ? 'task' : 'drill';
    var ids = arr(block[key]).map(function (it) { return it && it.id; });
    return gates.some(function (g) {
      if (g.pass || g.type !== gtype) return false;
      var want = g.raw && g.raw[sel];
      return want === undefined || want === null || ids.indexOf(want) !== -1;
    });
  }
  // The first field/drill block whose gate is unmet, in section order: { section, block } | null.
  function nextFieldOf(pack, gates) {
    var secs = arr(pack.sections);
    for (var i = 0; i < secs.length; i++) {
      var blocks = arr(secs[i].blocks);
      for (var j = 0; j < blocks.length; j++) {
        if (blockGateUnmet(blocks[j], gates)) return { section: secs[i].id, block: blocks[j].id || null, type: blocks[j].type };
      }
    }
    return null;
  }
  function gatesFor(pack, events, packs) {
    return arr(pack.gates).map(function (g) { var r = evalGate(g, pack, events, packs); r.raw = g; return r; });
  }
  function allPass(gates) { return gates.length > 0 && gates.every(function (g) { return g.pass; }); }

  // Derived (never stored): the time the pack FIRST became complete, by replaying prefixes
  // of the log at the points where an event relevant to this pack arrived.
  function completedAtOf(pack, events, packs) {
    var relevant = { };
    relevant[pack.id] = true;
    arr(pack.gates).forEach(function (g) {
      if (g.type === 'sim') { var r = resolveSet(packs, pack, g.set); if (r) relevant[r.pack.id] = true; }
    });
    for (var i = 0; i < events.length; i++) {
      if (!relevant[events[i].pack]) continue;
      if (allPass(gatesFor(pack, events.slice(0, i + 1), packs))) return events[i].t || null;
    }
    return null;
  }

  /* ---------------- the journey ---------------- */
  function computeJourney(events, levels, packs) {
    events = arr(events).filter(function (e) { return isObj(e) && e.type; });
    var cfg = settings(events);
    var unlockAll = cfg.unlockAll;
    var lv = arr(levels).slice().sort(function (a, b) { return num(a.n, 0) - num(b.n, 0); });
    var catalogue = latestPacks(packs);

    var packsByLevel = {};
    catalogue.forEach(function (p) { (packsByLevel[p.level] = packsByLevel[p.level] || []).push(p); });
    var withPacks = lv.filter(function (L) { return arr(packsByLevel[L.id]).length; });
    var startLevel = null;
    lv.forEach(function (L) { if (L.id === cfg.startLevel) startLevel = L; });
    var startChosen = !!startLevel;
    if (!startLevel) startLevel = withPacks[0] || null;
    var startN = startLevel ? num(startLevel.n, 0) : 0;

    var out = {
      levels: [], packs: {}, packList: [], current: null,
      startLevel: startLevel ? startLevel.id : null, startChosen: startChosen, unlockAll: unlockAll,
      settings: cfg.values, progress: { completed: 0, published: 0, pct: 0 }
    };
    var lowerAllComplete = true;

    lv.forEach(function (L) {
      var level = { id: L.id, n: num(L.n, 0), name: text(L.name), question: text(L.question), ages: text(L.ages), blurb: text(L.blurb), packs: [], hasPacks: false, unlocked: false, complete: false };
      var mine = arr(packsByLevel[L.id]);
      level.hasPacks = mine.length > 0;
      level.unlocked = level.n <= startN || lowerAllComplete || unlockAll;
      var prevInLevelComplete = true, allComplete = true;
      mine.forEach(function (P, i) {
        var gates = gatesFor(P, events, packs);
        var complete = allPass(gates);
        var passed = gates.filter(function (g) { return g.pass; }).length;
        var open = (level.unlocked && prevInLevelComplete) || unlockAll;
        var done = sectionsDone(events, P.id);
        var sectionIds = arr(P.sections).map(function (s) { return s.id; });
        var stepsDone = sectionIds.filter(function (id) { return !!done[id]; }).length;
        var nextSection = null;
        for (var j = 0; j < sectionIds.length; j++) if (!done[sectionIds[j]]) { nextSection = sectionIds[j]; break; }
        var started = stepsDone > 0 || passed > 0 || events.some(function (e) { return e.pack === P.id; });
        // Continue points outward first: unmet field/drill block -> first incomplete section -> pack.
        var nextField = complete ? null : nextFieldOf(P, gates);
        var nextStep = complete ? null : nextField ? { section: nextField.section, block: nextField.block, why: 'field' }
          : nextSection ? { section: nextSection, block: null, why: 'section' } : null;
        var pk = {
          id: P.id, version: text(P.version), levelId: L.id, levelN: level.n, levelName: level.name,
          title: text(P.title), tag: text(P.tag), promise: text(P.promise), index: i,
          sections: sectionIds, sectionsDone: done, gates: gates, gatesPassed: passed, gateCount: gates.length,
          pct: gates.length ? Math.round(passed / gates.length * 100) : 0,
          stepsDone: stepsDone, nextSection: nextSection, nextField: nextField, nextStep: nextStep,
          state: complete ? 'complete' : open ? 'open' : 'locked',
          complete: complete, open: open, locked: !open && !complete, started: started,
          completedAt: complete ? completedAtOf(P, events, packs) : null
        };
        level.packs.push(pk); out.packs[P.id] = pk; out.packList.push(pk);
        out.progress.published++;
        if (complete) out.progress.completed++;
        if (!complete) { allComplete = false; prevInLevelComplete = false; }
        if (!out.current && pk.state === 'open') out.current = pk;
      });
      level.complete = level.hasPacks && allComplete;
      if (level.hasPacks && !allComplete) lowerAllComplete = false;
      out.levels.push(level);
    });
    if (!out.current && out.packList.length) out.current = out.packList[out.packList.length - 1];
    out.currentLevel = out.current ? out.current.levelId : out.startLevel;
    out.firstLevelWithPacks = withPacks[0] ? withPacks[0].id : null;
    out.progress.pct = out.progress.published ? Math.round(out.progress.completed / out.progress.published * 100) : 0;
    return out;
  }

  var api = {
    computeJourney: computeJourney,
    resolveSet: resolveSet,
    latestPacks: latestPacks,
    findBlock: findBlock,
    satisfies: satisfies,
    cmpVer: cmpVer,
    gateGroup: gateGroup,
    blockGateUnmet: blockGateUnmet,
    nextFieldOf: nextFieldOf,
    reducers: {
      sectionsDone: sectionsDone, quizBest: quizBest, simBestAt: simBestAt, simSeen: simSeen,
      checklistTicks: checklistTicks, reviewEntries: reviewEntries, ladderLevel: ladderLevel, settings: settings,
      fieldCheckins: fieldCheckins, drillLogs: drillLogs, distinctDates: distinctDates
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) { root.KP = root.KP || {}; root.KP.journey = api; }
})(typeof window !== 'undefined' ? window : null);
