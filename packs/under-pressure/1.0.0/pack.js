// Pack: Under Pressure v1.0.0 — content only. Capabilities referenced by block `type`; see ARCHITECTURE.md.
window.KP = window.KP || {}; window.KP.packs = window.KP.packs || [];
window.KP.packs.push({
 "id": "under-pressure",
 "version": "1.0.0",
 "level": "L4",
 "tag": "Pack 1",
 "title": "Under Pressure",
 "promise": "The decisions you make slowly and correctly become the ones you make instantly.",
 "requires": {
  "simulator": "^1"
 },
 "sections": [
  {
   "id": "pressure",
   "kicker": "Under Pressure",
   "title": "Match Speed",
   "lede": "Same plays. Three seconds. You already know the right call — now make it before you've finished thinking.",
   "blocks": [
    {
     "type": "prose",
     "html": "<p>Everything in this pack you've seen before. The difference is the clock: set the pressure to <strong>Match speed</strong> and the decision has to arrive while the picture is still moving. Use Slow and Replay as much as you like between attempts — the goal is recognition, not reaction. When you can get seven of eight defending plays and five of six distribution plays right at Match speed, you've turned knowledge into instinct.</p>"
    },
    {
     "type": "simulator",
     "set": "defend",
     "title": "Defending — at match speed",
     "intro": "Switch the pressure to Match speed. Decide before the ball lands."
    },
    {
     "type": "simulator",
     "set": "distribute",
     "title": "Distribution — at match speed",
     "intro": "Switch the pressure to Match speed. One look, one action."
    }
   ]
  }
 ],
 "sets": {
  "defend": {
   "capability": "simulator",
   "ref": "own-the-box/defend"
  },
  "distribute": {
   "capability": "simulator",
   "ref": "own-the-box/distribute"
  }
 },
 "gates": [
  {
   "type": "sim",
   "set": "defend",
   "min": 7,
   "pressure": 3,
   "label": "Simulator — 7 of 8 defending plays at Match speed"
  },
  {
   "type": "sim",
   "set": "distribute",
   "min": 5,
   "pressure": 3,
   "label": "Simulator — 5 of 6 distribution plays at Match speed"
  }
 ]
});
