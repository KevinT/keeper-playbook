window.PLAYBOOK = {
  meta: {
    title: "Keeper Playbook",
    headline: ["Read the game.", "Run the box."],
    tagline: "Sample content for shell testing.",
    intro: "<p>Sample intro.</p>"
  },
  sections: [
    { id: "home", nav: "Home", hero: true, kicker: "", title: "", lede: "", blocks: [] },
    { id: "mind", nav: "The Keeper's Mind", kicker: "Section 01", title: "The Keeper's Mind", lede: "Sample lede.",
      blocks: [
        { type: "prose", html: "<p>Sample prose <strong>bold</strong>.</p>" },
        { type: "loop", title: "The loop", steps: [ {name:"See", text:"Observe."}, {name:"Understand", text:"Interpret."}, {name:"Decide", text:"Act."}, {name:"Review", text:"Adjust."} ] },
        { type: "cards", title: "Cards", cols: 3, items: [ {title:"A", text:"Text a", tag:"Tag"}, {title:"B", text:"Text b"}, {title:"C", text:"Text c"} ] },
        { type: "quote", text: "The drill is not the game.", attribution: "GC principle" },
        { type: "callout", title: "Note", html: "<p>Callout body.</p>" },
        { type: "tabs", title: "Tabs", items: [ {name:"One", html:"<p>One</p>"}, {name:"Two", html:"<p>Two</p>"} ] },
        { type: "phases", title: "Phases", items: [ {name:"Build-up", where:"High", see:"Runners", do:"Sweep", say:"Step up"}, {name:"Attack", where:"Deep", see:"Shooters", do:"Set", say:"Hold"} ] },
        { type: "tree", title: "Come or stay?", intro: "Sample tree.", root: { q: "Will you get there first?", options: [
          { label: "Yes, clearly", result: "Go. Commit.", why: "Hesitation is the worst option." },
          { label: "Not sure", next: { q: "Is the striker side-on?", options: [ { label:"Yes", result:"Stay and set.", why:"He can't shoot early." }, { label:"No", result:"Make yourself big.", why:"Delay him." } ] } }
        ] } },
        { type: "calls", title: "Calls", intro: "Sample.", groups: [
          { name: "Shape", items: [ {see:"Line is deep", say:"Push the line up", why:"Compress space.", words:["Step up","Squeeze"]}, {see:"Gap between CBs", say:"Close the gap", why:"Through balls.", words:["Tighten"]} ] },
          { name: "Ball near", items: [ {see:"Winger about to cross", say:"Get tight", why:"Block.", words:["Tight!","No cross"]} ] }
        ] },
        { type: "vocab", title: "Vocab", items: [ {word:"Away", meaning:"Clear it", when:"Danger near goal"}, {word:"Keeper's", meaning:"I'm claiming", when:"Crosses"} ] },
        { type: "pitch", title: "Pitch", intro:"Sample.", scenarios: [ {id:"c", label:"Central", ball:{x:50,y:30}, keeper:{x:50,y:62}, note:"Centre."}, {id:"w", label:"Wide", ball:{x:15,y:45}, keeper:{x:45,y:65}, zone:[[40,60],[60,60],[60,68],[40,68]], note:"Near post."} ] },
        { type: "quiz", title: "Quiz", intro:"Sample.", items: [ {situation:"Q1?", options:[{text:"A",correct:true,feedback:"Yes"},{text:"B",correct:false,feedback:"No"}]}, {situation:"Q2?", options:[{text:"A",correct:false,feedback:"No"},{text:"B",correct:true,feedback:"Yes"}]} ] },
        { type: "checklist", id: "chk1", title: "Checklist", items: ["One","Two"] },
        { type: "ladder", title: "Ladder", levels: [ {level:1, name:"Base", items:["a","b"]}, {level:2, name:"Next", items:["c"]} ] },
        { type: "review", id: "rev1", title: "Review", prompts: ["What did I see?", "What would I change?"] },
        { type: "nope", foo: 1 }
      ] },
    { id: "second", nav: "Second", kicker: "Section 02", title: "Second Section", lede: "Lede.", blocks: [ { type:"prose", html:"<p>Second.</p>" } ] }
  ]
};
