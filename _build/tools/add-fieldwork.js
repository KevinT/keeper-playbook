#!/usr/bin/env node
// Re-version packs 1.0.0 -> 1.1.0 adding an "On the pitch" section (field tasks + drills) and evidence gates (ADR 0004).
// Usage: node _build/tools/add-fieldwork.js   (idempotent: skips packs that already have 1.1.0)
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..');

const FIELD = {
  'read-the-game': {
    lede: 'Reading is trained by looking. These tasks point your eyes at the right things in real sessions and matches — nothing here can be done on a sofa.',
    tasks: [
      { id: 'scan-count', kind: 'do', when: 'session', text: 'Every time the ball travels in a small-sided game, do one scan: ball → nearest attacker → far-side runner → my line → ball.', why: 'Scanning is the habit everything else depends on. It feels pointless when the ball is far away — that is exactly when it matters.', prompt: 'Did it become automatic or did you have to remind yourself? When did you forget?' },
      { id: 'hips-head', kind: 'notice', when: 'match', text: 'For the whole first half, watch the hips and head of whoever has the ball in your half. Call what\'s coming out loud before it happens: "shot", "cross", "pass".', why: 'Intentions arrive before the ball does. Calling them out loud forces you to read early and tells your defenders at the same time.', prompt: 'How often were you right? Which cue fooled you?' },
      { id: 'far-side', kind: 'notice', when: 'match', text: 'Each time the ball goes wide, find the furthest-away attacker before you look back at the ball.', why: 'The back-post runner is the most common unseen goal at youth level. He is only invisible if you never look.', prompt: 'Was anyone ever free at the back post? Did you say anything?' },
      { id: 'starting-position', kind: 'do', when: 'session', text: 'In a game, move to a new starting position on EVERY pass the other team makes, even in their half. Never be standing still when the ball moves.', why: 'Positioning is done before the shot, not during it. A keeper who adjusts on every pass never has to make the spectacular save.', prompt: 'Did your coach or teammates notice? Where did you catch yourself standing on the line?' },
      { id: 'walk-the-pitch', kind: 'notice', when: 'match', text: 'Before kick-off, walk your box: bounce, grass, sun, wind. Decide one thing you\'ll do differently because of it.', why: 'Conditions change decisions — a wet pitch means parry wide, a low sun means come for fewer crosses. Pros do this every match.', prompt: 'What did you notice, and what did you change?' }
    ],
    drills: [
      { id: 'arc-shadow', mode: 'solo', name: 'Shadow the arc', minutes: 8, setup: 'A goal (or two cones 7m apart) and three markers on an arc: one central ~11m out, two wide ~6m out level with the posts.', steps: ['Start on your line, centre.', 'Imagine the ball at the central marker — move to your set position on the ball-to-centre line, get set, hold 2 seconds.', 'Imagine it switched wide left — move along the arc, set, hold. Then wide right. Then back central.', 'Three rounds slow, three rounds at match pace. Set means still: feet shoulder-width, weight forward, hands ready.'], focus: 'Arrive and be still before the "shot". If your feet are moving at the hold, you were late.', gameLink: 'This is the movement you make a hundred times a match while nothing seems to be happening. It is why good keepers look like they are never diving far.' },
      { id: 'call-the-cue', mode: 'pair', name: 'Call the cue', minutes: 10, setup: 'A partner with a ball 15–20m from goal, you in goal.', steps: ['Partner dribbles slowly and, without warning, either shoots, passes to the side, or turns away.', 'You call it — "shot!", "pass!", "turn!" — the moment you read it from hips and head, before they act.', 'Partner tells you if the call came before or after the action. Ten reps, swap.', 'Progress: partner adds a fake. Only react to the hips, never the eyes or the arms.'], focus: 'Hips first. A player can only strike where his hips point.', gameLink: 'Every 1v1 and every edge-of-box shot is decided by whether you read the strike early enough to be set.' },
      { id: 'scan-game', mode: 'group', name: 'Scan-and-call game', minutes: 12, setup: 'Any small-sided game at training. You in goal. One extra rule for you only.', steps: ['Every time the ball crosses the halfway line towards you, you must say out loud where the furthest attacker is: "far side left", "back post".', 'If a coach or teammate catches you silent, that\'s a point against you. Count them.', 'Second game: add the shape — "step up" or "drop" — every time possession changes.'], focus: 'Saying it proves you saw it. Silence means you were ball-watching.', gameLink: 'This is the exact habit that turns into organising the defence in Pack 3.' }
    ],
    gates: [
      { type: 'field', min: 3, distinctDates: true, label: 'Field tasks — check-ins from 3 different sessions or matches' },
      { type: 'drills', min: 2, label: 'Drills — 2 logged sessions' }
    ]
  },
  'own-the-box': {
    lede: 'Decisions are trained under real conditions: a real ball in the air, a real striker, a real choice. The simulator shows you the logic; these make it yours.',
    tasks: [
      { id: 'call-every-ball', kind: 'do', when: 'session', text: 'Call "KEEPER\'S!" or "AWAY!" on every single high ball into your box in training — no silent ones. Count the silent ones honestly.', why: 'The loudest call you ever make. Collisions with your own defender are a goal and sometimes an injury, and they all start with a quiet keeper.', prompt: 'How many silent ones? What stopped you — not sure, too late, embarrassed?' },
      { id: 'decide-in-flight', kind: 'do', when: 'match', text: 'On every ball played behind your defence, make your decision while the ball is in the air — say "mine" or "stay" under your breath before it lands.', why: 'The ball\'s flight is your thinking time. Keepers who decide after it lands are the ones caught in no-man\'s-land.', prompt: 'Did you ever change your mind mid-run? What did you see late?' },
      { id: 'first-time-backpass', kind: 'do', when: 'session', text: 'Every back pass in training: know your next pass before the ball arrives and play it first time if a striker is closing.', why: 'The one that gets keepers robbed. Under pressure the decision happens before the ball arrives.', prompt: 'Did you take a touch under pressure? What was your out-ball?' },
      { id: 'fast-or-slow', kind: 'notice', when: 'match', text: 'Each time you get the ball in your hands, say "fast" or "slow" before you look for a target — are they broken or set?', why: 'Distribution is a tactical choice, not a reflex. One look decides whether it\'s a counter or a build.', prompt: 'How often was it "fast"? Did you actually release fast when it was?' },
      { id: 'corner-organise', kind: 'do', when: 'match', text: 'At every corner against you, do not let the kick be taken until every one of their players in the box has a name attached. Stop the kick if you have to.', why: 'The one moment you can organise everything. Teams concede from corners because nobody takes that time.', prompt: 'Did you stop a kick? Was anyone free when it came in?' }
    ],
    drills: [
      { id: 'over-the-top', mode: 'pair', name: 'Over the top — come or stay', minutes: 12, setup: 'Partner 25–30m out with a few balls. You at the edge of your six-yard box. Two cones marking the edge of the 18.', steps: ['Partner lofts balls over an imaginary line to land anywhere between the 18 and the penalty spot — varying height and depth.', 'Decide in flight: if you\'ll clearly get there first, come and take it (catch high or clear first time outside the box). If not, retreat to set position and get big.', 'Say your decision out loud as the ball leaves his foot. Partner keeps score of hesitations — the stop-start is the only wrong answer.', 'Progress: partner runs onto his own ball as the striker.'], focus: 'One decision, made early, carried out fully. Hesitation counts as wrong even if nothing bad happens.', gameLink: 'This is the Ball Over the Top scenario in the simulator — in the real air.' },
      { id: 'catch-punch', mode: 'group', name: 'Traffic — catch or punch', minutes: 12, setup: 'A server wide with balls, two or three bodies (teammates) in the six-yard box jostling, you in goal.', steps: ['Server crosses. If you have a clear path to the ball at its highest point: CATCH, knee up, call "Keeper\'s!" before you move.', 'If bodies are in your path: PUNCH, two fists, high and wide — then react to the second ball.', 'If you can\'t get there: STAY, set near-post side, and call the nearest defender onto the runner.', 'Bodies rotate; ten crosses each side.'], focus: 'The call before the move. Catch > punch > stay, chosen by what\'s actually in your path.', gameLink: 'Every cross in every match is this decision.' },
      { id: 'release', mode: 'solo', name: 'One look, one release', minutes: 8, setup: 'Three targets (cones, bibs, a wall) at 15m, 25m and 35m, spread left, centre and right. A few balls.', steps: ['Toss a ball to yourself, catch it as if claiming a cross, land facing goal.', 'Turn, one look, and release to the target you pre-named before the toss: throw to 15m, side-volley to 25m, kick to 35m.', 'Time yourself: catch to release under 3 seconds. Accuracy over power — a release that misses the target is a turnover.', 'Twenty releases, mixed.'], focus: 'The decision is made before the catch; the look just confirms it.', gameLink: 'The counter-attack starts with you. Caught the Cross — They\'re Broken is this drill at full speed.' }
    ],
    gates: [
      { type: 'field', min: 4, distinctDates: true, label: 'Field tasks — check-ins from 4 different sessions or matches' },
      { type: 'field', task: 'call-every-ball', min: 2, label: '"Call every ball" — checked in twice' },
      { type: 'drills', min: 3, label: 'Drills — 3 logged sessions' }
    ]
  },
  'run-the-team': {
    lede: 'Voice is a muscle. Nothing in this pack is real until your defenders have heard it. These tasks make the Call Sheet happen on grass.',
    tasks: [
      { id: 'three-calls', kind: 'do', when: 'match', text: 'Pick three calls from the Call Sheet before the match (start with Keeper\'s!, Away!, Step up!). Use them every single time the situation comes up. After the match, count how many times you did and how many you missed.', why: 'You won\'t learn thirty calls at once. Three, used every time, become instinct in a month — then you add three more.', prompt: 'Which three? Roughly how many used vs missed? Which one felt most awkward?' },
      { id: 'name-first', kind: 'do', when: 'session', text: 'In every game at training, no instruction without a name in front of it. "Thabo — step." "Musa — tight."', why: 'A call without a name is noise; everyone assumes it\'s for someone else.', prompt: 'Did anyone respond faster when you used their name? Whose name did you keep forgetting?' },
      { id: 'shape-calls', kind: 'do', when: 'match', text: 'Give at least one shape call — "step up", "drop", "tuck in", "squeeze" — in every defensive phase of the match, not just at set pieces.', why: 'Your defenders are guessing about the line. You are the only one who can see it from behind.', prompt: 'Did the line actually move when you called? When did you see it wrong and say nothing?' },
      { id: 'after-mistake', kind: 'do', when: 'match', text: 'The first thing you say to a teammate after his mistake must be about the next ball, never the last one. "Next one, Josh."', why: 'A defender thinking about his last mistake makes the next one. You can fix his next thirty seconds.', prompt: 'Did it happen? What did you say? What did you want to say?' },
      { id: 'first-voice', kind: 'do', when: 'match', text: 'If you concede, be the first voice within five seconds — one instruction, forward-looking, to the whole team.', why: 'The thirty seconds after a goal is when the next one is most likely. The team looks to you.', prompt: 'Did you concede? What did you say first? How long did it take you?' },
      { id: 'opposition-read', kind: 'notice', when: 'match', text: 'In the first ten minutes, work out how they attack — over the top, through the middle, or wide and cross — and tell your defence one sentence about it.', why: 'You know more than your defenders do by kick-off if you watch the warm-up and the first ten minutes.', prompt: 'What was their pattern? Did you tell anyone? Were you right?' }
    ],
    drills: [
      { id: 'say-it', mode: 'solo', name: 'Say it out loud', minutes: 6, setup: 'The Call Sheet open, or a highlights clip of any match on your phone.', steps: ['Watch a defensive phase (or read a "when you see" row). Say the call out loud — full voice, the way you would on the pitch, with a name in front of it.', 'If it came out quiet or hesitant, say it again louder. The voice is a muscle.', 'Ten calls a day for a week before a match.'], focus: 'Short, certain, early. Not a paragraph — one verb.', gameLink: 'Defenders follow a voice that sounds sure. This is where it gets sure.' },
      { id: 'organise-corners', mode: 'group', name: 'Run the corner', minutes: 10, setup: 'A corner-kick set-up at training: a taker, six attackers, your defenders, you in goal. Coach watching.', steps: ['Before each kick you organise everything: posts, zones, every attacker named to a defender. The kick does not happen until you say so.', 'Coach plants one unmarked attacker each time; your job is to find him and fix it before the kick.', 'Six corners each side. Then swap: a teammate organises and you watch for what he misses.'], focus: 'No kick while a man is free. Find him, name him, then set.', gameLink: 'Corner — Free Man in the simulator, with real voices.' },
      { id: 'blind-defender', mode: 'pair', name: 'Blind defender', minutes: 8, setup: 'A partner as a defender with his back to you, facing an attacker (a cone or a third player) 10m from goal. You in goal.', steps: ['Only you can see where the attacker (or a second cone, the "runner") is. Your partner must act on your voice alone: "tight", "show him wide", "runner left — go".', 'Move the cones between reps; the defender keeps his eyes forward.', 'Ten reps, then swap roles so you feel what it is like to depend on the keeper\'s voice.'], focus: 'Name, one verb, direction. Early beats loud.', gameLink: 'Your defenders really are this blind to what\'s behind them. That is why your voice matters.' }
    ],
    gates: [
      { type: 'field', min: 4, distinctDates: true, done: ['yes', 'partly'], label: 'Field tasks — 4 different sessions or matches where you did it' },
      { type: 'field', task: 'three-calls', min: 2, label: '"Three calls" — used in 2 matches' },
      { type: 'drills', min: 2, label: 'Drills — 2 logged sessions' }
    ]
  },
  'under-pressure': {
    lede: 'Match speed on the simulator means nothing until it shows on a Saturday. This pack is completed by matches, not by clicks.',
    tasks: [
      { id: 'no-hesitation', kind: 'do', when: 'match', text: 'For a whole match, count your hesitations — any moment you started one decision and switched. Zero is the target; honesty is the point.', why: 'The only truly wrong decision is the half one. Pros are not faster thinkers; they commit earlier.', prompt: 'How many? What was happening each time?' },
      { id: 'reviewed-goals', kind: 'notice', when: 'match', text: 'For every goal or big chance against you, be able to say within a minute where it came from and what call or decision could have stopped it.', why: 'A conceded goal is information. This turns a bad moment into a better next one, in real time.', prompt: 'List them: where from, what would have stopped it.' },
      { id: 'quiet-match', kind: 'notice', when: 'match', text: 'After the match, count the chances you PREVENTED with a call or a position — the shots that never came. Those are your real saves now.', why: 'At this level keepers are judged by the quiet matches they create, not the saves they make.', prompt: 'What did you prevent? Who did you move?' }
    ],
    drills: [],
    gates: [
      { type: 'field', min: 4, distinctDates: true, label: 'Field tasks — 4 different matches' },
      { type: 'reviews', review: 'match-review', min: 4, label: '4 saved match reviews (from Run the Team)' }
    ]
  }
};

