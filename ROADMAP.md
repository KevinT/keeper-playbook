# Roadmap / radar

Items deliberately not built yet. Each names the design hook that makes it cheap later.

## The Goalkeepers Corner node (anchor)
Where this is going: **one Pi Durable node runs the whole Goalkeepers Corner operation** —
strategy, admin, coaches, keepers — everyone authenticated as themselves, via the website or a
chat surface. The Playbook contributes **pack extensions** and the **visual client**; progress is
a keeper-scoped **document** on the node. Decision and consequences:
`.about/decisions/0005-one-pi-durable-node-runs-goalkeepers-corner.md`.

What this absorbs (no longer Playbook features):
- *Server-side progress behind auth* — progress becomes a document on the node; identity is GC's.
  The `runtime/progress.js` store interface is the seam; browser storage becomes an offline cache.
- *Coach placement, coach review of a keeper's record, coach pack authoring* — multiplayer on the
  node with role-scoped tools.
- *Attention tasks* ("at your next session, notice…") — durable tasks with timers; the agent
  asks on the night, the keeper answers in chat or on the site.

Open, by design: the chat surface, the auth mechanism, how goalkeeperscorner.co.za and the
authenticated surfaces converge, and build order. Incremental; the static site stays in service.

## Keep the Playbook node-ready (now)
- `runtime/journey.js`, `runtime/progress.js` and the pack loader must run in Node as well as the
  browser: pure functions, CommonJS exports, no browser globals.
- Pack authoring must stay expressible as both a browser bundle and an extension (sections, tools,
  tasks). Field-task `prompt`/`why` are the agent's words.
- A `compile-pack-extension` tool is the first concrete node deliverable from this repo.

## Progress migration at go-live
No backwards compatibility is guaranteed until the site is declared live. From that point every
change to the event/document schema (`v`) ships with a migration, and pack version bumps keep
gates accepting events from earlier versions where that is pedagogically right.

## Content ideas queued
- Mastery grid of simulator scenarios ("today's five" drawn from the weakest).
- Pitch-tap on the match review to record where each goal/danger came from → season heat map.
- "Say it" mode on the Call Sheet; optional self-recording.
- Curated video clips (pro and own-match) tagged to scenarios.
- Level 1/2 and Level 5 packs — the ladder exists; the content does not yet.
