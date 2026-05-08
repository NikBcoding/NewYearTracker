// Goal & Task Tracker — localStorage backed

const STORAGE_KEY = 'nyt_goals';
const POINTS_KEY  = 'nyt_points';
const BG_KEY      = 'nyt_bg_color';
const SHOP_KEY    = 'nyt_shop_owned';
const THEME_KEY   = 'nyt_theme';
const ACCENT_KEY  = 'nyt_accent';

// ── Shop catalogue ────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  // Backgrounds — originals
  { id: 'bg_sunset',    type: 'bg', label: 'Sunset',         price: 25, value: 'linear-gradient(135deg,#ff9966 0%,#ff5e62 100%)',                   emoji: '🌅' },
  { id: 'bg_ocean',     type: 'bg', label: 'Ocean',          price: 25, value: 'linear-gradient(180deg,#00c6ff 0%,#0072ff 100%)',                   emoji: '🌊' },
  { id: 'bg_blossom',   type: 'bg', label: 'Cherry Blossom', price: 25, value: 'linear-gradient(135deg,#ffecd2 0%,#fcb69f 50%,#ff9a9e 100%)',       emoji: '🌸' },
  { id: 'bg_forest',    type: 'bg', label: 'Forest',         price: 25, value: 'linear-gradient(135deg,#56ab2f 0%,#a8e063 100%)',                   emoji: '🌿' },
  { id: 'bg_aurora',    type: 'bg', label: 'Aurora',         price: 25, value: 'linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%)',       emoji: '✨' },
  { id: 'bg_midnight',  type: 'bg', label: 'Midnight',       price: 25, value: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)',       emoji: '🌙' },
  // Backgrounds — new
  { id: 'bg_mint',      type: 'bg', label: 'Mint Breeze',    price: 25, value: 'linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)',                   emoji: '🫧' },
  { id: 'bg_lavender',  type: 'bg', label: 'Lavender',       price: 25, value: 'linear-gradient(135deg,#e0c3fc 0%,#8ec5fc 100%)',                   emoji: '💜' },
  { id: 'bg_candy',     type: 'bg', label: 'Cotton Candy',   price: 25, value: 'linear-gradient(135deg,#f093fb 0%,#f5576c 50%,#fda085 100%)',       emoji: '🍬' },
  { id: 'bg_deepblue',  type: 'bg', label: 'Deep Blue',      price: 25, value: 'linear-gradient(135deg,#1e3c72 0%,#2a5298 100%)',                   emoji: '🔵' },
  { id: 'bg_goldhour',  type: 'bg', label: 'Golden Hour',    price: 25, value: 'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',                   emoji: '☀️' },
  { id: 'bg_galaxy',    type: 'bg', label: 'Galaxy',         price: 25, value: 'linear-gradient(135deg,#0f0c29 0%,#302b63 33%,#24243e 66%,#7b2d8b 100%)', emoji: '🌌' },

  // Animals
  { id: 'pet_bunny', type: 'pet', label: 'Bunny', price: 50, value: 'bunny', emoji: '🐰' },
  { id: 'pet_fox',   type: 'pet', label: 'Fox',   price: 50, value: 'fox',   emoji: '🦊' },
  { id: 'pet_bear',  type: 'pet', label: 'Bear',  price: 50, value: 'bear',  emoji: '🐻' },

  // Accent colors
  { id: 'accent_ruby',      type: 'accent', label: 'Ruby Red',   price: 25, value: 'ruby',      color: '#dc2626', emoji: '🔴' },
  { id: 'accent_violet',    type: 'accent', label: 'Violet',     price: 25, value: 'violet',    color: '#7c3aed', emoji: '🟣' },
  { id: 'accent_tangerine', type: 'accent', label: 'Tangerine',  price: 25, value: 'tangerine', color: '#ea580c', emoji: '🟠' },
  { id: 'accent_rose',      type: 'accent', label: 'Rose',       price: 25, value: 'rose',      color: '#e11d7a', emoji: '🌹' },
  { id: 'accent_emerald',   type: 'accent', label: 'Emerald',    price: 25, value: 'emerald',   color: '#059669', emoji: '💚' },
  { id: 'accent_sky',       type: 'accent', label: 'Sky Blue',   price: 25, value: 'sky',       color: '#0284c7', emoji: '🩵' },
  { id: 'accent_gold',      type: 'accent', label: 'Gold',       price: 25, value: 'gold',      color: '#d97706', emoji: '⭐' },
  { id: 'accent_slate',     type: 'accent', label: 'Slate Gray', price: 25, value: 'slate',     color: '#475569', emoji: '🩶' },

  // Themes — originals
  { id: 'theme_dark',      type: 'theme', label: 'Dark Mode',    price: 50, value: 'dark',      emoji: '🌑' },
  { id: 'theme_pastel',    type: 'theme', label: 'Pastel Dream', price: 50, value: 'pastel',    emoji: '🎀' },
  { id: 'theme_nature',    type: 'theme', label: 'Nature',       price: 50, value: 'nature',    emoji: '🌱' },
  // Themes — new
  { id: 'theme_candy',     type: 'theme', label: 'Candy',        price: 50, value: 'candy',     emoji: '🍭' },
  { id: 'theme_vaporwave', type: 'theme', label: 'Vaporwave',    price: 50, value: 'vaporwave', emoji: '🌈' },
  { id: 'theme_beach',     type: 'theme', label: 'Beach',        price: 50, value: 'beach',     emoji: '🏖️' },

  // Extras
  { id: 'extra_confetti', type: 'extra', label: 'Confetti Burst', price: 50, value: 'confetti', emoji: '🎊' },
  { id: 'extra_sound',    type: 'extra', label: 'Sound Effects',  price: 50, value: 'sound',    emoji: '🔔' },
  { id: 'extra_trophy',   type: 'extra', label: 'Trophy Shelf',   price: 50, value: 'trophy',   emoji: '🏆' },
];

