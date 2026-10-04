// Pack: Under Pressure v1.1.0 — adds On the Pitch (field tasks, drills) and evidence gates (ADR 0004).
window.KP = window.KP || {}; window.KP.packs = window.KP.packs || [];
window.KP.packs.push({
 "id": "under-pressure",
 "version": "1.1.0",
 "level": "L4",
 "tag": "Pack 1",
 "title": "Under Pressure",
 "promise": "The decisions you make slowly and correctly become the ones you make instantly.",
 "requires": {
  "simulator": "^1",
  "field": "^1"
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
  },
  {
   "id": "on-the-pitch",
   "kicker": "On the pitch",
   "title": "On the Pitch",
   "lede": "Match speed on the simulator means nothing until it shows on a Saturday. This pack is completed by matches, not by clicks.",
   "blocks": [
    {
     "type": "prose",
     "html": "<p>Match speed on the simulator means nothing until it shows on a Saturday. This pack is completed by matches, not by clicks.</p><p>Check in after each session or match — a date, did it happen (yes, partly, no — all honest answers), and what you noticed. The record is yours. Nobody is checking; the point is that <em>you</em> are.</p>"
    },
    {
     "type": "field",
     "id": "field-under-pressure",
     "title": "Field tasks",
     "intro": "Take one or two to each session. Not all at once.",
     "tasks": [
      {
       "id": "no-hesitation",
       "kind": "do",
       "when": "match",
       "text": "For a whole match, count your hesitations — any moment you started one decision and switched. Zero is the target; honesty is the point.",
       "why": "The only truly wrong decision is the half one. Pros are not faster thinkers; they commit earlier.",
       "prompt": "How many? What was happening each time?"
      },
      {
       "id": "reviewed-goals",
       "kind": "notice",
       "when": "match",
       "text": "For every goal or big chance against you, be able to say within a minute where it came from and what call or decision could have stopped it.",
       "why": "A conceded goal is information. This turns a bad moment into a better next one, in real time.",
       "prompt": "List them: where from, what would have stopped it."
      },
      {
       "id": "quiet-match",
       "kind": "notice",
       "when": "match",
       "text": "After the match, count the chances you PREVENTED with a call or a position — the shots that never came. Those are your real saves now.",
       "why": "At this level keepers are judged by the quiet matches they create, not the saves they make.",
       "prompt": "What did you prevent? Who did you move?"
      }
     ]
    },
    {
     "type": "callout",
     "title": "Why this pack can't be finished indoors",
     "html": "<p>Reading, deciding and organising are habits, and habits are built on grass. The lessons and the simulator show you what good looks like; only matches and sessions make it yours. Completing a pack means it has shown up in your game — that is the whole point.</p>"
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
   "type": "field",
   "min": 4,
   "distinctDates": true,
   "label": "Field tasks — 4 different matches"
  },
  {
   "type": "reviews",
   "review": "match-review",
   "min": 4,
   "label": "4 saved match reviews (from Run the Team)"
  },
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
