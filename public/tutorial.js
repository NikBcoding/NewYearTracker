// ── Tutorial / Help Tour ───────────────────────────────────────────────────────

(function () {
  const STEPS = [
    {
      title: '👋 Welcome to New Years Tracker!',
      body:  'This quick tour walks through every button and feature. Press Next to continue, or Skip tour to close.',
      target: null,
    },
    {
      title: '🍅 Pomodoro Timer',
      body:  'Work in focused sessions at the top of the page. Switch between Focus, Short Break, and Long Break modes. Completing a focus session earns you +5 pts.',
      target: '#pomo-section',
      pos: 'below',
    },
    {
      title: '⚙️ Timer Settings',
      body:  'Click the gear icon to adjust focus and break durations (1–90 min). Set how many sessions pass before a long break. Saving resets the current timer.',
      target: '#pomo-settings-btn',
      pos: 'below',
    },
    {
      title: '▶ Start / Pause & Controls',
      body:  'Start or pause the timer with the main button. Reset returns to the beginning of the current session. Skip jumps straight to the next session.',
      target: '.pomo-controls',
      pos: 'above',
    },
    {
      title: '🎯 Adding Goals',
      body:  'Type a goal name and an optional deadline, then click Add Goal. Goals are the top-level items you want to achieve this year.',
      target: '.tracker-add-goal-row',
      pos: 'below',
    },
    {
      title: '✅ Tasks & Completion',
      body:  'Expand a goal and add tasks beneath it. Check a task\'s box when you\'re done — a confirmation popup appears. Confirming marks it complete and awards +3 pts.',
      target: '#goal-list',
      pos: 'below',
    },
    {
      title: '⭐ Points Balance',
      body:  'Your current points are shown here. Earn them by logging in (+1), completing tasks (+3), and finishing Pomodoro sessions (+5). Spend them in the Shop.',
      target: '.points-badge',
      pos: 'below',
    },
    {
      title: '🛒 Reward Shop',
      body:  'Open the shop to spend points on gradient backgrounds, accent color palettes, full UI themes (Dark, Vaporwave, Beach…), new corner pets, confetti, sounds, and a trophy tracker.',
      target: '#shop-open-btn',
      pos: 'below',
    },
    {
      title: '🎨 Background Color',
      body:  'Instantly change the page background tint to any color using this picker. For gradient and special backgrounds, check the Backgrounds tab in the Shop.',
      target: '.color-picker-wrap',
      pos: 'below',
    },
    {
      title: '🐾 Corner Pet',
      body:  'Your companion lives in the bottom-left! Hover to trigger an animation and a message. Click "switch pet" to cycle through unlocked animals. Buy new ones in the Shop\'s Animals tab.',
      target: '#corner-pet',
      pos: 'above',
    },
    {
      title: '🏆 You\'re all set!',
      body:  'Add your first goal, break it into tasks, stay focused with Pomodoro sessions, earn points, and head to the Shop to make the tracker your own. Happy New Year! 🎆',
      target: null,
    },
  ];

  let step = 0;

  // ── Build overlay panels ──────────────────────────────────────────────────
  const panels = {};
  ['top', 'right', 'bottom', 'left', 'full'].forEach(id => {
    const d = document.createElement('div');
    d.id  = `tut-panel-${id}`;
    d.className = 'tut-panel';
    d.style.display = 'none';
    d.addEventListener('click', close);
    document.body.appendChild(d);
    panels[id] = d;
  });

  const ring = document.createElement('div');
  ring.id = 'tut-ring';
  ring.style.display = 'none';
  document.body.appendChild(ring);

  // ── Build tooltip ─────────────────────────────────────────────────────────
  const tip = document.createElement('div');
  tip.id = 'tutorial-tooltip';
  tip.innerHTML = `
    <div id="tut-step-num"></div>
    <h3 id="tut-title"></h3>
    <p id="tut-body"></p>
    <div class="tut-actions">
      <button id="tut-skip">Skip tour</button>
      <div class="tut-nav">
        <button id="tut-prev">← Back</button>
        <button id="tut-next">Next →</button>
      </div>
    </div>
  `;
  document.body.appendChild(tip);

  // ── Spotlight helpers ─────────────────────────────────────────────────────
  const PAD = 8;

  function showSpotlight(el) {
    if (!el) {
      // Full-screen dim, no hole
      Object.values(panels).forEach(p => (p.style.display = 'none'));
      panels.full.style.cssText = 'display:block;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;';
      ring.style.display = 'none';
      return;
    }

    panels.full.style.display = 'none';

    const r    = el.getBoundingClientRect();
    const top  = Math.max(0, r.top  - PAD);
    const left = Math.max(0, r.left - PAD);
    const bot  = Math.min(window.innerHeight, r.bottom + PAD);
    const rgt  = Math.min(window.innerWidth,  r.right  + PAD);
    const bg   = 'rgba(0,0,0,0.6)';

    const set = (panel, css) => { panel.style.cssText = `display:block;position:fixed;background:${bg};z-index:10000;${css}`; };
    set(panels.top,    `top:0;left:0;right:0;height:${top}px;`);
    set(panels.bottom, `top:${bot}px;left:0;right:0;bottom:0;`);
    set(panels.left,   `top:${top}px;left:0;width:${left}px;height:${bot - top}px;`);
    set(panels.right,  `top:${top}px;left:${rgt}px;right:0;height:${bot - top}px;`);

    ring.style.cssText = `display:block;top:${top}px;left:${left}px;width:${rgt - left}px;height:${bot - top}px;`;
  }

  // ── Tooltip positioning ───────────────────────────────────────────────────
  function positionTip(el, pos) {
    tip.classList.add('visible');

    // Let browser render first so we can measure tooltip size
    requestAnimationFrame(() => {
      const TW = tip.offsetWidth  || 320;
      const TH = tip.offsetHeight || 160;
      const GAP = 14;
      const VW = window.innerWidth;
      const VH = window.innerHeight;

      let top, left;

      if (!el) {
        top  = (VH - TH) / 2;
        left = (VW - TW) / 2;
      } else {
        const r = el.getBoundingClientRect();
        if (pos === 'above') {
          top = r.top - PAD - GAP - TH;
          if (top < 8) top = r.bottom + PAD + GAP; // flip if off-screen
        } else {
          top = r.bottom + PAD + GAP;
          if (top + TH > VH - 8) top = r.top - PAD - GAP - TH; // flip
        }
        left = r.left + r.width / 2 - TW / 2;
      }

      // Clamp to viewport
      left = Math.max(10, Math.min(left, VW - TW - 10));
      top  = Math.max(10, Math.min(top,  VH - TH - 10));

      tip.style.top  = `${top}px`;
      tip.style.left = `${left}px`;
    });
  }

  // ── Render step ───────────────────────────────────────────────────────────
  function render() {
    const s  = STEPS[step];
    const el = s.target ? document.querySelector(s.target) : null;

    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Short delay so scroll finishes before we measure position
    setTimeout(() => {
      showSpotlight(el);
      positionTip(el, s.pos);

      document.getElementById('tut-step-num').textContent = `${step + 1} of ${STEPS.length}`;
      document.getElementById('tut-title').textContent    = s.title;
      document.getElementById('tut-body').textContent     = s.body;
      document.getElementById('tut-prev').disabled        = step === 0;
      document.getElementById('tut-next').textContent     = step === STEPS.length - 1 ? 'Finish ✓' : 'Next →';
    }, el ? 180 : 0);
  }

  // ── Open / Close ──────────────────────────────────────────────────────────
  function open() {
    step = 0;
    render();
  }

  function close() {
    Object.values(panels).forEach(p => (p.style.display = 'none'));
    ring.style.display = 'none';
    tip.classList.remove('visible');
    tip.style.top = tip.style.left = '';
  }

  // ── Events ────────────────────────────────────────────────────────────────
  document.getElementById('tut-next').addEventListener('click', () => {
    if (step >= STEPS.length - 1) { close(); return; }
    step++;
    render();
  });

  document.getElementById('tut-prev').addEventListener('click', () => {
    if (step > 0) { step--; render(); }
  });

  document.getElementById('tut-skip').addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (!tip.classList.contains('visible')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') document.getElementById('tut-next').click();
    if (e.key === 'ArrowLeft')  document.getElementById('tut-prev').click();
  });

  document.getElementById('tutorial-open-btn').addEventListener('click', open);
})();
