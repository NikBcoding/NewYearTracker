// ── Pomodoro Timer ────────────────────────────────────────────────────────────

(function () {
  const POMO_KEY = 'nyt_pomo';
  const DEFAULTS = { work: 25, short: 5, long: 15, interval: 4 };
  const CIRC     = 2 * Math.PI * 88; // circumference for r=88 ≈ 552.92

  function loadSettings() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(POMO_KEY))); }
    catch { return Object.assign({}, DEFAULTS); }
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const st = {
    settings:   loadSettings(),
    mode:       'work',
    timeLeft:   0,
    isRunning:  false,
    cycleCount: 0,   // work sessions completed in current long-break cycle
    _tid:       null,
  };

  // ── DOM ────────────────────────────────────────────────────────────────────
  const timeEl   = document.getElementById('pomo-time');
  const modeEl   = document.getElementById('pomo-mode-label');
  const startBtn = document.getElementById('pomo-start-btn');
  const resetBtn = document.getElementById('pomo-reset-btn');
  const skipBtn  = document.getElementById('pomo-skip-btn');
  const ring     = document.getElementById('pomo-ring-fill');
  const dotsEl   = document.getElementById('pomo-dots');
  const panel    = document.getElementById('pomo-settings-panel');
  const gearBtn  = document.getElementById('pomo-settings-btn');

  // ── Helpers ────────────────────────────────────────────────────────────────
  function info(mode) {
    const s = st.settings;
    return ({
      work:  { label: 'Focus',       secs: s.work  * 60, color: '#ef4444' },
      short: { label: 'Short Break', secs: s.short * 60, color: '#22c55e' },
      long:  { label: 'Long Break',  secs: s.long  * 60, color: '#3b82f6' },
    })[mode];
  }

  function fmt(secs) {
    return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  }

  // ── Ring ───────────────────────────────────────────────────────────────────
  ring.style.strokeDasharray = CIRC;

  function setRing(instant) {
    const { secs, color } = info(st.mode);
    const offset = CIRC * (1 - st.timeLeft / secs);
    if (instant) {
      const prev = ring.style.transition;
      ring.style.transition      = 'stroke 0.4s';
      ring.style.strokeDashoffset = offset;
      ring.style.stroke           = color;
      setTimeout(() => { ring.style.transition = prev; }, 60);
    } else {
      ring.style.strokeDashoffset = offset;
      ring.style.stroke           = color;
    }
  }

  // ── Dots ───────────────────────────────────────────────────────────────────
  function setDots() {
    const n = st.settings.interval;
    dotsEl.innerHTML = Array.from({ length: n }, (_, i) =>
      `<div class="pomo-dot${i < st.cycleCount ? ' done' : ''}"></div>`
    ).join('');
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function render() {
    const { label } = info(st.mode);
    timeEl.textContent   = fmt(st.timeLeft);
    modeEl.textContent   = label;
    startBtn.textContent = st.isRunning ? '⏸ Pause' : '▶ Start';
    startBtn.classList.toggle('running', st.isRunning);
    document.querySelectorAll('.pomo-mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === st.mode);
    });
    document.title = st.isRunning
      ? `${fmt(st.timeLeft)} · ${label} — New Year Tracker`
      : 'New Year Tracker';
    setRing(false);
    setDots();
  }

  // ── Controls ───────────────────────────────────────────────────────────────
  function switchMode(mode) {
    stop();
    st.mode     = mode;
    st.timeLeft = info(mode).secs;
    render();
    setRing(true);
  }

  function start() {
    if (st.isRunning) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    st.isRunning = true;
    st._tid = setInterval(tick, 1000);
    render();
  }

  function stop() {
    clearInterval(st._tid);
    st._tid      = null;
    st.isRunning = false;
    document.title = 'New Year Tracker';
    render();
  }

  function reset() {
    stop();
    st.timeLeft = info(st.mode).secs;
    setRing(true);
    render();
  }

  function tick() {
    if (st.timeLeft <= 0) { onEnd(); return; }
    st.timeLeft--;
    render();
  }

  function onEnd() {
    stop();

    if (st.mode === 'work') {
      st.cycleCount++;

      // Award points via tracker.js globals
      if (typeof addPoints    === 'function') addPoints(5, 'Pomodoro done! 🍅');
      if (typeof triggerExtras === 'function') triggerExtras();

      const goLong = st.cycleCount >= st.settings.interval;
      if (goLong) st.cycleCount = 0;
      const next = goLong ? 'long' : 'short';
      notify('Pomodoro Complete!', goLong ? 'Great work — take a long break 🎉' : 'Short break time 😌');
      switchMode(next);
    } else {
      notify('Break Over!', 'Time to focus! 🍅');
      switchMode('work');
    }
  }

  function notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }

  // ── Settings panel ─────────────────────────────────────────────────────────
  function toggleSettings() {
    const opening = panel.classList.toggle('hidden') === false;  // true = now visible
    if (opening) {
      document.getElementById('pomo-work-input').value     = st.settings.work;
      document.getElementById('pomo-short-input').value    = st.settings.short;
      document.getElementById('pomo-long-input').value     = st.settings.long;
      document.getElementById('pomo-interval-input').value = st.settings.interval;
    }
  }

  function saveFromUI() {
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, parseInt(v) || lo));
    st.settings = {
      work:     clamp(document.getElementById('pomo-work-input').value,     1, 90),
      short:    clamp(document.getElementById('pomo-short-input').value,    1, 30),
      long:     clamp(document.getElementById('pomo-long-input').value,     1, 60),
      interval: clamp(document.getElementById('pomo-interval-input').value, 2,  8),
    };
    localStorage.setItem(POMO_KEY, JSON.stringify(st.settings));
    panel.classList.add('hidden');
    // If current mode's duration changed, reset to apply new time
    st.timeLeft = info(st.mode).secs;
    setRing(true);
    stop();
    setDots();
    render();
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  startBtn.addEventListener('click', () => st.isRunning ? stop() : start());
  resetBtn.addEventListener('click', reset);
  skipBtn.addEventListener('click',  () => { stop(); onEnd(); });
  gearBtn.addEventListener('click',  toggleSettings);
  document.getElementById('pomo-save-btn').addEventListener('click', saveFromUI);

  document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  st.timeLeft = info('work').secs;
  render();
  setRing(true);
})();
