/* capability: pitch — 1.0.0  (static positioning diagrams with scenario chips) */
(function () {
  'use strict';
  var D = window.KP.dom, el = D.el, svgEl = D.svgEl, text = D.text, arr = D.arr;
  window.KP.capabilities = window.KP.capabilities || {};
  window.KP.capabilities.pitch = {
    version: '1.0.0',
    render: function (b) {
      var scenarios = arr(b.scenarios);
      var svg = D.buildPitchSvg();
      var zone = svgEl('polygon', { class: 'zone', points: '' });
      zone.style.display = 'none';
      svg.appendChild(zone);
      var g1 = svgEl('line', { class: 'guide', x1: 50, y1: 30, x2: 44.6, y2: 68 });
      var g2 = svgEl('line', { class: 'guide', x1: 50, y1: 30, x2: 55.4, y2: 68 });
      svg.appendChild(g1); svg.appendChild(g2);
      var ring = svgEl('circle', { class: 'keeper-ring', cx: 50, cy: 62, r: 3 });
      var keeper = svgEl('circle', { class: 'keeper', cx: 50, cy: 62, r: 1.6 });
      var ball = svgEl('circle', { class: 'ball', cx: 50, cy: 30, r: 1.1 });
      svg.appendChild(ring); svg.appendChild(keeper); svg.appendChild(ball);

      var chips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Scenario' });
      var noteText = el('div', { class: 'pitch__note-text' });
      var noteLabel = el('div', { class: 'eyebrow pitch__note-label' });
      var note = el('div', { class: 'pitch__note' }, [noteLabel, noteText]);
      var chipEls = [];

      function show(s, i) {
        chipEls.forEach(function (c, j) { c.classList.toggle('is-active', j === i); });
        var bx = s.ball && isFinite(s.ball.x) ? s.ball.x : 50, by = s.ball && isFinite(s.ball.y) ? s.ball.y : 30;
        var kx = s.keeper && isFinite(s.keeper.x) ? s.keeper.x : 50, ky = s.keeper && isFinite(s.keeper.y) ? s.keeper.y : 64;
        ball.setAttribute('cx', bx); ball.setAttribute('cy', by);
        keeper.setAttribute('cx', kx); keeper.setAttribute('cy', ky);
        ring.setAttribute('cx', kx); ring.setAttribute('cy', ky);
        g1.setAttribute('x1', bx); g1.setAttribute('y1', by);
        g2.setAttribute('x1', bx); g2.setAttribute('y1', by);
        if (Array.isArray(s.zone) && s.zone.length >= 3) {
          zone.setAttribute('points', s.zone.map(function (p) { return p[0] + ',' + p[1]; }).join(' '));
          zone.style.display = '';
        } else { zone.style.display = 'none'; }
        noteLabel.textContent = text(s.label);
        noteText.innerHTML = text(s.note);
      }
      scenarios.forEach(function (s, i) {
        var c = el('button', { class: 'chip', type: 'button', text: text(s.label || s.id || 'Scenario ' + (i + 1)) });
        c.addEventListener('click', function () { show(s, i); });
        chipEls.push(c); chips.appendChild(c);
      });
      if (scenarios.length) show(scenarios[0], 0);
      else note.style.display = 'none';

      var legend = el('div', { class: 'pitch__legend' }, [
        el('span', {}, [el('i', { class: 'l-ball' }), 'Ball']),
        el('span', {}, [el('i', { class: 'l-keeper' }), 'Keeper'])
      ]);
      return [D.blockTitle(b), D.blockIntro(b), chips, el('div', { class: 'pitch-block' }, [
        el('div', {}, [svg, legend]), note
      ])];
    }
  };
})();
