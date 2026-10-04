// ───────────────────────────────────────────────────────────── 07 SET PIECES
S.push({
  id: "setpieces", nav: "Set Pieces", kicker: "Section 07", title: "Set Pieces",
  lede: "The only moments in football where you get to organise everything before the ball moves. Keepers who use that time concede fewer goals — it really is that simple.",
  blocks: [
    { type: "prose", html: "<p>Most teams at your level don't have a plan for set pieces, which is exactly why they concede from them. A keeper who takes charge of corners and free kicks — same set-up every time, every man accounted for, nobody taking the kick until you're ready — takes a huge amount of risk out of the match before it happens.</p><p>Agree a system with your coach. Then <strong>own it</strong> on the pitch.</p>" },
    { type: "tabs", title: "Defending each situation", items: [
      { name: "Corners", html: "<p><strong>Your position:</strong> slightly past the centre of the goal towards the far post, on or just off the line, body open so you can see the kicker and the box. The six-yard box is your territory — anything in it is yours.</p><p><strong>Before the kick:</strong> posts covered (if your system uses them), zone players in the six-yard box, every attacker marked. Point at any free man and give him to someone. Watch for the short corner — one player ready to go to it.</p><p><strong>At the kick:</strong> decide early — <em>Keeper's!</em> or <em>Away!</em> — and make the whole box hear it. If you come, come with intent and take it at the highest point. If you stay, be set for the header.</p><p><strong>After:</strong> second ball. Where did the clearance land? Who's arriving? Call it.</p>" },
      { name: "Free kicks — direct", html: "<p><strong>Wall:</strong> enough players to cover the near-post side of the goal (usually 3–5 depending on distance and angle). Line it up from behind the ball: the outside player of the wall should be just outside the line from ball to near post. Then <strong>you</strong> cover the far side.</p><p><strong>Your position:</strong> where you can see the ball. Never behind the wall. Usually just off centre towards the far post, set and still as the ball is struck.</p><p><strong>Watch for:</strong> the pass instead of the shot, the player sneaking in behind the wall, the quick kick.</p>" },
      { name: "Free kicks — wide / indirect", html: "<p>Treat it like a corner that can also be shot. Mark everyone, zone the six-yard box, one or two in the wall if there's any shooting angle.</p><p>Your start position is near-post side but off the line enough to attack the ball. The danger is the near-post flick and the far-post runner — call both before the kick.</p>" },
      { name: "Penalties", html: "<p>You have nothing to lose and the taker has everything to lose. That is a real advantage — use it.</p><p>Stay big and still as long as you can; most youth takers decide late and look at the keeper. If you've seen him take one before, remember where it went. Pick a side as he plants his foot, not before. Whatever happens, be ready for the rebound — it's the most-forgotten part of a penalty.</p>" },
      { name: "Long throws", html: "<p>A long throw is a corner from a different angle. Same organisation: mark up, zone the six, call early. The ball tends to come lower and flatter than a corner — flick-ons at the near post are the main threat. Be ready to come and claim anything that reaches the six-yard box.</p>" }
    ] },
    { type: "cards", title: "Your own set pieces", cols: 2, items: [
      { title: "Our corner", text: "Where do you stand? Usually on the edge of your box, ready for the counter. Your job is the ball over the top if they break: be the sweeper. Call your two defenders who stay back into position." },
      { title: "Our free kick in their half", text: "Same — you're the last line against the counter. Edge of the box, on your toes, watching their fastest player." }
    ] },
    { type: "checklist", id: "setpiece-habits", title: "Set piece routine", intro: "Before every corner or free kick against us:", items: [
      "I've told the players who are on the posts / zoning (if that's our system).",
      "Every one of their players in the box has a name attached to him.",
      "I've checked for the short option and someone is ready for it.",
      "I'm in my position with my body open before the kicker starts his run-up.",
      "I've decided my call — Keeper's or Away — as early as the flight of the ball allows."
    ] }
  ]
});

