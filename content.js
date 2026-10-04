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

// ───────────────────────────────────────────────────────────── 02 READING THE GAME
S.push({
  id: "reading", nav: "Reading the Game", kicker: "Section 02", title: "Reading the Game",
  lede: "Danger has a shape, and it shows itself early. Your job is to spot the shape while there is still time to do something about it.",
  blocks: [
    { type: "prose", html: "<p>Most goals at your level are not unstoppable shots. They are a keeper or a defence that saw something half a second late: a runner nobody tracked, a cross nobody attacked, a keeper who set his feet after the shot was struck. Reading the game is the skill of seeing those moments <strong>before</strong> they happen.</p><p>It starts with one habit: <strong>scanning</strong>. Every time the ball travels, your eyes should do a quick loop — ball, nearest attacker, far-side runner, your own line — and come back to the ball. Two or three scans a minute when the ball is far away; constant when it is in your half.</p>" },
    { type: "cards", title: "The cues that arrive before the ball does", cols: 3, items: [
      { tag: "Body", title: "Hips and shoulders", text: "A player can only pass or shoot where his hips point. Open hips facing goal = shot or cross coming. Closed hips = he's turning back or playing sideways. Watch the hips, not the feet." },
      { tag: "Body", title: "The head", text: "A player looking up has a picture and is about to use it — expect a pass or a cross. A player looking down at the ball has no picture — pressure him, or expect a dribble." },
      { tag: "Ball", title: "The touch", text: "A heavy first touch means the player needs an extra step: time to close the angle or for a defender to step in. A clean touch into stride means he's ready to act now — be set." },
      { tag: "Ball", title: "Pass speed and height", text: "A slow, bobbling pass into the box is a chance to come and take it. A driven low pass across the box is a cut-back — expect a first-time shot from the second runner." },
      { tag: "Space", title: "Where the space is", text: "Before the ball moves, ask: if it goes to that space, who gets there first? If the answer is 'their player', the call to your defender must happen now." },
      { tag: "Space", title: "The far side", text: "The most dangerous player is usually the one furthest from the ball. Wingers ghosting in at the back post score more than strikers in the middle. Know where he is." }
    ] },
    { type: "phases", title: "The four phases of play — and what you do in each", items: [
      { name: "We have the ball (build-up)", where: "High and wide of your goal — often at or outside the edge of the box, offering a back-pass option.",
        see: "Which of our defenders is free? Where is their striker pressing from? Is there a safe pass if the ball comes back to me?",
        do: "Keep moving to give a clean angle for the back pass. Already know my next pass <em>before</em> I receive. Be the calm option, not the panic one.",
        say: "<em>\"Time\"</em> if the defender has it. <em>\"Man on\"</em> if he doesn't. <em>\"Keeper's here\"</em> to offer the pass back. Point where I want the ball played." },
      { name: "We lose the ball (transition to defend)", where: "Immediately drop and narrow — the first three seconds after losing the ball are the most dangerous in football.",
        see: "Who is the free runner? Is there a direct ball coming over the top? Is my line still high and now exposed?",
        do: "Sprint, don't jog, to my starting position. If the ball is going long and I can get there first — go. Otherwise get set early.",
        say: "<em>\"Drop!\"</em> or <em>\"Recover!\"</em> loud and once. Name the runner: <em>\"Thabo — runner, left!\"</em>" },
      { name: "They have the ball (organised defending)", where: "Starting position based on where the ball is: deeper and more central when it's far, higher and on the angle when it's close.",
        see: "The shape of my back line. Gaps between defenders. Who's marking who. Where the cross or shot will come from.",
        do: "Adjust on every pass. Stay on my toes. Be set at the moment the ball could be struck — not before, not after.",
        say: "Run the shape: <em>\"Step up\"</em>, <em>\"Hold\"</em>, <em>\"Squeeze\"</em>, <em>\"Tuck in\"</em>. Mark the danger: <em>\"Back post!\"</em>, <em>\"Second ball!\"</em>" },
      { name: "We win the ball (transition to attack)", where: "If I have it: ready to release fast. If a defender has it: moving to offer the outlet.",
        see: "Is the other team disorganised? Is there a fast forward in space? Or are they already set — meaning we should keep the ball and build?",
        do: "Decide in one touch: quick (throw or kick to the free player while they're unbalanced) or slow (keep possession, let the team move up).",
        say: "<em>\"Go, go!\"</em> if we have a counter. <em>\"Easy — keep it\"</em> if we don't. Name the target: <em>\"Lerato, wide!\"</em>" }
    ] },
    { type: "prose", html: "<h4>Triggers: the moments that demand a decision</h4><p>A trigger is a moment where the picture changes and you must act in the next second. Learn to recognise these and your reactions become anticipations.</p><ul><li><strong>Ball played over or behind your defence</strong> → sweep or set? (Section 04)</li><li><strong>Attacker's head goes up on the wing</strong> → cross is coming: position, call, and claim or hold.</li><li><strong>Defender takes a touch under pressure facing his own goal</strong> → back pass is coming: show for it and know where it's going next.</li><li><strong>Attacker gets side-on with the ball at his feet inside the box</strong> → shot or cut-back: set, and tell the defender to block.</li><li><strong>Our full-back goes forward and the ball is lost</strong> → the space he left is the danger: who fills it? Call it.</li></ul>" },
    { type: "vocab", title: "Words you'll hear — and should use", items: [
      { word: "Starting position", meaning: "Where you stand before the next action, based on where the ball is.", when: "All the time the ball is in play." },
      { word: "Set", meaning: "Feet shoulder-width, weight on the balls of the feet, hands ready, still — at the moment of the strike.", when: "Any time a shot could come." },
      { word: "Angle", meaning: "Your position on the line between the ball and the middle of the goal.", when: "Shot-stopping and 1v1s." },
      { word: "Depth", meaning: "How far off your line you are.", when: "Balancing shot-stopping against crosses and through balls." },
      { word: "Scan", meaning: "A quick look away from the ball to check positions.", when: "Every time the ball travels." },
      { word: "Second ball", meaning: "Where the ball goes after a header, block, or save.", when: "Crosses, set pieces, long balls." },
      { word: "Cut-back", meaning: "A pass pulled back from the by-line to a runner near the penalty spot.", when: "Attacker reaches the by-line." },
      { word: "Transition", meaning: "The few seconds after possession changes.", when: "Constantly — and it's where most goals start." },
      { word: "Sweeping", meaning: "Leaving your box to deal with a ball played behind the defence.", when: "High line, ball over the top." },
      { word: "Line", meaning: "Your defenders, as a unit. 'The line' is both where they stand and the shape they hold.", when: "Organising the defence." }
    ] }
  ]
});

