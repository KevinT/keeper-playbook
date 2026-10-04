/* Keeper Playbook — runtime/dom.js
   Tiny DOM/SVG helpers shared by the runtime views and every capability.
   No state, no storage, no routing. Plain vanilla JS, works from file://. */
(function () {
  'use strict';
  window.KP = window.KP || {};

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      }
    }
    if (children !== undefined) append(node, children);
    return node;
  }
  function append(node, children) {
    if (children === null || children === undefined || children === false) return node;
    if (Array.isArray(children)) { children.forEach(function (c) { append(node, c); }); return node; }
    if (typeof children === 'string' || typeof children === 'number') { node.appendChild(document.createTextNode(String(children))); return node; }
    node.appendChild(children);
    return node;
  }
  function svgEl(tag, attrs) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function text(s) { return s === undefined || s === null ? '' : String(s); }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function shuffle(a) {
    var out = a.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }
  var uidN = 0;
  // Unique DOM id (for aria wiring only — never used as a progress key).
  function uid(prefix) { uidN++; return (prefix || 'kp') + '-' + uidN; }
  function blockTitle(block) {
    return block.title ? el('h3', { class: 'block-title', text: block.title }) : null;
  }
  function blockIntro(block) {
    return block.intro ? el('div', { class: 'block-intro', html: block.intro }) : null;
  }

  // Accessible tab strip shared by `tabs` and `phases`.
  function buildTabs(items, panelFor) {
    var key = uid('tabs');
    var strip = el('div', { class: 'tabstrip', role: 'tablist' });
    var panels = el('div', { class: 'tabpanels' });
    var tabs = [], panes = [];
    items.forEach(function (it, i) {
      var id = key + '-tab-' + i;
      var tab = el('button', { class: 'tab', type: 'button', role: 'tab', id: id, 'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': id + '-panel', text: text(it.name) });
      var pane = el('div', { class: 'tabpanel' + (i === 0 ? ' is-active' : ''), role: 'tabpanel', id: id + '-panel', 'aria-labelledby': id }, panelFor(it, i));
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault(); e.stopPropagation();
          var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
          select(n); tabs[n].focus();
        }
      });
      tabs.push(tab); panes.push(pane);
      strip.appendChild(tab); panels.appendChild(pane);
    });
    function select(n) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === n ? 'true' : 'false'); });
      panes.forEach(function (p, j) { p.classList.toggle('is-active', j === n); });
      if (tabs[n].scrollIntoView) tabs[n].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    return [strip, panels];
  }

  // Shared half-pitch markings (defensive half; goal at bottom, centre line at top).
  // Goal centred x=50, y=68. Goal 7.32m on 68m width ≈ 10.8 units wide.
  function buildPitchSvg() {
    var svg = svgEl('svg', { class: 'pitch-svg', viewBox: '0 0 100 70', role: 'img', 'aria-label': 'Defensive half of the pitch' });
    svg.appendChild(svgEl('rect', { class: 'line', x: 1, y: 1, width: 98, height: 67 }));
    svg.appendChild(svgEl('line', { class: 'line', x1: 1, y1: 1, x2: 99, y2: 1 }));
    svg.appendChild(svgEl('path', { class: 'line', d: 'M 36.5 1 A 13.5 13.5 0 0 0 63.5 1' }));          // centre circle (half)
    svg.appendChild(svgEl('rect', { class: 'line', x: 20, y: 44, width: 60, height: 24 }));            // 18-yard box
    svg.appendChild(svgEl('rect', { class: 'line', x: 36, y: 60, width: 28, height: 8 }));             // 6-yard box
    svg.appendChild(svgEl('circle', { class: 'spot', cx: 50, cy: 52, r: .6 }));                         // penalty spot
    svg.appendChild(svgEl('path', { class: 'line', d: 'M 38.9 44 A 13.5 13.5 0 0 1 61.1 44' }));        // the D
    svg.appendChild(svgEl('rect', { class: 'goal', x: 44.6, y: 68, width: 10.8, height: 1.6 }));       // goal
    return svg;
  }

  // Small SVG glyphs (no emoji, no icon fonts)
  function padlock() {
    var s = svgEl('svg', { class: 'glyph glyph--lock', viewBox: '0 0 12 12', width: 12, height: 12, 'aria-hidden': 'true', focusable: 'false' });
    s.appendChild(svgEl('rect', { x: 1.5, y: 5.5, width: 9, height: 6, rx: .5 }));
    s.appendChild(svgEl('path', { d: 'M3.5 5.5V3.75a2.5 2.5 0 0 1 5 0V5.5', fill: 'none' }));
    return s;
  }
  function tick(cls) {
    var s = svgEl('svg', { class: 'glyph glyph--tick' + (cls ? ' ' + cls : ''), viewBox: '0 0 12 12', width: 12, height: 12, 'aria-hidden': 'true', focusable: 'false' });
    s.appendChild(svgEl('path', { d: 'M2 6.5l2.6 2.5L10 3.5', fill: 'none' }));
    return s;
  }

  window.KP.dom = {
    el: el, append: append, svgEl: svgEl, esc: esc, text: text, arr: arr, num: num, isObj: isObj,
    pad: pad, todayISO: todayISO, shuffle: shuffle, uid: uid,
    blockTitle: blockTitle, blockIntro: blockIntro, buildTabs: buildTabs, buildPitchSvg: buildPitchSvg,
    padlock: padlock, tick: tick
  };
})();
