---
status: Accepted
date: 2026-10-04
deciders: [k@wetware.works]
history:
  - 2026-10-04: Accepted
---

# Decision Record 0001: Progress is an append-only event log

## Context

Progress was first stored as a flat state blob keyed by UI position (`quiz["<section>:<blockIndex>"]`,
`sim[id].best`). Two defects followed directly: reordering content inside a section silently
orphaned a keeper's progress, and pack completion gates had to reach into UI-shaped keys. The
site is also expected, later, to keep progress server-side so it survives devices and cache
clears — a merge of two state blobs is ambiguous; a union of facts is not.

The owner's standing principle for timelines applies: store facts, never synthesis; derive
judgement from facts.

## Decision

Progress is an **append-only log of events** — one event per thing the keeper did, each stamped
with schema version, time, pack and pack version, and addressing content only by stable ids
(`section.completed`, `quiz.finished`, `sim.decided`, `checklist.ticked`, `review.saved`,
`ladder.placed`, …). Every derived view — pack complete, best per scenario, progress bar — is
**computed** from the log by a pure function; nothing derived is stored.

The log sits behind a minimal store interface (`append`, `all`, `clear`). localStorage is the
first implementation; a server-backed store is a future implementation of the same interface.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep the state blob, fix the keys to use explicit ids | Fixes the orphaning but leaves judgement (completion, bests) stored rather than derived; server sync would still be a state merge. |
| Store both events and a materialised summary | Two sources of truth that can disagree; the summary is cheap to recompute on a dataset this size. |
| **Chosen: events only, derived views computed** | Reorder-safe, version-aware, union-mergeable, exportable; matches the facts-not-synthesis principle. |

## Consequences

- Capabilities may only `emit` and `query`; they never write state directly.
- Gates are declarative and evaluated over events, so a gate can accept events from an earlier
  pack version where that is pedagogically right.
- Until the site is declared live, **no backwards compatibility is promised** for the log; from
  that milestone every schema change ships with a migration (`../../ROADMAP.md`).
- Server-side persistence is delivered by the Goalkeepers Corner node, where the log becomes a
  keeper-scoped document (`0005-one-pi-durable-node-runs-goalkeepers-corner`); the store
  interface here is the seam, and browser storage becomes an offline cache.

## Related

- `0000-three-tiers-runtime-capabilities-packs.md` (capabilities depend on this API)

## Maintenance log
- 2026-10-04 - k@wetware.works - storage-primacy consequence re-pointed at the GC node (`0005`); the decision itself is unchanged.
