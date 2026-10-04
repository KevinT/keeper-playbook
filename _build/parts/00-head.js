// Keeper Playbook — content. Built from parts in _build/parts/. Edit the parts, then run _build/build.py.
(function () {
var S = [];
var META = {
  title: "Keeper Playbook",
  headline: ["Read the game.", "Run the box."],
  tagline: "A gameplay and strategy guide for a goalkeeper who already has the technique — and wants to understand the game well enough to control it.",
  intro: "<p>You already train the position. This is about <strong>playing</strong> it: where to stand before anything happens, how to see the danger two passes early, when to come and when to stay, what to do with the ball, and — the biggest step at your age — how to run the players in front of you so the shot never comes.</p><p>Work through it in order the first time. After that, use it like a reference: the night before a match, after a game when something went wrong, or when a coach says a word you want to understand better.</p>"
};

S.push({ id: "home", nav: "Home", hero: true, kicker: "", title: "", lede: "", blocks: [] });

// ───────────────────────────────────────────────────────────── 01 THE KEEPER'S MIND
S.push({
  id: "mind", nav: "The Keeper's Mind", kicker: "Section 01", title: "The Keeper's Mind",
  lede: "Technique gets you into the team. Understanding keeps you there. The step you are taking now is from a keeper who stops shots to a keeper who changes what happens in front of him.",
  blocks: [
    { type: "prose", html: "<p>Up to now most of your development has been about the question <em>\"Can I do it?\"</em> — can I catch it, can I dive, can I kick it far. You can. The next question is harder and much more interesting: <em>\"Why am I doing it, and what should happen next?\"</em></p><p>At your level, the keepers who stand out are not always the ones with the best hands. They are the ones who are <strong>never surprised</strong>. They saw the cross before the winger did. They were already set when the shot came. They told the defender to step before the striker got the ball. That is not luck and it is not talent — it is reading the game, and it can be trained like any other skill.</p>" },
    { type: "loop", title: "The loop that runs every action", steps: [
      { name: "See", text: "What is actually happening? Ball, bodies, space, who is free." },
      { name: "Understand", text: "What does that mean? Where is the danger going to come from in the next two seconds?" },
      { name: "Decide & Execute", text: "Pick one action and commit to it fully. A half-decision is the only truly wrong one." },
      { name: "Review & Adapt", text: "Did it work? Why or why not? Adjust before the next one — not after the match." }
    ] },
    { type: "prose", html: "<p>This loop runs dozens of times every match, mostly when the ball is nowhere near you. The quality of your <strong>See</strong> and <strong>Understand</strong> decides the quality of everything else. A keeper who sees late has to be a superhero to stop the shot. A keeper who sees early just has to be in the right place.</p>" },
    { type: "cards", title: "Four things a thinking keeper does differently", cols: 2, items: [
      { tag: "Before", title: "Positions before the ball moves", text: "He adjusts on every pass, not on every shot. By the time the shot comes, the positioning is already done and all that is left is the save." },
      { tag: "During", title: "Reads intentions, not just the ball", text: "Where is the striker's head looking? Is his hip open to shoot or to pass? Is the winger's touch long or short? These cues arrive before the ball does." },
      { tag: "Around", title: "Controls the players in front of him", text: "He is the only player who sees the whole picture. Used well, that view is worth more than any save. See Section 06." },
      { tag: "After", title: "Owns every outcome", text: "Good or bad, he knows why it happened. No excuses, no hiding, no drama. 'I got that wrong, this is why, this is what I'll do next time.'" }
    ] },
    { type: "callout", title: "Confidence is a decision, not a feeling", html: "<p>Confidence does not arrive after a good save; it is what makes the good save possible. On the pitch it looks like this: chest open, chin up, voice early, moving to every ball with intent — even when you are nervous, even after a mistake. The body leads and the feeling follows. Your defenders read your body language constantly. If you look sure, they play sure.</p>" },
    { type: "prose", html: "<h4>Mistakes</h4><p>You will make them. Every keeper at every level does, and the position is designed so that yours are the visible ones. What separates keepers is the <strong>next ten seconds</strong>. The best keepers have a short, almost boring routine: one breath, one look at the next job (where is the ball, what is the restart), one instruction to the team. Then the mistake is over. It gets reviewed later, honestly, with a coach — not during the match in your own head.</p><p>A conceded goal is also information. Where did it come from? What did you see late? What could a call from you have stopped? That is a far better use of the walk back to your line than replaying the shot.</p>" },
    { type: "quote", text: "I am not just protecting the goal. I am influencing the team.", attribution: "The question that changes at this stage of a keeper's development" },
    { type: "checklist", id: "mind-habits", title: "Habits to build this season", intro: "Tick these as they become automatic, not when you've done them once.", items: [
      "I move my feet on every pass, even when the ball is in the other half.",
      "I say something useful to a defender at least once a minute when we are defending.",
      "I know where the nearest two opponents are before I receive a back pass.",
      "After a mistake I have one job: the next action. The review happens later.",
      "I can tell my coach after the match where each dangerous moment came from and what I saw."
    ] }
  ]
});
