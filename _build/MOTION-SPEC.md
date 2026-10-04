# Simulator motion engine — spec

Target: `/home/trek/Source/personal/keeper-playbook/app.js` (`renderers.sim`) and `styles.css`.
Read `renderers.sim` and `buildPitchSvg()` first; extend, don't rewrite. Content is authored
separately and will conform to this schema; `_build/parts/03c-simulator.js` currently holds the
STATIC version of the scenarios (fields `ball, keeper, us, them, arrow`) — keep those working as a
fallback when a scenario has no `play`.

## Coordinate system & realism constants
viewBox `0 0 100 70`, our goal centred at (50,68). Scale ≈ 0.7 m per unit.
Authors use these speeds (units/second) — the engine does NOT enforce them, but the
`slow` control exists so the viewer can study them:
- sprint 9, run 6.5, jog 3.5; driven pass 24; lofted ball 14 (ground speed) with `h` (height 0–1).

## Schema additions (per scenario)
```js
{
  id, label, phase, question, options:[...],
  setup: { ball:{x,y}, keeper:{x,y}, us:[{id,x,y,n?}], them:[{id,x,y,n?}] },
  play: { duration: seconds, tracks: { <entity>: [ {t, x, y, h?}, ... ] }, overlays?: [...] },
  options: [{ text, grade, feedback,
              outcome: { duration, tracks:{...}, overlays?:[...], result:'goal'|'saved'|'cleared'|'kept'|'lost'|'chance', caption } }]
}
```
- Entity keys: `ball`, `keeper`, `us.<id>`, `them.<id>`.
- Tracks are keyframes in seconds, sorted. Position at time t:
  - before the first keyframe: interpolate from the entity's position AT TIMELINE START to the first keyframe (so authors never restate start positions);
  - between keyframes: ease (use ease-in-out for players, linear for the ball on the ground, ease-out for lofted balls);
  - after the last: hold.
- `h` on the ball (0–1) renders height: ball radius scales 1.0→1.9, and a soft shadow ellipse stays on the ground, offset slightly, fading as h rises. A `h` keyframe sequence 0→1→0 is a lofted ball.
- A timeline's "start positions" = wherever entities are when it begins (setup for `play`; end-of-play for `outcome`). Outcomes therefore chain seamlessly from the frozen decision frame.
- Legacy fallback: if no `setup`, derive it from `ball/keeper/us/them`; if no `play`, show the static frame (current behaviour, incl. `arrow`).

## Playback behaviour
1. On scenario load: draw setup frame, show a small "▶ Watch the play" state for 600ms, then auto-play `play` with requestAnimationFrame (dt-based, so it's frame-rate independent).
2. At `play.duration` the frame FREEZES. A thin pulsing ring expands once around the keeper (the "decide" cue, 500ms, then static). Only now do the options become enabled (render them disabled/dimmed during the play so he watches first). The pressure timer (if any level is on) starts at the freeze, not before.
3. On answer: play the chosen option's `outcome` immediately (if present). When it ends, flash a result badge over the pitch: `goal` → red "GOAL CONCEDED"; `saved`/`cleared`/`kept` → green "SAVED"/"CLEARED"/"KEPT THE BALL"; `lost` → grey "POSSESSION LOST"; `chance` → amber "CHANCE CONCEDED". Show `caption` under the pitch (this is the teaching line).
4. If the chosen grade !== 'best' and the best option has an outcome, show a button "Watch the best option" that re-seeks to the frozen decision frame and plays the best outcome (with its badge+caption). Also always offer "Replay" (re-run the play to the decision frame; options stay answered).
5. Controls row under the pitch: Replay · Slow (toggles 0.5×, persisted in `state.sim._slow`) · Overlays toggle (on by default).
6. `prefers-reduced-motion`: skip straight to the decision frame; outcomes jump to their final frame and show the badge/caption. Everything remains usable.
7. No timers leak: cancel rAF + intervals on scenario change, on section change, and on `pagehide`.

## Overlays (must be geometrically correct, computed every frame from entity positions)
- `offside`: horizontal line across the pitch at the y of OUR deepest outfield player (max y among `us.*`, excluding keeper). Dashed, white 40%. Label "line" at the right edge. This is the lesson for shape scenarios — when the line steps up, the line visibly moves.
- `cone`: translucent green triangle ball→left post (44.6,68) →right post (55.4,68). Shows what the shooter sees; as the keeper moves, nothing changes in the cone (correct), but add a second darker wedge: the part of the cone the KEEPER covers = a triangle from the ball through keeper±2.2 units perpendicular to the ball-keeper line, clipped to the goal line. The uncovered part of the goal line is the visible "gap" — this is how angle/depth is taught, so compute it properly: project the two keeper-edge rays onto y=68 and shade ball→those two intercepts (clamped to the posts).
- `pressure`: a circle radius 3.5 around whichever `them.*` entity is within 1.5 units of the ball (the carrier); fill red 10%, stroke red 40%. Shows whether a defender is "tight" (inside the circle) or "standing off".
- `run`: for any entity whose track has movement in the current timeline, a faint trailing path (last ~0.8s of positions) so runs read as runs. Thin, 30% of entity colour. Ball trail too.
- Overlays listed in `play.overlays` show during the play and freeze; `outcome.overlays` during that outcome (default: inherit from play).

## Visual quality bar
- Entities: ball white r1.1 (+shadow), keeper green r1.6 with ring, us white 85% r1.5, them `#f43f5e` r1.5. Labels (`n`) follow their entity.
- Motion must look like football: no teleporting, no linear robotic player moves (ease players), ball on the ground moves linearly and fast, lofted balls arc with height.
- Result badge: Anton display, uppercase, letter-spaced; fades in 200ms, holds, stays until next action.
- Caption: `.sim__caption` — off-white, 15px, under the controls, border-top 2px pitch green when result is good, red when goal.
- Keep all CSS in the existing design system (no gradients, no glass, no emoji).

## Verification (do all of it)
Build a `_build/sim-smoke.js` content file containing ONE fully-authored scenario of your own (simple: a ball over the top, a striker run, a keeper that comes; outcomes for 2 options) plus one legacy static scenario, wire a temporary test page `_build/sim-test.html` that loads `../styles.css`, `sim-smoke.js`, `../app.js`, and verify in headless chromium (/usr/sbin/chromium) at 1440×900 and 390×844: play runs and freezes, options disabled until freeze, outcome plays, badge+caption appear, "watch the best option" works, replay works, overlays geometrically right (screenshot the cone at two keeper depths and confirm the uncovered gap shrinks as the keeper comes out), reduced-motion path, zero console errors, no rAF leak after switching scenarios (count active via a wrapper around requestAnimationFrame). Do not modify `content.js` or anything in `_build/parts/`. Do not commit. Report file paths, what you verified, and anything in the spec you could not honour.
