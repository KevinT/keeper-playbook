# Pack → Pi Durable extension: the compile contract

Implements the "packs compile to extensions" consequence of ADR 0005. One tool,
`node _build/tools/compile-pack-extension.js [--out node/generated]`, reads `packs/registry.js`
and emits one TypeScript extension module per pack plus a shared `playbook-core.ts`. The pack
folder stays the only authored artifact; the generated files are never hand-edited.

## Mapping

| Pack element | Extension element |
|---|---|
| `title`, `promise`, level, `sections[].lede` + `prose` blocks (HTML stripped to text) | `section("pack:<id>")` — the pack's teaching, rendered only when the keeper's current pack is this one or it is explicitly selected |
| `field` tasks (`text`, `why`, `prompt`, `when`, `kind`) | `section("pack:<id>:field")` listing open tasks the agent can ask about; tool `checkin_<packId>` (task, date, done, notes) → appends `field.checkin` |
| `drill` drills (`name`, `mode`, `steps`, `focus`, `gameLink`) | same section (drill summaries); tool `log_drill_<packId>` → `drill.logged` |
| `review` block | tool `save_review_<packId>` (date, answers) → `review.saved` |
| `quiz`, `tree`, `simulator`, `pitch`, `calls`, `checklist`, `ladder` | **client-only** — a `sections` line tells the agent the visual exists and its deep-link (`#s/<pack>/<section>/<block>`, `?scenario=`) so it can send the keeper there. Decisions made on the site arrive as events through the shared document, not through a tool. |
| `gates` | evaluated by the shared `computeJourney` (same `runtime/journey.js`, loaded in Node) inside `section("playbook:journey")`: where the keeper is, which gates are met, the next outward step |
| `requires` | the generated module imports only the core; `requires` is written into the module header and checked at install |

## Shared core (`playbook-core.ts`, generated once)

- `KeeperProgress = defineDocFamily<{ v:1, events: Event[] }, string>({ kind: "gc.keeper.progress",
  version: 1, scope: "session", initial: () => ({ v: 1, events: [] }) })` — one document per keeper,
  keyed by the keeper's identity id. **The event array is the same schema as the browser log.**
- `appendEvent(tx, keeperId, event)` stamps `v`, `t`, `pack`, `packVersion` exactly like
  `runtime/progress.js` does in the browser.
- `journeySection` — renders `computeJourney(doc.events, levels, packs)` as a compact text block:
  level · pack · gates met/unmet · next step. The agent is **pack-guided because this section is
  what it sees.**
- Keeper identity comes from the conversation's own `pi.agent`/init data under `keeperId`; the
  compiler does not decide auth (left open by ADR 0005) — it reads `input.agent.instructions`-adjacent
  metadata via a single `keeperIdOf(input)` function with one TODO.

## Non-goals (this iteration)

- No chat surface, no harness bootstrap, no model choice. The output is importable modules plus a
  tiny `example-harness.ts` that opens `MemoryStorage`, installs the generated extensions, and prints
  the rendered sections for a synthetic keeper — enough to prove the compile is real.
- Attention-task timers ("ask on Tuesday night") are a `defineTask` the compiler scaffolds as a
  commented stub; scheduling policy belongs to the node.

## Verification

- `node _build/tools/compile-pack-extension.js` generates under `node/generated/` without error for
  all four packs.
- The generated TypeScript type-checks against the real `@earendil-works/pi-durable` source
  (use the checkout at `~/.hermes/cache/scratch/pi/packages/durable`, `tsc --noEmit` with its
  tsconfig, or `node --experimental-strip-types` to run the example).
- `example-harness.ts` runs: a synthetic keeper with three `field.checkin` events on distinct dates
  renders a journey section showing the field gate `3/3 met` and the quiz gate unmet; a
  `checkin_read-the-game` tool call appends an event and the next render reflects it.