// ───────────────────────────────────────────────────────────── 03 POSITIONING & ANGLES
S.push({
  id: "positioning", nav: "Positioning", kicker: "Section 03", title: "Positioning & Angles",
  lede: "A keeper in the right place makes hard saves look easy and never needs to make the spectacular ones. Positioning is the quietest skill and the most important.",
  blocks: [
    { type: "prose", html: "<p>Think of positioning as two separate questions you answer on every pass:</p><ol><li><strong>Angle</strong> — am I on the line between the ball and the centre of the goal?</li><li><strong>Depth</strong> — how far off my line should I be?</li></ol><p>Angle is nearly always the same answer: find the imaginary line from the ball to the middle of the goal and stand on it. Depth is the real decision, and it changes with where the ball is, who has it, and how far away your defenders are.</p>" },
    { type: "pitch", title: "Starting positions by ball location", intro: "Pick a scenario. Watch where the keeper stands relative to the ball, and read why. The green lines show the ball's view of each post — that is what you're trying to cover.", scenarios: [
      { id: "far", label: "Ball in their half", ball: { x: 50, y: 8 }, keeper: { x: 50, y: 52 }, note: "<strong>Far ball, high keeper.</strong> With the ball in the opposition half you should be at or near the edge of your box. Shots aren't a threat; balls over the top and through balls are. From here you can sweep and you're the outlet for a back pass. The mistake at this age is standing on the line 'just in case' — it's not caution, it's giving away 15 metres of your pitch." },
      { id: "centre", label: "Central, outside the box", ball: { x: 50, y: 30 }, keeper: { x: 50, y: 60 }, note: "<strong>Central ball, edge of the six-yard box.</strong> A shot is now possible but far. Be on the centre line, a couple of metres off your goal line — enough to narrow the angle, not so far that a chip or a lob beats you. Get set the moment a strike is possible." },
      { id: "wide", label: "Wide, outside the box", ball: { x: 12, y: 40 }, keeper: { x: 46, y: 63 }, note: "<strong>Wide ball: protect the near post, see the whole box.</strong> From out wide, the shot is a low threat and the cross is the real one. Stand just off the near post side of centre, open your body so you can see both the ball and the far-post runner. Too far towards the near post and the far-post cross beats you; too central and the near-post drive beats you. Find the balance and keep your feet moving." },
      { id: "byline", label: "Attacker at the by-line", ball: { x: 22, y: 64 }, keeper: { x: 42, y: 67 }, zone: [[36,58],[56,58],[56,69],[36,69]], note: "<strong>By-line: near post is yours, the cut-back is the team's.</strong> When the attacker reaches the by-line, nothing goes in at your near post — you take it. But the real danger is the pull-back to the penalty spot (the green zone). You can't cover both. Your call to a defender — <em>'Watch the cut-back!'</em> — covers what your body can't." },
      { id: "oneVone", label: "1v1, striker through", ball: { x: 50, y: 42 }, keeper: { x: 50, y: 56 }, note: "<strong>Striker through on goal.</strong> Narrow the angle early by coming forward <em>while the ball is travelling to him</em>. Then slow down and get big as he takes his touch. If his touch is heavy — go and take it. If it's close — stay big, stay patient, make him make the decision. Never dive early; a striker's first option is to wait for you to go down." },
      { id: "corner", label: "Corner kick", ball: { x: 2, y: 69 }, keeper: { x: 52, y: 66 }, zone: [[38,56],[66,56],[66,69],[38,69]], note: "<strong>Corner: own the six-yard box.</strong> Start slightly past the centre of the goal, towards the far post, on the line or a step off it — because a ball that goes over you is unstoppable, while a ball in front of you can still be attacked. The green zone is your territory; anything in it is yours to claim. Open your body so you see both the kicker and the runners." }
    ] },
    { type: "cards", title: "The three positioning errors every young keeper makes", cols: 3, items: [
      { title: "Standing on the line", text: "The line is a place to finish, not to start. Standing on it gives the shooter the full goal and takes away your ability to sweep. Start off it; only go to it for corners and when a shot is certain." },
      { title: "Setting too late", text: "If your feet are still moving when the ball is struck, you will dive from a bad base and go late. Set is a moment, not a place: it happens the instant the ball <em>could</em> be hit." },
      { title: "Following the ball, not the angle", text: "When the ball moves across the box, moving sideways on the line leaves you square to a ball that is now hitting from an angle. Move in an arc — forward as the ball comes central, back as it goes wide." }
    ] },
    { type: "prose", html: "<h4>Depth: the trade-off you're always managing</h4><p>Further off your line = better angle against shots and better chance to sweep, but more exposed to chips and lobs and later to crosses. Closer to your line = safer against the lob and the cross, but the shooter sees more goal and the through-ball becomes your defender's problem alone.</p><p>At U13 the common mistake is being too deep, not too high. Most strikers can't reliably chip or lob from distance, and most dangerous moments are balls behind the defence. Err towards being higher, especially when the ball is far away — and work back towards your goal as the ball comes closer.</p>" },
    { type: "callout", title: "The arc", html: "<p>Picture a curved line from one post, out to about the penalty spot, and back to the other post. As the ball moves across the pitch, you move along that arc, always on the ball-to-centre-of-goal line. Central ball = top of the arc, furthest out. Wide ball = down near the post. Moving along the arc keeps your angle right without you having to think about it.</p>" },
    { type: "quiz", title: "Positioning check", intro: "Read the situation, pick the best answer. There's a good reason behind every option — including the wrong ones.", items: [
      { situation: "The ball is with their centre-back on the halfway line. Your defenders are holding a line around the edge of your box. Where are you?", options: [
        { text: "On my goal line, in case of a long shot.", correct: false, feedback: "A shot from halfway is not a threat; a ball over the top is. On the line you can't deal with it." },
        { text: "At the edge of the box, central, ready to sweep.", correct: true, feedback: "Yes. High, central, on your toes. You're covering the space behind your line and offering an outlet." },
        { text: "On the penalty spot, set for a shot.", correct: false, feedback: "Being set is wasted here — nothing can be struck. Use the moment to get higher and scan." }
      ] },
      { situation: "A winger has the ball wide on the left, level with the edge of the 18-yard box. His head is up.", options: [
        { text: "Go to the near post and stand on the line.", correct: false, feedback: "That protects the near post but you'll be flat-footed and blind to the far-post runner. You need to see the whole box." },
        { text: "Stay central on the goal line.", correct: false, feedback: "Central and deep gives him a near-post drive and leaves you unable to attack the cross." },
        { text: "Near-post side of centre, a step off the line, body open to see ball and box; call the back-post runner.", correct: true, feedback: "Right. Cover the near post with position, cover the far post with your voice, and be ready to attack the cross." }
      ] },
      { situation: "The ball is passed across the top of your box from left to right. Where should you move?", options: [
        { text: "Slide sideways along the goal line.", correct: false, feedback: "That leaves you square to a ball that now comes from an angle, and probably with your feet still moving when it's hit." },
        { text: "In an arc — come forward as it passes the centre, drop slightly as it goes wide.", correct: true, feedback: "Exactly. Stay on the ball-to-centre line the whole way, and set the moment a strike becomes possible." },
        { text: "Stay still — moving will unbalance you.", correct: false, feedback: "If you don't move, the shooter on the right has half an open goal. Move early, then set." }
      ] },
      { situation: "A long ball is lifted over your defence towards the penalty spot. Your defender and their striker are both chasing it. You think you'd get there at about the same time as the striker.", options: [
        { text: "Go — commit to it fully and claim or clear.", correct: false, feedback: "'About the same time' is not enough. If he gets there first you're out of your goal with an open net behind you." },
        { text: "Stay on the line.", correct: false, feedback: "Too passive — now the striker has a free touch and you've given him the whole goal." },
        { text: "Come forward to narrow the angle, call 'Keeper's!' only if you're sure, and get set big as he reaches it.", correct: true, feedback: "Yes. Make him beat you from close range with a keeper who's big and set, not with an empty goal. And your defender may still get a block in." }
      ] }
    ] }
  ]
});