// ───────────────────────────────────────────────────────────── 08 MATCH DAY
S.push({
  id: "matchday", nav: "Match Day", kicker: "Section 08", title: "Match Day",
  lede: "Performance starts before the whistle and doesn't end at it. A routine turns nerves into focus and a match into learning.",
  blocks: [
    { type: "tabs", title: "The match, phase by phase", items: [
      { name: "Before", html: "<p><strong>The day before:</strong> pack your kit, drink water, sleep. Spend five minutes with this guide on one section — not the whole thing.</p><p><strong>Arriving:</strong> walk the pitch. Is it bouncy, wet, long grass? Which way is the sun? Which goal is it in which half? Is the wind behind you or against you? These change your decisions — a wet pitch means parry wide, don't catch low drives; a sun in your eyes means come for fewer crosses.</p><p><strong>Warm-up:</strong> handling, footwork, a few crosses, a few shots, two or three kicks. Then <em>voice</em>: start talking in the warm-up. You should be organising the team before the game starts.</p>" },
      { name: "First five minutes", html: "<p>Get a touch early — a back pass, a catch, anything. Make your first decision a safe one. Say something to every defender by name in the first few minutes. Set the tone: you're switched on, calm, loud.</p>" },
      { name: "During", html: "<p>Scan constantly. Move on every pass. Talk in every defensive phase. One breath after every mistake, then the next job. Keep an eye on the clock and the score — the way you play at 1–0 up with ten minutes left is different from 0–0 at kick-off.</p>" },
      { name: "Half-time", html: "<p>Drink. One honest question to yourself: <em>what's happened in front of me that I could have changed with a call?</em> Tell the coach one thing you've seen about their attack. Tell the defence one thing you want from the second half.</p>" },
      { name: "After", html: "<p>Shake hands, no drama, win or lose. Then — same day, not next week — do the self-review below. It takes five minutes and it's the single most valuable thing you can do for your development.</p>" }
    ] },
    { type: "cards", title: "Reading the opposition", cols: 3, items: [
      { tag: "In the warm-up", title: "Watch their strikers", text: "Which foot? Do they shoot early or take a touch? Does their winger cross first-time or cut inside? You'll know more than your defenders do by kick-off." },
      { tag: "First ten minutes", title: "How do they attack?", text: "Over the top? Through the middle? Wide and cross? Once you see the pattern, tell your defence — 'they're going long, drop a yard', 'they're crossing, watch the back post'." },
      { tag: "Set pieces", title: "Where do they go?", text: "First corner: near post or far? Short or long? Remember it. The second one will probably be the same." }
    ] },
    { type: "review", id: "match-review", title: "Post-match self-review", intro: "Five minutes, same day. Honest. This is where the match turns into learning. Reviews are saved on this device.", prompts: [
      "Match, score, and what kind of game it was (fast, scrappy, one-sided, tight).",
      "Three moments I read well — what I saw, what I did.",
      "One moment I saw late — what cue I missed, and what I'd look for next time.",
      "Each goal we conceded (if any): where it came from, and the call or action that could have stopped it.",
      "My voice: what I organised well, and one call I should have made and didn't.",
      "With the ball: did I pick fast or slow correctly? Any giveaways?",
      "One thing to work on in training this week."
    ] }
  ]
});

// ───────────────────────────────────────────────────────────── 09 THE LADDER
S.push({
  id: "ladder", nav: "The Ladder", kicker: "Section 09", title: "The Ladder",
  lede: "Where you are, where you're going, and what the next rung looks like. Be honest about the level — the ladder only works if you are.",
  blocks: [
    { type: "ladder", title: "Game-understanding ladder", intro: "Mark the level you're at now. Come back in two months and check again.", levels: [
      { level: 1, name: "The shot-stopper", items: ["Reacts to shots; positioning is mostly instinct.", "Quiet during the game, talks only at set pieces.", "Decisions on crosses and through balls are hesitant.", "Distribution: kicks it long and hopes."] },
      { level: 2, name: "The positioner", items: ["Adjusts position on most passes; usually set when the shot comes.", "Calls 'Keeper's' and 'Away' consistently.", "Comes for crosses and through balls when it's clear; stays when it's not.", "Distribution: can pick short or long, sometimes rushes."] },
      { level: 3, name: "The reader", items: ["Sees runners and gaps early; rarely surprised.", "Gives shape calls — step, drop, tuck in — in every defensive phase.", "Commits to decisions early and fully; no no-man's-land.", "Distribution: reads fast vs slow correctly most of the time.", "Owns mistakes and can explain where goals came from."] },
      { level: 4, name: "The organiser", items: ["Runs the defence: names, instructions, confirmation, praise.", "Organises every set piece and stops the quick ones.", "Reads the opposition's patterns and tells the team.", "Manages game moments — after goals, late in matches, teammates' heads.", "Defenders trust his voice and look to him."] },
      { level: 5, name: "The controller", items: ["The team's shape is visibly better because of him.", "Prevents chances rather than saving shots — quiet matches by design.", "Starts attacks with intent; distribution is a weapon.", "Composed under every kind of pressure; teammates calm down because he's calm.", "Coaches and opponents notice him for his game understanding, not his saves."] }
    ] },
    { type: "prose", html: "<p>Most U13 keepers with good coaching are at level 2, moving towards 3. The whole point of this guide is level 3 to level 4 — the step from <em>reading</em> the game to <em>running</em> it. That step is mostly voice, and voice is mostly courage. Start small, start now.</p>" },
    { type: "quote", text: "The keeper who sees early just has to be in the right place.", attribution: "Section 01" },
    { type: "prose", html: "<h4>Where to go from here</h4><ul><li>Pick three calls from the Call Sheet. Use them in your next match until they're automatic.</li><li>Do the post-match review every match for a month. Read them back at the end of it.</li><li>Watch a professional keeper for a full match — not the highlights. Watch his feet when the ball is far away and watch how often he talks.</li><li>Ask your coach to tell you one thing per session about what you <em>saw</em>, not what you <em>did</em>.</li></ul>" }
  ]
});

window.PLAYBOOK = { meta: META, sections: S };
})();
