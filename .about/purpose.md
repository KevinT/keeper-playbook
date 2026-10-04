---
title: Purpose of Keeper Playbook
description: What the Keeper Playbook is, who it is for, what it is for, and how to judge a change to it.
tags: [keeper-playbook, goalkeeping, coaching, learning, static-site]
---

# Keeper Playbook

A goalkeeper's companion for the **gameplay and strategy** side of the position — reading the
game, positioning, the big decisions, distribution, set pieces, and above all organising the
players in front of you. It assumes the keeper already has coaching for technique; it exists to
raise understanding, and through understanding, confidence.

## Who it is for

A keeper at any level and age. The site speaks to the keeper's **identity** — the one player who
sees the whole game — and carries the age/level pedagogy in **levels** and **packs**, not in the
voice of the site. The first keeper it was built for is a motivated U13 with professional coaching;
nothing in the site names him or depends on him.

## What it is for (objectives, in order)

1. **Understanding before technique.** The keeper should be able to say *why* he did something,
   not only *what*. Every lesson ends in a decision he can recognise in a match.
2. **Confidence that is earned, not performed.** Progress is visible (levels, packs, mastery),
   mistakes are reframed as information, and the voice is serious, warm and never childish.
3. **Transfer to the pitch.** The centrepiece is what the keeper can *say* to his team from what
   he can *see*. If a feature does not change what happens on a Saturday, it is decoration.
4. **A journey with a next step.** At every moment the keeper knows where he is and what unlocks
   next. Nothing is a flat reference he has to navigate alone.
5. **Publishable by a coach, without the author.** Packs are folders; a coach can add "how *we*
   defend corners" without touching the runtime.

## What it is not

- Not a technique manual (diving, handling, footwork) — that is the coach's domain.
- Not a record of any individual keeper. Progress is the keeper's own and lives with him; the
  content is shareable with anyone.
- Not a platform. A static site over GitHub Pages until there is a reason for more
  (see `../ROADMAP.md`).

## How to judge a change

Walk the alignment stack from the top:

- **Does it serve objective 3 (transfer to the pitch)?** If the honest answer is "it's nicer", the
  bar is: does it make the keeper more likely to read, decide or speak correctly in a match?
- **Is the football correct?** Animated plays, overlays and gates teach by what they *show*. A
  pretty clip that is tactically wrong is a regression. Speeds, angles and the offside line are
  computed, not drawn.
- **Does it respect the three tiers?** Runtime / capabilities / packs (`../ARCHITECTURE.md`).
  Content never carries a renderer; a renderer never carries content; progress is facts, derived
  views are computed.
- **Does it keep the voice?** Serious, inspiring, direct. No emoji, no gamified noise, no
  flattery. Fun comes from the plays and the levelling, not from decoration.

## Where things live

```
.about/           purpose (this file), decisions/
ARCHITECTURE.md   the three-tier design and the pack / event / gate contracts
ROADMAP.md        what is deliberately not built yet, and the hook that makes it cheap later
runtime/          nav, routing, journey, progress log
capabilities/     versioned engines (simulator, quiz, …) — no content inside
packs/            versioned content folders + registry.js (the only file edited to publish)
levels.js         the development ladder; site.js  hero/identity copy
_build/           authoring sources and specs; not served
```

## Provenance

Built on the Goalkeepers Corner development pathway (four stages, four development questions,
"See · Understand · Decide & Execute · Review & Adapt") and themed to the club's visual language.
Decisions that shaped it are in `decisions/`.
