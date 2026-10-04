---
status: Accepted
date: 2026-10-04
deciders: [k@wetware.works]
history:
  - 2026-10-04: Accepted
---

# Decision Record 0005: One Pi Durable node runs Goalkeepers Corner; the Playbook is extensions and a client on it

## Context

The Playbook was built as a static site with progress in the browser. Its architecture
(`0000-three-tiers-runtime-capabilities-packs`, `0001-progress-is-an-append-only-event-log`) was
shaped deliberately towards a durable agent harness — [Pi Durable](https://earendil.com/posts/pi-durable/):
a harness over one storage that runs many long-lived conversations, with pluggable **extensions**
(system-prompt sections, tools, hooks, tasks), typed **documents** committed atomically with
transcripts, durable tasks and timers, live replacement of extensions, and **multiplayer** — many
authenticated humans and clients attached to the same conversations.

The deployment target is not a device and not a Playbook server. It is **a single Pi Durable
node that runs the whole Goalkeepers Corner operation** — strategy, administration, coaching and
keepers — with every person interacting as their authenticated self, through the website or a
chat surface. The Playbook is one part of that operation.

Several things are not yet decided and this record does not pretend they are: the chat surface,
the authentication mechanism, how the public site and the authenticated surfaces converge, and
the order in which this is built.

## Decision

- **Goalkeepers Corner runs as one Pi Durable node.** One harness, one storage, one identity
  model for the organisation. Keeper, coach, admin and strategy are roles within it, not separate
  systems.
- **The Playbook contributes extensions, not an application.** A pack compiles to an extension:
  its lessons, field-task prompts and `why`s become system-prompt sections; its check-ins, drill
  logs, simulator decisions and reviews become tools; its attention tasks ("at your next session,
  notice…") become durable tasks with timers. The versioned pack folder stays the authoring
  format; the node is what it is published *to*. Any GC conversation — a keeper's, a coach's, a
  strategy session's — may select a pack extension.
- **A keeper's progress is a document on the node**, scoped to the keeper's identity and committed
  with the conversation that produced it. The event schema in `0001` is that document's schema.
  Browser storage becomes an offline cache that syncs, never the truth. This closes the
  "progress is ephemeral" problem by construction rather than with a bolt-on.
- **The website is a client of the node.** The pitch, the simulator, the Call Sheet, the journey
  map are visual surfaces the agent can hand a person mid-conversation and that read committed
  state. The intelligence is in the conversation; it is **pack-guided** because the pack decides
  what the agent sees and can do.
- **Coach capabilities are multiplayer, not features.** Placement, review of a keeper's record,
  pack authoring — a coach attaches to the relevant conversation with role-scoped tools. These
  leave the roadmap as Playbook features.
- **Incremental.** The static site and its in-browser store stay in service until the node is
  ready; nothing built now may depend on browser-only globals in `runtime/journey.js`,
  `runtime/progress.js` or the pack loader, so the node can run the same code.

## Alternatives considered

| Option | Why not |
|---|---|
| A Playbook-only backend with its own auth | A second identity system next to the organisation's; progress and coaching split across two stores; every GC surface rebuilds the same plumbing. |
| Per-keeper or per-household agents | Optimises for one keeper's privacy at the cost of the thing GC is: a community where coaches and keepers share a record. Identity-scoped documents on one node give the privacy without the fragmentation. |
| Keep the site standalone and bolt a chat on later | The architecture was pointed at the harness on purpose; delaying the alignment only grows the rework. |
| **Chosen: one organisational node; Playbook as extensions + client** | Matches what the operation is; makes coach involvement, durable progress and conversational interaction the same mechanism. |

## Consequences

- The UX will change materially: check-ins and reviews partly dissolve into dialogue; "Continue
  points outward" becomes the agent asking on the night of training; the site becomes the place
  the agent sends you to *see* something. Design for that incrementally; do not redesign the site
  around conversation before the node exists.
- `0001`'s localStorage-first consequence is superseded by this record: the store interface stays,
  the primary implementation becomes the node's storage.
- `ROADMAP.md` items "server-side progress behind auth" and "coach placement & authoring" are
  re-homed: they are node concerns, delivered by this architecture, not Playbook features.
- Pack authoring gains a compile target (extension) alongside the browser bundle; the authoring
  format must stay expressible as both. Field-task `prompt` and `why` fields are the agent's
  words — write them as such.
- A workstream boundary: Goalkeepers Corner's node, identities and surfaces are **GC's estate**;
  this repository contributes packs, capabilities and the client. Decisions about the node itself
  belong with the node, not here.

## Related

- `0000-three-tiers-runtime-capabilities-packs.md` (the tiers map onto extensions, documents and clients)
- `0001-progress-is-an-append-only-event-log.md` (the event schema is the document schema; storage primacy superseded here)
- `0004-progress-requires-real-world-evidence.md` (field tasks become durable tasks and conversational check-ins)
