// Keeper Playbook — pack manifest.
// A LEVEL is a stage of a keeper's development. A PACK is a versioned, ordered set of sections with a
// completion gate. Levels unlock in order (levels with no published packs are skipped). A coach can set a
// keeper's starting level. New packs/versions are published by editing this file.
//
// Gate types:  { type:'sections' }                       all sections in the pack marked complete
//              { type:'quiz',  key, min }                 best score on a quiz block (key = "<sectionId>:<blockIndex>")
//              { type:'sim',   id, min, level? }          scenarios nailed at least once in a sim (level: min pressure level index 0-3)
//              { type:'reviews', id, min }                saved match reviews
//              { type:'checklist', id }                   every item ticked
window.PACKS = {
  version: 1,
  levels: [
    { id: "L1", n: 1, name: "Foundation", question: "Can I do it?", ages: "about 7–9",
      blurb: "You, the ball and the goal. Enjoying the position, moving safely, trying things and not minding mistakes.",
      packs: [] },
    { id: "L2", n: 2, name: "Development", question: "When should I do it?", ages: "about 10–12",
      blurb: "Technique plus decision. Basic angles, starting positions, choosing the right option with the ball, first words to the defence.",
      packs: [] },
    { id: "L3", n: 3, name: "Performance", question: "Why am I doing it?", ages: "about 13–15",
      blurb: "You are no longer just protecting the goal — you are influencing the team. Reading the game before the ball moves, running the shape, staying composed.",
      packs: [
        { id: "read-the-game", version: "1.0", title: "Read the Game", tag: "Pack 1",
          promise: "See danger two passes early and be in the right place before the shot exists.",
          sections: ["mind", "reading", "positioning"],
          gates: [ { type: "sections" }, { type: "quiz", key: "positioning", min: 3, label: "Positioning check — 3 of 4" } ] },
        { id: "own-the-box", version: "1.0", title: "Own the Box", tag: "Pack 2",
          promise: "Make the big calls — come or stay, catch or punch, fast or slow — early, once, and fully.",
          sections: ["decisions", "ball", "setpieces", "simulator"],
          gates: [ { type: "sections" }, { type: "sim", id: "sim-defend", min: 6, label: "Simulator — 6 of 8 defending plays, best call" }, { type: "sim", id: "sim-distribute", min: 4, label: "Simulator — 4 of 6 distribution plays, best call" } ] },
        { id: "run-the-team", version: "1.0", title: "Run the Team", tag: "Pack 3",
          promise: "Turn what only you can see into instructions the players in front of you act on.",
          sections: ["organising", "matchday", "ladder"],
          gates: [ { type: "sections" }, { type: "checklist", id: "organising-habits", label: "Organising habits — all ticked" }, { type: "reviews", id: "match-review", min: 3, label: "3 saved match reviews" } ] }
      ] },
    { id: "L4", n: 4, name: "Pre-professional", question: "Can I make the right decision, consistently, under pressure?", ages: "about 16–18",
      blurb: "The question changes from 'can you become a goalkeeper' to 'can you perform at a serious level, every week'.",
      packs: [
        { id: "under-pressure", version: "1.0", title: "Under Pressure", tag: "Pack 1",
          promise: "The decisions you make slowly and correctly become the ones you make instantly.",
          sections: ["simulator"],
          gates: [ { type: "sim", id: "sim-defend", min: 7, level: 3, label: "Simulator — 7 of 8 defending plays at Match speed" }, { type: "sim", id: "sim-distribute", min: 5, level: 3, label: "Simulator — 5 of 6 distribution plays at Match speed" } ] }
      ] },
    { id: "L5", n: 5, name: "Leader", question: "Can I make the keepers around me better?", ages: "senior",
      blurb: "Mentoring, analysis, and the habits of a professional. The journey never ends — it turns around and helps the next keeper.",
      packs: [] }
  ]
};