// ── Shop ownership helpers ─────────────────────────────────────────────────────
function getOwned() {
  try { return JSON.parse(localStorage.getItem(SHOP_KEY)) || []; } catch { return []; }
}
function setOwned(arr) { localStorage.setItem(SHOP_KEY, JSON.stringify(arr)); }
function isOwned(id)   { return getOwned().includes(id); }

// ── Background ────────────────────────────────────────────────────────────────
function applyBgColor(color) {
  const overlay    = document.getElementById('bg-overlay');
  const isGradient = color.startsWith('linear-gradient') || color.startsWith('radial-gradient');
  if (isGradient) {
    document.body.style.background           = color;
    document.body.style.backgroundAttachment = 'fixed';
    overlay.style.opacity = '0';
  } else {
    document.body.style.background           = '';
    document.body.style.backgroundAttachment = '';
    overlay.style.background = color;
    overlay.style.opacity    = '0.35';
    document.getElementById('bg-color-picker').value = color;
  }
}

function initBgColor() {
  const saved = localStorage.getItem(BG_KEY) || '#a8d8ea';
  applyBgColor(saved);
  document.getElementById('bg-color-picker').addEventListener('input', e => {
    localStorage.setItem(BG_KEY, e.target.value);
    applyBgColor(e.target.value);
  });
}

// ── Points ────────────────────────────────────────────────────────────────────
function getPoints() {
  return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10);
}

function setPointsDisplay(total) {
  document.getElementById('points-display').textContent  = total;
  const sp = document.getElementById('shop-pts-display');
  if (sp) sp.textContent = total;
}

function addPoints(amount, label) {
  const total = getPoints() + amount;
  localStorage.setItem(POINTS_KEY, total);
  setPointsDisplay(total);
  showToast(`+${amount} pts — ${label}`);
}