// ───────────────────────────────────────────────────────────── 04 DECISIONS
S.push({
  id: "decisions", nav: "Big Decisions", kicker: "Section 04", title: "The Big Decisions",
  lede: "Come or stay. Catch or punch. Go or wait. These moments decide matches, and each one has a logic you can learn. The goal is to make them early, make them once, and make them fully.",
  blocks: [
    { type: "prose", html: "<p>Every one of these decisions has the same rule underneath it: <strong>a committed decision beats a perfect one made late.</strong> Keepers get caught in no-man's-land not because they chose wrong, but because they didn't choose. Learn the logic, then trust it in the moment.</p>" },
    { type: "tree", title: "Come or stay? — the ball behind the defence", intro: "A ball is played over or through your defence. Walk the decision.", root: {
      q: "Will you get to the ball clearly before the attacker?", options: [
        { label: "Yes — clearly first", next: {
          q: "Is it inside your box?", options: [
            { label: "Yes", result: "Go and take it. Catch it high if it's in the air, or gather it cleanly. Call 'KEEPER'S!' early and loud so your defender pulls out.", why: "You're first and you can use your hands. There's nothing to think about — the only danger is a defender who didn't hear you." },
            { label: "No — outside the box", result: "Go — and clear it first time with your feet (or head) into a safe area: wide and high, or to a teammate if it's genuinely easy. Don't take a touch.", why: "You're a sweeper now. One clean contact removes the danger. A touch invites the striker to close you down with no hands to save you." }
          ] } },
        { label: "It's close — maybe 50/50", next: {
          q: "Is the attacker running straight at your goal, or across it?", options: [
            { label: "Straight at goal", result: "Don't gamble. Come forward while the ball travels to narrow the angle, then get BIG and SET as he takes his touch. Make him beat you.", why: "A 50/50 you lose means an empty net. A 1v1 where you're big and patient is a save you make most of the time — strikers at this age miss far more than they score." },
            { label: "Across goal / wide", result: "Stay and hold your angle. Follow him along the arc, stay near-post side, and let your recovering defender do the work. Call 'SHOW HIM WIDE!'", why: "A striker running across goal is losing his angle every step. The defender can pressure him from behind; your job is to deny the near post and wait for the mistake." }
          ] } },
        { label: "No — he gets there first", next: {
          q: "Is he inside the box?", options: [
            { label: "Yes", result: "Get set, get big, and stay on your feet as long as possible. Position on the ball-to-centre line, a step or two off your line.", why: "He has the ball; the save is now a 1v1. The worst thing you can do is go down early — it's the one thing he wants. Stay up and make him choose." },
            { label: "No — still outside", result: "Hold the edge of your six-yard box, set, and call the defender back in behind him: 'RECOVER! GOAL SIDE!'", why: "He still has to beat you from distance or carry it closer. Every second you stay patient, your defenders are closing. Don't go to him." }
          ] } }
      ] } },
    { type: "tree", title: "Catch, punch, or stay? — the cross", intro: "A cross is coming into your box. Walk the decision.", root: {
      q: "Can you get to the ball at its highest point, with your hands, with a clear path?", options: [
        { label: "Yes — I can catch it clean", result: "Go and CATCH. Call 'KEEPER'S!' before you move, attack the ball, take it at the top of your jump with your knee up for protection.", why: "A catch ends the attack completely — no second ball, no corner, and you now start the counter. It's always first choice when it's on." },
        { label: "I can get there but it's crowded", next: {
          q: "Is it crowded with bodies in your path, or is it just a tight contest at the ball?", options: [
            { label: "Bodies in my path", result: "PUNCH — two fists if you can get square, one fist if you're stretching. Aim high, wide and long. Then react to the second ball.", why: "In traffic, a catch that gets knocked loose is a tap-in. A good punch gets the ball out of the danger zone and lets you reset." },
            { label: "Tight contest, one attacker", result: "Attack it with a CATCH, but be ready to turn it into a punch at the last moment if he gets a touch first.", why: "One-on-one for a ball in the air, the keeper's hands win. Go with intent — the hesitant keeper is the one who gets beaten." }
          ] } },
        { label: "No — it's going beyond me or will drop before I get there", result: "STAY. Get set on your line, near-post side of the ball-to-centre line, and call the defender onto the runner: 'BACK POST — PICK HIM UP!'", why: "A keeper stuck under a cross he can't reach is the easiest goal in football. If you can't get there, make the header have to beat a set keeper, and use your voice to get a body on the runner." }
      ] } },
    { type: "tree", title: "What do I do with the ball? — distribution", intro: "You've got the ball in your hands or at your feet. Walk the decision.", root: {
      q: "Did we just win it — are they unbalanced right now?", options: [
        { label: "Yes — they're disorganised", next: {
          q: "Is there a teammate in space ahead who can be found quickly?", options: [
            { label: "Yes", result: "Release FAST. Throw if he's within range (it's quicker and more accurate), kick if he's beyond it. One look, one action.", why: "Transition is where cheap goals are scored — for both teams. A fast, accurate release while they're still turning is the most dangerous thing you can do." },
            { label: "No — everyone's covered", result: "Slow it down. Keep it, let the team push up, then play short to a free defender or a full-back.", why: "A rushed long ball into a covered area just gives possession back when they're already ahead of the ball." }
          ] } },
        { label: "No — it's a normal restart", next: {
          q: "Are they pressing high, with strikers close to your defenders?", options: [
            { label: "Yes — pressing high", result: "Look long, over the press, to the space behind their strikers — or to a target player who can hold it. Don't play short into a trap.", why: "A high press leaves space behind it. Beating it with one kick turns their aggression into your chance. Short passing into a press is how keepers give goals away." },
            { label: "No — they've dropped off", result: "Play short to a centre-back or full-back and build. Move to offer the return pass immediately.", why: "No pressure means no reason to gamble. Keep the ball, keep the shape, and move up the pitch together." }
          ] } }
      ] } },
    { type: "cards", title: "Decisions in one line", cols: 2, items: [
      { tag: "Rule", title: "Decide while the ball is travelling", text: "The time to choose is while the pass is in the air, not after it lands. Use the flight of the ball to make up your mind and start moving." },
      { tag: "Rule", title: "Say it, then do it", text: "A loud call before you act does two things: it tells your defenders what's happening and it commits you. A silent keeper is a hesitant keeper." },
      { tag: "Rule", title: "Catch > Punch > Parry", text: "Keep the ball if you can. Clear it if you can't. Push it away only as a last resort — and then push it wide, never back into the middle." },
      { tag: "Rule", title: "Stay up in 1v1s", text: "The striker's first plan is to wait for you to go down. Stay big, stay patient, and make him do something. Most of them can't." },
      { tag: "Rule", title: "Fast if they're broken, slow if they're set", text: "Distribution is a tactical choice, not a reflex. Look up once: if they're disorganised, go fast. If they're organised, keep it." },
      { tag: "Rule", title: "If you go, go all the way", text: "Once you've decided to come for a ball — through, over, or crossed — commit completely. Stopping halfway is the only decision that's always wrong." }
    ] },
    { type: "quiz", title: "Decision check", intro: "Twelve match situations. Choose, then read the reasoning — the reasons matter more than the score.", items: [
      { situation: "A long ball is played over your defence. You're clearly going to get there first, about five metres outside your box.", options: [
        { text: "Wait on the edge of the box and let the defender deal with it.", correct: false, feedback: "Your defender is behind the striker. Waiting makes it a race the striker wins." },
        { text: "Sprint out and clear it first time, high and wide.", correct: true, feedback: "Yes. You're the sweeper. One clean contact, no touch, danger over." },
        { text: "Sprint out, take a touch to control it, then pick a pass.", correct: false, feedback: "A touch gives the striker time to close you down with no hands to save you. Clear first time." }
      ] },
      { situation: "A striker is clean through, running straight at goal, ball under control. You're on your line.", options: [
        { text: "Stay on the line and dive when he shoots.", correct: false, feedback: "From the line he sees the whole goal. You have to narrow it." },
        { text: "Rush out and slide at his feet.", correct: false, feedback: "He has the ball under control — he'll go round you or chip you. Sliding is for when his touch is loose." },
        { text: "Come forward while he's running, then slow, get big, and set as he gets ready to shoot.", correct: true, feedback: "Right. Narrow the angle early, then make him beat a big, set keeper. Patience wins most 1v1s." }
      ] },
      { situation: "A cross is coming from the left. You could reach it, but there are three bodies between you and the ball.", options: [
        { text: "Go through them and try to catch it.", correct: false, feedback: "In traffic a catch becomes a drop becomes a tap-in. Punch." },
        { text: "Punch it high and wide with two fists, then react.", correct: true, feedback: "Yes. Get it out of the danger zone and reset." },
        { text: "Stay on the line and wait for the header.", correct: false, feedback: "You can reach it — a reachable cross you don't attack is an invitation." }
      ] },
      { situation: "A cross is coming from the right and is going to land at the far post, beyond you. A winger is arriving unmarked.", options: [
        { text: "Charge across and try to get there.", correct: false, feedback: "You won't make it, and now you're off your line and out of position for the header." },
        { text: "Stay near-post side, set, and shout for a defender to pick up the back post.", correct: true, feedback: "Right. Make the header beat a set keeper, and use your voice to get a body on the runner. Next time, call it before the cross." },
        { text: "Go to the far post early to cover the header.", correct: false, feedback: "Then the near post is open and the cross changes. Position on the ball, cover the runner with your voice." }
      ] },
      { situation: "You've just caught a cross. You look up and see their whole team has pushed forward — your winger is alone near the halfway line.", options: [
        { text: "Hold it, calm everyone down, and play short.", correct: false, feedback: "You've just been handed a counter-attack. Playing slow throws it away." },
        { text: "Throw or kick it quickly and accurately to the winger in space.", correct: true, feedback: "Yes. They're unbalanced — go fast while they're still turning." },
        { text: "Kick it as far as you can downfield.", correct: false, feedback: "Distance isn't the point. Accuracy is. A hopeful hoof becomes their possession." }
      ] },
      { situation: "Goal kick. Their two strikers are pressing high, standing close to your centre-backs.", options: [
        { text: "Play short to the centre-back as usual.", correct: false, feedback: "That's exactly what the press wants. A lost ball there is a shot on goal." },
        { text: "Go long over the press into the space behind their strikers, or to a target player.", correct: true, feedback: "Right. A high press leaves space behind it. Make them pay for it." },
        { text: "Wait until they get bored and drop off.", correct: false, feedback: "You'll run out of time and have to rush. Decide and act." }
      ] },
      { situation: "A back pass comes to you, slightly slow. Their striker is sprinting at you from your left.", options: [
        { text: "Take a touch to control, then look for a pass.", correct: false, feedback: "Touch under pressure is how keepers get robbed. First time, away from the pressure." },
        { text: "Play it first time with your right foot, away from the striker, to the full-back on the right.", correct: true, feedback: "Yes. First time, away from the pressure, to a safe side. Know this before the ball arrives." },
        { text: "Pick it up.", correct: false, feedback: "Deliberate back pass — you can't use your hands. That's an indirect free kick in your box." }
      ] },
      { situation: "A shot from distance is hit low and hard to your left. You can save it but not hold it.", options: [
        { text: "Parry it back out in front of goal.", correct: false, feedback: "Into the middle is where the strikers are. Never push a save back into the danger zone." },
        { text: "Parry it wide, away from goal, towards the corner flag.", correct: true, feedback: "Right. Wide and away. A corner is a far better outcome than a rebound." },
        { text: "Try to catch it anyway.", correct: false, feedback: "If you can't hold it, trying to catch means a spill in the worst place. Push it wide with intent." }
      ] },
      { situation: "A striker gets the ball side-on in the box, a defender close behind him. He's shaping to shoot across you, or to cut it back.", options: [
        { text: "Dive early across goal to cover the far corner.", correct: false, feedback: "Going early is what he's waiting for. Stay up." },
        { text: "Set, stay big, cover the near post with position, and tell the defender 'BLOCK — DON'T DIVE IN!'", correct: true, feedback: "Yes. Make him beat a set keeper; let the defender's pressure do the rest. A diving defender gives him the choice." },
        { text: "Rush him.", correct: false, feedback: "He has the ball under control with a defender arriving. Rushing takes away the defender's chance to block." }
      ] },
      { situation: "A ball is lifted into your box. It will drop around the penalty spot. You and a defender both go for it, and he hasn't heard you.", options: [
        { text: "Stop and let him head it.", correct: false, feedback: "Half-stopping is the worst option. Either you called early and you go, or you let him have it clearly — and you call that too." },
        { text: "Go anyway and hope.", correct: false, feedback: "A collision with your own defender in your own box ends badly. The problem was the call, not the decision." },
        { text: "Shout 'AWAY!' clearly so he knows to clear it, and get set behind him.", correct: true, feedback: "Right in the moment — fix it with a clear call and get ready for the second ball. The lesson: call 'KEEPER'S!' earlier next time, before you move." }
      ] },
      { situation: "You've just made a save and the ball is loose in the six-yard box. Two attackers are reacting.", options: [
        { text: "Get up and set for the second shot.", correct: false, feedback: "A loose ball in the six-yard box is yours. Getting set is for when you can't reach it." },
        { text: "Dive on it with your hands and body, protecting your head.", correct: true, feedback: "Yes. Smother it. Body behind the ball, hands around it, head tucked. End the attack." },
        { text: "Kick it clear from the ground.", correct: false, feedback: "A rushed kick from the ground is a gift to the second attacker. Use your hands — you're the only one who can." }
      ] },
      { situation: "You've got the ball in your hands. Their team is fully organised, everyone back. No quick options.", options: [
        { text: "Launch it long for the striker to chase.", correct: false, feedback: "Into an organised defence, that's a coin flip at best. Keep the ball." },
        { text: "Roll it to a free full-back and move to offer the return pass.", correct: true, feedback: "Right. No pressure means no reason to gamble. Keep it and build together." },
        { text: "Hold it for six seconds to let everyone rest.", correct: false, feedback: "Waiting doesn't improve anything. Decide and play." }
      ] }
    ] }
  ]
});

