// Pack: Own the Box v1.0.0 — content only. Capabilities referenced by block `type`; see ARCHITECTURE.md.
window.KP = window.KP || {}; window.KP.packs = window.KP.packs || [];
window.KP.packs.push({
 "id": "own-the-box",
 "version": "1.0.0",
 "level": "L3",
 "tag": "Pack 2",
 "title": "Own the Box",
 "promise": "Make the big calls — come or stay, catch or punch, fast or slow — early, once, and fully.",
 "requires": {
  "simulator": "^1",
  "quiz": "^1",
  "tree": "^1",
  "checklist": "^1"
 },
 "sections": [
  {
   "id": "decisions",
   "kicker": "Section 04",
   "title": "The Big Decisions",
   "lede": "Come or stay. Catch or punch. Go or wait. These moments decide matches, and each one has a logic you can learn. The goal is to make them early, make them once, and make them fully.",
   "blocks": [
    {
     "type": "prose",
     "html": "<p>Every one of these decisions has the same rule underneath it: <strong>a committed decision beats a perfect one made late.</strong> Keepers get caught in no-man's-land not because they chose wrong, but because they didn't choose. Learn the logic, then trust it in the moment.</p>"
    },
    {
     "type": "tree",
     "title": "Come or stay? — the ball behind the defence",
     "intro": "A ball is played over or through your defence. Walk the decision.",
     "root": {
      "q": "Will you get to the ball clearly before the attacker?",
      "options": [
       {
        "label": "Yes — clearly first",
        "next": {
         "q": "Is it inside your box?",
         "options": [
          {
           "label": "Yes",
           "result": "Go and take it. Catch it high if it's in the air, or gather it cleanly. Call 'KEEPER'S!' early and loud so your defender pulls out.",
           "why": "You're first and you can use your hands. There's nothing to think about — the only danger is a defender who didn't hear you."
          },
          {
           "label": "No — outside the box",
           "result": "Go — and clear it first time with your feet (or head) into a safe area: wide and high, or to a teammate if it's genuinely easy. Don't take a touch.",
           "why": "You're a sweeper now. One clean contact removes the danger. A touch invites the striker to close you down with no hands to save you."
          }
         ]
        }
       },
       {
        "label": "It's close — maybe 50/50",
        "next": {
         "q": "Is the attacker running straight at your goal, or across it?",
         "options": [
          {
           "label": "Straight at goal",
           "result": "Don't gamble. Come forward while the ball travels to narrow the angle, then get BIG and SET as he takes his touch. Make him beat you.",
           "why": "A 50/50 you lose means an empty net. A 1v1 where you're big and patient is a save you make most of the time — strikers at this age miss far more than they score."
          },
          {
           "label": "Across goal / wide",
           "result": "Stay and hold your angle. Follow him along the arc, stay near-post side, and let your recovering defender do the work. Call 'SHOW HIM WIDE!'",
           "why": "A striker running across goal is losing his angle every step. The defender can pressure him from behind; your job is to deny the near post and wait for the mistake."
          }
         ]
        }
       },
       {
        "label": "No — he gets there first",
        "next": {
         "q": "Is he inside the box?",
         "options": [
          {
           "label": "Yes",
           "result": "Get set, get big, and stay on your feet as long as possible. Position on the ball-to-centre line, a step or two off your line.",
           "why": "He has the ball; the save is now a 1v1. The worst thing you can do is go down early — it's the one thing he wants. Stay up and make him choose."
          },
          {
           "label": "No — still outside",
           "result": "Hold the edge of your six-yard box, set, and call the defender back in behind him: 'RECOVER! GOAL SIDE!'",
           "why": "He still has to beat you from distance or carry it closer. Every second you stay patient, your defenders are closing. Don't go to him."
          }
         ]
        }
       }
      ]
     },
     "id": "tree-come-or-stay"
    },
    {
     "type": "tree",
     "title": "Catch, punch, or stay? — the cross",
     "intro": "A cross is coming into your box. Walk the decision.",
     "root": {
      "q": "Can you get to the ball at its highest point, with your hands, with a clear path?",
      "options": [
       {
        "label": "Yes — I can catch it clean",
        "result": "Go and CATCH. Call 'KEEPER'S!' before you move, attack the ball, take it at the top of your jump with your knee up for protection.",
        "why": "A catch ends the attack completely — no second ball, no corner, and you now start the counter. It's always first choice when it's on."
       },
       {
        "label": "I can get there but it's crowded",
        "next": {
         "q": "Is it crowded with bodies in your path, or is it just a tight contest at the ball?",
         "options": [
          {
           "label": "Bodies in my path",
           "result": "PUNCH — two fists if you can get square, one fist if you're stretching. Aim high, wide and long. Then react to the second ball.",
           "why": "In traffic, a catch that gets knocked loose is a tap-in. A good punch gets the ball out of the danger zone and lets you reset."
          },
          {
           "label": "Tight contest, one attacker",
           "result": "Attack it with a CATCH, but be ready to turn it into a punch at the last moment if he gets a touch first.",
           "why": "One-on-one for a ball in the air, the keeper's hands win. Go with intent — the hesitant keeper is the one who gets beaten."
          }
         ]
        }
       },
       {
        "label": "No — it's going beyond me or will drop before I get there",
        "result": "STAY. Get set on your line, near-post side of the ball-to-centre line, and call the defender onto the runner: 'BACK POST — PICK HIM UP!'",
        "why": "A keeper stuck under a cross he can't reach is the easiest goal in football. If you can't get there, make the header have to beat a set keeper, and use your voice to get a body on the runner."
       }
      ]
     },
     "id": "tree-cross"
    },
    {
     "type": "tree",
     "title": "What do I do with the ball? — distribution",
     "intro": "You've got the ball in your hands or at your feet. Walk the decision.",
     "root": {
      "q": "Did we just win it — are they unbalanced right now?",
      "options": [
       {
        "label": "Yes — they're disorganised",
        "next": {
         "q": "Is there a teammate in space ahead who can be found quickly?",
         "options": [
          {
           "label": "Yes",
           "result": "Release FAST. Throw if he's within range (it's quicker and more accurate), kick if he's beyond it. One look, one action.",
           "why": "Transition is where cheap goals are scored — for both teams. A fast, accurate release while they're still turning is the most dangerous thing you can do."
          },
          {
           "label": "No — everyone's covered",
           "result": "Slow it down. Keep it, let the team push up, then play short to a free defender or a full-back.",
           "why": "A rushed long ball into a covered area just gives possession back when they're already ahead of the ball."
          }
         ]
        }
       },
       {
        "label": "No — it's a normal restart",
        "next": {
         "q": "Are they pressing high, with strikers close to your defenders?",
         "options": [
          {
           "label": "Yes — pressing high",
           "result": "Look long, over the press, to the space behind their strikers — or to a target player who can hold it. Don't play short into a trap.",
           "why": "A high press leaves space behind it. Beating it with one kick turns their aggression into your chance. Short passing into a press is how keepers give goals away."
          },
          {
           "label": "No — they've dropped off",
           "result": "Play short to a centre-back or full-back and build. Move to offer the return pass immediately.",
           "why": "No pressure means no reason to gamble. Keep the ball, keep the shape, and move up the pitch together."
          }
         ]
        }
       }
      ]
     },
     "id": "tree-distribution"
    },
    {
     "type": "cards",
     "title": "Decisions in one line",
     "cols": 2,
     "items": [
      {
       "tag": "Rule",
       "title": "Decide while the ball is travelling",
       "text": "The time to choose is while the pass is in the air, not after it lands. Use the flight of the ball to make up your mind and start moving."
      },
      {
       "tag": "Rule",
       "title": "Say it, then do it",
       "text": "A loud call before you act does two things: it tells your defenders what's happening and it commits you. A silent keeper is a hesitant keeper."
      },
      {
       "tag": "Rule",
       "title": "Catch > Punch > Parry",
       "text": "Keep the ball if you can. Clear it if you can't. Push it away only as a last resort — and then push it wide, never back into the middle."
      },
      {
       "tag": "Rule",
       "title": "Stay up in 1v1s",
       "text": "The striker's first plan is to wait for you to go down. Stay big, stay patient, and make him do something. Most of them can't."
      },
      {
       "tag": "Rule",
       "title": "Fast if they're broken, slow if they're set",
       "text": "Distribution is a tactical choice, not a reflex. Look up once: if they're disorganised, go fast. If they're organised, keep it."
      },
      {
       "tag": "Rule",
       "title": "If you go, go all the way",
       "text": "Once you've decided to come for a ball — through, over, or crossed — commit completely. Stopping halfway is the only decision that's always wrong."
      }
     ]
    },
    {
     "type": "quiz",
     "title": "Decision check",
     "intro": "Twelve match situations. Choose, then read the reasoning — the reasons matter more than the score.",
     "items": [
      {
       "situation": "A long ball is played over your defence. You're clearly going to get there first, about five metres outside your box.",
       "options": [
        {
         "text": "Wait on the edge of the box and let the defender deal with it.",
         "correct": false,
         "feedback": "Your defender is behind the striker. Waiting makes it a race the striker wins."
        },
        {
         "text": "Sprint out and clear it first time, high and wide.",
         "correct": true,
         "feedback": "Yes. You're the sweeper. One clean contact, no touch, danger over."
        },
        {
         "text": "Sprint out, take a touch to control it, then pick a pass.",
         "correct": false,
         "feedback": "A touch gives the striker time to close you down with no hands to save you. Clear first time."
        }
       ]
      },
      {
       "situation": "A striker is clean through, running straight at goal, ball under control. You're on your line.",
       "options": [
        {
         "text": "Stay on the line and dive when he shoots.",
         "correct": false,
         "feedback": "From the line he sees the whole goal. You have to narrow it."
        },
        {
         "text": "Rush out and slide at his feet.",
         "correct": false,
         "feedback": "He has the ball under control — he'll go round you or chip you. Sliding is for when his touch is loose."
        },
        {
         "text": "Come forward while he's running, then slow, get big, and set as he gets ready to shoot.",
         "correct": true,
         "feedback": "Right. Narrow the angle early, then make him beat a big, set keeper. Patience wins most 1v1s."
        }
       ]
      },
      {
       "situation": "A cross is coming from the left. You could reach it, but there are three bodies between you and the ball.",
       "options": [
        {
         "text": "Go through them and try to catch it.",
         "correct": false,
         "feedback": "In traffic a catch becomes a drop becomes a tap-in. Punch."
        },
        {
         "text": "Punch it high and wide with two fists, then react.",
         "correct": true,
         "feedback": "Yes. Get it out of the danger zone and reset."
        },
        {
         "text": "Stay on the line and wait for the header.",
         "correct": false,
         "feedback": "You can reach it — a reachable cross you don't attack is an invitation."
        }
       ]
      },
      {
       "situation": "A cross is coming from the right and is going to land at the far post, beyond you. A winger is arriving unmarked.",
       "options": [
        {
         "text": "Charge across and try to get there.",
         "correct": false,
         "feedback": "You won't make it, and now you're off your line and out of position for the header."
        },
        {
         "text": "Stay near-post side, set, and shout for a defender to pick up the back post.",
         "correct": true,
         "feedback": "Right. Make the header beat a set keeper, and use your voice to get a body on the runner. Next time, call it before the cross."
        },
        {
         "text": "Go to the far post early to cover the header.",
         "correct": false,
         "feedback": "Then the near post is open and the cross changes. Position on the ball, cover the runner with your voice."
        }
       ]
      },
      {
       "situation": "You've just caught a cross. You look up and see their whole team has pushed forward — your winger is alone near the halfway line.",
       "options": [
        {
         "text": "Hold it, calm everyone down, and play short.",
         "correct": false,
         "feedback": "You've just been handed a counter-attack. Playing slow throws it away."
        },
        {
         "text": "Throw or kick it quickly and accurately to the winger in space.",
         "correct": true,
         "feedback": "Yes. They're unbalanced — go fast while they're still turning."
        },
        {
         "text": "Kick it as far as you can downfield.",
         "correct": false,
         "feedback": "Distance isn't the point. Accuracy is. A hopeful hoof becomes their possession."
        }
       ]
      },
      {
       "situation": "Goal kick. Their two strikers are pressing high, standing close to your centre-backs.",
       "options": [
        {
         "text": "Play short to the centre-back as usual.",
         "correct": false,
         "feedback": "That's exactly what the press wants. A lost ball there is a shot on goal."
        },
        {
         "text": "Go long over the press into the space behind their strikers, or to a target player.",
         "correct": true,
         "feedback": "Right. A high press leaves space behind it. Make them pay for it."
        },
        {
         "text": "Wait until they get bored and drop off.",
         "correct": false,
         "feedback": "You'll run out of time and have to rush. Decide and act."
        }
       ]
      },
      {
       "situation": "A back pass comes to you, slightly slow. Their striker is sprinting at you from your left.",
       "options": [
        {
         "text": "Take a touch to control, then look for a pass.",
         "correct": false,
         "feedback": "Touch under pressure is how keepers get robbed. First time, away from the pressure."
        },
        {
         "text": "Play it first time with your right foot, away from the striker, to the full-back on the right.",
         "correct": true,
         "feedback": "Yes. First time, away from the pressure, to a safe side. Know this before the ball arrives."
        },
        {
         "text": "Pick it up.",
         "correct": false,
         "feedback": "Deliberate back pass — you can't use your hands. That's an indirect free kick in your box."
        }
       ]
      },
      {
       "situation": "A shot from distance is hit low and hard to your left. You can save it but not hold it.",
       "options": [
        {
         "text": "Parry it back out in front of goal.",
         "correct": false,
         "feedback": "Into the middle is where the strikers are. Never push a save back into the danger zone."
        },
        {
         "text": "Parry it wide, away from goal, towards the corner flag.",
         "correct": true,
         "feedback": "Right. Wide and away. A corner is a far better outcome than a rebound."
        },
        {
         "text": "Try to catch it anyway.",
         "correct": false,
         "feedback": "If you can't hold it, trying to catch means a spill in the worst place. Push it wide with intent."
        }
       ]
      },
      {
       "situation": "A striker gets the ball side-on in the box, a defender close behind him. He's shaping to shoot across you, or to cut it back.",
       "options": [
        {
         "text": "Dive early across goal to cover the far corner.",
         "correct": false,
         "feedback": "Going early is what he's waiting for. Stay up."
        },
        {
         "text": "Set, stay big, cover the near post with position, and tell the defender 'BLOCK — DON'T DIVE IN!'",
         "correct": true,
         "feedback": "Yes. Make him beat a set keeper; let the defender's pressure do the rest. A diving defender gives him the choice."
        },
        {
         "text": "Rush him.",
         "correct": false,
         "feedback": "He has the ball under control with a defender arriving. Rushing takes away the defender's chance to block."
        }
       ]
      },
      {
       "situation": "A ball is lifted into your box. It will drop around the penalty spot. You and a defender both go for it, and he hasn't heard you.",
       "options": [
        {
         "text": "Stop and let him head it.",
         "correct": false,
         "feedback": "Half-stopping is the worst option. Either you called early and you go, or you let him have it clearly — and you call that too."
        },
        {
         "text": "Go anyway and hope.",
         "correct": false,
         "feedback": "A collision with your own defender in your own box ends badly. The problem was the call, not the decision."
        },
        {
         "text": "Shout 'AWAY!' clearly so he knows to clear it, and get set behind him.",
         "correct": true,
         "feedback": "Right in the moment — fix it with a clear call and get ready for the second ball. The lesson: call 'KEEPER'S!' earlier next time, before you move."
        }
       ]
      },
      {
       "situation": "You've just made a save and the ball is loose in the six-yard box. Two attackers are reacting.",
       "options": [
        {
         "text": "Get up and set for the second shot.",
         "correct": false,
         "feedback": "A loose ball in the six-yard box is yours. Getting set is for when you can't reach it."
        },
        {
         "text": "Dive on it with your hands and body, protecting your head.",
         "correct": true,
         "feedback": "Yes. Smother it. Body behind the ball, hands around it, head tucked. End the attack."
        },
        {
         "text": "Kick it clear from the ground.",
         "correct": false,
         "feedback": "A rushed kick from the ground is a gift to the second attacker. Use your hands — you're the only one who can."
        }
       ]
      },
      {
       "situation": "You've got the ball in your hands. Their team is fully organised, everyone back. No quick options.",
       "options": [
        {
         "text": "Launch it long for the striker to chase.",
         "correct": false,
         "feedback": "Into an organised defence, that's a coin flip at best. Keep the ball."
        },
        {
         "text": "Roll it to a free full-back and move to offer the return pass.",
         "correct": true,
         "feedback": "Right. No pressure means no reason to gamble. Keep it and build together."
        },
        {
         "text": "Hold it for six seconds to let everyone rest.",
         "correct": false,
         "feedback": "Waiting doesn't improve anything. Decide and play."
        }
       ]
      }
     ],
     "id": "decision-check"
    }
   ]
  },
  {
   "id": "ball",
   "kicker": "Section 05",
   "title": "With the Ball",
   "lede": "Modern keepers start attacks. Every time you have the ball is a decision about the next five seconds of the match — and you're the one who gets to make it.",
   "blocks": [
    {
     "type": "prose",
     "html": "<p>You touch the ball more than most people think — every goal kick, every save, every back pass. Each of those is a chance to either give the ball away or start something. Keepers who treat distribution as an afterthought leak possession; keepers who treat it as a weapon make their team better.</p><p>Two principles cover almost everything: <strong>know your next action before you receive</strong>, and <strong>fast if they're broken, slow if they're set</strong>.</p>"
    },
    {
     "type": "tabs",
     "title": "The tools and when to use them",
     "items": [
      {
       "name": "Roll / bowl",
       "html": "<p><strong>Short distance, maximum accuracy.</strong> To a full-back or centre-back who has space and time. Keep it on the ground, into his path, to his far foot so he can play forward. Use it when they've dropped off and we're building.</p><p>Follow it: move immediately to give him a return pass.</p>"
      },
      {
       "name": "Throw (javelin / overarm)",
       "html": "<p><strong>Medium distance, fast and precise.</strong> To a winger or midfielder in space, especially on a counter. Faster and more accurate than a kick to the same spot. Aim for his feet or a yard in front, on the side away from the nearest opponent.</p><p>This is the counter-attack weapon: catch, one look, throw.</p>"
      },
      {
       "name": "Side volley / half-volley",
       "html": "<p><strong>Long distance from your hands, lower trajectory.</strong> Reaches a target player quickly over a press. Choose a target, not a direction — a long ball to no one is a turnover.</p>"
      },
      {
       "name": "Goal kick — short",
       "html": "<p>Default when they're not pressing. To a centre-back who's split wide or a full-back. You immediately become an option again: step to the side, show for the ball.</p><p>If their striker starts to press the receiver, your call is <em>\"man on — back to me\"</em> or <em>\"turn — time\"</em>. You see it before he does.</p>"
      },
      {
       "name": "Goal kick — long",
       "html": "<p>When they press high, or when we have a clear aerial target and want to play in their half. Aim at a zone where our player can win it or a teammate can pick up the second ball. Tell them: <em>\"long — second ball!\"</em></p>"
      },
      {
       "name": "Back pass with feet",
       "html": "<p>The one that gets keepers in trouble. Rules: know where the pressure is before the ball arrives; receive on the foot away from pressure; play first time if a striker is closing; never dribble past a striker in your own box. If in doubt, clear it high and wide — ugly and safe beats pretty and risky.</p>"
      }
     ]
    },
    {
     "type": "cards",
     "title": "Reading the picture before you release",
     "cols": 3,
     "items": [
      {
       "title": "Who's free?",
       "text": "Scan while the ball comes to you. By the time it's in your hands you should already have a target."
      },
      {
       "title": "Are they broken?",
       "text": "If the other team is still turning, go now — fast and direct. If they're organised, keep the ball."
      },
      {
       "title": "Where's the danger?",
       "text": "Never play a pass that puts a teammate under pressure facing his own goal in our third. If the safe pass isn't on, go long."
      }
     ]
    },
    {
     "type": "callout",
     "title": "The six-second rule is a budget, not a deadline",
     "html": "<p>You have six seconds with the ball in your hands. Use them. One good look is worth more than a rushed throw, but every second you hold it, the other team gets more organised. Make the picture, make the decision, go.</p>"
    },
    {
     "type": "checklist",
     "id": "ball-habits",
     "title": "Distribution habits",
     "items": [
      "I know who I'm playing to before the ball reaches me.",
      "After every short pass I move to offer the return.",
      "I can throw accurately to a moving target past the edge of the box.",
      "On a back pass under pressure, I play first time with the foot away from the striker.",
      "I tell the receiver what's behind him: 'time', 'man on', 'turn'."
     ]
    }
   ]
  },
  {
   "id": "setpieces",
   "kicker": "Section 07",
   "title": "Set Pieces",
   "lede": "The only moments in football where you get to organise everything before the ball moves. Keepers who use that time concede fewer goals — it really is that simple.",
   "blocks": [
    {
     "type": "prose",
     "html": "<p>Most teams at your level don't have a plan for set pieces, which is exactly why they concede from them. A keeper who takes charge of corners and free kicks — same set-up every time, every man accounted for, nobody taking the kick until you're ready — takes a huge amount of risk out of the match before it happens.</p><p>Agree a system with your coach. Then <strong>own it</strong> on the pitch.</p>"
    },
    {
     "type": "tabs",
     "title": "Defending each situation",
     "items": [
      {
       "name": "Corners",
       "html": "<p><strong>Your position:</strong> slightly past the centre of the goal towards the far post, on or just off the line, body open so you can see the kicker and the box. The six-yard box is your territory — anything in it is yours.</p><p><strong>Before the kick:</strong> posts covered (if your system uses them), zone players in the six-yard box, every attacker marked. Point at any free man and give him to someone. Watch for the short corner — one player ready to go to it.</p><p><strong>At the kick:</strong> decide early — <em>Keeper's!</em> or <em>Away!</em> — and make the whole box hear it. If you come, come with intent and take it at the highest point. If you stay, be set for the header.</p><p><strong>After:</strong> second ball. Where did the clearance land? Who's arriving? Call it.</p>"
      },
      {
       "name": "Free kicks — direct",
       "html": "<p><strong>Wall:</strong> enough players to cover the near-post side of the goal (usually 3–5 depending on distance and angle). Line it up from behind the ball: the outside player of the wall should be just outside the line from ball to near post. Then <strong>you</strong> cover the far side.</p><p><strong>Your position:</strong> where you can see the ball. Never behind the wall. Usually just off centre towards the far post, set and still as the ball is struck.</p><p><strong>Watch for:</strong> the pass instead of the shot, the player sneaking in behind the wall, the quick kick.</p>"
      },
      {
       "name": "Free kicks — wide / indirect",
       "html": "<p>Treat it like a corner that can also be shot. Mark everyone, zone the six-yard box, one or two in the wall if there's any shooting angle.</p><p>Your start position is near-post side but off the line enough to attack the ball. The danger is the near-post flick and the far-post runner — call both before the kick.</p>"
      },
      {
       "name": "Penalties",
       "html": "<p>You have nothing to lose and the taker has everything to lose. That is a real advantage — use it.</p><p>Stay big and still as long as you can; most youth takers decide late and look at the keeper. If you've seen him take one before, remember where it went. Pick a side as he plants his foot, not before. Whatever happens, be ready for the rebound — it's the most-forgotten part of a penalty.</p>"
      },
      {
       "name": "Long throws",
       "html": "<p>A long throw is a corner from a different angle. Same organisation: mark up, zone the six, call early. The ball tends to come lower and flatter than a corner — flick-ons at the near post are the main threat. Be ready to come and claim anything that reaches the six-yard box.</p>"
      }
     ]
    },
    {
     "type": "cards",
     "title": "Your own set pieces",
     "cols": 2,
     "items": [
      {
       "title": "Our corner",
       "text": "Where do you stand? Usually on the edge of your box, ready for the counter. Your job is the ball over the top if they break: be the sweeper. Call your two defenders who stay back into position."
      },
      {
       "title": "Our free kick in their half",
       "text": "Same — you're the last line against the counter. Edge of the box, on your toes, watching their fastest player."
      }
     ]
    },
    {
     "type": "checklist",
     "id": "setpiece-habits",
     "title": "Set piece routine",
     "intro": "Before every corner or free kick against us:",
     "items": [
      "I've told the players who are on the posts / zoning (if that's our system).",
      "Every one of their players in the box has a name attached to him.",
      "I've checked for the short option and someone is ready for it.",
      "I'm in my position with my body open before the kicker starts his run-up.",
      "I've decided my call — Keeper's or Away — as early as the flight of the ball allows."
     ]
    }
   ]
  },
  {
   "id": "simulator",
   "kicker": "Section 08",
   "title": "The Simulator",
   "lede": "Real plays, in motion. Watch the picture develop, make your call when it freezes, then watch what your decision does to the match. No clock — until you want one.",
   "blocks": [
    {
     "type": "prose",
     "html": "<p>Each scenario plays out from above exactly as a match would — the pass travels, the runner goes, the line moves — and stops at the moment you'd have to decide. White is us, red is them, green is you. The dashed line across the pitch is your defensive line (your deepest defender). The green wedge is what the shooter can see of your goal, and the darker part is what you're covering; the gap between them is the goal he's being offered.</p><p>Options are <strong>best</strong>, <strong>playable</strong>, or <strong>poor</strong>. After you choose, your decision plays out. If there was a better one, watch it — the difference between the two clips is the lesson.</p><p>Start with <em>No clock</em>. Use <em>Slow</em> and <em>Replay</em> as much as you like — studying the picture is the point. When the reads are right every time, switch the pressure on.</p>"
    },
    {
     "type": "simulator",
     "title": "Defending — read the play",
     "intro": "Where is the danger, and what do you do about it?",
     "set": "defend"
    },
    {
     "type": "simulator",
     "title": "Distribution — pick the pass",
     "intro": "The ball is yours. Where does it go, and how fast?",
     "set": "distribute"
    },
    {
     "type": "callout",
     "title": "How to use the clock",
     "html": "<p>When you can get every scenario right with no clock, switch to <em>Calm</em> (12 seconds). When that's easy, <em>Pressure</em> (6). <em>Match speed</em> (3 seconds) is a real match: you see the picture and you've already decided. Nobody passes Match speed first time. That's the point.</p>"
    }
   ]
  }
 ],
 "sets": {
  "defend": {
   "capability": "simulator",
   "scenarios": [
    {
     "id": "d1",
     "label": "Ball over the top",
     "phase": "Transition",
     "question": "Their 10 has lifted a ball over your line towards the penalty spot. Their 9 is on the shoulder of your centre-backs and sprinting. You'll reach it at about the same time he does.",
     "setup": {
      "ball": {
       "x": 50,
       "y": 22
      },
      "keeper": {
       "x": 50,
       "y": 56
      },
      "us": [
       {
        "id": "lb",
        "x": 30,
        "y": 36,
        "n": "LB"
       },
       {
        "id": "cb1",
        "x": 44,
        "y": 34,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 58,
        "y": 35,
        "n": "CB"
       },
       {
        "id": "rb",
        "x": 70,
        "y": 37,
        "n": "RB"
       }
      ],
      "them": [
       {
        "id": "t10",
        "x": 50,
        "y": 22,
        "n": "10"
       },
       {
        "id": "t9",
        "x": 52,
        "y": 33,
        "n": "9"
       },
       {
        "id": "t7",
        "x": 28,
        "y": 30
       }
      ]
     },
     "play": {
      "duration": 1.4,
      "overlays": [
       "offside",
       "run"
      ],
      "tracks": {
       "ball": [
        {
         "t": 0.1,
         "x": 50,
         "y": 22,
         "h": 0
        },
        {
         "t": 1.1,
         "x": 51.5,
         "y": 40,
         "h": 1
        },
        {
         "t": 1.4,
         "x": 52,
         "y": 44,
         "h": 0.7
        }
       ],
       "them.t9": [
        {
         "t": 0.1,
         "x": 52,
         "y": 33
        },
        {
         "t": 1.4,
         "x": 52,
         "y": 44
        }
       ],
       "us.cb1": [
        {
         "t": 0.3,
         "x": 44,
         "y": 34
        },
        {
         "t": 1.4,
         "x": 46,
         "y": 41
        }
       ],
       "us.cb2": [
        {
         "t": 0.3,
         "x": 58,
         "y": 35
        },
        {
         "t": 1.4,
         "x": 56,
         "y": 42
        }
       ],
       "keeper": [
        {
         "t": 1.4,
         "x": 50,
         "y": 55
        }
       ]
      }
     },
     "options": [
      {
       "text": "Sprint out and win it — commit now.",
       "grade": "poor",
       "feedback": "'About the same time' isn't first. If he gets a toe to it you're off your line with an open net.",
       "outcome": {
        "duration": 2.2,
        "result": "goal",
        "caption": "You arrive a half-step late. One touch past you, empty net. A gamble you lose costs a goal; a gamble you win saves a chance — the maths is against you.",
        "tracks": {
         "keeper": [
          {
           "t": 0.8,
           "x": 51.5,
           "y": 50
          },
          {
           "t": 1.2,
           "x": 52,
           "y": 49
          }
         ],
         "them.t9": [
          {
           "t": 0.7,
           "x": 52,
           "y": 50
          },
          {
           "t": 1.1,
           "x": 54,
           "y": 52
          },
          {
           "t": 1.6,
           "x": 55,
           "y": 55
          }
         ],
         "ball": [
          {
           "t": 0.7,
           "x": 52,
           "y": 50,
           "h": 0
          },
          {
           "t": 1.1,
           "x": 55,
           "y": 53,
           "h": 0
          },
          {
           "t": 2,
           "x": 50,
           "y": 67.5,
           "h": 0.1
          }
         ],
         "us.cb1": [
          {
           "t": 1.8,
           "x": 48,
           "y": 50
          }
         ],
         "us.cb2": [
          {
           "t": 1.8,
           "x": 55,
           "y": 52
          }
         ]
        }
       }
      },
      {
       "text": "Come forward while it travels, get big and set as he reaches it. Call 'Recover!' to the CBs.",
       "grade": "best",
       "feedback": "You narrow the angle without gambling, and the striker has to beat a set keeper from close range with defenders arriving. Most don't.",
       "outcome": {
        "duration": 2.6,
        "result": "saved",
        "caption": "You're set at the top of the six-yard box when he strikes — he has to beat a keeper who's big and still, with two defenders closing. Saved, and the ball goes wide. That's a 1v1 won with position, not with a dive.",
        "overlays": [
         "cone",
         "run"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 0.9,
           "x": 50.5,
           "y": 59
          },
          {
           "t": 1.9,
           "x": 50.5,
           "y": 59
          },
          {
           "t": 2.3,
           "x": 47,
           "y": 61
          }
         ],
         "them.t9": [
          {
           "t": 0.7,
           "x": 52,
           "y": 50
          },
          {
           "t": 1.4,
           "x": 52,
           "y": 54
          },
          {
           "t": 1.9,
           "x": 52,
           "y": 56
          }
         ],
         "ball": [
          {
           "t": 0.7,
           "x": 52,
           "y": 50,
           "h": 0
          },
          {
           "t": 1.4,
           "x": 52,
           "y": 54.5,
           "h": 0
          },
          {
           "t": 1.9,
           "x": 52,
           "y": 56,
           "h": 0
          },
          {
           "t": 2.3,
           "x": 46,
           "y": 62,
           "h": 0.2
          },
          {
           "t": 2.6,
           "x": 38,
           "y": 66,
           "h": 0.1
          }
         ],
         "us.cb1": [
          {
           "t": 1.9,
           "x": 49,
           "y": 54
          }
         ],
         "us.cb2": [
          {
           "t": 1.9,
           "x": 55,
           "y": 55
          }
         ]
        }
       }
      },
      {
       "text": "Stay on the line and get set for the shot.",
       "grade": "poor",
       "feedback": "From the line he sees the whole goal and has time to take a touch. Far too passive.",
       "outcome": {
        "duration": 2.8,
        "result": "goal",
        "caption": "He has time to take a touch and pick his corner. From the goal line you cover a fraction of the goal he can see. The wedge tells the story.",
        "overlays": [
         "cone"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 1.3,
           "x": 50,
           "y": 66.5
          }
         ],
         "them.t9": [
          {
           "t": 0.7,
           "x": 52,
           "y": 50
          },
          {
           "t": 1.5,
           "x": 52,
           "y": 56
          },
          {
           "t": 2.1,
           "x": 52,
           "y": 58
          }
         ],
         "ball": [
          {
           "t": 0.7,
           "x": 52,
           "y": 50,
           "h": 0
          },
          {
           "t": 1.5,
           "x": 52,
           "y": 56,
           "h": 0
          },
          {
           "t": 2.1,
           "x": 52,
           "y": 58.5,
           "h": 0
          },
          {
           "t": 2.6,
           "x": 45.5,
           "y": 67.5,
           "h": 0.15
          }
         ],
         "us.cb1": [
          {
           "t": 2.1,
           "x": 49,
           "y": 55
          }
         ],
         "us.cb2": [
          {
           "t": 2.1,
           "x": 55,
           "y": 56
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d2",
     "label": "Line too deep",
     "phase": "They have the ball",
     "question": "Their centre-back has the ball on the halfway line, nobody pressing him. Your back four is sitting on the edge of the box. Their 10 and 9 have fifteen metres of free space in front of your defence to receive in.",
     "setup": {
      "ball": {
       "x": 50,
       "y": 12
      },
      "keeper": {
       "x": 50,
       "y": 62
      },
      "us": [
       {
        "id": "lb",
        "x": 28,
        "y": 48,
        "n": "LB"
       },
       {
        "id": "cb1",
        "x": 42,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 58,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "rb",
        "x": 72,
        "y": 48,
        "n": "RB"
       },
       {
        "id": "cm",
        "x": 50,
        "y": 30,
        "n": "CM"
       }
      ],
      "them": [
       {
        "id": "cb",
        "x": 50,
        "y": 12,
        "n": "CB"
       },
       {
        "id": "t10",
        "x": 40,
        "y": 34,
        "n": "10"
       },
       {
        "id": "t9",
        "x": 62,
        "y": 36,
        "n": "9"
       }
      ]
     },
     "play": {
      "duration": 1.6,
      "overlays": [
       "offside",
       "run"
      ],
      "tracks": {
       "them.cb": [
        {
         "t": 1.6,
         "x": 50,
         "y": 15
        }
       ],
       "ball": [
        {
         "t": 1.6,
         "x": 50,
         "y": 15,
         "h": 0
        }
       ],
       "them.t10": [
        {
         "t": 1.6,
         "x": 41,
         "y": 38
        }
       ],
       "them.t9": [
        {
         "t": 1.6,
         "x": 60,
         "y": 40
        }
       ]
      }
     },
     "options": [
      {
       "text": "Nothing — the line is deep and safe, no one can get behind.",
       "grade": "poor",
       "feedback": "Nobody can get behind, but their 10 can receive, turn and shoot from the edge of the box unpressured. The gap between your defence and midfield is the problem.",
       "outcome": {
        "duration": 3.2,
        "result": "chance",
        "caption": "Pass into the gap, the 10 turns unpressured, shot from the D. You might save it — but you've let a chance exist that never needed to. Count how much space he had.",
        "overlays": [
         "offside",
         "pressure",
         "cone"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.1,
           "x": 50,
           "y": 15,
           "h": 0
          },
          {
           "t": 1.1,
           "x": 42,
           "y": 39,
           "h": 0
          },
          {
           "t": 1.9,
           "x": 46,
           "y": 42,
           "h": 0
          },
          {
           "t": 2.4,
           "x": 46,
           "y": 43,
           "h": 0
          },
          {
           "t": 3.2,
           "x": 54.5,
           "y": 67.5,
           "h": 0.3
          }
         ],
         "them.t10": [
          {
           "t": 1.1,
           "x": 42,
           "y": 39
          },
          {
           "t": 1.9,
           "x": 46,
           "y": 42
          },
          {
           "t": 2.4,
           "x": 46,
           "y": 43
          }
         ],
         "us.cb1": [
          {
           "t": 1.4,
           "x": 42,
           "y": 50
          },
          {
           "t": 2.4,
           "x": 44,
           "y": 47
          }
         ],
         "keeper": [
          {
           "t": 2.4,
           "x": 49,
           "y": 62
          },
          {
           "t": 3,
           "x": 54,
           "y": 65
          }
         ]
        }
       }
      },
      {
       "text": "'Step up! Squeeze!' — push the line to the edge of the D, and move up yourself.",
       "grade": "best",
       "feedback": "Compress the space so their 10 and 9 have nowhere to receive. You move up with the line so you can sweep anything over the top.",
       "outcome": {
        "duration": 3.4,
        "result": "kept",
        "caption": "The whole line steps together — watch the dashed line move. The 10 is now in a crowd, the pass into him is intercepted, and you're high enough to sweep anything over the top. The chance never existed.",
        "overlays": [
         "offside",
         "run"
        ],
        "tracks": {
         "us.lb": [
          {
           "t": 1.2,
           "x": 30,
           "y": 38
          }
         ],
         "us.cb2": [
          {
           "t": 1.2,
           "x": 58,
           "y": 40
          }
         ],
         "us.rb": [
          {
           "t": 1.2,
           "x": 72,
           "y": 38
          }
         ],
         "keeper": [
          {
           "t": 1.4,
           "x": 50,
           "y": 52
          }
         ],
         "ball": [
          {
           "t": 1.4,
           "x": 50,
           "y": 15,
           "h": 0
          },
          {
           "t": 2.3,
           "x": 42,
           "y": 38,
           "h": 0
          },
          {
           "t": 3.4,
           "x": 36,
           "y": 30,
           "h": 0
          }
         ],
         "them.t10": [
          {
           "t": 2.3,
           "x": 42,
           "y": 40
          }
         ],
         "us.cb1": [
          {
           "t": 1.2,
           "x": 43,
           "y": 40
          },
          {
           "t": 2.3,
           "x": 43,
           "y": 38.5
          },
          {
           "t": 3.4,
           "x": 36,
           "y": 30
          }
         ]
        }
       }
      },
      {
       "text": "'Tight!' — tell the CBs to go man-to-man on the 10 and 9.",
       "grade": "ok",
       "feedback": "It deals with the two players, but it pulls your CBs out of the line and leaves holes. Moving the whole line is cleaner.",
       "outcome": {
        "duration": 3,
        "result": "chance",
        "caption": "Your CBs go to their men — and now there are two holes in the line where they were. Their CB plays it over the top into the space. You've swapped one problem for another; the whole line moving together solves both.",
        "overlays": [
         "offside",
         "run"
        ],
        "tracks": {
         "us.cb1": [
          {
           "t": 1,
           "x": 42,
           "y": 41
          }
         ],
         "us.cb2": [
          {
           "t": 1,
           "x": 59,
           "y": 42
          }
         ],
         "ball": [
          {
           "t": 1,
           "x": 50,
           "y": 15,
           "h": 0
          },
          {
           "t": 2.4,
           "x": 52,
           "y": 44,
           "h": 1
          },
          {
           "t": 3,
           "x": 52,
           "y": 52,
           "h": 0
          }
         ],
         "them.t9": [
          {
           "t": 1,
           "x": 60,
           "y": 40
          },
          {
           "t": 3,
           "x": 53,
           "y": 51
          }
         ],
         "keeper": [
          {
           "t": 3,
           "x": 50,
           "y": 57
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d3",
     "label": "Back-post runner",
     "phase": "Cross coming",
     "question": "Their 7 has beaten your right-back and looked up. Both your CBs are on their 9 in the middle. Their 11 is ghosting in at the back post and your left-back hasn't seen him.",
     "setup": {
      "ball": {
       "x": 14,
       "y": 44
      },
      "keeper": {
       "x": 46,
       "y": 64
      },
      "us": [
       {
        "id": "rb",
        "x": 20,
        "y": 46,
        "n": "RB"
       },
       {
        "id": "cb1",
        "x": 40,
        "y": 56,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 52,
        "y": 57,
        "n": "CB"
       },
       {
        "id": "lb",
        "x": 66,
        "y": 52,
        "n": "LB"
       }
      ],
      "them": [
       {
        "id": "t7",
        "x": 14,
        "y": 44,
        "n": "7"
       },
       {
        "id": "t9",
        "x": 46,
        "y": 58,
        "n": "9"
       },
       {
        "id": "t11",
        "x": 74,
        "y": 50,
        "n": "11"
       }
      ]
     },
     "play": {
      "duration": 1.5,
      "overlays": [
       "run"
      ],
      "tracks": {
       "them.t7": [
        {
         "t": 1.5,
         "x": 16,
         "y": 50
        }
       ],
       "ball": [
        {
         "t": 1.5,
         "x": 16.5,
         "y": 50.5,
         "h": 0
        }
       ],
       "them.t11": [
        {
         "t": 1.5,
         "x": 70,
         "y": 54
        }
       ],
       "us.lb": [
        {
         "t": 1.5,
         "x": 64,
         "y": 52
        }
       ],
       "them.t9": [
        {
         "t": 1.5,
         "x": 47,
         "y": 59
        }
       ],
       "us.cb1": [
        {
         "t": 1.5,
         "x": 42,
         "y": 58
        }
       ],
       "us.cb2": [
        {
         "t": 1.5,
         "x": 51,
         "y": 59
        }
       ]
      }
     },
     "options": [
      {
       "text": "Shift towards the back post to cover the 11 myself.",
       "grade": "poor",
       "feedback": "That opens the near post, and you'll arrive late for a header anyway. Position for the ball; cover the runner with your voice.",
       "outcome": {
        "duration": 3,
        "result": "goal",
        "caption": "The 7 sees you drift and drives it low to the near post. You're moving the wrong way when it's struck. Your position covers the ball; your voice covers the runner — never swap them.",
        "overlays": [
         "cone"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 1,
           "x": 52,
           "y": 65
          }
         ],
         "ball": [
          {
           "t": 0.9,
           "x": 16.5,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 2.6,
           "x": 45.2,
           "y": 67.5,
           "h": 0.1
          }
         ]
        }
       }
      },
      {
       "text": "'Back post — Lerato, yours!' now, before the cross. Hold near-post side, body open, ready to attack the ball.",
       "grade": "best",
       "feedback": "The call puts a body on the runner while you stay in position to deal with the cross. This has to happen as the 7's head goes up.",
       "outcome": {
        "duration": 3.4,
        "result": "cleared",
        "caption": "Your left-back hears you and goes with the 11. The cross comes to the back post — and now there's a defender there to head it clear. You never touched the ball. You prevented the goal.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "us.lb": [
          {
           "t": 0.6,
           "x": 66,
           "y": 55
          },
          {
           "t": 2.4,
           "x": 62,
           "y": 61
          }
         ],
         "them.t11": [
          {
           "t": 2.4,
           "x": 63,
           "y": 62
          }
         ],
         "ball": [
          {
           "t": 0.9,
           "x": 16.5,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 2.4,
           "x": 61,
           "y": 61,
           "h": 0.6
          },
          {
           "t": 3.4,
           "x": 80,
           "y": 44,
           "h": 0.8
          }
         ],
         "keeper": [
          {
           "t": 2.4,
           "x": 47,
           "y": 63
          }
         ]
        }
       }
      },
      {
       "text": "'Keeper's!' — come and claim whatever comes in.",
       "grade": "poor",
       "feedback": "You can't claim a cross you haven't seen yet, and if it goes to the back post you've committed to nothing. Decide once the ball is in the air.",
       "outcome": {
        "duration": 3.2,
        "result": "goal",
        "caption": "You've called for a ball you can't reach. Your defenders pull out because you said 'Keeper's', the cross sails over you to the back post, and the 11 heads it in with nobody near him. The call has to match what you can actually do.",
        "tracks": {
         "keeper": [
          {
           "t": 1.4,
           "x": 46,
           "y": 61
          },
          {
           "t": 2.4,
           "x": 52,
           "y": 59
          }
         ],
         "us.cb2": [
          {
           "t": 1.6,
           "x": 48,
           "y": 61
          }
         ],
         "them.t11": [
          {
           "t": 2.4,
           "x": 62,
           "y": 61
          }
         ],
         "ball": [
          {
           "t": 0.9,
           "x": 16.5,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 2.4,
           "x": 61,
           "y": 60.5,
           "h": 0.6
          },
          {
           "t": 3,
           "x": 53,
           "y": 67.5,
           "h": 0.2
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d4",
     "label": "Cut-back",
     "phase": "They have the ball",
     "question": "Their 7 has reached the by-line. Both your CBs have dropped to the six-yard box with their 9. Their 10 is arriving unmarked at the penalty spot. Your midfielder is nowhere near.",
     "setup": {
      "ball": {
       "x": 24,
       "y": 58
      },
      "keeper": {
       "x": 44,
       "y": 66
      },
      "us": [
       {
        "id": "rb",
        "x": 27,
        "y": 56,
        "n": "RB"
       },
       {
        "id": "cb1",
        "x": 42,
        "y": 58,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 54,
        "y": 60,
        "n": "CB"
       },
       {
        "id": "cm",
        "x": 50,
        "y": 36,
        "n": "CM"
       }
      ],
      "them": [
       {
        "id": "t7",
        "x": 24,
        "y": 58,
        "n": "7"
       },
       {
        "id": "t10",
        "x": 50,
        "y": 44,
        "n": "10"
       },
       {
        "id": "t9",
        "x": 56,
        "y": 60,
        "n": "9"
       }
      ]
     },
     "play": {
      "duration": 1.4,
      "overlays": [
       "run"
      ],
      "tracks": {
       "them.t7": [
        {
         "t": 1.4,
         "x": 23,
         "y": 65
        }
       ],
       "ball": [
        {
         "t": 1.4,
         "x": 23.5,
         "y": 65.5,
         "h": 0
        }
       ],
       "us.rb": [
        {
         "t": 1.4,
         "x": 25,
         "y": 63
        }
       ],
       "them.t10": [
        {
         "t": 1.4,
         "x": 50,
         "y": 50
        }
       ],
       "us.cb1": [
        {
         "t": 1.4,
         "x": 42,
         "y": 61
        }
       ],
       "us.cb2": [
        {
         "t": 1.4,
         "x": 54,
         "y": 62
        }
       ],
       "keeper": [
        {
         "t": 1.4,
         "x": 43,
         "y": 67
        }
       ]
      }
     },
     "options": [
      {
       "text": "Stand on the near post — nothing goes in at the near post.",
       "grade": "ok",
       "feedback": "Right about the near post, but you've said nothing about the real danger. The near post is yours anyway; the cut-back is the goal.",
       "outcome": {
        "duration": 3,
        "result": "goal",
        "caption": "Near post covered — and the ball never goes there. The pull-back finds the 10 at the penalty spot with no one within five metres. Your body did its job; your voice didn't.",
        "overlays": [
         "pressure"
        ],
        "tracks": {
         "them.t10": [
          {
           "t": 1.2,
           "x": 50,
           "y": 53
          }
         ],
         "ball": [
          {
           "t": 0.4,
           "x": 23.5,
           "y": 65.5,
           "h": 0
          },
          {
           "t": 1.3,
           "x": 49,
           "y": 53.5,
           "h": 0
          },
          {
           "t": 1.8,
           "x": 50,
           "y": 54,
           "h": 0
          },
          {
           "t": 2.5,
           "x": 53.5,
           "y": 67.5,
           "h": 0.2
          }
         ],
         "keeper": [
          {
           "t": 1.3,
           "x": 44,
           "y": 67
          },
          {
           "t": 2.5,
           "x": 50,
           "y": 65
          }
         ]
        }
       }
      },
      {
       "text": "Near post with position, and 'Musa — cut-back! Penalty spot!' to pull a CB out to the 10.",
       "grade": "best",
       "feedback": "You cover what your body can cover and use your voice for what it can't. One CB on the 9 is enough in the six-yard box.",
       "outcome": {
        "duration": 3,
        "result": "cleared",
        "caption": "Your left CB steps to the penalty spot as the 10 arrives. The pull-back comes — and he blocks it. One sentence from you turned a free shot into a block. That's the whole lesson of Section 06.",
        "overlays": [
         "pressure",
         "run"
        ],
        "tracks": {
         "us.cb1": [
          {
           "t": 0.5,
           "x": 42,
           "y": 61
          },
          {
           "t": 1.4,
           "x": 48,
           "y": 53
          }
         ],
         "them.t10": [
          {
           "t": 1.2,
           "x": 50,
           "y": 53
          }
         ],
         "ball": [
          {
           "t": 0.4,
           "x": 23.5,
           "y": 65.5,
           "h": 0
          },
          {
           "t": 1.3,
           "x": 48.5,
           "y": 53.5,
           "h": 0
          },
          {
           "t": 2.2,
           "x": 40,
           "y": 42,
           "h": 0.4
          }
         ],
         "keeper": [
          {
           "t": 1.3,
           "x": 44,
           "y": 67
          }
         ]
        }
       }
      },
      {
       "text": "Come off the line to attack the 7 and block.",
       "grade": "poor",
       "feedback": "He's on the by-line with a defender close; your rushing out leaves the whole goal open to the pull-back.",
       "outcome": {
        "duration": 2.8,
        "result": "goal",
        "caption": "You charge the 7; he simply rolls it inside before you arrive. The 10 side-foots into an open goal. Your RB was already pressuring the 7 — your job was the goal.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 1.4,
           "x": 30,
           "y": 65
          }
         ],
         "them.t10": [
          {
           "t": 1.2,
           "x": 50,
           "y": 53
          }
         ],
         "ball": [
          {
           "t": 0.6,
           "x": 23.5,
           "y": 65.5,
           "h": 0
          },
          {
           "t": 1.5,
           "x": 49,
           "y": 54,
           "h": 0
          },
          {
           "t": 2,
           "x": 50,
           "y": 54,
           "h": 0
          },
          {
           "t": 2.6,
           "x": 50,
           "y": 67.5,
           "h": 0.1
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d5",
     "label": "1v1 — heavy touch",
     "phase": "1v1",
     "question": "Their 9 is through alone. His first touch has gone heavy — three metres ahead of him, towards the penalty spot. You're at the top of your six-yard box.",
     "setup": {
      "ball": {
       "x": 50,
       "y": 38
      },
      "keeper": {
       "x": 50,
       "y": 59
      },
      "us": [
       {
        "id": "cb1",
        "x": 38,
        "y": 34,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 62,
        "y": 36,
        "n": "CB"
       }
      ],
      "them": [
       {
        "id": "t9",
        "x": 50,
        "y": 36,
        "n": "9"
       }
      ]
     },
     "play": {
      "duration": 1.3,
      "overlays": [
       "run",
       "cone"
      ],
      "tracks": {
       "them.t9": [
        {
         "t": 0.4,
         "x": 50,
         "y": 39
        },
        {
         "t": 1.3,
         "x": 50.5,
         "y": 43
        }
       ],
       "ball": [
        {
         "t": 0.4,
         "x": 50,
         "y": 40,
         "h": 0
        },
        {
         "t": 1.3,
         "x": 51,
         "y": 49,
         "h": 0
        }
       ],
       "us.cb1": [
        {
         "t": 1.3,
         "x": 41,
         "y": 39
        }
       ],
       "us.cb2": [
        {
         "t": 1.3,
         "x": 59,
         "y": 41
        }
       ],
       "keeper": [
        {
         "t": 1.3,
         "x": 50,
         "y": 58
        }
       ]
      }
     },
     "options": [
      {
       "text": "Hold position, stay big, make him beat me.",
       "grade": "ok",
       "feedback": "Safe and not wrong — but his touch has given you the ball. A heavy touch is the moment to go.",
       "outcome": {
        "duration": 2.8,
        "result": "saved",
        "caption": "You hold, he recovers the ball, and you save the shot — a fine outcome. But look at the frame where his touch went long: the ball was closer to you than to him. That was yours for free.",
        "overlays": [
         "cone"
        ],
        "tracks": {
         "them.t9": [
          {
           "t": 1,
           "x": 51,
           "y": 50
          },
          {
           "t": 1.6,
           "x": 51,
           "y": 53
          }
         ],
         "ball": [
          {
           "t": 1,
           "x": 51,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 1.6,
           "x": 51,
           "y": 53.5,
           "h": 0
          },
          {
           "t": 2.1,
           "x": 46,
           "y": 61,
           "h": 0.1
          },
          {
           "t": 2.8,
           "x": 36,
           "y": 66,
           "h": 0.1
          }
         ],
         "keeper": [
          {
           "t": 1.6,
           "x": 50,
           "y": 58
          },
          {
           "t": 2.1,
           "x": 46,
           "y": 61
          }
         ]
        }
       }
      },
      {
       "text": "Go now — attack the ball, get there first, body behind it, protect the head.",
       "grade": "best",
       "feedback": "His touch is loose and you're closer to the ball than he is. Decide while it's travelling, commit fully, and it's yours.",
       "outcome": {
        "duration": 1.8,
        "result": "saved",
        "caption": "You read the touch and go before it stops rolling. You're on the ball at the penalty spot while he's still a stride away. Hands around it, head tucked. Attack over, and you've got the ball to start the counter.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 0.9,
           "x": 51,
           "y": 51
          }
         ],
         "ball": [
          {
           "t": 0.3,
           "x": 51,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 0.9,
           "x": 51,
           "y": 51,
           "h": 0
          }
         ],
         "them.t9": [
          {
           "t": 0.9,
           "x": 51,
           "y": 47
          },
          {
           "t": 1.4,
           "x": 53,
           "y": 49
          }
         ]
        }
       }
      },
      {
       "text": "Drop back to the line to give myself more time.",
       "grade": "poor",
       "feedback": "Dropping gives him time to recover the ball and the whole goal to aim at. Never retreat from a loose touch.",
       "outcome": {
        "duration": 3,
        "result": "goal",
        "caption": "You back off, he collects the ball you could have had, and from the line you cover almost none of the goal he's looking at. Retreating turns your advantage into his.",
        "overlays": [
         "cone"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 1.2,
           "x": 50,
           "y": 66
          }
         ],
         "them.t9": [
          {
           "t": 1,
           "x": 51,
           "y": 50
          },
          {
           "t": 1.8,
           "x": 51,
           "y": 55
          }
         ],
         "ball": [
          {
           "t": 1,
           "x": 51,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 1.8,
           "x": 51,
           "y": 55.5,
           "h": 0
          },
          {
           "t": 2.2,
           "x": 51,
           "y": 56,
           "h": 0
          },
          {
           "t": 2.8,
           "x": 54.5,
           "y": 67.5,
           "h": 0.2
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d6",
     "label": "Edge of the box, unpressured",
     "phase": "They have the ball",
     "question": "Their 10 has received just outside the D. Both your midfielders are behind the ball, your back line is holding. He has a free shot if he wants it.",
     "setup": {
      "ball": {
       "x": 58,
       "y": 30
      },
      "keeper": {
       "x": 52,
       "y": 61
      },
      "us": [
       {
        "id": "lb",
        "x": 30,
        "y": 52,
        "n": "LB"
       },
       {
        "id": "cb1",
        "x": 44,
        "y": 54,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 56,
        "y": 53,
        "n": "CB"
       },
       {
        "id": "rb",
        "x": 70,
        "y": 52,
        "n": "RB"
       },
       {
        "id": "cm1",
        "x": 40,
        "y": 26,
        "n": "CM"
       },
       {
        "id": "cm2",
        "x": 66,
        "y": 24,
        "n": "CM"
       }
      ],
      "them": [
       {
        "id": "t10",
        "x": 60,
        "y": 34,
        "n": "10"
       },
       {
        "id": "t9",
        "x": 50,
        "y": 50,
        "n": "9"
       },
       {
        "id": "t8",
        "x": 58,
        "y": 28
       }
      ]
     },
     "play": {
      "duration": 1.5,
      "overlays": [
       "pressure",
       "cone",
       "run"
      ],
      "tracks": {
       "ball": [
        {
         "t": 0.6,
         "x": 60,
         "y": 38,
         "h": 0
        },
        {
         "t": 1.5,
         "x": 60,
         "y": 40,
         "h": 0
        }
       ],
       "them.t10": [
        {
         "t": 0.6,
         "x": 60,
         "y": 37
        },
        {
         "t": 1.5,
         "x": 60,
         "y": 39
        }
       ],
       "keeper": [
        {
         "t": 1.5,
         "x": 52.5,
         "y": 61
        }
       ]
      }
     },
     "options": [
      {
       "text": "Get set, on the angle, ready for the strike.",
       "grade": "ok",
       "feedback": "Necessary — but on its own it leaves him unpressured. A keeper set and a defender stepping is better than a keeper set alone.",
       "outcome": {
        "duration": 2.6,
        "result": "saved",
        "caption": "He has all the time he wants and picks his spot. You're set and you save it — this time. An unpressured shooter from the D scores often enough that you don't want to rely on the save.",
        "overlays": [
         "pressure",
         "cone"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.9,
           "x": 60,
           "y": 41,
           "h": 0
          },
          {
           "t": 1.6,
           "x": 46.5,
           "y": 67,
           "h": 0.15
          },
          {
           "t": 2.4,
           "x": 38,
           "y": 69,
           "h": 0.1
          }
         ],
         "keeper": [
          {
           "t": 0.9,
           "x": 52.5,
           "y": 61
          },
          {
           "t": 1.6,
           "x": 46.5,
           "y": 65
          }
         ]
        }
       }
      },
      {
       "text": "'Sipho — press! Close him!' to the nearest CB, and get set on the angle.",
       "grade": "best",
       "feedback": "A defender stepping even half a yard rushes the shot or forces a pass. You set for the strike at the same time.",
       "outcome": {
        "duration": 2.6,
        "result": "cleared",
        "caption": "Your CB steps out as he shapes to shoot. The shot is rushed and blocked. You were set anyway — the save was there if needed, but it wasn't. Pressure plus position.",
        "overlays": [
         "pressure",
         "run"
        ],
        "tracks": {
         "us.cb2": [
          {
           "t": 1.1,
           "x": 59,
           "y": 43
          }
         ],
         "ball": [
          {
           "t": 1.1,
           "x": 60,
           "y": 41,
           "h": 0
          },
          {
           "t": 1.4,
           "x": 59.5,
           "y": 43.5,
           "h": 0.1
          },
          {
           "t": 2.4,
           "x": 76,
           "y": 36,
           "h": 0.3
          }
         ],
         "keeper": [
          {
           "t": 1.1,
           "x": 52.5,
           "y": 61
          }
         ]
        }
       }
      },
      {
       "text": "Come forward off the line to narrow the angle.",
       "grade": "poor",
       "feedback": "From 20 metres, coming out makes you a chip target and you'll be moving when it's hit. Narrow with position, not distance.",
       "outcome": {
        "duration": 2.8,
        "result": "goal",
        "caption": "You rush out; he sees you coming and lifts it over you. From that distance the angle was already narrow enough — the only thing you added was a moving keeper and space behind him.",
        "overlays": [
         "cone"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 1,
           "x": 55,
           "y": 52
          }
         ],
         "ball": [
          {
           "t": 1,
           "x": 60,
           "y": 41,
           "h": 0
          },
          {
           "t": 1.9,
           "x": 52,
           "y": 60,
           "h": 0.9
          },
          {
           "t": 2.5,
           "x": 49,
           "y": 67.5,
           "h": 0.3
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d7",
     "label": "Corner — free man",
     "phase": "Set piece",
     "question": "Corner from the left. Everyone's marked except their 8, standing free near the penalty spot. The taker is starting his run-up.",
     "setup": {
      "ball": {
       "x": 2,
       "y": 69
      },
      "keeper": {
       "x": 52,
       "y": 66
      },
      "us": [
       {
        "id": "post",
        "x": 45,
        "y": 67.5,
        "n": "P"
       },
       {
        "id": "z1",
        "x": 40,
        "y": 62
       },
       {
        "id": "z2",
        "x": 50,
        "y": 62
       },
       {
        "id": "z3",
        "x": 58,
        "y": 60
       },
       {
        "id": "m1",
        "x": 47,
        "y": 56
       },
       {
        "id": "m2",
        "x": 61,
        "y": 50
       }
      ],
      "them": [
       {
        "id": "tk",
        "x": 2,
        "y": 69,
        "n": "T"
       },
       {
        "id": "t9",
        "x": 42,
        "y": 59,
        "n": "9"
       },
       {
        "id": "t5",
        "x": 52,
        "y": 58
       },
       {
        "id": "t6",
        "x": 60,
        "y": 56
       },
       {
        "id": "t4",
        "x": 62,
        "y": 49,
        "n": "4"
       },
       {
        "id": "t8",
        "x": 36,
        "y": 50,
        "n": "8"
       }
      ]
     },
     "play": {
      "duration": 1,
      "overlays": [
       "run"
      ],
      "tracks": {
       "them.tk": [
        {
         "t": 1,
         "x": 4,
         "y": 67
        }
       ],
       "them.t8": [
        {
         "t": 1,
         "x": 38,
         "y": 51
        }
       ]
      }
     },
     "options": [
      {
       "text": "Let the kick happen — I'll deal with the 8 if the ball comes to him.",
       "grade": "poor",
       "feedback": "A free man at a corner is a goal waiting to happen. You have the power to stop the kick; use it.",
       "outcome": {
        "duration": 3.2,
        "result": "goal",
        "caption": "The corner is driven to the penalty spot. The 8 arrives with a free run, no one touches him, and he heads it past you. You can't stop a free header from eight metres — you can stop him being free.",
        "tracks": {
         "ball": [
          {
           "t": 0.2,
           "x": 4,
           "y": 67,
           "h": 0
          },
          {
           "t": 1.9,
           "x": 46,
           "y": 54,
           "h": 0.9
          },
          {
           "t": 2.1,
           "x": 47,
           "y": 53.5,
           "h": 0.6
          },
          {
           "t": 2.8,
           "x": 54,
           "y": 67.5,
           "h": 0.3
          }
         ],
         "them.t8": [
          {
           "t": 2.1,
           "x": 47,
           "y": 53
          }
         ],
         "them.t9": [
          {
           "t": 2,
           "x": 43,
           "y": 62
          }
         ],
         "us.z1": [
          {
           "t": 2,
           "x": 41,
           "y": 63
          }
         ],
         "keeper": [
          {
           "t": 2.1,
           "x": 51,
           "y": 66
          },
          {
           "t": 2.8,
           "x": 54,
           "y": 66
          }
         ]
        }
       }
      },
      {
       "text": "'Stop! Who's got the 8?' — hold up the kick, give the 8 to the nearest marker, then set.",
       "grade": "best",
       "feedback": "Set pieces are the one time you can organise everything. Don't let the kick go until every man has a name.",
       "outcome": {
        "duration": 3.6,
        "result": "cleared",
        "caption": "Your spare marker goes to the 8 before the kick. Same delivery, same run — but now there's a defender on his shoulder and it's headed clear. Nothing dramatic happened. That's what organising looks like.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "us.m1": [
          {
           "t": 1.1,
           "x": 39,
           "y": 51
          },
          {
           "t": 2.8,
           "x": 46,
           "y": 53
          }
         ],
         "ball": [
          {
           "t": 1,
           "x": 4,
           "y": 67,
           "h": 0
          },
          {
           "t": 2.6,
           "x": 46,
           "y": 54,
           "h": 0.9
          },
          {
           "t": 2.8,
           "x": 46,
           "y": 53.5,
           "h": 0.6
          },
          {
           "t": 3.6,
           "x": 30,
           "y": 38,
           "h": 0.8
          }
         ],
         "them.t8": [
          {
           "t": 1,
           "x": 38,
           "y": 51
          },
          {
           "t": 2.8,
           "x": 47,
           "y": 54
          }
         ]
        }
       }
      },
      {
       "text": "Move myself towards the 8 to cover him.",
       "grade": "poor",
       "feedback": "Then the goal is open and you're out of your six-yard territory. You mark the ball, not a man.",
       "outcome": {
        "duration": 3.2,
        "result": "goal",
        "caption": "You step out towards the 8 — so the taker goes to the near post instead, where the 9 gets across your post player. Flick-on, empty goal. A keeper who leaves his zone to mark a man leaves the goal to mark itself.",
        "tracks": {
         "keeper": [
          {
           "t": 0.9,
           "x": 47,
           "y": 60
          }
         ],
         "ball": [
          {
           "t": 0.3,
           "x": 4,
           "y": 67,
           "h": 0
          },
          {
           "t": 1.8,
           "x": 42,
           "y": 61,
           "h": 0.6
          },
          {
           "t": 2,
           "x": 43,
           "y": 61.5,
           "h": 0.4
          },
          {
           "t": 2.7,
           "x": 48,
           "y": 67.5,
           "h": 0.2
          }
         ],
         "them.t9": [
          {
           "t": 1.9,
           "x": 42.5,
           "y": 61.5
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "d8",
     "label": "Full-back caught forward",
     "phase": "Transition",
     "question": "We've just lost the ball. Your right-back is twenty metres up the pitch. Their 11 has it wide right with the whole channel in front of him. Your right CB is the nearest to that space.",
     "setup": {
      "ball": {
       "x": 76,
       "y": 24
      },
      "keeper": {
       "x": 50,
       "y": 58
      },
      "us": [
       {
        "id": "rb",
        "x": 78,
        "y": 10,
        "n": "RB"
       },
       {
        "id": "lb",
        "x": 36,
        "y": 44,
        "n": "LB"
       },
       {
        "id": "cb1",
        "x": 46,
        "y": 44,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 58,
        "y": 42,
        "n": "CB"
       },
       {
        "id": "cm",
        "x": 52,
        "y": 26,
        "n": "CM"
       }
      ],
      "them": [
       {
        "id": "t11",
        "x": 76,
        "y": 24,
        "n": "11"
       },
       {
        "id": "t9",
        "x": 60,
        "y": 30,
        "n": "9"
       },
       {
        "id": "t7",
        "x": 40,
        "y": 34,
        "n": "7"
       }
      ]
     },
     "play": {
      "duration": 1.4,
      "overlays": [
       "offside",
       "run"
      ],
      "tracks": {
       "them.t11": [
        {
         "t": 1.4,
         "x": 76,
         "y": 33
        }
       ],
       "ball": [
        {
         "t": 1.4,
         "x": 76.5,
         "y": 34,
         "h": 0
        }
       ],
       "them.t9": [
        {
         "t": 1.4,
         "x": 60,
         "y": 36
        }
       ],
       "us.rb": [
        {
         "t": 1.4,
         "x": 78,
         "y": 18
        }
       ]
      }
     },
     "options": [
      {
       "text": "'Recover!' to the right-back and wait.",
       "grade": "ok",
       "feedback": "He needs to hear it, but he's not getting back in time. The space needs filling now.",
       "outcome": {
        "duration": 3.4,
        "result": "chance",
        "caption": "Your RB sprints back — and is still ten metres away when the 11 reaches the box and crosses. Right call, wrong recipient. The player who could fix it was your CB.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "us.rb": [
          {
           "t": 3.4,
           "x": 76,
           "y": 44
          }
         ],
         "them.t11": [
          {
           "t": 2.6,
           "x": 76,
           "y": 52
          }
         ],
         "ball": [
          {
           "t": 2.6,
           "x": 76.5,
           "y": 53,
           "h": 0
          },
          {
           "t": 3.4,
           "x": 56,
           "y": 60,
           "h": 0.5
          }
         ],
         "them.t9": [
          {
           "t": 3.4,
           "x": 56,
           "y": 58
          }
         ],
         "us.cb2": [
          {
           "t": 3.4,
           "x": 56,
           "y": 56
          }
         ],
         "keeper": [
          {
           "t": 3.4,
           "x": 49,
           "y": 63
          }
         ]
        }
       }
      },
      {
       "text": "'Thabo — slide right! Cover the channel!' to the right CB, and 'Tuck in!' to the LB and other CB so the whole line shifts across.",
       "grade": "best",
       "feedback": "Fill the space with the player who's closest, shift the whole line to cover the gap he leaves. That's organising.",
       "outcome": {
        "duration": 3,
        "result": "kept",
        "caption": "The CB meets the 11 at the edge of the box; the line slides across behind him so there's no hole where he came from. The 11 has nowhere to go and loses it. Watch the whole shape move together.",
        "overlays": [
         "offside",
         "pressure",
         "run"
        ],
        "tracks": {
         "us.cb2": [
          {
           "t": 1.3,
           "x": 72,
           "y": 42
          },
          {
           "t": 2.4,
           "x": 73,
           "y": 44
          },
          {
           "t": 3,
           "x": 70,
           "y": 40
          }
         ],
         "us.cb1": [
          {
           "t": 1.3,
           "x": 56,
           "y": 44
          }
         ],
         "us.lb": [
          {
           "t": 1.3,
           "x": 44,
           "y": 46
          }
         ],
         "them.t11": [
          {
           "t": 1.6,
           "x": 75,
           "y": 42
          },
          {
           "t": 2.4,
           "x": 73,
           "y": 44
          }
         ],
         "ball": [
          {
           "t": 1.6,
           "x": 75.5,
           "y": 43,
           "h": 0
          },
          {
           "t": 2.4,
           "x": 73,
           "y": 44,
           "h": 0
          },
          {
           "t": 3,
           "x": 70,
           "y": 40,
           "h": 0
          }
         ]
        }
       }
      },
      {
       "text": "Drop to the line and get set — a cross or shot is coming.",
       "grade": "poor",
       "feedback": "You've given up on preventing the chance before it exists. The whole point is that your voice can stop this becoming a shot.",
       "outcome": {
        "duration": 3.4,
        "result": "chance",
        "caption": "Nobody closes the 11. He runs unopposed to the by-line and the cross comes in with your line still flat-footed. You were set — but you organised nothing, so you were set for a chance that didn't have to exist.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "keeper": [
          {
           "t": 1,
           "x": 50,
           "y": 66
          }
         ],
         "them.t11": [
          {
           "t": 2.6,
           "x": 76,
           "y": 54
          }
         ],
         "ball": [
          {
           "t": 2.6,
           "x": 76.5,
           "y": 55,
           "h": 0
          },
          {
           "t": 3.4,
           "x": 55,
           "y": 61,
           "h": 0.5
          }
         ],
         "them.t9": [
          {
           "t": 3.4,
           "x": 55,
           "y": 59
          }
         ]
        }
       }
      }
     ]
    }
   ]
  },
  "distribute": {
   "capability": "simulator",
   "scenarios": [
    {
     "id": "p1",
     "label": "Caught the cross — they're broken",
     "phase": "Transition",
     "question": "You've just claimed a corner. Five of their players are still in your box. Your right winger is alone near the halfway line with one of their centre-backs twenty metres from him.",
     "setup": {
      "ball": {
       "x": 48,
       "y": 61
      },
      "keeper": {
       "x": 48,
       "y": 61
      },
      "us": [
       {
        "id": "cb1",
        "x": 50,
        "y": 57,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 40,
        "y": 55,
        "n": "CB"
       },
       {
        "id": "rw",
        "x": 82,
        "y": 22,
        "n": "RW"
       },
       {
        "id": "cm",
        "x": 52,
        "y": 38,
        "n": "CM"
       },
       {
        "id": "lb",
        "x": 24,
        "y": 42,
        "n": "LB"
       }
      ],
      "them": [
       {
        "id": "a",
        "x": 56,
        "y": 59
       },
       {
        "id": "b",
        "x": 44,
        "y": 61
       },
       {
        "id": "c",
        "x": 36,
        "y": 53
       },
       {
        "id": "d",
        "x": 66,
        "y": 51
       },
       {
        "id": "e",
        "x": 50,
        "y": 43
       },
       {
        "id": "cb",
        "x": 46,
        "y": 20,
        "n": "CB"
       }
      ]
     },
     "play": {
      "duration": 1,
      "overlays": [
       "run"
      ],
      "tracks": {
       "them.a": [
        {
         "t": 1,
         "x": 56,
         "y": 56
        }
       ],
       "them.b": [
        {
         "t": 1,
         "x": 44,
         "y": 58
        }
       ],
       "us.rw": [
        {
         "t": 1,
         "x": 82,
         "y": 20
        }
       ]
      }
     },
     "options": [
      {
       "text": "Hold it. Calm everyone down. Roll to the left-back.",
       "grade": "poor",
       "feedback": "You've been handed a counter-attack and you've put it in your pocket. By the time you roll it, they've recovered.",
       "outcome": {
        "duration": 3.4,
        "result": "lost",
        "caption": "By the time the ball reaches your LB, their players have jogged out of your box and are set again. The winger's twenty metres of space are gone. Possession kept, chance thrown away.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "them.a": [
          {
           "t": 2.4,
           "x": 58,
           "y": 40
          }
         ],
         "them.b": [
          {
           "t": 2.4,
           "x": 44,
           "y": 40
          }
         ],
         "them.c": [
          {
           "t": 2.4,
           "x": 30,
           "y": 36
          }
         ],
         "them.d": [
          {
           "t": 2.4,
           "x": 68,
           "y": 36
          }
         ],
         "them.e": [
          {
           "t": 2.4,
           "x": 50,
           "y": 30
          }
         ],
         "them.cb": [
          {
           "t": 2.4,
           "x": 70,
           "y": 22
          }
         ],
         "ball": [
          {
           "t": 2,
           "x": 48,
           "y": 61,
           "h": 0
          },
          {
           "t": 3,
           "x": 25,
           "y": 43,
           "h": 0
          }
         ]
        }
       }
      },
      {
       "text": "Throw or side-volley it fast and accurately to the right winger's feet or into his path.",
       "grade": "best",
       "feedback": "They're broken. Fast and accurate — a throw if he's in range. This is what claiming the cross was for.",
       "outcome": {
        "duration": 3.6,
        "result": "chance",
        "caption": "One look, one throw. The winger is away with one defender to beat and the rest of their team still turning in your box. From a corner against you to a chance for you in four seconds.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.5,
           "x": 48,
           "y": 61,
           "h": 0
          },
          {
           "t": 2.4,
           "x": 84,
           "y": 16,
           "h": 0.6
          },
          {
           "t": 3.6,
           "x": 86,
           "y": 4,
           "h": 0
          }
         ],
         "us.rw": [
          {
           "t": 2.4,
           "x": 84,
           "y": 16
          },
          {
           "t": 3.6,
           "x": 86,
           "y": 4
          }
         ],
         "them.cb": [
          {
           "t": 3.6,
           "x": 66,
           "y": 12
          }
         ],
         "them.a": [
          {
           "t": 3.6,
           "x": 58,
           "y": 44
          }
         ],
         "them.e": [
          {
           "t": 3.6,
           "x": 52,
           "y": 30
          }
         ]
        }
       }
      },
      {
       "text": "Kick it as far as you can down the middle.",
       "grade": "ok",
       "feedback": "Quick, which is right — but a hopeful ball to no one usually comes straight back. The winger is the target, not the distance.",
       "outcome": {
        "duration": 3.2,
        "result": "lost",
        "caption": "Fast — good. But the ball lands in the centre where their CB is the only player, and he simply collects it. Speed without a target is just giving it back quickly.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.5,
           "x": 48,
           "y": 61,
           "h": 0
          },
          {
           "t": 2,
           "x": 50,
           "y": 22,
           "h": 1
          },
          {
           "t": 2.6,
           "x": 50,
           "y": 14,
           "h": 0
          }
         ],
         "them.cb": [
          {
           "t": 2.6,
           "x": 50,
           "y": 14
          }
         ],
         "us.rw": [
          {
           "t": 2.6,
           "x": 70,
           "y": 16
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "p2",
     "label": "Goal kick — they're pressing high",
     "phase": "Restart",
     "question": "Goal kick. Their strikers are standing five metres from each of your centre-backs and their 10 is on your midfielder. Their defence is high — there's space behind it.",
     "setup": {
      "ball": {
       "x": 46,
       "y": 62
      },
      "keeper": {
       "x": 46,
       "y": 62
      },
      "us": [
       {
        "id": "cb1",
        "x": 28,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 72,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "lb",
        "x": 14,
        "y": 36,
        "n": "LB"
       },
       {
        "id": "rb",
        "x": 86,
        "y": 36,
        "n": "RB"
       },
       {
        "id": "cm",
        "x": 50,
        "y": 38,
        "n": "CM"
       },
       {
        "id": "s9",
        "x": 56,
        "y": 12,
        "n": "9"
       }
      ],
      "them": [
       {
        "id": "t9",
        "x": 32,
        "y": 44,
        "n": "9"
       },
       {
        "id": "t11",
        "x": 68,
        "y": 44,
        "n": "11"
       },
       {
        "id": "t10",
        "x": 50,
        "y": 32,
        "n": "10"
       },
       {
        "id": "wl",
        "x": 20,
        "y": 30
       },
       {
        "id": "wr",
        "x": 80,
        "y": 30
       },
       {
        "id": "cb",
        "x": 46,
        "y": 16,
        "n": "CB"
       }
      ]
     },
     "play": {
      "duration": 1.2,
      "overlays": [
       "run"
      ],
      "tracks": {
       "them.t9": [
        {
         "t": 1.2,
         "x": 31,
         "y": 46
        }
       ],
       "them.t11": [
        {
         "t": 1.2,
         "x": 69,
         "y": 46
        }
       ],
       "them.t10": [
        {
         "t": 1.2,
         "x": 50,
         "y": 34
        }
       ],
       "us.s9": [
        {
         "t": 1.2,
         "x": 56,
         "y": 14
        }
       ]
      }
     },
     "options": [
      {
       "text": "Short to the CB, as usual.",
       "grade": "poor",
       "feedback": "Straight into the press. If he loses it there, it's a shot. The press is a trap; don't walk into it.",
       "outcome": {
        "duration": 3.2,
        "result": "chance",
        "caption": "Your CB receives with the 9 already on him, tries to turn, and is robbed. Their 9 is through on goal from your goal kick. This is the exact picture the press is designed to produce.",
        "overlays": [
         "pressure",
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.9,
           "x": 29,
           "y": 50,
           "h": 0
          },
          {
           "t": 1.6,
           "x": 30,
           "y": 50.5,
           "h": 0
          },
          {
           "t": 2,
           "x": 33,
           "y": 51,
           "h": 0
          },
          {
           "t": 3.2,
           "x": 44,
           "y": 58,
           "h": 0
          }
         ],
         "them.t9": [
          {
           "t": 1.6,
           "x": 31,
           "y": 49
          },
          {
           "t": 2,
           "x": 33,
           "y": 51
          },
          {
           "t": 3.2,
           "x": 44,
           "y": 58
          }
         ],
         "us.cb1": [
          {
           "t": 1.6,
           "x": 29,
           "y": 51
          },
          {
           "t": 3.2,
           "x": 36,
           "y": 56
          }
         ],
         "keeper": [
          {
           "t": 3.2,
           "x": 47,
           "y": 60
          }
         ]
        }
       }
      },
      {
       "text": "Long over the press into the space behind their defence, or to our 9 to hold it up. Call 'Second ball!'",
       "grade": "best",
       "feedback": "A high press leaves space behind it — and you've just turned their aggression into your chance.",
       "outcome": {
        "duration": 3.6,
        "result": "chance",
        "caption": "The ball sails over the three pressers. Your 9 holds it up against their CB with your midfielder arriving for the second ball — we're attacking in their half and their press has achieved nothing.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 46,
           "y": 62,
           "h": 0
          },
          {
           "t": 2.2,
           "x": 55,
           "y": 24,
           "h": 1
          },
          {
           "t": 2.9,
           "x": 57,
           "y": 14,
           "h": 0
          }
         ],
         "us.s9": [
          {
           "t": 2.9,
           "x": 57,
           "y": 14
          }
         ],
         "them.cb": [
          {
           "t": 2.9,
           "x": 52,
           "y": 12
          }
         ],
         "us.cm": [
          {
           "t": 3.6,
           "x": 52,
           "y": 22
          }
         ],
         "them.t10": [
          {
           "t": 3.6,
           "x": 50,
           "y": 26
          }
         ]
        }
       }
      },
      {
       "text": "Wide to the full-back on the touchline.",
       "grade": "ok",
       "feedback": "Playable — he's less marked than the CBs — but he's receiving facing the touchline with a presser nearby. Long is cleaner.",
       "outcome": {
        "duration": 3.6,
        "result": "kept",
        "caption": "The full-back receives, but their wide player has closed him and he's facing the touchline. He clears it down the line under pressure. You kept the ball — just — and gave the press a chance to work.",
        "overlays": [
         "pressure",
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 46,
           "y": 62,
           "h": 0
          },
          {
           "t": 1.9,
           "x": 15,
           "y": 37,
           "h": 0.6
          },
          {
           "t": 2.5,
           "x": 15,
           "y": 36,
           "h": 0
          },
          {
           "t": 3.6,
           "x": 10,
           "y": 10,
           "h": 0.8
          }
         ],
         "them.wl": [
          {
           "t": 2.5,
           "x": 18,
           "y": 34
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "p3",
     "label": "Goal kick — they've dropped off",
     "phase": "Restart",
     "question": "Goal kick. Their whole team has dropped into their own half. Nobody is within fifteen metres of your centre-backs.",
     "setup": {
      "ball": {
       "x": 46,
       "y": 62
      },
      "keeper": {
       "x": 46,
       "y": 62
      },
      "us": [
       {
        "id": "cb1",
        "x": 28,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 72,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "lb",
        "x": 14,
        "y": 36,
        "n": "LB"
       },
       {
        "id": "rb",
        "x": 86,
        "y": 36,
        "n": "RB"
       },
       {
        "id": "cm",
        "x": 50,
        "y": 40,
        "n": "CM"
       },
       {
        "id": "s9",
        "x": 50,
        "y": 14,
        "n": "9"
       }
      ],
      "them": [
       {
        "id": "t9",
        "x": 44,
        "y": 26,
        "n": "9"
       },
       {
        "id": "t11",
        "x": 56,
        "y": 24,
        "n": "11"
       },
       {
        "id": "t10",
        "x": 50,
        "y": 18,
        "n": "10"
       },
       {
        "id": "d1",
        "x": 30,
        "y": 10
       },
       {
        "id": "d2",
        "x": 70,
        "y": 10
       },
       {
        "id": "d3",
        "x": 50,
        "y": 8
       }
      ]
     },
     "play": {
      "duration": 1,
      "tracks": {
       "us.cb1": [
        {
         "t": 1,
         "x": 27,
         "y": 51
        }
       ],
       "us.cb2": [
        {
         "t": 1,
         "x": 73,
         "y": 51
        }
       ]
      }
     },
     "options": [
      {
       "text": "Long, into their half, for our forwards to fight for.",
       "grade": "poor",
       "feedback": "Into an organised, set defence that outnumbers us. You're giving the ball back for no reason.",
       "outcome": {
        "duration": 3.2,
        "result": "lost",
        "caption": "Your 9 against three set defenders. Their centre-back heads it clear and they have the ball in a good position. Nobody pressed you; you pressured yourself.",
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 46,
           "y": 62,
           "h": 0
          },
          {
           "t": 2.2,
           "x": 50,
           "y": 20,
           "h": 1
          },
          {
           "t": 2.6,
           "x": 50,
           "y": 12,
           "h": 0.5
          },
          {
           "t": 3.2,
           "x": 40,
           "y": 20,
           "h": 0.7
          }
         ],
         "them.d3": [
          {
           "t": 2.6,
           "x": 50,
           "y": 12
          }
         ],
         "us.s9": [
          {
           "t": 2.6,
           "x": 49,
           "y": 13
          }
         ]
        }
       }
      },
      {
       "text": "Short to a centre-back and immediately move to offer the return pass.",
       "grade": "best",
       "feedback": "No pressure means no reason to gamble. Keep the ball, build, and stay involved as the free man.",
       "outcome": {
        "duration": 3.4,
        "result": "kept",
        "caption": "Short to the CB, and you step out to the side so he always has you as an option. He turns, plays to the full-back, and the team moves up together. Calm, controlled, ours.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 46,
           "y": 62,
           "h": 0
          },
          {
           "t": 1.2,
           "x": 28,
           "y": 51,
           "h": 0
          },
          {
           "t": 2.2,
           "x": 28,
           "y": 50,
           "h": 0
          },
          {
           "t": 3.2,
           "x": 15,
           "y": 37,
           "h": 0
          }
         ],
         "keeper": [
          {
           "t": 1.4,
           "x": 40,
           "y": 58
          }
         ],
         "us.cb1": [
          {
           "t": 2.2,
           "x": 28,
           "y": 48
          }
         ],
         "us.cm": [
          {
           "t": 3.4,
           "x": 44,
           "y": 34
          }
         ],
         "us.cb2": [
          {
           "t": 3.4,
           "x": 70,
           "y": 44
          }
         ]
        }
       }
      },
      {
       "text": "Roll it to the full-back.",
       "grade": "ok",
       "feedback": "Fine — he's free too. Slightly less good than the CB because the full-back is further and more easily shut off against the touchline.",
       "outcome": {
        "duration": 3.2,
        "result": "kept",
        "caption": "The full-back receives against the touchline — safe, but his options are narrower than the CB's would have been. Ball kept. Good enough, not best.",
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 46,
           "y": 62,
           "h": 0
          },
          {
           "t": 2,
           "x": 15,
           "y": 37,
           "h": 0
          }
         ],
         "keeper": [
          {
           "t": 1.6,
           "x": 42,
           "y": 59
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "p4",
     "label": "Back pass, striker closing",
     "phase": "We have the ball",
     "question": "Your left CB has played it back to you, a little slow. Their 9 is sprinting at you from your left. Your right-back is free out wide on your right.",
     "setup": {
      "ball": {
       "x": 40,
       "y": 42
      },
      "keeper": {
       "x": 48,
       "y": 61
      },
      "us": [
       {
        "id": "cb1",
        "x": 40,
        "y": 40,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 62,
        "y": 44,
        "n": "CB"
       },
       {
        "id": "rb",
        "x": 82,
        "y": 44,
        "n": "RB"
       },
       {
        "id": "lb",
        "x": 20,
        "y": 40,
        "n": "LB"
       }
      ],
      "them": [
       {
        "id": "t9",
        "x": 30,
        "y": 44,
        "n": "9"
       },
       {
        "id": "t11",
        "x": 56,
        "y": 32
       },
       {
        "id": "t7",
        "x": 72,
        "y": 28
       }
      ]
     },
     "play": {
      "duration": 1.4,
      "overlays": [
       "run"
      ],
      "tracks": {
       "ball": [
        {
         "t": 0.1,
         "x": 40,
         "y": 42,
         "h": 0
        },
        {
         "t": 1.4,
         "x": 47,
         "y": 56,
         "h": 0
        }
       ],
       "them.t9": [
        {
         "t": 1.4,
         "x": 38,
         "y": 52
        }
       ],
       "keeper": [
        {
         "t": 1.4,
         "x": 48,
         "y": 59
        }
       ]
      }
     },
     "options": [
      {
       "text": "Take a touch to control it, then look up.",
       "grade": "poor",
       "feedback": "The 9 is on you by the time you've touched it. This is how keepers get robbed in their own box.",
       "outcome": {
        "duration": 2.4,
        "result": "goal",
        "caption": "One touch — and the 9 is there. He nicks it off your foot and rolls it in. You never got to the 'look up' part. Under pressure, the decision happens before the ball arrives.",
        "overlays": [
         "pressure",
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 47.5,
           "y": 58,
           "h": 0
          },
          {
           "t": 1,
           "x": 47.5,
           "y": 58.5,
           "h": 0
          },
          {
           "t": 1.4,
           "x": 49,
           "y": 60,
           "h": 0
          },
          {
           "t": 2.2,
           "x": 51,
           "y": 67.5,
           "h": 0
          }
         ],
         "them.t9": [
          {
           "t": 0.4,
           "x": 42,
           "y": 55
          },
          {
           "t": 1,
           "x": 46.5,
           "y": 58
          },
          {
           "t": 1.4,
           "x": 49,
           "y": 60
          }
         ],
         "keeper": [
          {
           "t": 0.4,
           "x": 48,
           "y": 59
          },
          {
           "t": 1.6,
           "x": 47,
           "y": 62
          }
         ]
        }
       }
      },
      {
       "text": "First time, right foot, out to the right-back — away from the 9.",
       "grade": "best",
       "feedback": "One touch, away from the pressure, to the free man. You decided this before the ball arrived.",
       "outcome": {
        "duration": 2.6,
        "result": "kept",
        "caption": "The ball is gone before the 9 arrives — away from him, to the free man on the far side. He's run twenty metres for nothing. You knew where it was going before you received it.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.3,
           "x": 47,
           "y": 57,
           "h": 0
          },
          {
           "t": 1.7,
           "x": 82,
           "y": 45,
           "h": 0.2
          }
         ],
         "them.t9": [
          {
           "t": 0.6,
           "x": 43,
           "y": 56
          },
          {
           "t": 1.2,
           "x": 46,
           "y": 58
          }
         ],
         "us.rb": [
          {
           "t": 1.7,
           "x": 82,
           "y": 44
          },
          {
           "t": 2.6,
           "x": 84,
           "y": 36
          }
         ]
        }
       }
      },
      {
       "text": "First time, clear it long and high.",
       "grade": "ok",
       "feedback": "Safe — ugly and safe beats pretty and risky — but the right-back was free, and keeping the ball is better than giving it away cleanly.",
       "outcome": {
        "duration": 2.8,
        "result": "lost",
        "caption": "Safe, and nothing bad happens — the ball goes long and they collect it. The right-back was free though. Same first-time decision, better target, and we'd have kept it.",
        "tracks": {
         "ball": [
          {
           "t": 0.3,
           "x": 47,
           "y": 57,
           "h": 0
          },
          {
           "t": 2,
           "x": 54,
           "y": 20,
           "h": 1
          },
          {
           "t": 2.8,
           "x": 56,
           "y": 10,
           "h": 0
          }
         ],
         "them.t9": [
          {
           "t": 0.8,
           "x": 44,
           "y": 56
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "p5",
     "label": "Won it late, protecting a lead",
     "phase": "Game management",
     "question": "You're 1–0 up with five minutes left. You've just saved a shot. Their team is set, everyone's in position, and your teammates are screaming 'Get rid of it!'",
     "setup": {
      "ball": {
       "x": 50,
       "y": 60
      },
      "keeper": {
       "x": 50,
       "y": 60
      },
      "us": [
       {
        "id": "cb1",
        "x": 36,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 62,
        "y": 50,
        "n": "CB"
       },
       {
        "id": "lb",
        "x": 20,
        "y": 44,
        "n": "LB"
       },
       {
        "id": "rb",
        "x": 82,
        "y": 42,
        "n": "RB"
       },
       {
        "id": "cm",
        "x": 50,
        "y": 34,
        "n": "CM"
       }
      ],
      "them": [
       {
        "id": "a",
        "x": 44,
        "y": 46
       },
       {
        "id": "b",
        "x": 58,
        "y": 48
       },
       {
        "id": "c",
        "x": 50,
        "y": 28
       },
       {
        "id": "d",
        "x": 30,
        "y": 30
       },
       {
        "id": "e",
        "x": 70,
        "y": 32
       }
      ]
     },
     "play": {
      "duration": 1,
      "tracks": {
       "them.a": [
        {
         "t": 1,
         "x": 45,
         "y": 44
        }
       ],
       "them.b": [
        {
         "t": 1,
         "x": 57,
         "y": 46
        }
       ]
      }
     },
     "options": [
      {
       "text": "Do what they say — launch it long and hope.",
       "grade": "poor",
       "feedback": "Hoofing it to a set team gives them the ball back in thirty seconds for another attack. Panic defending.",
       "outcome": {
        "duration": 3.6,
        "result": "lost",
        "caption": "Straight to their centre-back. Thirty seconds later they're attacking you again, and your team is more tired and more anxious than before. A lead is protected with the ball, not without it.",
        "tracks": {
         "ball": [
          {
           "t": 0.3,
           "x": 50,
           "y": 60,
           "h": 0
          },
          {
           "t": 2,
           "x": 48,
           "y": 22,
           "h": 1
          },
          {
           "t": 2.6,
           "x": 48,
           "y": 14,
           "h": 0
          },
          {
           "t": 3.6,
           "x": 40,
           "y": 24,
           "h": 0
          }
         ],
         "them.c": [
          {
           "t": 2.6,
           "x": 48,
           "y": 14
          },
          {
           "t": 3.6,
           "x": 42,
           "y": 22
          }
         ]
        }
       }
      },
      {
       "text": "Take my time inside the six seconds, let everyone catch their breath, then play short to the free full-back. 'Calm — keep it!'",
       "grade": "best",
       "feedback": "You use the time you have, you keep the ball, and your calm sets the mood. A team keeping the ball can't concede.",
       "outcome": {
        "duration": 4.8,
        "result": "kept",
        "caption": "Four seconds of calm, then a roll to the right-back. He plays it up the line, the team moves out together and the clock runs. They can't score if they don't have it.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 2,
           "x": 50,
           "y": 60,
           "h": 0
          },
          {
           "t": 3.6,
           "x": 82,
           "y": 43,
           "h": 0
          },
          {
           "t": 4.8,
           "x": 84,
           "y": 30,
           "h": 0
          }
         ],
         "us.rb": [
          {
           "t": 3.6,
           "x": 82,
           "y": 42
          },
          {
           "t": 4.8,
           "x": 84,
           "y": 30
          }
         ],
         "us.cb2": [
          {
           "t": 4.8,
           "x": 66,
           "y": 40
          }
         ],
         "us.cb1": [
          {
           "t": 4.8,
           "x": 38,
           "y": 42
          }
         ],
         "us.cm": [
          {
           "t": 4.8,
           "x": 56,
           "y": 26
          }
         ]
        }
       }
      },
      {
       "text": "Quick throw to the midfielder.",
       "grade": "ok",
       "feedback": "Keeps the ball, which is right — but he's got players around him. The free full-back is the better target, and slower is better here.",
       "outcome": {
        "duration": 3,
        "result": "kept",
        "caption": "He keeps it under pressure — this time. The full-back was free and there was no rush. Right idea, slightly risky execution.",
        "overlays": [
         "pressure"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.4,
           "x": 50,
           "y": 60,
           "h": 0
          },
          {
           "t": 1.4,
           "x": 50,
           "y": 35,
           "h": 0.3
          },
          {
           "t": 3,
           "x": 36,
           "y": 28,
           "h": 0
          }
         ],
         "them.c": [
          {
           "t": 1.6,
           "x": 50,
           "y": 31
          }
         ],
         "us.cm": [
          {
           "t": 1.4,
           "x": 50,
           "y": 35
          },
          {
           "t": 2.2,
           "x": 46,
           "y": 32
          }
         ]
        }
       }
      }
     ]
    },
    {
     "id": "p6",
     "label": "Caught it — nobody's free",
     "phase": "Transition",
     "question": "You've caught a cross. You look up: every one of your players has an opponent close to him. Nobody is free.",
     "setup": {
      "ball": {
       "x": 50,
       "y": 62
      },
      "keeper": {
       "x": 50,
       "y": 62
      },
      "us": [
       {
        "id": "cb1",
        "x": 34,
        "y": 48,
        "n": "CB"
       },
       {
        "id": "cb2",
        "x": 64,
        "y": 48,
        "n": "CB"
       },
       {
        "id": "lb",
        "x": 20,
        "y": 40,
        "n": "LB"
       },
       {
        "id": "rb",
        "x": 84,
        "y": 40,
        "n": "RB"
       },
       {
        "id": "cm",
        "x": 50,
        "y": 32,
        "n": "CM"
       },
       {
        "id": "s9",
        "x": 52,
        "y": 14,
        "n": "9"
       }
      ],
      "them": [
       {
        "id": "a",
        "x": 36,
        "y": 44
       },
       {
        "id": "b",
        "x": 62,
        "y": 44
       },
       {
        "id": "c",
        "x": 22,
        "y": 36
       },
       {
        "id": "d",
        "x": 82,
        "y": 36
       },
       {
        "id": "e",
        "x": 50,
        "y": 28
       },
       {
        "id": "f",
        "x": 50,
        "y": 12
       }
      ]
     },
     "play": {
      "duration": 1,
      "tracks": {
       "us.cb1": [
        {
         "t": 1,
         "x": 33,
         "y": 49
        }
       ]
      }
     },
     "options": [
      {
       "text": "Pick the least-marked player and throw it to him anyway.",
       "grade": "poor",
       "feedback": "A throw into a 50/50 in your own half is a turnover in a dangerous place.",
       "outcome": {
        "duration": 2.8,
        "result": "chance",
        "caption": "Your CB and their player arrive together; their player wins it and is twenty metres from your goal with the ball. A 50/50 in your own third is a chance for them half the time.",
        "overlays": [
         "pressure",
         "run"
        ],
        "tracks": {
         "ball": [
          {
           "t": 0.3,
           "x": 50,
           "y": 62,
           "h": 0
          },
          {
           "t": 1.2,
           "x": 35,
           "y": 47,
           "h": 0.3
          },
          {
           "t": 1.6,
           "x": 36,
           "y": 46,
           "h": 0
          },
          {
           "t": 2.8,
           "x": 42,
           "y": 52,
           "h": 0
          }
         ],
         "them.a": [
          {
           "t": 1.6,
           "x": 36,
           "y": 46
          },
          {
           "t": 2.8,
           "x": 42,
           "y": 52
          }
         ],
         "us.cb1": [
          {
           "t": 1.6,
           "x": 35,
           "y": 48
          },
          {
           "t": 2.8,
           "x": 38,
           "y": 53
          }
         ]
        }
       }
      },
      {
       "text": "Hold it a moment, let a defender move to create space, then roll to him — or if nothing opens, go long to the 9 and call 'Second ball!'",
       "grade": "best",
       "feedback": "Use the six seconds. Movement creates the free man. If it doesn't come, a long ball to a target is the honest choice.",
       "outcome": {
        "duration": 4,
        "result": "kept",
        "caption": "You hold. Your left CB drops wide and away from his marker — and now he's free. Roll, and we're playing. The free man wasn't there when you looked; your patience made him.",
        "overlays": [
         "run"
        ],
        "tracks": {
         "us.cb1": [
          {
           "t": 1.8,
           "x": 26,
           "y": 54
          },
          {
           "t": 3,
           "x": 27,
           "y": 54
          },
          {
           "t": 4,
           "x": 22,
           "y": 46
          }
         ],
         "them.a": [
          {
           "t": 1.8,
           "x": 34,
           "y": 48
          }
         ],
         "ball": [
          {
           "t": 2,
           "x": 50,
           "y": 62,
           "h": 0
          },
          {
           "t": 3,
           "x": 27,
           "y": 54,
           "h": 0
          },
          {
           "t": 4,
           "x": 20,
           "y": 44,
           "h": 0
          }
         ]
        }
       }
      },
      {
       "text": "Go long immediately.",
       "grade": "ok",
       "feedback": "Not wrong — but you've got six seconds and a team that can move. Try to make the free man first.",
       "outcome": {
        "duration": 3,
        "result": "lost",
        "caption": "A clean long ball to your 9 — who's marked, like everyone else, and loses the header. Honest, safe, and a turnover. The free man was one second of patience away.",
        "tracks": {
         "ball": [
          {
           "t": 0.3,
           "x": 50,
           "y": 62,
           "h": 0
          },
          {
           "t": 2,
           "x": 52,
           "y": 20,
           "h": 1
          },
          {
           "t": 2.5,
           "x": 52,
           "y": 13,
           "h": 0.5
          },
          {
           "t": 3,
           "x": 60,
           "y": 20,
           "h": 0.6
          }
         ],
         "them.f": [
          {
           "t": 2.5,
           "x": 52,
           "y": 13
          }
         ]
        }
       }
      }
     ]
    }
   ]
  }
 },
 "gates": [
  {
   "type": "sections"
  },
  {
   "type": "sim",
   "set": "defend",
   "min": 6,
   "label": "Simulator — 6 of 8 defending plays, best call"
  },
  {
   "type": "sim",
   "set": "distribute",
   "min": 4,
   "label": "Simulator — 4 of 6 distribution plays, best call"
  }
 ]
});
