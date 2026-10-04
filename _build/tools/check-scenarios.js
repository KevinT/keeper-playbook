#!/usr/bin/env node
// Speed/consistency check for simulator scenario sets in every registered pack (ADR 0003).
// Usage: node _build/tools/check-scenarios.js   (exit 1 on any finding)
const path = require('path'), fs = require('fs');
const root = path.resolve(__dirname, '..', '..');
global.window = {}; require(path.join(root, 'packs', 'registry.js'));
for (const r of window.KP.registry) require(path.join(root, r.path));
const LIM = { ball: 42, player: 13 }; // ≈ 30 m/s struck shot, ≈ 9 m/s sprint burst (0.7 m per unit)
const out = [];
for (const p of window.KP.packs) for (const [name, set] of Object.entries(p.sets || {})) {
  if (!set.scenarios) continue;
  for (const s of set.scenarios) {
    const pos = { ball: { ...s.setup.ball }, keeper: { ...s.setup.keeper } };
    s.setup.us.forEach(q => pos['us.' + q.id] = { x: q.x, y: q.y }); s.setup.them.forEach(q => pos['them.' + q.id] = { x: q.x, y: q.y });
    const run = (tag, tl) => { const start = JSON.parse(JSON.stringify(pos));
      for (const [k, kfs] of Object.entries(tl.tracks || {})) {
        if (!(k in pos)) { out.push(`${p.id}/${name}/${s.id}/${tag}: unknown entity ${k}`); continue; }
        let prev = { t: 0, ...start[k] };
        for (const kf of kfs) { const d = Math.hypot(kf.x - prev.x, kf.y - prev.y), dt = kf.t - prev.t;
          if (dt <= 0) out.push(`${p.id}/${name}/${s.id}/${tag}: ${k} non-increasing t`);
          const v = d / dt, lim = k === 'ball' ? LIM.ball : LIM.player;
          if (v > lim && d > 0.5) out.push(`${p.id}/${name}/${s.id}/${tag}: ${k} ${v.toFixed(1)} u/s over ${d.toFixed(1)}u`);
          prev = { ...kf }; }
        pos[k] = { x: prev.x, y: prev.y };
        if (kfs.length && kfs[kfs.length - 1].t > tl.duration + 1e-6) out.push(`${p.id}/${name}/${s.id}/${tag}: ${k} ends after duration`);
      } };
    run('play', s.play); const frozen = JSON.parse(JSON.stringify(pos));
    if (s.options.filter(o => o.grade === 'best').length !== 1) out.push(`${p.id}/${name}/${s.id}: must have exactly one best option`);
    for (const o of s.options) { Object.assign(pos, JSON.parse(JSON.stringify(frozen))); if (o.outcome) run('out:' + o.grade, o.outcome); else out.push(`${p.id}/${name}/${s.id}: option without outcome`); }
  }
}
console.log(out.length ? out.join('\n') : 'scenarios OK'); process.exit(out.length ? 1 : 0);