// ───────────────────────────────────────────────────────────── 05 WITH THE BALL
S.push({
  id: "ball", nav: "With the Ball", kicker: "Section 05", title: "With the Ball",
  lede: "Modern keepers start attacks. Every time you have the ball is a decision about the next five seconds of the match — and you're the one who gets to make it.",
  blocks: [
    { type: "prose", html: "<p>You touch the ball more than most people think — every goal kick, every save, every back pass. Each of those is a chance to either give the ball away or start something. Keepers who treat distribution as an afterthought leak possession; keepers who treat it as a weapon make their team better.</p><p>Two principles cover almost everything: <strong>know your next action before you receive</strong>, and <strong>fast if they're broken, slow if they're set</strong>.</p>" },
    { type: "tabs", title: "The tools and when to use them", items: [
      { name: "Roll / bowl", html: "<p><strong>Short distance, maximum accuracy.</strong> To a full-back or centre-back who has space and time. Keep it on the ground, into his path, to his far foot so he can play forward. Use it when they've dropped off and we're building.</p><p>Follow it: move immediately to give him a return pass.</p>" },
      { name: "Throw (javelin / overarm)", html: "<p><strong>Medium distance, fast and precise.</strong> To a winger or midfielder in space, especially on a counter. Faster and more accurate than a kick to the same spot. Aim for his feet or a yard in front, on the side away from the nearest opponent.</p><p>This is the counter-attack weapon: catch, one look, throw.</p>" },
      { name: "Side volley / half-volley", html: "<p><strong>Long distance from your hands, lower trajectory.</strong> Reaches a target player quickly over a press. Choose a target, not a direction — a long ball to no one is a turnover.</p>" },
      { name: "Goal kick — short", html: "<p>Default when they're not pressing. To a centre-back who's split wide or a full-back. You immediately become an option again: step to the side, show for the ball.</p><p>If their striker starts to press the receiver, your call is <em>\"man on — back to me\"</em> or <em>\"turn — time\"</em>. You see it before he does.</p>" },
      { name: "Goal kick — long", html: "<p>When they press high, or when we have a clear aerial target and want to play in their half. Aim at a zone where our player can win it or a teammate can pick up the second ball. Tell them: <em>\"long — second ball!\"</em></p>" },
      { name: "Back pass with feet", html: "<p>The one that gets keepers in trouble. Rules: know where the pressure is before the ball arrives; receive on the foot away from pressure; play first time if a striker is closing; never dribble past a striker in your own box. If in doubt, clear it high and wide — ugly and safe beats pretty and risky.</p>" }
    ] },
    { type: "cards", title: "Reading the picture before you release", cols: 3, items: [
      { title: "Who's free?", text: "Scan while the ball comes to you. By the time it's in your hands you should already have a target." },
      { title: "Are they broken?", text: "If the other team is still turning, go now — fast and direct. If they're organised, keep the ball." },
      { title: "Where's the danger?", text: "Never play a pass that puts a teammate under pressure facing his own goal in our third. If the safe pass isn't on, go long." }
    ] },
    { type: "callout", title: "The six-second rule is a budget, not a deadline", html: "<p>You have six seconds with the ball in your hands. Use them. One good look is worth more than a rushed throw, but every second you hold it, the other team gets more organised. Make the picture, make the decision, go.</p>" },
    { type: "checklist", id: "ball-habits", title: "Distribution habits", items: [
      "I know who I'm playing to before the ball reaches me.",
      "After every short pass I move to offer the return.",
      "I can throw accurately to a moving target past the edge of the box.",
      "On a back pass under pressure, I play first time with the foot away from the striker.",
      "I tell the receiver what's behind him: 'time', 'man on', 'turn'."
    ] }
  ]
});

