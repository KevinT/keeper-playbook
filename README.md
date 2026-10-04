# Keeper Playbook

A goalkeeper's companion for the gameplay and strategy side of the position — reading the game,
positioning, the big decisions, distribution, set pieces, and organising the team. Levels and
packs carry the pedagogy; the keeper levels up by completing them.

**Live:** https://kevint.github.io/keeper-playbook/

- What it is, who it is for, and how to judge a change: [`.about/purpose.md`](.about/purpose.md)
- Decisions that shaped it: [`.about/decisions/`](.about/decisions/)
- How it is built (runtime / capabilities / packs): [`ARCHITECTURE.md`](ARCHITECTURE.md)
- What is deliberately not built yet: [`ROADMAP.md`](ROADMAP.md)

## Publishing a pack

1. Create `packs/<id>/<version>/pack.js` (see an existing pack for the shape and
   `ARCHITECTURE.md` for the contract). Simulator scenario sets must pass the speed check in
   `_build/`.
2. Add one line to `packs/registry.js`.
3. Commit and push — GitHub Pages serves `master`.

## Local development

Open `index.html` in a browser. No build step, no server.
