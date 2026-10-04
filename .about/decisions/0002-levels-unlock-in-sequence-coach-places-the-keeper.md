---
status: Accepted
date: 2026-10-04
deciders: [k@wetware.works]
history:
  - 2026-10-04: Accepted
---

# Decision Record 0002: Levels unlock in sequence; age is guidance, the coach places the keeper

## Context

A flat navigation of ten sections was overwhelming and gave no sense of journey. The question was
how to sequence the pedagogy: free exploration, strict unlocking, or something between — and
whether age should gate content.

## Decision

- Content is organised into **levels** that follow the goalkeeper development questions
  (*Can I do it? → When? → Why? → Consistently under pressure? → Can I make others better?*),
  each holding versioned **packs**. Packs within a level, and levels themselves, **unlock in
  sequence** by completing gates. Levels with no published pack are shown honestly and skipped.
- **Age bands are guidance, not gates.** A level shows "about 13–15" as orientation; nothing in
  the system reads a date of birth or blocks a keeper by age.
- **The coach places the keeper**: a starting level setting unlocks everything up to it. A
  "coach preview" setting unlocks all content for review.

## Alternatives considered

| Option | Why not |
|---|---|
| Free exploration, no locks | The ordering *is* the pedagogy; the simulator is more valuable as something earned after the reading, and a flat menu is what the site is escaping. |
| Age-gated content | Keepers develop at different rates and coaches disagree with age tables; gating by age would contradict the coach. |
| Strict sequence from Level 1 for everyone | Insulting to an older keeper who starts at Level 3; the coach knows where a keeper belongs. |
| **Chosen: sequential unlock + coach placement + age as guidance** | Journey and reward without pretending to know the keeper better than the coach does. |

## Consequences

- A section reached by deep link while locked shows a short locked panel naming its pack, not
  the content.
- Placement is a self-reported setting until a coach-facing layer exists (`../../ROADMAP.md`).
- Adding a new level or pack is a manifest change; the unlock rules are a pure function and must
  stay one so they can be unit-tested.

## Related

- `0000-three-tiers-runtime-capabilities-packs.md` (packs are the unit of unlocking)