for (const [id, fw] of Object.entries(FIELD)) {
  const src = path.join(root, 'packs', id, '1.0.0', 'pack.js');
  const dst = path.join(root, 'packs', id, '1.1.0', 'pack.js');
  if (fs.existsSync(dst)) { console.log('skip', id, '1.1.0 exists'); continue; }
  global.window = { KP: { packs: [] } };
  require(src);
  const p = window.KP.packs[0];
  p.version = '1.1.0';
  p.requires = Object.assign({}, p.requires, { field: '^1' }, fw.drills.length ? { drill: '^1' } : {});
  const blocks = [{ type: 'prose', html: '<p>' + fw.lede + '</p><p>Check in after each session or match — a date, did it happen (yes, partly, no — all honest answers), and what you noticed. The record is yours. Nobody is checking; the point is that <em>you</em> are.</p>' },
                  { type: 'field', id: 'field-' + id, title: 'Field tasks', intro: 'Take one or two to each session. Not all at once.', tasks: fw.tasks }];
  if (fw.drills.length) blocks.push({ type: 'drill', id: 'drills-' + id, title: 'Drills', intro: 'Solo ones you can do today. Pair and group ones need a partner or a session — ask.', drills: fw.drills });
  blocks.push({ type: 'callout', title: 'Why this pack can\'t be finished indoors', html: '<p>Reading, deciding and organising are habits, and habits are built on grass. The lessons and the simulator show you what good looks like; only matches and sessions make it yours. Completing a pack means it has shown up in your game — that is the whole point.</p>' });
  p.sections.push({ id: 'on-the-pitch', kicker: 'On the pitch', title: 'On the Pitch', lede: fw.lede, blocks });
  p.gates = fw.gates.concat(p.gates);  // real-world first
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, `// Pack: ${p.title} v1.1.0 — adds On the Pitch (field tasks, drills) and evidence gates (ADR 0004).\nwindow.KP = window.KP || {}; window.KP.packs = window.KP.packs || [];\nwindow.KP.packs.push(${JSON.stringify(p, null, 1)});\n`);
  console.log('wrote', dst);
}
// registry -> 1.1.0
const reg = path.join(root, 'packs', 'registry.js');
fs.writeFileSync(reg, fs.readFileSync(reg, 'utf8').replace(/1\.0\.0/g, '1.1.0'));
console.log('registry updated');