function showToast(msg) {
  const toast = document.getElementById('points-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function initPoints() {
  setPointsDisplay(getPoints());
  if (!sessionStorage.getItem('nyt_login_rewarded')) {
    sessionStorage.setItem('nyt_login_rewarded', '1');
    addPoints(1, 'Logged in');
  }
}

// ── Data ──────────────────────────────────────────────────────────────────────
function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveData(goals) { localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)); }

// ── State ─────────────────────────────────────────────────────────────────────
let goals = loadData();

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const list = document.getElementById('goal-list');
  list.innerHTML = '';

  if (goals.length === 0) {
    list.innerHTML = '<p class="tracker-empty">No goals yet. Add one above!</p>';
    updateTrophyDisplay();
    return;
  }

  goals.forEach((goal, gi) => {
    const goalEl = document.createElement('div');
    goalEl.className = 'tracker-goal';

    const completedTasks = goal.tasks.filter(t => t.done).length;
    const totalTasks     = goal.tasks.length;

    goalEl.innerHTML = `
      <div class="tracker-goal-header">
        <span class="tracker-goal-title">${escHtml(goal.title)}</span>
        <span class="tracker-goal-deadline">${deadlineBadge(goal.deadline)}</span>
        <span class="tracker-goal-progress">${completedTasks}/${totalTasks} done</span>
        <button class="tracker-btn-icon tracker-delete-goal" data-gi="${gi}" title="Delete goal">✕</button>
      </div>
      <ul class="tracker-task-list" id="tasks-${gi}"></ul>
      <div class="tracker-add-task-row">
        <input class="tracker-input" type="text" placeholder="Add a task…" id="task-input-${gi}">
        <input class="tracker-date-input" type="date" id="task-deadline-${gi}" min="${todayStr()}" max="${maxDeadline()}" title="Task deadline (optional)">
        <button class="tracker-btn tracker-btn-sm" data-gi="${gi}" data-action="add-task">Add Task</button>
      </div>
    `;

    list.appendChild(goalEl);

    const taskList = goalEl.querySelector(`#tasks-${gi}`);
    goal.tasks.forEach((task, ti) => {
      const li = document.createElement('li');
      li.className = 'tracker-task' + (task.done ? ' tracker-task-done' : '');
      li.innerHTML = `
        <label class="tracker-checkbox-label">
          <input type="checkbox" class="tracker-checkbox" data-gi="${gi}" data-ti="${ti}" ${task.done ? 'checked disabled' : ''}>
          <span class="tracker-task-name">${escHtml(task.name)}</span>
        </label>
        ${!task.done ? deadlineBadge(task.deadline) : ''}
        <button class="tracker-btn-icon tracker-delete-task" data-gi="${gi}" data-ti="${ti}" title="Delete task">✕</button>
      `;
      taskList.appendChild(li);
    });
  });

  renderChecklist();
  updateTrophyDisplay();
}

// ── Checklist summary ─────────────────────────────────────────────────────────
function renderChecklist() {
  const section = document.getElementById('checklist-section');
  if (goals.length === 0 || goals.every(g => g.tasks.length === 0)) {
    section.innerHTML = '';
    return;
  }

  let html = '<h2>Checklist</h2>';
  goals.forEach(goal => {
    if (goal.tasks.length === 0) return;
    html += `<div class="cl-goal">
      <div class="cl-goal-title" style="display:flex;align-items:center;gap:8px;">
        ${escHtml(goal.title)} ${deadlineBadge(goal.deadline)}
      </div>
      <ul class="cl-list">`;
    goal.tasks.forEach(task => {
      html += `
        <li class="cl-item${task.done ? ' cl-done' : ''}">
          <span class="cl-check">${task.done ? '✓' : '○'}</span>
          <span class="cl-name">${escHtml(task.name)}</span>
          ${!task.done ? deadlineBadge(task.deadline) : ''}
        </li>`;
    });
    html += '</ul></div>';
  });
  section.innerHTML = html;
}

