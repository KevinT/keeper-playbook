# Levels & Packs — shell restructure spec

Target: `/home/trek/Source/personal/keeper-playbook/` — `index.html`, `app.js`, `styles.css`. Read all three
fully first, plus `packs.js` (new manifest, `window.PACKS`) and skim `content.js` (`window.PLAYBOOK`,
unchanged except hero copy). Keep every existing block renderer and all existing persisted state
(`keeper-playbook-v1`) working; extend the state, never reset it.

## Why
The flat 10-tab nav is overwhelming and has no sense of journey. The site must speak to a keeper's
identity at any level/age, and the pedagogy becomes **levelling up**: packs (versioned sets of
sections with a completion gate) sit inside levels; levels unlock in order; a coach can set a
keeper's starting level. Sections no longer appear in the top nav — they are reached through packs.

## Information architecture
Top nav (desktop + burger): **Levels** · **Current pack** · **My game**. Plus the brand wordmark
(→ home) and the thin progress bar (now = packs completed / published packs).

Routes (hash):
- `#home` — hero (identity). Headline/tagline from `meta`. Below the fold: NOT the section TOC any
  more — instead a compact "Where you are" card: current level + pack, % of pack gates met,
  "Continue" button (→ next unfinished section of the current pack). First visit (no start level
  chosen): the card becomes "Start here" → `#levels` with the placement prompt.
- `#levels` — the journey map. Vertical list of levels, big level number in Anton, name, the
  development question as the headline, age band as small grey text ("about 13–15 — a guide, not a
  rule"), blurb. Under each level: its packs as rows (tag · title · version · promise · state).
  States: `locked` (grey, lock glyph drawn with CSS/SVG not emoji), `open` (green rule, "Continue"),
  `complete` (green tick, date + version completed). Levels with zero packs show "No pack published
  yet" and are skipped by the unlock logic. Exactly one pack is "current" at a time (the first
  open, unfinished pack in level order).
- `#pack/<packId>` — the pack page: title, promise, version, ordered step list of its sections
  (number, title, done tick), then the gate checklist ("What completes this pack") with live
  pass/fail per gate and a progress ring/bar. Buttons: "Continue" (next undone section) / "Start".
  When all gates pass: a completion panel ("Pack complete — Level 3 · Read the Game v1.0 · <date>")
  with "Next pack" → the next pack; mark `state.packs[packId] = {version, completedAt}` (keep
  earlier completions if version differs: store `completions: [{version, at}]`).
- `#s/<sectionId>` — a section, as today, BUT framed inside its pack: a slim pack breadcrumb bar
  above ("Level 3 · Read the Game · Step 2 of 3"), prev/next step buttons at the bottom that move
  within the pack (last step → back to the pack page), and the existing "Mark section complete"
  toggle. Keep the old `#<sectionId>` hashes working as redirects to `#s/<sectionId>` so existing
  links don't break. A section that belongs to a locked pack renders a short "locked" panel with the
  level/pack it belongs to and a link to `#levels` — unless `state.coach.unlockAll` is true.
- `#me` — "My game": reviews list (reuse the review renderer's stored data: `state.reviews`),
  ladder self-placement (`state.ladder`), sim stats (best per scenario / per pressure level), pack
  completions with dates, and **Settings**: starting level (select of levels; label "Your coach
  will tell you where to start"), "Unlock everything (coach preview)" toggle, slow-motion default,
  Reset progress.
- Keyboard ←/→: within a pack moves between steps; elsewhere no-op.

## Unlock logic (pure function, unit-testable in a `computeJourney(state, PACKS, PLAYBOOK)`)
- `startLevel` = `state.journey.startLevel` (level id) or the first level with ≥1 pack if unset.
- Level L is `unlocked` if L.n ≤ startLevel.n, OR every pack in every lower level that has packs is
  complete. Levels with no packs never block.
- Pack P is `open` if its level is unlocked and all earlier packs in the same level are complete.
  (Packs within a level are sequential.)
- Pack P is `complete` if every gate passes (evaluate live every time; also persist first
  completion date).
- Gate evaluation:
  - `sections`: every section id in the pack has `state.done[id]`.
  - `quiz`: `state.quiz[key] >= min`. NOTE the existing quiz state key is `ctx.key` =
    `<sectionId>:<blockIndex>`. The manifest gives `key: "positioning"` meaning "the quiz block(s)
    in section positioning" — resolve: find quiz blocks in that section and take the max best
    score across them. Same resolution rule for any gate `key` that names a section.
  - `sim`: `state.sim[id].best` is `{scenarioId: true}` today. EXTEND the sim renderer so that
    answering records `state.sim[id].bestAt[scenarioId] = max(levelIndex)` (highest pressure level
    at which the best option was chosen). Gate passes when count of scenarios with
    `bestAt >= (gate.level||0)` ≥ min. Keep the old `best` map in sync for backwards compat.
  - `reviews`: `(state.reviews[id]||[]).length >= min`.
  - `checklist`: every item in that checklist block ticked (look at how the checklist renderer
    stores ticks under `state.checklist[id]`).
- Progress bar: completed published packs / total published packs.

## Hero / identity
`content.js` meta will be updated by the content author to speak to any keeper. The hero layout
stays: two-line Anton headline (line 2 green), tagline, buttons "Start" (→ `#levels`) and
"Continue" (→ current pack's next step; hidden when nothing started). Replace the old TOC under
the hero with the "Where you are" card described above.

## Visual
Same design system (dark, pitch-green single accent, Anton/Montserrat/Inter, 1px lines, 2px
radii, no gradients/glass/emoji/icon tiles). Level numbers huge in Anton. Locked state = reduced
opacity + a small SVG padlock drawn inline (12px), not a character. The journey map should feel
like a path: a thin vertical line connecting level numbers, filled green up to the current level.

## Verification (do all)
Headless chromium at 1440×900 and 390×844, zero console errors:
1. Fresh state → `#home` shows "Start here"; `#levels` shows L3 open (L1/L2 "No pack published
   yet"), L4/L5 locked; `#pack/read-the-game` open with 3 steps and 2 gates failing.
2. Mark `mind`, `reading`, `positioning` done via the toggle and set `state.quiz` for positioning
   ≥3 (drive the real quiz or set localStorage then reload) → pack shows complete with date;
   `own-the-box` becomes open; progress bar = 1/4.
3. Deep-link `#s/simulator` while `own-the-box` is locked (fresh state) → locked panel. With
   coach `unlockAll` → renders.
4. Old link `#organising` → redirects to `#s/organising`.
5. Sim: answer a best option at level index 3 → `state.sim['sim-defend'].bestAt[id] === 3`.
6. Settings: set start level L4 → L4 unlocked and `under-pressure` open without L3 complete.
7. Keyboard ←/→ moves between steps inside a pack only.
8. Mobile: burger shows the three nav items; no horizontal overflow on `#levels`, a pack page, a
   section, and `#me`; all hit targets ≥44px.
Report file paths, what you verified, and anything you could not honour. Do not commit. Do not
edit `content.js`, `packs.js`, or `_build/parts/*` (content author owns them) — if the manifest
needs a field you lack, say so in the report.
