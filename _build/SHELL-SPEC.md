# Keeper Playbook — shell spec

Build a self-contained static site: `index.html`, `styles.css`, `app.js` in
`/home/trek/Source/personal/keeper-playbook/`. Content is NOT yours to write —
it arrives as `content.js` defining `window.PLAYBOOK` (schema below). A stub
`content.sample.js` is provided for testing; load it via
`<script src="content.js">` and copy the sample to `content.js` for your tests
only if `content.js` does not already exist (never overwrite an existing one).

## Audience + feel
A talented U13 goalkeeper reading on his phone and on a laptop. Serious,
inspiring, athletic — editorial sports-brand, NOT childish, NOT corporate SaaS.
No emoji. No icon-topped feature tiles. No gradients. No glassmorphism.

## Design system (fixed — this matches the club's site)
```
--black:#0a0a0a; --near-black:#141414; --ink:#1a1a1a; --panel:#1f1f1f;
--white:#fff; --off-white:#f4f4f2; --grey:#8a8a8a; --grey-2:#b8b8b8;
--line:rgba(255,255,255,.12); --pitch:#4ade80; --pitch-deep:#22c55e;
--f-display:'Anton','Arial Narrow',Impact,sans-serif  (huge uppercase headlines, line-height .92)
--f-head:'Montserrat',system-ui,sans-serif (800 weight headings, -0.02em)
--f-body:'Inter',system-ui,sans-serif (17px, line-height 1.65)
```
Load the three families from Google Fonts with `display=swap`; everything must
still look right on the fallbacks offline. Dark background throughout. Pitch
green is the ONLY accent: eyebrows, active states, correct answers, progress.
Use a subtle white-on-black "pitch line" motif (1px lines, 2px radius buttons,
uppercase letter-spaced labels) rather than cards everywhere. Section headers
are big Anton display type with a small green eyebrow above.

## Layout / navigation
- Sticky top bar: wordmark (text from `meta.title`), section nav (desktop),
  burger drawer (mobile ≤900px), and a thin green progress bar across the very
  top showing overall completion (see progress below).
- One-page, hash-routed sections (`#section-id`). Only the active section is
  shown (it's a lot of content). Prev/Next section buttons at the bottom of
  each section. Deep links must work on load. Keyboard: ←/→ switch sections.
- Hero (section with `hero:true`): full-viewport, giant two-line display
  headline from `meta.headline` (array of 2 strings; second line in pitch
  green), `meta.tagline`, two buttons: "Start" (goes to second section) and
  "Resume" (goes to the last section visited, stored in localStorage; hidden
  if none). Below the fold in the hero: the section list as a numbered
  table-of-contents with completion ticks.
- Mobile hit targets ≥44px. Respect prefers-reduced-motion. Real focus states.

## Progress / persistence (localStorage key `keeper-playbook-v1`)
- Each section is "done" when the user hits a "Mark section complete" toggle
  at the bottom of it. Store done flags, quiz results, checklist ticks,
  decision-tree completions, review entries, last section.
- Progress bar = done sections / total non-hero sections.
- "Reset progress" link in the footer with confirm().

## Data schema (`window.PLAYBOOK`)
```js
{
  meta: { title, headline:[a,b], tagline, intro },
  sections: [
    { id, nav, kicker, title, lede, hero?:bool, blocks:[Block...] }
  ]
}
```
Block types — implement ALL of these renderers:

1. `{type:'prose', html}` — rich paragraph(s). Trusted HTML.
2. `{type:'loop', title?, steps:[{name, text}]}` — big numbered horizontal
   process (stack vertically on mobile). Numbers in Anton, green.
3. `{type:'cards', title?, cols?:2|3, items:[{title, text, tag?}]}` — plain
   bordered panels, title in Montserrat. `tag` is a small green eyebrow.
4. `{type:'tabs', title?, items:[{name, html}]}` — horizontal tab strip
   (scrollable on mobile), one panel visible.
5. `{type:'phases', title?, items:[{name, where, see, do, say}]}` — tabbed like
   `tabs`, but each panel renders four labelled rows: WHERE AM I / WHAT I'M
   WATCHING / WHAT I DO / WHAT I SAY. Values are HTML.
6. `{type:'tree', title, intro?, root:Node}` where
   `Node = {q, options:[{label, next?:Node, result?:string, why?:string}]}`.
   Interactive decision tree: show the question, options as big buttons,
   walk the tree with a breadcrumb trail of chosen answers, show the result
   panel (green rule) with `why`, and a "Start again" button. Record a
   completion when a result is reached.
7. `{type:'calls', title, intro?, groups:[{name, items:[{see, say, why, words:[string...]}]}]}`
   — THE key block. A filterable playbook: group chips across the top (All +
   each group), a text filter input, then a list of rows. Each row: left
   column "WHEN YOU SEE" (see), right column "YOU SAY" (say, bold, white) with
   `words` rendered as green pill chips (the exact short calls), and `why`
   underneath in grey. Expandable on mobile. Count shown ("24 calls").
8. `{type:'vocab', title?, items:[{word, meaning, when}]}` — compact glossary
   grid: word in Anton green, meaning, "when" in grey.
9. `{type:'pitch', title, intro?, scenarios:[{id, label, ball:{x,y}, keeper:{x,y}, zone?:[[x,y],...], note}]}`
   — interactive SVG of HALF a pitch (defensive half, goal at the bottom,
   viewBox 0 0 100 70, goal centred at x=50,y=68, 6-yard box, 18-yard box,
   penalty spot, D, centre line at top). Coordinates are in that space. Chips
   to pick a scenario; animate the ball (white) and keeper (green) to their
   positions (CSS transition), draw thin green guide lines from ball to both
   posts, optional `zone` polygon lightly filled. Show `note` beside/below.
10. `{type:'quiz', title, intro?, items:[{situation, options:[{text, correct:bool, feedback}]}]}`
    — one scenario at a time with "Scenario 3 / 12". Pick an option → show
    feedback for the chosen option (green rule if correct, white/grey rule if
    not) plus reveal which was correct. Next button. Score summary at the end
    with "Go again" (reshuffle order). Persist best score.
11. `{type:'checklist', id, title, intro?, items:[string...]}` — tickable list
    persisted under its id.
12. `{type:'ladder', title, intro?, levels:[{level, name, items:[string...]}]}`
    — vertical ladder, each rung a level with its items; the user can mark
    "I'm here" on one level (persisted) and it highlights.
13. `{type:'review', id, title, intro?, prompts:[string...]}` — a post-match
    self-review form: date field + one textarea per prompt; "Save review"
    appends to a list under `id`; past reviews shown below, newest first,
    each collapsible, with delete; "Copy as text" button for the latest.
14. `{type:'quote', text, attribution?}` — big pull-quote in Anton.
15. `{type:'callout', title?, html}` — a bordered emphasis panel (green 1px
    border, no left accent rail).

Every block with a `title` renders it as an h3. Unknown block types must not
crash the app — render a visible "unsupported block" note.

## Quality bar
- No console errors. Works from `file://` (no fetch, no modules).
- Test with the sample content in a real browser (chromium is at
  /usr/sbin/chromium; `chromium --headless --screenshot=... --window-size=390,844 file:///...`
  works for mobile; also 1440x900). Check both.
- Keep `app.js` readable: one render function per block type in a `renderers`
  map. No frameworks, no build step.
- Deliver: the three files, and a short note listing any schema fields you
  could not honour.