// ── Completion prompt modal ───────────────────────────────────────────────────
function showCompletionPrompt(gi, ti) {
  const overlay  = document.getElementById('tracker-modal-overlay');
  const taskName = goals[gi].tasks[ti].name;

  document.getElementById('tracker-modal-task-name').textContent = `"${taskName}"`;
  overlay.classList.remove('hidden');

  document.getElementById('tracker-modal-yes').onclick = () => {
    const goal = goals[gi];

    // Check if the goal was already complete before this task
    const wasGoalComplete = goal.tasks.length > 0 && goal.tasks.every(t => t.done);

    // Mark this task as complete
    goal.tasks[ti].done = true;

    // Check if this task completed the whole main goal
    const isGoalComplete = goal.tasks.length > 0 && goal.tasks.every(t => t.done);

    // Reward main goal only once
    const shouldRewardGoal = !wasGoalComplete && isGoalComplete && !goal.goalRewarded;

    if (shouldRewardGoal) {
      goal.goalRewarded = true;
    }

    saveData(goals);
    overlay.classList.add('hidden');
    render();

    addPoints(5, 'Task completed');

    if (shouldRewardGoal) {
      addPoints(50, 'Main goal completed! 🎉');
    }

    triggerExtras();
  };

  document.getElementById('tracker-modal-no').onclick = () => {
    overlay.classList.add('hidden');
  };
}

// ── Event delegation ──────────────────────────────────────────────────────────
document.getElementById('goal-list').addEventListener('change', e => {
  const cb = e.target.closest('input[type="checkbox"].tracker-checkbox');
  if (!cb) return;
  e.preventDefault();
  cb.checked = false;
  showCompletionPrompt(parseInt(cb.dataset.gi, 10), parseInt(cb.dataset.ti, 10));
});

document.getElementById('goal-list').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const gi = parseInt(btn.dataset.gi, 10);
  const ti = parseInt(btn.dataset.ti, 10);

  if (btn.dataset.action === 'add-task') {
    const input     = document.getElementById(`task-input-${gi}`);
    const dateInput = document.getElementById(`task-deadline-${gi}`);
    const name      = input.value.trim();
    if (!name) return;
    goals[gi].tasks.push({ name, done: false, deadline: dateInput.value || null });
    saveData(goals);
    input.value = '';
    dateInput.value = '';
    render();
    return;
  }

  if (btn.classList.contains('tracker-delete-goal')) {
    if (confirm(`Delete goal "${goals[gi].title}" and all its tasks?`)) {
      goals.splice(gi, 1);
      saveData(goals);
      render();
    }
    return;
  }

  if (btn.classList.contains('tracker-delete-task')) {
    goals[gi].tasks.splice(ti, 1);
    saveData(goals);
    render();
    return;
  }
});

document.getElementById('goal-list').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const input = e.target;
  if (!input.id || !input.id.startsWith('task-input-')) return;
  const gi   = parseInt(input.id.replace('task-input-', ''), 10);
  const name = input.value.trim();
  if (!name) return;
  goals[gi].tasks.push({ name, done: false });
  saveData(goals);
  input.value = '';
  render();
});

document.getElementById('add-goal-btn').addEventListener('click', () => {
  const input     = document.getElementById('goal-input');
  const dateInput = document.getElementById('goal-deadline');
  const title     = input.value.trim();
  if (!title) return;

  goals.push({
  title,
  tasks: [],
  deadline: dateInput.value || null,
  goalRewarded: false
});

  saveData(goals);
  input.value     = '';
  dateInput.value = '';
  render();
});

document.getElementById('goal-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-goal-btn').click();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function deadlineBadge(deadline) {
  if (!deadline) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const due   = new Date(deadline + 'T00:00:00');
  const days  = Math.round((due - today) / 86400000);
  if (days < 0)  return `<span class="deadline-badge deadline-overdue">⚠ Overdue (${Math.abs(days)}d ago)</span>`;
  if (days <= 7) return `<span class="deadline-badge deadline-soon">⏳ Due in ${days}d</span>`;
  return `<span class="deadline-badge deadline-ok">📅 ${due.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>`;
}

