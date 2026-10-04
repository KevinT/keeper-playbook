// ───────────────────────────────────────────────────────────── 09 MATCH DAY
S.push({
  id: "matchday", nav: "Match Day", kicker: "Section 09", title: "Match Day",
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

// ───────────────────────────────────────────────────────────── 10 THE LADDER
S.push({
  id: "ladder", nav: "The Ladder", kicker: "Section 10", title: "The Ladder",
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
