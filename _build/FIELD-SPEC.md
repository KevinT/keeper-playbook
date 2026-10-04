# Field work — capabilities, events, gates (implements ADR 0004)

Read `ARCHITECTURE.md`, `.about/decisions/0004-progress-requires-real-world-evidence.md`,
`runtime/journey.js`, `runtime/app.js`, `capabilities/checklist.js` and `capabilities/review.js`
first (the last two are the closest existing patterns).

## Capability `field` (v1.0.0) — tasks done or noticed in the real world
Block: `{ type:'field', id, title, intro?, tasks:[ { id, kind:'do'|'notice', when:'session'|'match'|'any',
          text, why, prompt } ] }`
- Renders each task as a row: kind label (DO / NOTICE), when label (NEXT SESSION / NEXT MATCH / ANY TIME),
  the task text (bold), `why` in grey, then a **Check in** button (≥44px).
- Check in opens an inline form: date (default today, ≤ today), "Did it happen?" (yes / partly / no —
  all three are valid, none is a failure), notes textarea with the task's `prompt` as placeholder
  (e.g. "How many silent ones? What stopped you calling?"). Save → `api.emit('field.checkin',
  { task, date, done:'yes'|'partly'|'no', notes })`.
- Under each task: its past check-ins (newest first, collapsed to one line each: date · done · first
  60 chars of notes), expandable, with delete → `field.checkin.deleted { task, id }` (id = event t).
- Header shows "N check-ins · M distinct dates" for the block.
- Tone: this is a record, not a scoreboard. No ticks that look like "complete"; the count is the
  feedback. Copy for the empty state: "Nothing logged yet. Take this to your next session."

## Capability `drill` (v1.0.0) — practice drills
Block: `{ type:'drill', id, title, intro?, drills:[ { id, mode:'solo'|'pair'|'group', name, setup, steps:[string],
          focus, gameLink, minutes } ] }`
- Each drill: mode label (SOLO / PAIR / GROUP), name in Montserrat 800, minutes, then collapsible
  body: SET-UP, STEPS (numbered), FOCUS ON (the one detail), WHY IT MATTERS IN A MATCH (gameLink).
- **Log a session** button → inline form: date, "how did it go" (1–5 as five plain buttons, labelled
  "rough" … "nailed it"), notes. Save → `api.emit('drill.logged', { drill, date, rating, notes })`.
  Past logs listed as in `field`; delete → `drill.logged.deleted { drill, id }`.
- Header: "N sessions · M distinct dates".

## Gate types (add to `runtime/journey.js`, pure, tested)
- `{ type:'field', task?, min, distinctDates?:true, done?:['yes','partly'] }` — count live (not
  deleted) `field.checkin` events for this pack (optionally one task); if `done` given, only those
  with `done` in the list (default: any); if `distinctDates`, count distinct `date` values instead
  of events. Pass when count ≥ min. Report `{have, need}`.
- `{ type:'drills', drill?, min, distinctDates?:true }` — same over `drill.logged`.
- Both must honour `ref`-style pack ownership the same way `sim` does (events are stamped with the
  pack they were emitted in; a block inside pack P records against P).

## Runtime changes
- **Continue points outward first.** In `app.js`, the "next step" for a pack is: the first section
  containing a `field`/`drill` block whose gate is unmet → else the first incomplete section → else
  the pack page. Apply to the home where-card and the pack page button.
- Pack page: gate list groups **"On the pitch"** (field/drills/reviews gates) above **"In the
  Playbook"** (sections/quiz/sim gates). Both must pass; the heading order states the priority.
- Section pack-frame: if the section has a `field`/`drill` block with an unmet gate, show a one-line
  "Take this to your next session" ribbon under the breadcrumb linking to that block.
- `#me`: add "On the pitch" — total check-ins, sessions logged, distinct dates, last 10 entries
  across all packs (date · pack · task/drill · done/rating · notes), newest first.
- No timers, streaks, or daily nags anywhere. Reduced-motion and 44px targets as before.

## Verification (headless chromium, both viewports, zero errors)
1. A synthetic pack (in a scratch test page, not committed) with one `field` block (2 tasks) and one
   `drill` block (1 drill), gates `field {min:3, distinctDates:true}` and `drills {min:2}`: three
   check-ins on the SAME date → gate have=1 fail; three on distinct dates → pass. Two drill logs →
   pass. Delete one → fails again. Reload persists.
2. Continue-points-outward: with sections complete but field gate unmet, home Continue → the field
   block's section; with all gates met → pack page completion.
3. Node unit tests for both gate types incl. `done` filter, `distinctDates`, deletes, pack ownership.
4. Real packs (after the content author re-versions them to 1.1.0 with field/drill blocks): every
   pack page shows "On the pitch" above "In the Playbook"; `#me` lists entries; no overflow; targets ≥44px.
Do not commit. Do not edit `packs/`, `levels.js`, `site.js`, or `.about/`. Report paths, verification,
and anything you could not honour.