function maxDeadline() {
  const d = new Date(); d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

function todayStr() { return new Date().toISOString().split('T')[0]; }

// ── Theme ─────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(THEME_KEY);
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);
}

// ── Accent color ──────────────────────────────────────────────────────────────
function getAccent() { return localStorage.getItem(ACCENT_KEY) || ''; }

function applyAccent(accent) {
  if (accent) {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem(ACCENT_KEY, accent);
  } else {
    document.documentElement.removeAttribute('data-accent');
    localStorage.removeItem(ACCENT_KEY);
  }
}

function initAccent() {
  const saved = getAccent();
  if (saved) applyAccent(saved);
}

// ── Extras ────────────────────────────────────────────────────────────────────
function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6fc8','#c77dff','#f8961e','#43d9ad','#ff9f1c','#2ec4b6'];
  for (let i = 0; i < 55; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*8}px;
      height:${6+Math.random()*8}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*0.4}s;
    `;
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function playCompletionSound() {
  try {
    const ctx   = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  } catch (_) { /* AudioContext unavailable */ }
}

function updateTrophyDisplay() {
  const display = document.getElementById('trophy-display');
  if (!display || !isOwned('extra_trophy')) return;
  const done = goals.flatMap(g => g.tasks).filter(t => t.done).length;
  const milestones = [
    { min: 50, icon: '🏆', title: 'Champion' },
    { min: 30, icon: '🥇', title: 'Gold'      },
    { min: 15, icon: '🥈', title: 'Silver'    },
    { min:  5, icon: '🥉', title: 'Bronze'    },
  ];
  const badge = milestones.find(m => done >= m.min);
  display.style.display = 'flex';
  display.innerHTML     = `${badge ? badge.icon : '🎯'} <span>${done}</span>`;
  display.title         = badge ? `${badge.title}! ${done} tasks done` : `Complete 5 tasks for your first medal!`;
}

function triggerExtras() {
  if (isOwned('extra_confetti')) spawnConfetti();
  if (isOwned('extra_sound'))    playCompletionSound();
}

function initExtras() {
  if (isOwned('extra_trophy')) updateTrophyDisplay();
}

// ── Shop ──────────────────────────────────────────────────────────────────────
function buyItem(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item || isOwned(id)) return;
  const pts = getPoints();
  if (pts < item.price) { showToast('Not enough points! ⭐'); return; }
  localStorage.setItem(POINTS_KEY, pts - item.price);
  setPointsDisplay(pts - item.price);
  const owned = getOwned();
  owned.push(id);
  setOwned(owned);
  showToast(`Bought ${item.emoji} ${item.label}!`);
  applyShopItem(item);
  renderShop();
  if (item.type === 'pet') window._petRefreshUnlocked && window._petRefreshUnlocked();
}

function applyShopItem(item) {
  if (item.type === 'bg') {
    localStorage.setItem(BG_KEY, item.value);
    applyBgColor(item.value);
  } else if (item.type === 'theme') {
    applyTheme(item.value);
  } else if (item.type === 'accent') {
    applyAccent(getAccent() === item.value ? null : item.value);
  } else if (item.type === 'pet') {
    window._petSwitchTo && window._petSwitchTo(item.value);
  } else if (item.type === 'extra') {
    if (item.value === 'trophy') updateTrophyDisplay();
  }
}

function renderShop() {
  const container = document.getElementById('shop-items');
  if (!container) return;

  const sp = document.getElementById('shop-pts-display');
  if (sp) sp.textContent = getPoints();

  const activeTab   = document.querySelector('.shop-tab.active')?.dataset.tab || 'bg';
  const items       = SHOP_ITEMS.filter(i => i.type === activeTab);
  const owned       = getOwned();
  const pts         = getPoints();
  const activeTheme  = localStorage.getItem(THEME_KEY);
  const activeBg     = localStorage.getItem(BG_KEY);
  const activePet    = localStorage.getItem('nyt_pet') || 'cat';
  const activeAccent = getAccent();

  let html = '';
  items.forEach(item => {
    const isFree = item.type === 'pet' && (item.value === 'cat' || item.value === 'dog');
    const owns   = isFree || owned.includes(item.id);
    const canBuy = pts >= item.price;

    let isActive = false;
    if (item.type === 'theme')  isActive = activeTheme  === item.value;
    if (item.type === 'bg')     isActive = activeBg     === item.value;
    if (item.type === 'pet')    isActive = activePet    === item.value;
    if (item.type === 'accent') isActive = activeAccent === item.value;
    if (item.type === 'extra')  isActive = owns;

    // Preview area
    let preview = '';
    if (item.type === 'bg') {
      preview = `<div class="shop-preview-bg" style="background:${item.value};"></div>`;
    } else if (item.type === 'pet') {
      preview = `<div class="shop-preview-pet"><img src="/pet-${item.value}.svg" alt="${item.label}"></div>`;
    } else if (item.type === 'theme') {
      preview = `<div class="shop-preview-theme theme-preview-${item.value}">${item.emoji}</div>`;
    } else if (item.type === 'accent') {
      preview = `<div class="shop-preview-accent">
        <div class="accent-demo" style="background:${item.color};">
          <span class="accent-demo-text">Aa</span>
          <div class="accent-demo-bar"></div>
        </div>
      </div>`;
    } else {
      preview = `<div class="shop-preview-extra">${item.emoji}</div>`;
    }

    // Action button
    let action = '';
    if (!owns) {
      action = `<button class="shop-buy-btn" data-id="${item.id}" ${!canBuy ? 'disabled' : ''}>
        ${!canBuy ? '🔒' : '🛒'} ${item.price} pts
      </button>`;
    } else if (item.type === 'extra') {
      action = `<button class="shop-apply-btn shop-active-btn" style="cursor:default">✓ Active</button>`;
    } else {
      const activeClass = isActive ? ' shop-active-btn' : '';
      const label = item.type === 'pet'
        ? (isActive ? '✓ Active' : 'Switch to')
        : (isActive ? '✓ Active — remove' : 'Apply');
      action = `<button class="shop-apply-btn${activeClass}" data-id="${item.id}">${label}</button>`;
    }

    html += `<div class="shop-item${isActive ? ' active-item' : ''}">
      ${preview}
      <div class="shop-item-info">
        <span class="shop-item-label">${item.emoji} ${item.label}</span>
        ${owns
          ? '<span class="shop-owned-badge">✓ Owned</span>'
          : `<span class="shop-item-price">⭐ ${item.price}</span>`}
      </div>
      ${action}
    </div>`;
  });

  container.innerHTML = html || '<p class="shop-empty">Nothing here yet.</p>';

  container.querySelectorAll('.shop-buy-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => buyItem(btn.dataset.id));
  });

  container.querySelectorAll('.shop-apply-btn[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = SHOP_ITEMS.find(i => i.id === btn.dataset.id);
      if (!item) return;
      if (item.type === 'theme') {
        applyTheme(localStorage.getItem(THEME_KEY) === item.value ? null : item.value);
      } else if (item.type === 'accent') {
        applyAccent(getAccent() === item.value ? null : item.value);
      } else if (item.type === 'bg') {
        localStorage.setItem(BG_KEY, item.value);
        applyBgColor(item.value);
      } else if (item.type === 'pet') {
        window._petSwitchTo && window._petSwitchTo(item.value);
      }
      renderShop();
    });
  });
}

function openShop() {
  document.getElementById('shop-pts-display').textContent = getPoints();
  document.getElementById('shop-modal-overlay').classList.remove('hidden');
  renderShop();
}

function closeShop() {
  document.getElementById('shop-modal-overlay').classList.add('hidden');
}

document.getElementById('shop-open-btn').addEventListener('click', openShop);
document.getElementById('shop-close-btn').addEventListener('click', closeShop);
document.getElementById('shop-modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('shop-modal-overlay')) closeShop();
});
document.querySelectorAll('.shop-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderShop();
  });
});

// ── Corner pet ────────────────────────────────────────────────────────────────
(function () {
  const PET_KEY  = 'nyt_pet';
  const petIcons = { cat:'🐱', dog:'🐶', bunny:'🐰', fox:'🦊', bear:'🐻' };
  const pets = {
    cat:   { src:'/pet-cat.svg',   messages:['Meow! 🐾','Pet me!','Purrrr…','You got this!','*yawns*','Stay focused! 😺'] },
    dog:   { src:'/pet-dog.svg',   messages:['Woof! 🐾','Good job!','You can do it!','*wags tail*','Fetch those goals! 🐕'] },
    bunny: { src:'/pet-bunny.svg', messages:['Hop hop! 🐾','*twitches nose*','Carrots = motivation!','You got this! 🐰','*binky!*'] },
    fox:   { src:'/pet-fox.svg',   messages:['Yip! 🦊','Clever as a fox!','*flicks tail*','Hunt those goals!','Sly but kind! 🦊'] },
    bear:  { src:'/pet-bear.svg',  messages:['Roar! 🐻','Bear hug incoming!','*scratches tree*','Strong like bear!','You\'re the bear-st! 🐻'] },
  };
  const anims = ['jump', 'spin', 'wiggle', 'shake'];

  const emoji  = document.getElementById('pet-emoji');
  const bubble = document.getElementById('pet-bubble');
  const toggle = document.getElementById('pet-toggle');

  function getUnlocked() {
    const owned = getOwned();
    const list  = ['cat', 'dog'];
    SHOP_ITEMS.filter(i => i.type === 'pet' && owned.includes(i.id)).forEach(i => {
      if (!list.includes(i.value)) list.push(i.value);
    });
    return list;
  }

  let current = localStorage.getItem(PET_KEY) || 'cat';
  if (!getUnlocked().includes(current)) current = 'cat';

  function updateToggleText() {
    const unlocked = getUnlocked();
    const next = unlocked[(unlocked.indexOf(current) + 1) % unlocked.length];
    toggle.textContent = `${petIcons[next] || '🐾'} switch pet`;
  }

  function setPet(type) {
    if (!pets[type]) return;
    current = type;
    localStorage.setItem(PET_KEY, type);
    emoji.src = pets[type].src;
    updateToggleText();
  }

  function playAnim() {
    const anim = anims[Math.floor(Math.random() * anims.length)];
    const msgs = pets[current].messages;
    bubble.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    emoji.className = anim;
    emoji.addEventListener('animationend', () => { emoji.className = 'idle'; }, { once: true });
  }

  setPet(current);

  document.getElementById('corner-pet').addEventListener('mouseenter', playAnim);
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const unlocked = getUnlocked();
    const next     = unlocked[(unlocked.indexOf(current) + 1) % unlocked.length];
    setPet(next);
    playAnim();
  });

  window._petSwitchTo       = type => { if (getUnlocked().includes(type)) { setPet(type); playAnim(); } };
  window._petRefreshUnlocked = ()   => { if (!getUnlocked().includes(current)) setPet('cat'); updateToggleText(); };
})();

// ── Init ──────────────────────────────────────────────────────────────────────
const goalDeadlineInput = document.getElementById('goal-deadline');
goalDeadlineInput.min = todayStr();
goalDeadlineInput.max = maxDeadline();

initTheme();
initAccent();
initBgColor();
initPoints();
initExtras();
render();