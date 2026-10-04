// ───────────────────────────────────────────────────────────── 08 THE SIMULATOR (after Set Pieces)
// Coordinates: viewBox 0 0 100 70; our goal centred at (50,68). y small = far from our goal.
S.push({
  id: "simulator", nav: "Simulator", kicker: "Section 08", title: "The Simulator",
  lede: "Real pictures, real decisions, no clock — until you want one. Look at the positions, decide what you'd do, and read why. When the no-clock version feels easy, switch the pressure on. You set the level.",
  blocks: [
    { type: "prose", html: "<p>Each scenario is a freeze-frame of a match from above. White is us, red is them, green is you, the dashed line is where the ball is about to go. Some options are <strong>best</strong>, some are <strong>playable</strong>, some are <strong>poor</strong> — football usually has more than one right answer, but there's nearly always a best one.</p><p>Start with <em>No clock</em>. There is no prize for speed until the reads are right. Then come back and switch to <em>Calm</em>, <em>Pressure</em>, <em>Match speed</em> — the aim is that a decision you made slowly and correctly last week becomes one you make instantly this week.</p>" },
    { type: "sim", id: "sim-defend", title: "Defending — read the picture", intro: "Where is the danger, and what do you do about it?", scenarios: [
      { id: "d1", label: "Ball over the top", phase: "Transition", ball: { x: 50, y: 22 }, keeper: { x: 50, y: 56 },
        us: [{ x: 30, y: 36, n: "LB" }, { x: 44, y: 34, n: "CB" }, { x: 58, y: 35, n: "CB" }, { x: 70, y: 37, n: "RB" }],
        them: [{ x: 50, y: 22, n: "10" }, { x: 52, y: 32, n: "9" }, { x: 28, y: 30 }],
        arrow: { from: { x: 50, y: 22 }, to: { x: 52, y: 50 } },
        question: "Their 10 has just lifted a ball over your line towards the penalty spot. Their 9 is level with your centre-backs and sprinting. You'll reach it around the same time as he does.",
        options: [
          { text: "Sprint out and win it — commit now.", grade: "poor", feedback: "'Around the same time' isn't first. If he gets a toe to it you're off your line with an open net." },
          { text: "Come forward while it travels, then get big and set as he reaches it. Call 'Recover!' to the CBs.", grade: "best", feedback: "You narrow the angle without gambling, and the striker has to beat a set keeper from close range with defenders arriving. Most don't." },
          { text: "Stay on the line and get set for the shot.", grade: "poor", feedback: "From the line he sees the whole goal and has time to take a touch. Far too passive." }
        ] },
      { id: "d2", label: "Line too deep", phase: "They have the ball", ball: { x: 50, y: 12 }, keeper: { x: 50, y: 62 },
        us: [{ x: 28, y: 48, n: "LB" }, { x: 42, y: 50, n: "CB" }, { x: 58, y: 50, n: "CB" }, { x: 72, y: 48, n: "RB" }, { x: 50, y: 30, n: "CM" }],
        them: [{ x: 50, y: 12, n: "CB" }, { x: 40, y: 38, n: "10" }, { x: 62, y: 40, n: "9" }],
        question: "Their centre-back has the ball on the halfway line, nobody pressing him. Your back four is sitting near the edge of the box. Their 10 and 9 have 15 metres of free space in front of your defence.",
        options: [
          { text: "Nothing — the line is safe and deep, no one can get behind.", grade: "poor", feedback: "Nobody can get behind, but their 10 can receive, turn, and shoot from the edge of the box unpressured. The gap between your defence and midfield is the problem." },
          { text: "'Step up! Squeeze!' — push the line to the halfway side of the D, and get yourself higher too.", grade: "best", feedback: "Yes. Compress the space so their 10 and 9 have nowhere to receive. You move up with the line so you can sweep anything over the top." },
          { text: "'Tight!' — tell the CBs to go and mark the 10 and 9 man-to-man.", grade: "ok", feedback: "It deals with the two players, but it pulls your CBs out of the line and leaves holes. Moving the whole line is cleaner." }
        ] },
      { id: "d3", label: "Back-post runner", phase: "Cross coming", ball: { x: 14, y: 44 }, keeper: { x: 46, y: 64 },
        us: [{ x: 20, y: 46, n: "RB" }, { x: 40, y: 56, n: "CB" }, { x: 52, y: 57, n: "CB" }, { x: 66, y: 52, n: "LB" }],
        them: [{ x: 14, y: 44, n: "7" }, { x: 46, y: 58, n: "9" }, { x: 72, y: 54, n: "11" }],
        arrow: { from: { x: 14, y: 44 }, to: { x: 62, y: 62 } },
        question: "Their 7 has beaten your right-back and looked up. Your CBs are both on their 9 in the middle. Their 11 is ghosting in at the back post and your left-back hasn't seen him.",
        options: [
          { text: "Shift towards the back post to cover the 11 myself.", grade: "poor", feedback: "That opens the near post, and you'll arrive late for a header anyway. Position for the ball; cover the runner with your voice." },
          { text: "'Back post — Lerato, yours!' now, before the cross. Hold near-post side, body open, ready to attack the ball.", grade: "best", feedback: "The call puts a body on the runner while you stay in position to deal with the cross. This has to happen as the 7's head goes up." },
          { text: "'Keeper's!' — come and claim whatever comes in.", grade: "poor", feedback: "You can't claim a cross you haven't seen yet, and if it goes to the back post you've committed to nothing. Decide once the ball is in the air." }
        ] },
      { id: "d4", label: "Cut-back", phase: "They have the ball", ball: { x: 22, y: 64 }, keeper: { x: 42, y: 67 },
        us: [{ x: 26, y: 62, n: "RB" }, { x: 44, y: 60, n: "CB" }, { x: 54, y: 62, n: "CB" }, { x: 48, y: 40, n: "CM" }],
        them: [{ x: 22, y: 64, n: "7" }, { x: 50, y: 54, n: "10" }, { x: 58, y: 60, n: "9" }],
        arrow: { from: { x: 22, y: 64 }, to: { x: 50, y: 54 } },
        question: "Their 7 has reached the by-line. Both your CBs have dropped to the six-yard box with their 9. Their 10 is arriving unmarked at the penalty spot. Your midfielder is miles away.",
        options: [
          { text: "Stand on the near post — nothing goes in at the near post.", grade: "ok", feedback: "Right about the near post, but you've said nothing about the real danger. The near post is yours anyway; the cut-back is the goal." },
          { text: "Near post with position, and 'Musa — cut-back! Penalty spot!' to pull a CB out to the 10.", grade: "best", feedback: "You cover what your body can cover and use your voice for what it can't. One CB on the 9 is enough in the six-yard box." },
          { text: "Come off the line to attack the 7 and block.", grade: "poor", feedback: "He's on the by-line with a defender close; your rushing out leaves the whole goal open to the pull-back." }
        ] },
      { id: "d5", label: "1v1 — heavy touch", phase: "1v1", ball: { x: 51, y: 46 }, keeper: { x: 50, y: 58 },
        us: [{ x: 38, y: 36, n: "CB" }, { x: 62, y: 38, n: "CB" }],
        them: [{ x: 50, y: 41, n: "9" }],
        arrow: { from: { x: 50, y: 41 }, to: { x: 51, y: 50 } },
        question: "Their 9 is through alone. His first touch has gone three metres ahead of him, towards the penalty spot. You're at the top of the six-yard box.",
        options: [
          { text: "Hold position, stay big, make him beat me.", grade: "ok", feedback: "Safe and not wrong — but his touch has given you the ball. A heavy touch is the moment to go." },
          { text: "Go now — attack the ball, get there first, hands or body behind it, protect the head.", grade: "best", feedback: "His touch is loose and you're closer to the ball than he is. Decide while it's travelling, commit fully, and it's yours." },
          { text: "Drop back to the line to give myself more time.", grade: "poor", feedback: "Dropping gives him time to recover the ball and the whole goal to aim at. Never retreat from a loose touch." }
        ] },
      { id: "d6", label: "Edge of the box, unpressured", phase: "They have the ball", ball: { x: 60, y: 40 }, keeper: { x: 52, y: 61 },
        us: [{ x: 30, y: 52, n: "LB" }, { x: 44, y: 54, n: "CB" }, { x: 56, y: 53, n: "CB" }, { x: 70, y: 52, n: "RB" }, { x: 40, y: 30, n: "CM" }, { x: 66, y: 28, n: "CM" }],
        them: [{ x: 60, y: 40, n: "10" }, { x: 50, y: 50, n: "9" }],
        question: "Their 10 has received just outside the D. Both your midfielders are behind him, your back line is holding. He has a free shot if he wants one.",
        options: [
          { text: "Get set, on the angle, ready for the strike.", grade: "ok", feedback: "Necessary — but on its own it leaves him unpressured. A keeper set and a defender stepping is better than a keeper set alone." },
          { text: "'Sipho — press! Close him!' to the nearest CB, and get set on the angle.", grade: "best", feedback: "A defender stepping even half a yard rushes the shot or forces a pass. You set for the strike at the same time." },
          { text: "Come forward off the line to narrow the angle.", grade: "poor", feedback: "From 20 metres, coming out makes you a chip target and you'll be moving when it's hit. Narrow with position, not distance." }
        ] },
      { id: "d7", label: "Corner — free man", phase: "Set piece", ball: { x: 2, y: 69 }, keeper: { x: 52, y: 66 },
        us: [{ x: 45, y: 68, n: "P" }, { x: 40, y: 62 }, { x: 50, y: 62 }, { x: 58, y: 60 }, { x: 46, y: 56 }, { x: 60, y: 50 }],
        them: [{ x: 2, y: 69, n: "T" }, { x: 42, y: 60, n: "9" }, { x: 52, y: 58 }, { x: 60, y: 56 }, { x: 62, y: 50, n: "4" }, { x: 36, y: 52, n: "8" }],
        question: "Corner from the left. Everyone's marked except their 8, standing free near the penalty spot. The taker is about to run up.",
        options: [
          { text: "Let the kick happen — I'll deal with the 8 if the ball comes to him.", grade: "poor", feedback: "A free man at a corner is a goal waiting to happen. You have the power to stop the kick; use it." },
          { text: "'Stop! Who's got the 8?' — hold up the kick, give the 8 to the nearest marker, then set.", grade: "best", feedback: "Set pieces are the one time you can organise everything. Don't let the kick go until every man has a name." },
          { text: "Move myself towards the 8 to cover him.", grade: "poor", feedback: "Then the goal is open and you're out of your six-yard territory. You mark the ball, not a man." }
        ] },
      { id: "d8", label: "Full-back caught forward", phase: "Transition", ball: { x: 78, y: 30 }, keeper: { x: 50, y: 58 },
        us: [{ x: 76, y: 14, n: "RB" }, { x: 36, y: 44, n: "LB" }, { x: 46, y: 44, n: "CB" }, { x: 58, y: 42, n: "CB" }, { x: 50, y: 28, n: "CM" }],
        them: [{ x: 78, y: 30, n: "11" }, { x: 60, y: 28, n: "9" }, { x: 40, y: 34, n: "7" }],
        arrow: { from: { x: 78, y: 30 }, to: { x: 74, y: 50 } },
        question: "We've lost the ball. Your right-back is 20 metres up the pitch. Their 11 has it wide right with the whole channel in front of him. Your right CB is the nearest to that space.",
        options: [
          { text: "'Recover!' to the right-back and wait.", grade: "ok", feedback: "He needs to hear it, but he's not getting back in time. The space needs filling now." },
          { text: "'Thabo — slide right! Cover the channel!' to the right CB, and 'Tuck in!' to the LB and other CB so the line shifts across.", grade: "best", feedback: "Fill the space with the player who's closest, shift the whole line to cover the gap he leaves. That's organising." },
          { text: "Drop to the line and get set — a cross or shot is coming.", grade: "poor", feedback: "You've given up on preventing the chance before it exists. The whole point is that your voice can stop this becoming a shot." }
        ] }
    ] },
    { type: "sim", id: "sim-distribute", title: "Distribution — pick the pass", intro: "The ball is yours. Where does it go, and how fast?", scenarios: [
      { id: "p1", label: "Caught the cross — they're broken", phase: "Transition", ball: { x: 50, y: 62 }, keeper: { x: 50, y: 62 },
        us: [{ x: 50, y: 56, n: "CB" }, { x: 40, y: 54, n: "CB" }, { x: 80, y: 20, n: "RW" }, { x: 52, y: 36, n: "CM" }, { x: 24, y: 40, n: "LB" }],
        them: [{ x: 56, y: 58 }, { x: 44, y: 60 }, { x: 36, y: 52 }, { x: 66, y: 50 }, { x: 50, y: 42 }, { x: 46, y: 20, n: "CB" }],
        question: "You've just claimed a corner. Five of their players are in your box. Your right winger is alone on the halfway line with one of their CBs twenty metres from him.",
        options: [
          { text: "Hold it. Calm everyone down. Roll to the left-back.", grade: "poor", feedback: "You've been handed a counter-attack and you've put it in your pocket. By the time you roll it, they've recovered." },
          { text: "Throw or side-volley it fast and accurately to the right winger's feet or into his path.", grade: "best", feedback: "They're broken. Fast and accurate — a throw if he's in range. This is what claiming the cross was for." },
          { text: "Kick it as long as possible down the middle.", grade: "ok", feedback: "Quick, which is right — but a hopeful ball to no one usually comes straight back. The winger is the target, not the distance." }
        ] },
      { id: "p2", label: "Goal kick — they're pressing high", phase: "Restart", ball: { x: 46, y: 62 }, keeper: { x: 46, y: 62 },
        us: [{ x: 28, y: 50, n: "CB" }, { x: 72, y: 50, n: "CB" }, { x: 14, y: 36, n: "LB" }, { x: 86, y: 36, n: "RB" }, { x: 50, y: 38, n: "CM" }, { x: 56, y: 10, n: "9" }],
        them: [{ x: 32, y: 44, n: "9" }, { x: 68, y: 44, n: "11" }, { x: 50, y: 32, n: "10" }, { x: 20, y: 30 }, { x: 80, y: 30 }, { x: 46, y: 14, n: "CB" }],
        question: "Goal kick. Their strikers are standing five metres from each of your centre-backs and their 10 is on your CM. Their defence is high — there's space behind it.",
        options: [
          { text: "Short to the CB, as usual.", grade: "poor", feedback: "Straight into the press. If he loses it there, it's a shot. The press is a trap; don't walk into it." },
          { text: "Long over the press into the space behind their defence, or to our 9 to hold it up. Call 'Second ball!'", grade: "best", feedback: "A high press leaves space behind it — and you've just turned their aggression into your chance." },
          { text: "Wide to the full-back on the touchline.", grade: "ok", feedback: "Playable — he's less marked than the CBs — but he's receiving facing the touchline with a presser nearby. Long is cleaner." }
        ] },
      { id: "p3", label: "Goal kick — they've dropped off", phase: "Restart", ball: { x: 46, y: 62 }, keeper: { x: 46, y: 62 },
        us: [{ x: 28, y: 50, n: "CB" }, { x: 72, y: 50, n: "CB" }, { x: 14, y: 36, n: "LB" }, { x: 86, y: 36, n: "RB" }, { x: 50, y: 40, n: "CM" }],
        them: [{ x: 44, y: 24, n: "9" }, { x: 56, y: 22, n: "11" }, { x: 50, y: 16, n: "10" }, { x: 30, y: 10 }, { x: 70, y: 10 }],
        question: "Goal kick. Their whole team has dropped into their own half. Nobody is near your centre-backs.",
        options: [
          { text: "Long, into their half, for our forwards to fight for.", grade: "poor", feedback: "Into an organised, set defence that outnumbers us. You're giving the ball back for no reason." },
          { text: "Short to a centre-back and immediately move to offer the return pass.", grade: "best", feedback: "No pressure means no reason to gamble. Keep the ball, build, and stay involved as the free man." },
          { text: "Roll it to the full-back.", grade: "ok", feedback: "Fine — he's free too. Slightly less good than the CB because the full-back is further and more easily shut off against the touchline." }
        ] },
      { id: "p4", label: "Back pass, striker closing", phase: "We have the ball", ball: { x: 46, y: 54 }, keeper: { x: 48, y: 60 },
        us: [{ x: 40, y: 40, n: "CB" }, { x: 62, y: 44, n: "CB" }, { x: 80, y: 44, n: "RB" }, { x: 20, y: 40, n: "LB" }],
        them: [{ x: 36, y: 52, n: "9" }, { x: 56, y: 36 }, { x: 70, y: 30 }],
        arrow: { from: { x: 40, y: 40 }, to: { x: 48, y: 58 } },
        question: "Your left CB has played it back to you, a little slow. Their 9 is sprinting at you from your left. Your right-back is free out wide, on your right.",
        options: [
          { text: "Take a touch to control it, then look up.", grade: "poor", feedback: "The 9 is on you by the time you've touched it. This is how keepers get robbed in their own box." },
          { text: "First time, right foot, out to the right-back — away from the 9.", grade: "best", feedback: "One touch, away from the pressure, to the free man. You decided this before the ball arrived." },
          { text: "First time, clear it long and high.", grade: "ok", feedback: "Safe — ugly and safe beats pretty and risky — but the right-back was free, and keeping the ball is better than giving it away cleanly." }
        ] },
      { id: "p5", label: "Won it late, protecting a lead", phase: "Game management", ball: { x: 50, y: 60 }, keeper: { x: 50, y: 60 },
        us: [{ x: 36, y: 50, n: "CB" }, { x: 62, y: 50, n: "CB" }, { x: 20, y: 44, n: "LB" }, { x: 82, y: 42, n: "RB" }, { x: 50, y: 34, n: "CM" }],
        them: [{ x: 44, y: 46 }, { x: 58, y: 48 }, { x: 50, y: 28 }, { x: 30, y: 30 }, { x: 70, y: 32 }],
        question: "You're 1–0 up with five minutes left. You've just saved a shot. Their team is set, everyone's in position, and your teammates are screaming 'Get rid of it!'",
        options: [
          { text: "Do what they say — launch it long and hope.", grade: "poor", feedback: "Hoofing it to a set team gives them the ball back in thirty seconds for another attack. Panic defending." },
          { text: "Take my time inside the six seconds, let everyone catch their breath, then play short to the free full-back. 'Calm — keep it!'", grade: "best", feedback: "You use the time you have, you keep the ball, and your calm sets the mood. A team keeping the ball can't concede." },
          { text: "Quick throw to the CM.", grade: "ok", feedback: "Keeps the ball, which is right — but he's got three players around him. The free full-back is the better target, and slower is better here." }
        ] },
      { id: "p6", label: "Caught it — nobody's free", phase: "Transition", ball: { x: 50, y: 62 }, keeper: { x: 50, y: 62 },
        us: [{ x: 34, y: 48, n: "CB" }, { x: 64, y: 48, n: "CB" }, { x: 20, y: 40, n: "LB" }, { x: 84, y: 40, n: "RB" }, { x: 50, y: 32, n: "CM" }, { x: 52, y: 14, n: "9" }],
        them: [{ x: 36, y: 44 }, { x: 62, y: 44 }, { x: 22, y: 36 }, { x: 82, y: 36 }, { x: 50, y: 28 }, { x: 50, y: 12 }],
        question: "You've caught a cross. You look up: every one of your players has an opponent close to him. Nobody is free.",
        options: [
          { text: "Pick the least-marked player and throw it to him anyway.", grade: "poor", feedback: "A throw into a 50/50 in your own half is a turnover in a dangerous place." },
          { text: "Hold it for a moment, let a defender move to create space, then roll to him — or if nothing opens, go long to the 9 and call 'Second ball!'", grade: "best", feedback: "Use the six seconds. Movement creates the free man. If it doesn't come, a long ball to a target is the honest choice." },
          { text: "Go long immediately.", grade: "ok", feedback: "Not wrong — but you've got six seconds and a team that can move. Try to make the free man first." }
        ] }
    ] },
    { type: "callout", title: "How to use the clock", html: "<p>When you can get every scenario right with no clock, switch to <em>Calm</em> (12 seconds). When that's easy, <em>Pressure</em> (6). <em>Match speed</em> (3 seconds) is a real match: you see the picture and you've already decided. Nobody passes Match speed first time. That's the point.</p>" }
  ]
});
