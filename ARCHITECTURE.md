# Keeper Playbook — Architecture

## Three tiers

```
RUNTIME        nav · routing · journey/unlock · progress log · gate evaluator · pack loader
  └─ CAPABILITIES   versioned engines the runtime ships (no content inside them)
        simulator · quiz · tree · pitch · calls · checklist · review · ladder
        (+ presentational: prose, loop, cards, tabs, phases, vocab, quote, callout)
        └─ PACKS       versioned, self-contained folders of content + scenario sets + gates
                       declare `requires` on capability versions; never embed a renderer
```

A pack can be published, versioned and retired without the runtime changing. A capability can
be improved (e.g. the simulator gets new overlays) without any pack changing, as long as its
major version holds. The runtime knows nothing about which packs exist; it reads a registry.

## Files

```
index.html
runtime/            app.js (boot, router, views), journey.js (pure unlock + gates), progress.js (event log + store)
capabilities/       <name>.js  — each registers `window.KP.capabilities.<name> = { version, render(block, ctx, api) }`
packs/registry.js   — list of { id, version, path }   (ONE line per published pack version)
packs/<id>/<version>/pack.js  — window.KP.packs.push({ id, version, level, title, promise, requires, sections, gates, sets })
levels.js           — the level ladder (development questions, age guidance). Rarely changes.
```

Everything is plain `<script>` tags listed by `index.html` + the registry (no bundler, no fetch,
works from `file://`). The registry is the only thing edited to publish.

## Pack format

```js
window.KP.packs.push({
  id: "read-the-game", version: "1.0.0", level: "L3", tag: "Pack 1",
  title, promise,
  requires: { simulator: "^1", quiz: "^1" },            // capability majors this pack needs
  sections: [ { id, title, kicker?, lede, blocks:[...] } ],   // blocks reference capabilities by `type`
  sets: { "defend": { capability: "simulator", scenarios: [...] } },   // named data sets a block can point at: { type:'simulator', set:'defend' }
  // a set may instead be a reference to another pack's set: { capability:'simulator', ref:'own-the-box/defend' }
  // (the runtime resolves it from the latest loaded version of that pack; progress is recorded against the SET'S OWNING pack
  //  so "nailed d1 at Match speed" is one fact regardless of which pack it was done in)
  gates: [ ... ]                                           // see Gates
});
```

- Section ids are **pack-scoped**: the runtime addresses a section as `<packId>/<sectionId>`.
- A block that needs a stable identity (quiz, checklist, review, simulator set, tree) carries an
  explicit `id`. **No positional keys anywhere.** Reordering content never touches progress.

## Progress: an append-only event log

Facts only. One event per thing the keeper did. Derived views (pack complete, best per scenario,
ladder level) are computed, never stored.

```js
{ v: 1, t: ISO, type, pack, packVersion, ...payload }
  section.completed   { section }
  section.uncompleted { section }
  quiz.finished       { quiz, score, total }
  sim.decided         { set, scenario, grade:'best'|'ok'|'poor'|'out', pressure:0-3 }
  checklist.ticked    { checklist, item, on:boolean }
  review.saved        { review, entry:{ id, date, answers } }      review.deleted { review, id }
  ladder.placed       { ladder, level }
  journey.startLevel  { level }        coach.unlockAll { on }
  settings.changed    { key, value }
```

`progress.js` exposes a **store interface** — `append(event)`, `all()`, `clear()` — with a
localStorage implementation (`kp-progress-v1`). A server-backed store (behind auth) is a
future implementation of the same interface; nothing above it changes. Events carry
`packVersion` so a gate can decide whether completion under an older version counts.

## Gates (declarative, evaluated over the log)

```
{ type:'sections' }                                   every section in the pack has a net section.completed
{ type:'quiz', quiz, min }                            max quiz.finished.score for that quiz id >= min
{ type:'sim', set, min, pressure? }                   count of scenarios with a sim.decided grade:'best' at pressure >= given >= min
{ type:'checklist', checklist }                       every item of that checklist currently on
{ type:'reviews', review, min }                       live review entries (saved minus deleted) >= min
```

`journey.js` is pure: `computeJourney(events, levels, packs) -> { levels:[...], current, progress }`.

## Capability API contract

`render(block, ctx, api)` where `ctx = { pack, packVersion, section }` and
`api = { emit(type, payload), query(fn), set(name) }`. Capabilities never touch storage or the
router directly. `emit` stamps `pack`/`packVersion`/`t`. `query` runs a reducer over the log.

## Versioning rules

- Capability: semver; a pack's `requires` is checked at load, unmet → pack shows "needs a newer
  Playbook" instead of breaking.
- Pack: semver. Patch = copy fixes; minor = added scenarios/sections; major = restructure.
  Multiple versions of a pack may coexist in the registry; the runtime shows the latest and
  gates may accept older-version events.

## Not in scope (on the radar)

- Server-side progress behind simple auth (email/password or OAuth) so progress survives devices
  and cache clears. Design hook: the store interface above.
- Coach authoring UI. Today a pack is a folder in git.
