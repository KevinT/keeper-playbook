---
status: Accepted
date: 2026-10-04
deciders: [k@wetware.works]
history:
  - 2026-10-04: Accepted
---

# Decision Record 0000: Three tiers — runtime, capabilities, packs

## Context

The first versions of the site were a single content bundle (`content.js`) rendered by a single
`app.js`, with the simulator's scenarios embedded as blocks inside one section. Introducing
"packs" (versioned, completable units) exposed that nothing could be versioned independently:
fixing one scenario changed the file every pack depended on, and a coach could not publish
content without touching the application.

The requirement that drove the decision: packs must be versioned and managed independently,
and new packs must be publishable later by someone other than the original author.

## Decision

Three tiers with one-way dependencies:

- **Runtime** — navigation, routing, the journey/unlock model, the progress log and the gate
  evaluator. Knows nothing about which packs exist; reads a registry.
- **Capabilities** — versioned engines (simulator, quiz, decision tree, pitch diagram, call sheet,
  checklist, match review, ladder, plus presentational blocks). A capability contains no content
  and never touches storage or the router; it renders a block through a small API
  (`emit`, `query`, `set`).
- **Packs** — self-contained, versioned folders (`packs/<id>/<version>/`) carrying sections,
  named data sets (e.g. simulator scenario sets) and completion gates. A pack declares which
  capability versions it `requires` and never embeds a renderer. A set may *reference* another
  pack's set rather than copy it.

Publishing is one line in `packs/registry.js`. Full contracts: `../../ARCHITECTURE.md`.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep one content bundle, add a pack manifest that references sections | Versioning stays coupled: any content change re-versions everything; the simulator cannot be depended on, only copied. This was the first implementation and it is what this record replaces. |
| Packs embed their own renderers (fully self-contained HTML/JS per pack) | Every pack re-ships the simulator; a fix to the engine has to be applied N times; packs drift visually. |
| A build step / bundler producing one artifact | Adds tooling for a static site that must work from `file://` and GitHub Pages with no server; publishing a pack would require a build rather than a folder. |
| **Chosen: three tiers, plain script tags, registry file** | Independent versioning of engines and content, zero tooling, coach-publishable. |

## Consequences

- The simulator (and every other engine) is a dependency packs declare, not content they carry.
  Engine improvements reach every pack at once.
- Block identity must be explicit (`id`) wherever progress attaches; positional keys are
  forbidden (see `0001-progress-is-an-append-only-event-log`).
- Unmet `requires` must degrade gracefully ("needs a newer Playbook"), never break the site.
- Multiple versions of a pack may coexist in the registry.

## Related

- `0001-progress-is-an-append-only-event-log.md` (the progress model this separation needs)
