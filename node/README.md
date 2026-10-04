# node/ — the Playbook as Pi Durable extensions

Implements ADR 0005 ("one Pi Durable node runs Goalkeepers Corner; the Playbook contributes
extensions and a client"). Contract: `_build/COMPILE-SPEC.md`. Nothing in `generated/` is
hand-edited; the pack folder (`packs/<id>/<version>/pack.js`) is the only authored artifact.

## What is generated

`node _build/tools/compile-pack-extension.js [--out node/generated]` reads `packs/registry.js`,
loads `levels.js` and every published pack (latest version per id) the same way the browser does,
and writes:

| File | Contents |
|---|---|
| `generated/playbook-core.ts` | `KeeperProgress` — a session-scoped `defineDocFamily` (`kind: gc.keeper.progress`, keyed by keeper id) holding `{ v:1, events: Event[] }`, **the same event schema as the browser log**. `stamp`/`appendEvent` mirror `runtime/progress.js`. `computeJourney` loads `runtime/journey.js` via `createRequire` (no reimplementation of gates). `renderJourney` + `journeySection` (`playbook-journey`): level · pack · gates met/unmet · next outward step. `keeperIdOf(input)` with the single auth TODO. |
| `generated/pack-<id>.ts` (×4) | One `defineExtension` per pack: `teachingSection` (`pack-<id>`: title, promise, every section's lede + presentational blocks as plain text, plus a "visuals on the site" list with deep-links for client-only blocks — quiz, tree, simulator, pitch, calls, checklist, ladder); `fieldSection` (`pack-<id>-field`: field tasks with `why`/`prompt`, drills, review prompts); tools `checkin_<id>` → `field.checkin`, `log_drill_<id>` → `drill.logged`, `save_review_<id>` → `review.saved` (only where the pack has those blocks). Both sections render only when the pack is the keeper's current pack or is selected via `playbook.packs: a,b` in the agent instructions. `requires` is in the header and exported. |
| `generated/index.ts` | `installPlaybook(registry, capabilities?)`: installs `playbook:core` then each pack whose `requires` the node's capability versions satisfy (same `satisfies` lifted from `runtime/journey.js`). Not in the spec's list; added so the core never imports packs. |
| `generated/example-harness.ts` | Proof the compile is real: `MemoryStorage` + faux provider, three seeded `field.checkin` events on distinct dates, journey rendered (field gate 3/3 met, quiz unmet), a `checkin_read-the-game` tool call appends an event, journey re-rendered (4/3), and the section keys the model actually saw. Asserts all of it. |

## How to regenerate and verify

```sh
# 1. generate (plain Node, no deps)
node _build/tools/compile-pack-extension.js

# 2. one-time scratch wiring against a pi source checkout (never committed; see .gitignore)
#    PI=~/.hermes/cache/scratch/pi  (git clone of github.com/earendil-works/pi)
#    cd $PI && npm install --ignore-scripts
#    cd $PI/packages/chord && npm run build; cd ../telemetry && npm run build
#    cd ../ai && npx tsc -p tsconfig.build.json; cp -r src/providers/data dist/providers/data   # `npm run build` fails on check:model-data; tsc + data copy is enough
#    (chord + durable expose a `source` export condition; pi-ai and pi-telemetry do not, so their dist must exist)
ln -s $PI node/pi
ln -s $PI/node_modules node/node_modules

# 3. type-check (tsconfig.json maps @earendil-works/* onto the checkout's src)
cd node && ./node_modules/.bin/tsc -p tsconfig.json

# 4. run the example
cd node && node --conditions=source --experimental-strip-types generated/example-harness.ts
```

Expected tail of step 4: `[met] Field tasks … (3/3, pitch)`, `[unmet] Positioning check`, then
`(4/3, pitch)` after the tool call, `system prompt sections seen by the model: playbook-journey,
pack-read-the-game, pack-read-the-game-field, instructions, …`, and `OK: compile is real.`

Generated code follows the checkout's rules: erasable TypeScript only, no `any`, top-level imports.

## Deviations from `_build/COMPILE-SPEC.md` (forced by the real API)

- **Section keys**: Pi Durable validates keys against `/^[a-z][a-z0-9_-]*$/`
  (`durable/src/harness/registry.ts`), so the spec's `pack:<id>`, `pack:<id>:field`,
  `playbook:journey` are emitted as `pack-<id>`, `pack-<id>-field`, `playbook-journey`.
  Extension names keep the `playbook:<id>` form (unconstrained).
- **`JsonValue`** is exported by `@earendil-works/chord`, not `@earendil-works/pi-durable`.
- **Event `t` is strictly increasing within a process.** `runtime/journey.js` keys live
  field/drill entries by `t`, so two events appended in one commit (same millisecond) would
  collapse into one. The browser never emits two events in one tick; a tool or a seed can, so the
  node-side `stamp` bumps by 1 ms on collision. Same stamp shape otherwise.

## Deliberately not decided here (ADR 0005 leaves these to the node)

- **Authentication / keeper identity.** `keeperIdOf` reads a `keeperId: <id>` line from the
  conversation's agent `instructions`, else falls back to `conversation:<id>`. One TODO marks the
  swap for the node's identity model.
- **Attention-task timers** ("ask on Tuesday night"). Each pack module carries a commented
  `defineTask` stub naming the hook; scheduling policy belongs to the node.
- **Chat surface, harness bootstrap, model choice.** `example-harness.ts` is a proof, not a server.
- **Client-only visuals** (quiz, simulator, tree, pitch, calls, checklist, ladder) are not tools.
  The agent gets a deep-link (`#s/<pack>/<section>/<block>`, `?scenario=<id>`); decisions made on
  the site arrive as events in the shared document when the browser store syncs to it — that sync
  is not built yet (browser storage is still the truth until the node exists).
- **Pack selection beyond "current pack"**: the `playbook.packs:` instructions line is a
  placeholder for whatever the node uses to let a coach or strategy conversation select a pack.
