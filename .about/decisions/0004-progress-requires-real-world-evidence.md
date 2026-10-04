---
status: Accepted
date: 2026-10-04
deciders: [k@wetware.works]
history:
  - 2026-10-04: Accepted
---

# Decision Record 0004: Progress requires real-world evidence; the site is support, not a race

## Context

With content-only gates (sections read, quizzes passed, simulator scenarios nailed), a motivated
keeper can complete every published level in one sitting. That would reward exactly the wrong
behaviour: optimising the site rather than the pitch. The purpose of the site (`../purpose.md`,
objective 3) is transfer to the match. A level "earned" on a sofa in an afternoon is not a level.

## Decision

- **Every pack carries real-world work** — field tasks ("at your next session / match, do or
  notice X"), drills (solo, pair, group) and match reviews — and **every pack's gates require
  evidence of it**. Content gates alone never complete a pack.
- **Evidence is a dated, honest check-in**, not proof. The keeper records what he did and what he
  noticed; a check-in is a `field.checkin` event with the date of the session or match it refers
  to. The trust model is the same one his coach uses. The site does not police him; it keeps his
  record.
- **Pace comes from the real calendar.** A gate may require evidence from *distinct* dates (e.g.
  "three sessions", "two matches"), so completing a pack takes the number of real sessions it
  takes. The site never imposes a timer or a daily streak.
- **The next step always points outward first.** Where a pack has an unfinished field task, the
  "Continue" affordance leads to it before any remaining reading.
- **Attention tasks are first-class.** "Notice where their first corner goes" is as valid as a
  drill; reading the game is trained by directed attention, not only by activity.

## Alternatives considered

| Option | Why not |
|---|---|
| Time-lock packs (e.g. one per week) | Arbitrary; punishes a keeper with two sessions a week, and still rewards nothing real. |
| Require photo/video proof or coach sign-off | Friction and distrust at exactly the age where ownership is the lesson; coach sign-off needs the auth layer that does not exist yet. |
| Keep content-only gates, add drills as optional extras | Optional means skipped by the keeper most tempted to race. The gate is the point. |
| **Chosen: evidence gates on honest, dated check-ins** | Makes the pitch the unit of progress without surveillance; survives offline; matches how coaching trust actually works. |

## Consequences

- New capabilities: `field` (tasks with check-ins) and `drill` (with session logs). New events:
  `field.checkin { task, date, done, notes }`, `drill.logged { drill, date, notes }`. New gate
  types: `field { task?, min, distinctDates? }`, `drills { drill?, min, distinctDates? }`.
- Every existing pack is re-versioned (1.1.0) to add field tasks and evidence gates.
- The simulator's "nailed at match speed" remains a gate component but can no longer complete a
  pack on its own.
- Honest check-ins are facts in the keeper's own record; when server-side progress exists they
  become shareable with a coach, which is the long-term payoff.

## Related

- `0001-progress-is-an-append-only-event-log.md` (check-ins are events; gates are derived)
- `0002-levels-unlock-in-sequence-coach-places-the-keeper.md` (what unlocking now requires)
