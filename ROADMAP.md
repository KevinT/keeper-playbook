# Roadmap / radar

Items deliberately not built yet. Each names the design hook that makes it cheap later.

## Server-side progress behind simple auth
**Problem:** progress lives in one browser's localStorage. New device, new browser, or a cache
clear puts a keeper back to zero.
**Hook:** `runtime/progress.js` exposes a store interface (`append`, `all`, `clear`). The
server-backed store is another implementation of that interface; gates, views and capabilities
never see the difference. Because the log is append-only facts, sync is a union of events, not a
merge of state.
**Shape when built:** tiny API (`GET/POST /events` per keeper), email+password or OAuth
(Google is what most youth clubs' families already have), local store kept as an offline cache
that flushes when online.

## Progress migration at go-live
No backwards compatibility is guaranteed until the site is declared live. From that point every
change to the event schema (`v`) ships with a migration, and pack version bumps keep gates
accepting events from earlier versions where that is pedagogically right.

## Coach placement & pack authoring
Today: start level is a setting the keeper changes on a coach's instruction; a pack is a folder
in git. Later: a coach view that sets placement per keeper (needs the auth layer above), and a
pack authoring guide so a coach can write "how *we* defend corners" as a pack.

## Content ideas queued
- Mastery grid of simulator scenarios ("today's five" drawn from the weakest).
- Pitch-tap on the match review to record where each goal/danger came from → season heat map.
- "Say it" mode on the Call Sheet; optional self-recording.
- Curated video clips (pro and own-match) tagged to scenarios.
- Level 1/2 and Level 5 packs — the ladder exists; the content does not yet.
