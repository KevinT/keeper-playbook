/* capability: tree — 1.0.0
   Decision tree. Emits `tree.decided { tree, result }` when a leaf is reached (a fact for
   future gates; nothing today reads it). Block carries an explicit `id`. */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.tree = {
    version: '1.0.0',
    render: function (b, ctx, api) {
      var box = el('div', { class: 'tree' });
      var crumbs = el('div', { class: 'tree__crumbs', 'aria-label': 'Your answers' });
      var body = el('div', { class: 'tree__body', 'aria-live': 'polite' });
      box.appendChild(crumbs); box.appendChild(body);
      var trail = [];

      function showNode(node) {
        body.innerHTML = '';
        if (!node || !node.q) { body.appendChild(el('p', { class: 'calls__empty', text: 'This branch has no question.' })); return; }
        body.appendChild(el('div', { class: 'tree__q', text: text(node.q) }));
        var opts = el('div', { class: 'tree__opts' });
        arr(node.options).forEach(function (o) {
          opts.appendChild(el('button', { class: 'tree__opt', type: 'button', text: text(o.label), onclick: function () { choose(o); } }));
        });
        body.appendChild(opts);
      }
      function choose(o) {
        trail.push(text(o.label));
        renderCrumbs();
        if (o.next && o.next.q) showNode(o.next);
        else showResult(o);
      }
      function showResult(o) {
        body.innerHTML = '';
        if (b.id) api.emit('tree.decided', { tree: b.id, result: text(o.result || o.label) });
        body.appendChild(el('div', { class: 'tree__result' }, [
          el('div', { class: 'eyebrow', text: 'Decision' }),
          el('div', { class: 'tree__result-text', text: text(o.result || o.label) }),
          o.why ? el('div', { class: 'tree__why', html: text(o.why) }) : null,
          el('button', { class: 'btn', type: 'button', text: 'Start again', onclick: restart })
        ]));
      }
      function renderCrumbs() {
        crumbs.innerHTML = '';
        if (!trail.length) { crumbs.appendChild(el('span', { class: 'tree__crumb', text: 'Start' })); return; }
        trail.forEach(function (t) { crumbs.appendChild(el('span', { class: 'tree__crumb', text: t })); });
      }
      function restart() { trail = []; renderCrumbs(); showNode(b.root); }
      restart();
      return [D.blockTitle(b), D.blockIntro(b), box];
    }
  };
})();
