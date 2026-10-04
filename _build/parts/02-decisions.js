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