// ───────────────────────────────────────────────────────────── 06 ORGANISING THE TEAM
S.push({
  id: "organising", nav: "Running the Team", kicker: "Section 06", title: "Running the Team",
  lede: "You see everything. Nobody else on the pitch does. A keeper who turns what he sees into clear instructions prevents more goals than any keeper who just saves shots. This is the section that raises your bar.",
  blocks: [
    { type: "prose", html: "<p>Here's the thing most young keepers don't realise: the defenders in front of you are often guessing. They have their back to the goal, an attacker in their face, and no idea where the runner behind them is. <strong>You know.</strong> You can see the runner, the gap in the line, the winger ghosting into the back post, the full-back who's been dragged out. If you say nothing, that knowledge is worthless. If you say the right thing early, the danger never becomes a shot.</p><p>Organising is a skill with technique, exactly like diving. It has a method, it can be practised, and at your age it is the single biggest thing that separates keepers who get noticed from keepers who don't.</p>" },
    { type: "loop", title: "How a good instruction works", steps: [
      { name: "Name", text: "Who it's for. 'Thabo —'. A call without a name is noise; everyone assumes it's for someone else." },
      { name: "Instruction", text: "One verb. 'Step.' 'Drop.' 'Tight.' 'Tuck in.' Not a paragraph — a word they can act on without thinking." },
      { name: "Direction", text: "Where, if it isn't obvious. 'Left shoulder.' 'Back post.' 'Behind you.'" },
      { name: "Confirm", text: "Did they do it? If yes, 'Good.' If no, say it again louder. Then move on — don't nag." }
    ] },
    { type: "cards", title: "The rules of a voice people follow", cols: 2, items: [
      { tag: "Timing", title: "Early beats loud", text: "A whisper at the right moment beats a scream too late. The instruction must arrive before the problem does — when you see the shape forming, not when the ball is already in the space." },
      { tag: "Tone", title: "Calm, clear, certain", text: "Shouting in panic makes everyone panic. A short, confident instruction makes everyone confident. Your voice sets the temperature of the whole defence." },
      { tag: "Content", title: "Instruct, never complain", text: "'Why didn't you track him?!' changes nothing. 'Next one — go with the runner.' changes the next one. Fix the future, not the past." },
      { tag: "Volume", title: "Constant, not constant shouting", text: "Be talking the whole time they're attacking, in short bursts. Save the loud voice for the three calls that matter most: 'Keeper's!', 'Away!', and the one that stops a goal." },
      { tag: "Ownership", title: "Praise is an instruction too", text: "'Good, Sipho — again.' tells him what to keep doing. Defenders work harder for a keeper who notices." },
      { tag: "Credibility", title: "Earn it with your own play", text: "They follow the voice of a keeper who is sure and who takes responsibility. Call it, do it, own it — and they'll trust you with the next one." }
    ] },
    { type: "calls", title: "The Call Sheet — what you see, what you say", intro: "The core of this guide. Each row is a specific thing you can observe, the instruction it needs, the exact words, and why it works. Filter by situation. Learn the ones that happen most in your matches first; the rest come with time.", groups: [
      { name: "Defensive shape", items: [
        { see: "Our defensive line is deeper than it needs to be — the ball is far away and there's a big gap between our defence and midfield.", say: "Push the line up. Call the line as one unit, then confirm.", words: ["Step up!", "Line — up!", "Squeeze!"], why: "A deep line gives the opposition free space in front of it, invites shots from the edge of the box, and makes it impossible for your midfield to press. Compressing the space means they have nowhere to play — and you're behind the line to sweep if they go long." },
        { see: "The ball is about to be played in behind — a player has his head up and a runner is going.", say: "Drop the line immediately, and name the runner.", words: ["Drop!", "Drop, drop!", "Runner — left!"], why: "Once a ball over the top is coming, a high line is a liability. The call needs to come as the passer's head goes up, not as the ball is kicked. A second's warning is the difference between a defender who's turned and running and one who's flat-footed." },
        { see: "A gap has opened between two of our central defenders.", say: "Tell them to close it, naming the one who should move.", words: ["Tighten!", "Tuck in, Musa!", "Close the gap!"], why: "A through ball is only dangerous if there's a gap for it to go through. Defenders can't see the gap beside them; you can see it from behind. Point at it as you say it." },
        { see: "One defender is much deeper than the rest — he's playing everyone onside.", say: "Bring him up to the line. Name him.", words: ["Josh — up!", "Hold the line!", "Level up!"], why: "One deep defender cancels the whole line's offside shape and leaves a striker free. He can't see he's out of line — he's looking at the ball. You can." },
        { see: "Our full-back has gone forward and the ball has been lost — the space he left is open.", say: "Get the nearest player to fill the space, and tell the full-back to recover.", words: ["Cover left!", "Slide across!", "Recover, Lerato!"], why: "The first five seconds after losing the ball are when most goals start. Naming the space and the player to fill it closes the door before the opposition can go through it." },
        { see: "The ball is wide and our far-side defenders have drifted towards it, leaving the far side open.", say: "Pull them back across to balance the shape.", words: ["Tuck in!", "Balance!", "Far side — stay!"], why: "Ball-watching drags the whole line towards the ball. A switch of play then finds a free man. Your call keeps the shape when their eyes can't." },
        { see: "The ball is deep in their half and our team is sitting back — everyone's tired or nervous.", say: "Push the whole team out. Set the tone.", words: ["Out! Out!", "Push on!", "Up together!"], why: "Dropping deep when you don't need to invites pressure that wasn't there. You're the one player who can see the team's shape; use that to keep them brave." }
      ] },
      { name: "Marking & runners", items: [
        { see: "A winger or midfielder is drifting towards the back post and nobody has seen him.", say: "Name a defender and give him the man.", words: ["Back post!", "Musa — back post, yours!", "Runner — far side!"], why: "The back-post runner is the most common unseen goal at youth level. Defenders are watching the ball; the runner is arriving from behind them. You are the only one with the angle to see both." },
        { see: "A striker is making a run between two defenders and neither has picked him up.", say: "Pick one defender and give him the striker. Say the side.", words: ["Go with him!", "Thabo — he's yours!", "Track the run!"], why: "'Someone get him' means nobody gets him. One name, one man. If both go, there's a gap; if neither, there's a goal." },
        { see: "A defender has let his man go so he can watch the ball — the man is free behind him.", say: "Warn the defender his man is behind him.", words: ["Man behind!", "Check your shoulder!", "He's on your back!"], why: "Defenders need to know where their man is without turning their head. You're their eyes behind them." },
        { see: "An attacker has pulled off into space on the edge of the box, in a shooting position, and nobody's stepped to him.", say: "Get a midfielder or defender to close him down.", words: ["Edge — press!", "Close him!", "Nobody free there!"], why: "Shots from the edge of the box beat keepers because they're unexpected and unpressured. A player stepping even half a yard towards the shooter changes the shot." },
        { see: "We're defending a corner or free kick and a player is unmarked in the box.", say: "Point him out and assign him before the kick is taken.", words: ["Who's got him?", "Sipho — number nine!", "Pick up — now!"], why: "Set pieces give you time to organise. Use all of it. No kick should be taken while one of their players is standing free in your box." }
      ] },
      { name: "The ball carrier", items: [
        { see: "An attacker has the ball and is facing goal, and our defender is standing off — too far away to affect a shot.", say: "Tell the defender to get closer.", words: ["Tight!", "Get tight!", "Press him!"], why: "A striker with time picks his spot. A striker with a defender in his face has to rush. 'Tight' is the most useful single word a keeper has." },
        { see: "A defender is about to dive into a tackle on a player who's not yet dangerous — a tackle that, if missed, leaves him clean through.", say: "Tell him to stay on his feet.", words: ["Stay up!", "Don't dive in!", "Delay!"], why: "A missed tackle in the wrong place is a goal. A defender who stays on his feet and slows the attacker gives teammates time to recover and you time to set." },
        { see: "An attacker is running at our defender in a 1v1 and looking to cut inside onto his strong foot.", say: "Tell the defender which way to show him.", words: ["Show him wide!", "Outside!", "Don't let him in!"], why: "Forcing the attacker away from goal, towards the touchline, turns a dangerous moment into a cross you can deal with. Forcing him inside makes it a shot. You can see which foot he wants." },
        { see: "An attacker has the ball out wide, head up, and is about to cross.", say: "Get the defender to block the cross, then organise the box.", words: ["No cross!", "Block it!", "Stand up — cross coming!"], why: "A blocked cross is a corner at worst. An unblocked cross is a header on your goal. The defender can't block if he's three yards away; the call pulls him in." },
        { see: "A striker is about to shoot and our defender is between us but not close enough to block — he's in my line of sight.", say: "Get him out of the way or on the ball — not in between.", words: ["Clear!", "Out of the way!", "Block or move!"], why: "A defender who doesn't block but blocks your view is worse than no defender. Half-blocks deflect balls past keepers more often than clean shots beat them." }
      ] },
      { name: "Crosses & aerial balls", items: [
        { see: "A cross or high ball is coming and I'm going to take it.", say: "Call it before you move, loud and once.", words: ["KEEPER'S!", "Mine!"], why: "The loudest call you ever make. It tells defenders to pull out and attackers that you're coming. A late or quiet call means a collision with your own defender — that's a goal and sometimes an injury." },
        { see: "A cross or high ball is coming and I'm not going to reach it.", say: "Tell the nearest defender to deal with it — and where to put it.", words: ["AWAY!", "Head it — away!", "Clear it — wide!"], why: "Defenders need to know you're not coming so they commit. 'Away' means out of the danger zone, high and wide, not back into the middle." },
        { see: "The cross has been cleared but only to the edge of the box — an attacker is arriving for the second ball.", say: "Point out the second ball before it lands.", words: ["Second ball!", "Edge — close!", "Press the edge!"], why: "Most goals from crosses aren't headers; they're the shot from the half-cleared ball nobody picked up. You see where the clearance is landing before anyone else." },
        { see: "A long ball is coming towards our defender and the striker is going to challenge him in the air.", say: "Tell the defender what's behind him and that you're covering.", words: ["Head it!", "Time — head it!", "I've got the drop!"], why: "A defender who knows a keeper is behind him attacks the ball harder. A defender who's unsure half-jumps and loses it." }
      ] },
      { name: "Set pieces", items: [
        { see: "We've conceded a corner.", say: "Set up before the kicker even places the ball — posts, zones, markers.", words: ["Two on the posts!", "Mark up — everyone!", "Zone the six!"], why: "Corners are the one time you can organise everything. Decide with your coach what your set-up is, then make it happen every time. Don't let the kick be taken until every man is accounted for." },
        { see: "A free kick is being set up within shooting range.", say: "Build the wall, position it, and then get to your own position.", words: ["Wall — four!", "Left! Stop! Hold!", "Nobody move!"], why: "The wall covers one side; you cover the other. The wall must be set from where you can see, and you must finish in a position where you can see the ball. A wall you can't see past is worse than no wall." },
        { see: "The free kick or corner is about to be taken quickly while we're still organising.", say: "Stop the kick — get bodies in front of the ball.", words: ["Stop it!", "Don't let him take it!", "Ten yards!"], why: "A quick kick while you're unorganised is how set pieces turn into goals. One player in front of the ball buys the time you need." },
        { see: "A throw-in deep in our half; their players are crowding the touchline area.", say: "Mark up as if it's a corner, watch the long throw.", words: ["Mark up — throw!", "Watch the long one!", "Someone on the thrower!"], why: "Long throws are set pieces. Teams that don't treat them that way concede from them." }
      ] },
      { name: "We have the ball", items: [
        { see: "A defender receives the ball with no opponent near him.", say: "Tell him he has time — and which way to go.", words: ["Time!", "Turn!", "Time — play forward!"], why: "Defenders with their back to the play don't know if they're under pressure. 'Time' lets them turn and play with their head up instead of panicking." },
        { see: "A defender is receiving the ball with an opponent closing fast behind him.", say: "Warn him and give him his out-ball.", words: ["Man on!", "Man on — back to me!", "One touch!"], why: "The ball you don't want is the one lost in your own third. 'Man on' plus a solution — 'back to me', 'wide', 'one touch' — turns a panic into a pass." },
        { see: "A defender has the ball and I want him to play it back to me because I can see a better picture.", say: "Offer yourself, clearly.", words: ["Keeper's here!", "Back to me!", "Give it!"], why: "You are the free man. If you can see a switch of play or a long ball that he can't, call for it and play it." },
        { see: "We've just won the ball and their team is out of shape.", say: "Tell the team to go, and where.", words: ["Go, go, go!", "Counter!", "Lerato's on — quick!"], why: "Transition moments last two or three seconds. The team needs someone who sees the whole picture to trigger the counter. That's you." },
        { see: "We've won the ball but they're already set — no quick option.", say: "Slow everyone down.", words: ["Easy!", "Keep it!", "No rush — build!"], why: "A hurried pass into a set defence is just giving it back. Your calm voice stops the team from forcing it." }
      ] },
      { name: "Game management", items: [
        { see: "We've just conceded.", say: "First instruction within five seconds. Reset the team.", words: ["Heads up — next one!", "Back to shape!", "Still in this — go!"], why: "The thirty seconds after a goal is when the next one is most likely. The team looks to you. If you're organising, they're organising." },
        { see: "We've just scored and our team is celebrating with half of them still in the opposition half.", say: "Get them back and organised before the kick-off.", words: ["Back in — reset!", "Concentrate!", "Kick-off — shape!"], why: "Goals straight after goals are shockingly common. Someone has to be the one who's already thinking about the next phase." },
        { see: "A teammate has made a mistake and his head has dropped.", say: "One line, immediate, forward-looking.", words: ["Next one, Josh!", "Forget it — go again!", "You're fine — on we go!"], why: "A defender thinking about his last mistake makes the next one. You can't fix the past; you can fix his head for the next thirty seconds." },
        { see: "We're winning late and the team is panicking, hoofing the ball away.", say: "Slow things down. Call for the ball. Set the tempo.", words: ["Calm!", "Back to me — easy!", "Keep the ball!"], why: "Panic defending gives the ball straight back. A keeper who demands the ball and takes a few seconds with it changes the mood of the whole team." },
        { see: "We're losing late and the team has gone flat.", say: "Lift them — specific and loud.", words: ["Push on — all of us!", "One goal — come on!", "Press from the front!"], why: "Energy is contagious and it starts from the back. Flat keeper, flat team." },
        { see: "An opponent is trying to wind up one of our players, or an argument is starting.", say: "Pull your player out of it.", words: ["Leave it!", "Walk away — next ball!", "Not worth it!"], why: "A booking or a sending-off loses matches. You're the calmest head on the pitch — or you need to be." }
      ] }
    ] },
    { type: "prose", html: "<h4>Building the habit</h4><p>You won't learn thirty calls at once. Pick <strong>three</strong> for your next match — probably <em>Keeper's!</em>, <em>Away!</em>, and <em>Step up!</em> — and use them every single time the situation comes up. When they're automatic, add <em>Tight!</em>, <em>Back post!</em> and <em>Man on!</em>. Then the shape calls. Within a season, the whole sheet becomes instinct.</p><p>Say the calls out loud in training too, even in drills, even when they feel unnecessary. The voice is a muscle.</p>" },
    { type: "callout", title: "If you're not sure what to say", html: "<p>Say where the danger is. <em>'Runner, left!'</em> <em>'Space behind!'</em> <em>'Edge of the box!'</em> You don't need the perfect instruction — you need to transfer what you can see to the people who can't. Information first, instruction when you've got it.</p>" },
    { type: "checklist", id: "organising-habits", title: "Organising habits", items: [
      "I call 'Keeper's!' or 'Away!' on every single high ball in my box — no silent ones.",
      "I say a defender's name before an instruction.",
      "I've given at least one shape call ('step', 'drop', 'tuck in') in every defensive phase.",
      "I organise every corner and free kick before the kick is taken — and I stop the quick ones.",
      "After a mistake by a defender, my first words to him are about the next ball, not the last one.",
      "I'm the first voice after we concede."
    ] }
  ]
});

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
