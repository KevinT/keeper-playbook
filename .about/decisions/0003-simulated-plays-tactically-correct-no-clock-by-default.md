---
status: Accepted
date: 2026-10-04
deciders: [k@wetware.works]
history:
  - 2026-10-04: Accepted
---

# Decision Record 0003: Simulated plays must be tactically correct, with no clock by default

## Context

The simulator teaches decisions by showing a play, freezing it, and then showing the consequence
of the keeper's choice. Animation here is not transition polish; it is the lesson. A clip that
looks good but puts the striker first to a ball he could not reach, or draws a shot cone the
keeper is not actually covering, teaches the wrong thing with great conviction.

Separately: a timer makes the exercise exciting but also makes a young keeper guess. The owner's
instruction was that the keeper should drive the pressure level himself.

## Decision

- **Overlays are computed, never drawn.** The defensive line is the deepest defender's position
  each frame; the shot cone is ball-to-posts; the covered wedge is the keeper's width projected
  onto the goal line; pressure is a radius around the actual ball carrier. If an overlay would be
  wrong, the authored positions are wrong — fix the positions.
- **Authored timelines are checked against real-world speeds** by script before publishing
  (`_build/tools/check-scenarios.js`): authoring guides are sprint ≈ 9, run ≈ 6.5, driven pass
  ≈ 24, lofted ball ≈ 14 pitch-units/s; the hard ceilings are a struck shot or whipped cross
  (≈ 42 u/s, 30 m/s) and a sprint burst (≈ 13 u/s, 9 m/s). A play may be simplified; it may not
  be physically implausible.
- **Every option has an outcome clip**, and a non-best choice always offers "watch the best
  option" from the same frozen frame — the difference between the two clips is the lesson.
- **No clock by default.** The pressure timer exists in four levels and is switched on by the
  keeper; it starts at the decision freeze, not during the play. Progress records the pressure
  level at which a best call was made, so higher levels can gate on it.

## Alternatives considered

| Option | Why not |
|---|---|
| Hand-drawn overlays per scenario | Drift between what is drawn and what the positions imply; the lesson becomes an illustration rather than a demonstration. |
| Static freeze-frames only | Reading happens while the picture moves; static frames teach analysis, not recognition. (This was the first version.) |
| Timer always on, scaled by level | Makes a young keeper guess rather than read; removes his ownership of the pressure. |
| **Chosen: computed overlays, speed-checked timelines, outcomes for every option, keeper-driven clock** | Correct by construction, and the pressure is his. |

## Consequences

- Scenario authoring is slower; a speed-check script is part of the authoring workflow
  (`_build/`). Any coach-authored scenario set goes through the same check.
- The simulator is a capability with a versioned contract; packs depend on it rather than
  copying it (`0000-three-tiers-runtime-capabilities-packs`).
- Coaching positions encoded in scenarios (come/stay thresholds, line height, corner set-up) are
  mainstream but opinionated; they should be reviewed by the keeper's coach and may be overridden
  by a club-authored pack.

## Related

- `0000-three-tiers-runtime-capabilities-packs.md` (the simulator as a capability)
- `0001-progress-is-an-append-only-event-log.md` (`sim.decided` carries the pressure level)
