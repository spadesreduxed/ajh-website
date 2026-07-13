/* ============================================================
   Day 81: Build Aquarium — 81 days as a living fish tank.
   Each build is a fish. Size by impact. Species by archetype.
   Each fish has a deterministic swim loop with random phase,
   drift, hover depth, and a "school bias" so they cluster a
   little without overlapping.
   ============================================================ */

(function () {
  'use strict';

  const DAY1 = new Date(2026, 3, 22); // Apr 22 2026
  const TODAY_DAY = 81;
  const TOTAL_FISH = 81;
  const STORAGE_KEY = 'ajh_aquarium_v1';

  // Archetype palette matches the rest of the site
  const ARCHETYPE_COLORS = {
    systems:     '#a855f7',
    visual:      '#ec4899',
    audio:       '#3b82f6',
    interactive: '#10b981',
    data:        '#f59e0b',
    meta:        '#8b5cf6',
    craft:       '#06b6d4',
    social:      '#f43f5e',
  };
  const ARCHETYPE_LABELS = {
    systems: 'Systems', visual: 'Visual', audio: 'Audio',
    interactive: 'Interactive', data: 'Data', meta: 'Meta',
    craft: 'Craft', social: 'Social',
  };
  // 8 species, one per archetype. Each is a fish emoji + tail wiggle.
  const SPECIES = {
    systems:     { emoji: '🐠', fin: 'clown' },
    visual:      { emoji: '🐡', fin: 'puffer' },
    audio:       { emoji: '🐬', fin: 'dolphin' },
    interactive: { emoji: '🐟', fin: 'koi' },
    data:        { emoji: '🦈', fin: 'shark' },
    meta:        { emoji: '🐳', fin: 'whale' },
    craft:       { emoji: '🐢', fin: 'turtle' },
    social:      { emoji: '🦑', fin: 'squid' },
  };

  // 81-day build history, mirrors dna / trail / weather / garden / tape / skyline.
  // Day 81 = Build Aquarium (the new one).
  const BUILDS = [
    { d: 1,  a: 'meta',        n: 'Vault Genesis' },
    { d: 2,  a: 'visual',      n: 'Theme System' },
    { d: 3,  a: 'systems',     n: 'Build Pipeline' },
    { d: 4,  a: 'craft',       n: 'Hero Polish' },
    { d: 5,  a: 'data',        n: 'Visitor Map' },
    { d: 6,  a: 'interactive', n: 'Easter Eggs' },
    { d: 7,  a: 'craft',       n: 'About Rewrite' },
    { d: 8,  a: 'systems',     n: 'Service Worker' },
    { d: 9,  a: 'social',      n: 'Share Buttons' },
    { d: 10, a: 'data',        n: 'Projects Feed' },
    { d: 11, a: 'interactive', n: 'Particle Field' },
    { d: 12, a: 'craft',       n: 'Section Anchors' },
    { d: 13, a: 'data',        n: 'Tag Cloud' },
    { d: 14, a: 'systems',     n: 'Build Cache' },
    { d: 15, a: 'interactive', n: 'Tilt Cards' },
    { d: 16, a: 'visual',      n: 'Cursor Trail' },
    { d: 17, a: 'interactive', n: 'Confetti' },
    { d: 18, a: 'craft',       n: 'Hero Meta' },
    { d: 19, a: 'visual',      n: 'Aurora' },
    { d: 20, a: 'data',        n: 'Search Modal' },
    { d: 21, a: 'interactive', n: 'Mini Game' },
    { d: 22, a: 'visual',      n: 'Role Rotator' },
    { d: 23, a: 'craft',       n: 'Smart Nav' },
    { d: 24, a: 'audio',       n: 'Ambient Sound' },
    { d: 25, a: 'interactive', n: 'Section Minimap' },
    { d: 26, a: 'craft',       n: 'Currently Building' },
    { d: 27, a: 'interactive', n: 'Quick Actions' },
    { d: 28, a: 'craft',       n: 'Live Clock' },
    { d: 29, a: 'visual',      n: 'FAQ Accordion' },
    { d: 30, a: 'interactive', n: '3D Tilt Polish' },
    { d: 31, a: 'data',        n: 'Blog Cleanup' },
    { d: 32, a: 'craft',       n: 'Project Modal' },
    { d: 33, a: 'data',        n: 'Quote Vault' },
    { d: 34, a: 'craft',       n: 'Section Reveal' },
    { d: 35, a: 'data',        n: 'Quote Rotator' },
    { d: 36, a: 'craft',       n: 'FAQ Polish' },
    { d: 37, a: 'visual',      n: 'Glassmorphism' },
    { d: 38, a: 'craft',       n: 'Role Polish' },
    { d: 39, a: 'audio',       n: 'Smart Nav Audio' },
    { d: 40, a: 'data',        n: 'Build Sparkline' },
    { d: 41, a: 'visual',      n: 'Gradient Lab' },
    { d: 42, a: 'craft',       n: 'Story Scroll' },
    { d: 43, a: 'data',        n: 'Terminal Dash' },
    { d: 44, a: 'interactive', n: 'Code Playground' },
    { d: 45, a: 'data',        n: 'Crypto Tracker' },
    { d: 46, a: 'interactive', n: 'Command Palette' },
    { d: 47, a: 'craft',       n: 'Onboarding Tour' },
    { d: 48, a: 'interactive', n: 'Daily Challenge' },
    { d: 49, a: 'audio',       n: 'Music Player' },
    { d: 50, a: 'meta',        n: 'Roadmap 50' },
    { d: 51, a: 'data',        n: 'Status Dashboard' },
    { d: 52, a: 'visual',      n: 'Theme Swatches' },
    { d: 53, a: 'craft',       n: 'Mini Map Polish' },
    { d: 54, a: 'interactive', n: 'Snippet Run' },
    { d: 55, a: 'visual',      n: 'Animated Cursor' },
    { d: 56, a: 'craft',       n: 'Snippet Editor' },
    { d: 57, a: 'data',        n: 'Build Heatmap' },
    { d: 58, a: 'meta',        n: 'Build Assistant' },
    { d: 59, a: 'craft',       n: 'Bookmark Cards' },
    { d: 60, a: 'data',        n: 'Site Constellation' },
    { d: 61, a: 'meta',        n: 'Time Capsule' },
    { d: 62, a: 'craft',       n: 'Theme Studio' },
    { d: 63, a: 'craft',       n: 'Reading Mode' },
    { d: 64, a: 'meta',        n: 'Build Journal' },
    { d: 65, a: 'social',      n: 'Community Wishlist' },
    { d: 66, a: 'craft',       n: 'Builder Wisdom' },
    { d: 67, a: 'interactive', n: 'Pixel Art Studio' },
    { d: 68, a: 'interactive', n: 'Daily Pixel Challenge' },
    { d: 69, a: 'craft',       n: 'Build Receipts' },
    { d: 70, a: 'audio',       n: 'Soundboard' },
    { d: 71, a: 'audio',       n: 'Step Sequencer' },
    { d: 72, a: 'meta',        n: 'The Forge' },
    { d: 73, a: 'meta',        n: 'Lab Notebook' },
    { d: 74, a: 'data',        n: 'Build DNA' },
    { d: 75, a: 'data',        n: 'Constellation Map' },
    { d: 76, a: 'data',        n: 'Build Trail' },
    { d: 77, a: 'data',        n: 'Build Weather' },
    { d: 78, a: 'data',        n: 'Build Garden' },
    { d: 79, a: 'data',        n: 'Build Tape' },
    { d: 80, a: 'data',        n: 'Build Skyline' },
    { d: 81, a: 'craft',       n: 'Build Aquarium' },
  ];

  // Impact estimates per build (2 = tiny fry, 5 = whale/shark)
  const IMPACT = {};
  BUILDS.forEach(b => { IMPACT[b.d] = impactFor(b.d); });

  function impactFor(d) {
    // Big flagship features
    if ([11, 15, 17, 19, 22, 24, 25, 30, 37, 40, 44, 46, 48, 49, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81].includes(d)) return 5;
    // Medium features
    if ([2, 3, 6, 8, 9, 10, 14, 18, 20, 23, 26, 27, 28, 29, 32, 33, 34, 35, 36, 38, 39, 41, 42, 43, 45, 47, 50, 51, 52, 53, 54, 55, 56, 58, 59].includes(d)) return 4;
    if ([1, 4, 5, 7, 12, 13, 16, 21, 31].includes(d)) return 3;
    return 3;
  }

  const state = loadState();

  function loadState() {
    const defaults = {
      filter: 'all',
      time: 'night',       // 'night' | 'day'
      focused: null,
      feeding: 0,          // ms timestamp of last feed
      feeds: 0,            // total feedings
      visits: 0,
      spots: 0,            // fish-spotlighted count
      lastBubble: 0,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return Object.assign({}, defaults, parsed);
    } catch (e) { return defaults; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // Deterministic PRNG seeded by day number so the same fish pattern shows every visit.
  function rng(seed) {
    let s = (seed | 0) || 1;
    return function () {
      s = (s * 1664525 + 1013904223) | 0;
      return ((s >>> 0) % 100000) / 100000;
    };
  }
  function randRange(r, lo, hi) { return lo + r() * (hi - lo); }

  function buildDate(d) {
    const dt = new Date(DAY1.getTime() + (d - 1) * 86400000);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function buildDateLong(d) {
    const dt = new Date(DAY1.getTime() + (d - 1) * 86400000);
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function fishImpactDots(d) {
    const n = IMPACT[d] || 3;
    return '●'.repeat(n) + '○'.repeat(5 - n);
  }

  // -- Render: stats ---------------------------------------------------------
  function renderStats() {
    const totalImpact = Object.values(IMPACT).reduce((a, b) => a + b, 0);
    let tallest = BUILDS[0];
    BUILDS.forEach(b => { if (IMPACT[b.d] > IMPACT[tallest.d]) tallest = b; });

    setText('aq-stat-fish', TOTAL_FISH);
    setText('aq-stat-impact', totalImpact);
    setText('aq-stat-biggest', tallest ? 'Day ' + tallest.d : '—');
    setText('aq-stat-bubbles', state.feeds * 12 + state.visits * 3);
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // -- Render: chips ---------------------------------------------------------
  function renderChips() {
    const host = document.getElementById('aq-chips');
    if (!host) return;
    const counts = { all: TOTAL_FISH };
    BUILDS.forEach(b => { counts[b.a] = (counts[b.a] || 0) + 1; });
    host.innerHTML = '';
    const order = ['all', 'systems', 'visual', 'audio', 'interactive', 'data', 'meta', 'craft', 'social'];
    order.forEach(k => {
      const count = counts[k] || 0;
      const btn = document.createElement('button');
      btn.className = 'aq-chip' + (state.filter === k ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', state.filter === k ? 'true' : 'false');
      btn.dataset.key = k;
      const color = k === 'all' ? 'var(--aq-accent)' : ARCHETYPE_COLORS[k];
      btn.style.setProperty('--chip-color', color);
      btn.innerHTML =
        '<span class="aq-chip-label">' + (k === 'all' ? 'All' : ARCHETYPE_LABELS[k]) + '</span>' +
        '<span class="aq-chip-count">' + count + '</span>';
      btn.addEventListener('click', () => {
        state.filter = k;
        save();
        renderChips();
        renderTank();
      });
      host.appendChild(btn);
    });
  }

  // -- Render: static flora (weeds + coral) ---------------------------------
  function renderFlora() {
    const host = document.getElementById('aq-flora');
    if (!host) return;
    host.innerHTML = '';
    // 5 weeds across the floor
    for (let i = 1; i <= 5; i++) {
      const w = document.createElement('div');
      w.className = 'aq-weed aq-weed-' + i;
      host.appendChild(w);
    }
    // 4 coral mounds (hand-built SVG, cool teals + purples)
    const coralColors = ['#06b6d4','#22d3ee','#0ea5b7','#67e8f9','#a855f7','#14b8a6'];
    const coralSpots = [
      { left: '12%', bottom: '12%', size: 56, hue: 0 },
      { left: '28%', bottom: '14%', size: 42, hue: 1 },
      { left: '68%', bottom: '12%', size: 64, hue: 4 },
      { left: '88%', bottom: '16%', size: 48, hue: 3 },
    ];
    coralSpots.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'aq-coral';
      el.style.left = c.left;
      el.style.bottom = c.bottom;
      el.style.setProperty('--coral-w', c.size + 'px');
      el.style.setProperty('--coral-color', coralColors[c.hue]);
      el.innerHTML = '<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M50 80 C30 80 10 60 12 38 C14 22 28 18 30 8 C32 0 38 0 40 8 C42 18 48 22 50 18 C52 22 58 18 60 8 C62 0 68 0 70 8 C72 18 86 22 88 38 C90 60 70 80 50 80 Z" fill="var(--coral-color)" opacity="0.85"/><circle cx="38" cy="42" r="3" fill="rgba(255,255,255,0.4)"/><circle cx="60" cy="48" r="2" fill="rgba(255,255,255,0.4)"/><circle cx="50" cy="30" r="2.5" fill="rgba(255,255,255,0.4)"/></svg>';
      host.appendChild(el);
    });
    // 3 rocks
    const rockSpots = [
      { left: '8%',  bottom: '6%',  size: 36, rotate: 8 },
      { left: '44%', bottom: '5%',  size: 44, rotate: -12 },
      { left: '78%', bottom: '8%',  size: 32, rotate: 5 },
    ];
    rockSpots.forEach(r => {
      const el = document.createElement('div');
      el.className = 'aq-rock';
      el.style.left = r.left;
      el.style.bottom = r.bottom;
      el.style.setProperty('--rock-w', r.size + 'px');
      el.style.setProperty('--rock-rotate', r.rotate + 'deg');
      el.innerHTML = '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="50" cy="40" rx="48" ry="18" fill="#0c2438"/><ellipse cx="40" cy="32" rx="32" ry="14" fill="#1a3a55"/><ellipse cx="64" cy="34" rx="22" ry="10" fill="#234b6b"/><ellipse cx="50" cy="30" rx="14" ry="6" fill="rgba(255,255,255,0.08)"/></svg>';
      host.appendChild(el);
    });
    // 1 treasure chest (small easter egg)
    const chest = document.createElement('div');
    chest.className = 'aq-chest';
    chest.title = 'a sunken chest of build data';
    chest.innerHTML = '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="20" width="68" height="26" rx="3" fill="#7a4a1a"/><rect x="6" y="20" width="68" height="8" fill="#a06a2a"/><rect x="34" y="26" width="12" height="14" rx="2" fill="#d4af37"/><circle cx="40" cy="33" r="2" fill="#7a5a10"/></svg>';
    chest.style.left = '38%';
    chest.style.bottom = '5%';
    host.appendChild(chest);
  }

  // -- Render: tank (fish) ---------------------------------------------------
  function renderTank() {
    const stage = document.getElementById('aq-tank');
    if (!stage) return;
    // Remove old fish (but keep static .aq-water-* layers)
    stage.querySelectorAll('.aq-fish, .aq-food, .aq-bubble').forEach(n => n.remove());
    BUILDS.forEach((b, i) => {
      if (state.filter !== 'all' && b.a !== state.filter) return;
      const r = rng(b.d * 17 + 3);
      const fish = makeFish(b, r, i);
      stage.appendChild(fish);
    });
    // Seaweed and sand stay static
  }

  function makeFish(b, r, i) {
    const fish = document.createElement('button');
    fish.type = 'button';
    fish.className = 'aq-fish aq-fish--' + b.a;
    fish.setAttribute('data-day', String(b.d));
    fish.setAttribute('data-archetype', b.a);
    fish.setAttribute('aria-label', 'Day ' + b.d + ' — ' + b.n);

    const impact = IMPACT[b.d] || 3;
    const size = 24 + impact * 8; // 40..64
    const depth = randRange(r, 8, 86); // top%
    const speed = randRange(r, 18, 50); // seconds across tank
    const delay = -randRange(r, 0, speed); // negative = already in flight
    const yWobble = randRange(r, 4, 14);
    const yDur = randRange(r, 3, 7);
    const dir = r() < 0.5 ? -1 : 1;
    fish.style.setProperty('--aq-size', size + 'px');
    fish.style.setProperty('--aq-depth', depth + '%');
    fish.style.setProperty('--aq-speed', speed + 's');
    fish.style.setProperty('--aq-delay', delay + 's');
    fish.style.setProperty('--aq-ywobble', yWobble + 'px');
    fish.style.setProperty('--aq-ydur', yDur + 's');
    fish.style.setProperty('--aq-dir', dir);
    fish.style.setProperty('--aq-color', ARCHETYPE_COLORS[b.a]);
    if (b.d === TODAY_DAY) fish.classList.add('is-today');

    const sp = SPECIES[b.a] || SPECIES.systems;
    fish.innerHTML =
      '<span class="aq-fish-bubble" aria-hidden="true"></span>' +
      '<span class="aq-fish-body" aria-hidden="true">' + sp.emoji + '</span>' +
      '<span class="aq-fish-tag" aria-hidden="true">' + b.d + '</span>';

    fish.addEventListener('click', () => focusFish(b.d));
    return fish;
  }

  // -- Focus panel -----------------------------------------------------------
  function focusFish(day) {
    const b = BUILDS.find(x => x.d === day);
    if (!b) return;
    state.focused = day;
    state.spots += 1;
    save();
    const f = document.getElementById('aq-focus');
    if (!f) return;
    f.hidden = false;
    f.classList.add('is-open');
    const sp = SPECIES[b.a] || SPECIES.systems;
    setText('aq-focus-emoji', sp.emoji);
    setText('aq-focus-day', 'Day ' + b.d);
    setText('aq-focus-title', b.n);
    setText('aq-focus-name', buildDateLong(b.d));
    setText('aq-focus-tag', ARCHETYPE_LABELS[b.a]);
    setText('aq-focus-date', 'Day ' + b.d + ' · ' + IMPACT[b.d] + ' / 5 impact');
    setText('aq-focus-arch', b.a);
    setText('aq-focus-impact', fishImpactDots(b.d));
    setText('aq-focus-pct', Math.round((b.d / TOTAL_FISH) * 100) + '% of streak');
    setText('aq-focus-coord', 'T' + String(Math.round(rng(b.d)() * 32 + 8)).padStart(2, '0') + '°C');
    setText('aq-focus-desc', 'A ' + (b.a === 'systems' ? 'Systems' : b.a) +
      ' build: ' + b.n + '. This fish weighs in at ' + IMPACT[b.d] + '/5 impact and joins the school on ' + buildDateLong(b.d) + '.');
    const rows = document.getElementById('aq-focus-rows');
    if (rows) {
      const color = ARCHETYPE_COLORS[b.a];
      rows.innerHTML =
        '<div class="aq-focus-row"><span>Archetype</span><b style="color:' + color + '">' + ARCHETYPE_LABELS[b.a] + '</b></div>' +
        '<div class="aq-focus-row"><span>Impact</span><b>' + IMPACT[b.d] + ' / 5</b></div>' +
        '<div class="aq-focus-row"><span>Date</span><b>' + buildDate(b.d) + '</b></div>' +
        '<div class="aq-focus-row"><span>Position</span><b>#' + b.d + ' of ' + TOTAL_FISH + '</b></div>';
    }
    // Pulse the matching fish
    document.querySelectorAll('.aq-fish.is-focused').forEach(n => n.classList.remove('is-focused'));
    const target = document.querySelector('.aq-fish[data-day="' + b.d + '"]');
    if (target) {
      target.classList.add('is-focused');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
  function closeFocus() {
    const f = document.getElementById('aq-focus');
    if (!f) return;
    f.hidden = true;
    f.classList.remove('is-open');
    state.focused = null;
    document.querySelectorAll('.aq-fish.is-focused').forEach(n => n.classList.remove('is-focused'));
    save();
  }
  function stepFish(dir) {
    const visible = BUILDS.filter(b => state.filter === 'all' || b.a === state.filter).map(b => b.d);
    if (!visible.length) return;
    let idx = visible.indexOf(state.focused);
    if (idx === -1) idx = 0;
    idx = (idx + dir + visible.length) % visible.length;
    focusFish(visible[idx]);
  }

  // -- Feeding (food + bubbles) ---------------------------------------------
  function feedFish() {
    const stage = document.getElementById('aq-tank');
    if (!stage) return;
    state.feeds += 1;
    state.feeding = Date.now();
    save();
    renderStats();
    spawnFood(stage, 5);
    spawnBubbles(stage, 14);
    toast('Feed dropped! Watch the fish dart for it.');
  }
  function spawnFood(stage, n) {
    for (let i = 0; i < n; i++) {
      const food = document.createElement('span');
      food.className = 'aq-food';
      const left = 10 + Math.random() * 80;
      food.style.left = left + '%';
      food.style.animationDelay = (Math.random() * 0.6) + 's';
      stage.appendChild(food);
      setTimeout(() => food.remove(), 5200);
    }
  }
  function spawnBubbles(stage, n) {
    for (let i = 0; i < n; i++) {
      const b = document.createElement('span');
      b.className = 'aq-bubble';
      const left = 6 + Math.random() * 88;
      const size = 4 + Math.random() * 8;
      b.style.left = left + '%';
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.animationDuration = (3 + Math.random() * 4) + 's';
      b.style.animationDelay = (Math.random() * 1.4) + 's';
      stage.appendChild(b);
      setTimeout(() => b.remove(), 9000);
    }
  }
  function ambientBubbles() {
    const stage = document.getElementById('aq-tank');
    if (!stage) return;
    spawnBubbles(stage, 1);
    // Schedule next
    setTimeout(ambientBubbles, 1400);
  }

  // -- Mode (day / night) ----------------------------------------------------
  function applyMode() {
    const sec = document.querySelector('.aquarium-section');
    if (!sec) return;
    sec.classList.toggle('aq-night', state.time === 'night');
    sec.classList.toggle('aq-light', state.time === 'day');
    document.querySelectorAll('.aq-mode-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.mode === state.time);
    });
  }
  function setMode(m) {
    state.time = m;
    save();
    applyMode();
  }

  // -- Toast -----------------------------------------------------------------
  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById('aq-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
  }

  // -- Export ----------------------------------------------------------------
  function exportJSON() {
    const data = BUILDS.map(b => ({
      day: b.d, name: b.n, archetype: b.a,
      archetypeLabel: ARCHETYPE_LABELS[b.a],
      impact: IMPACT[b.d],
      date: buildDate(b.d),
      dateLong: buildDateLong(b.d),
    }));
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), total: TOTAL_FISH, day: TODAY_DAY, builds: data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ajh-aquarium-day' + TODAY_DAY + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 250);
    toast('Aquarium exported as JSON.');
  }

  // -- Wiring ----------------------------------------------------------------
  function wire() {
    document.querySelectorAll('.aq-mode-btn[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    const feedBtn = document.getElementById('aq-feed');
    if (feedBtn) feedBtn.addEventListener('click', feedFish);
    const jumpBtn = document.getElementById('aq-jump-today');
    if (jumpBtn) jumpBtn.addEventListener('click', () => focusFish(TODAY_DAY));
    const spotBtn = document.getElementById('aq-spotlight');
    if (spotBtn) spotBtn.addEventListener('click', () => {
      const pool = BUILDS.filter(b => state.filter === 'all' || b.a === state.filter);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) focusFish(pick.d);
    });
    const expBtn = document.getElementById('aq-export');
    if (expBtn) expBtn.addEventListener('click', exportJSON);
    const closeBtn = document.getElementById('aq-focus-close');
    if (closeBtn) closeBtn.addEventListener('click', closeFocus);
    const back = document.getElementById('aq-focus-back');
    if (back) back.addEventListener('click', closeFocus);
    const jump = document.getElementById('aq-focus-jump');
    if (jump) jump.addEventListener('click', () => {
      // Re-spotlight today's fish (it's already focused) and trigger a feed
      feedFish();
    });
    const calmBtn = document.getElementById('aq-calm');
    if (calmBtn) calmBtn.addEventListener('click', toggleCalm);
    const bubblesBtn = document.getElementById('aq-bubbles-btn');
    if (bubblesBtn) bubblesBtn.addEventListener('click', burstBubbles);
    const shuffleBtn = document.getElementById('aq-shuffle');
    if (shuffleBtn) shuffleBtn.addEventListener('click', () => {
      const pool = BUILDS.filter(b => state.filter === 'all' || b.a === state.filter);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) focusFish(pick.d);
    });

    // Keyboard
    // Keyboard
    document.addEventListener('keydown', (e) => {
      const sec = document.querySelector('.aquarium-section');
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.2;
      // Always allow Esc to close focus when open
      if (e.key === 'Escape' && state.focused) { e.preventDefault(); closeFocus(); return; }
      if (!inView) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); stepFish(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepFish(1); }
      if (e.key.toLowerCase() === 't') { e.preventDefault(); focusFish(TODAY_DAY); }
      if (e.key.toLowerCase() === 'f') { e.preventDefault(); feedFish(); }
      if (e.key.toLowerCase() === 'd') { e.preventDefault(); setMode('day'); }
      if (e.key.toLowerCase() === 'n') { e.preventDefault(); setMode('night'); }
    });

    // Global hotkey: G A opens the section
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key.toLowerCase() === 'g') {
        // Wait for next key
        const handler = (e2) => {
          document.removeEventListener('keydown', handler, true);
          if (e2.key.toLowerCase() === 'a') {
            const sec = document.getElementById('aquarium');
            if (sec) {
              e2.preventDefault();
              sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
              toast('Aquarium opened.');
            }
          }
        };
        document.addEventListener('keydown', handler, true);
      }
    }, true);
  }

  // -- Public API helpers ---------------------------------------------------
  function toggleCalm() {
    state.calm = !state.calm;
    document.body.classList.toggle('aq-calm', state.calm);
    const btn = document.getElementById('aq-calm');
    if (btn) {
      const lbl = btn.querySelector('span');
      if (lbl) lbl.textContent = state.calm ? 'Wake the Water' : 'Calm';
    }
    save();
  }

  function burstBubbles() {
    const fishes = document.querySelectorAll('.aq-fish');
    let count = 0;
    fishes.forEach(f => {
      const r = parseFloat(f.dataset.r || '0.5');
      const n = 2 + Math.floor(r * 4);
      for (let i = 0; i < n; i++) {
        const b = document.createElement('div');
        b.className = 'aq-bubble aq-bubble--burst';
        b.style.setProperty('--aq-bubble-x', (Math.random() * 100) + '%');
        b.style.setProperty('--aq-bubble-size', (4 + Math.random() * 8) + 'px');
        b.style.setProperty('--aq-bubble-dur', (2.2 + Math.random() * 1.6) + 's');
        b.style.setProperty('--aq-bubble-delay', (Math.random() * 0.4) + 's');
        f.appendChild(b);
        count++;
        setTimeout(() => b.remove(), 4000);
      }
    });
    return count;
  }

  // -- Public API for command palette / external triggers -------------------
  window.Aquarium = window.ajhAquarium = {
    open: () => document.getElementById('aquarium')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    feed: feedFish,
    focus: focusFish,
    spotlight: () => {
      const pool = BUILDS.filter(b => state.filter === 'all' || b.a === state.filter);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) focusFish(pick.d);
    },
    setMode,
    toggleCalm,
    burstBubbles,
    export: exportJSON,
    exportJSON: exportJSON,
  };
  document.addEventListener('ajh-command', (e) => {
    const cmd = e.detail?.command;
    if (cmd === 'aquarium-open')      window.Aquarium.open();
    if (cmd === 'aquarium-feed')      window.Aquarium.feed();
    if (cmd === 'aquarium-spotlight') window.Aquarium.spotlight();
    if (cmd === 'aquarium-export')    window.Aquarium.export();
    if (cmd === 'aquarium-calm')      window.Aquarium.toggleCalm();
    if (cmd === 'aquarium-bubbles')   window.Aquarium.burstBubbles();
  });

  // -- Init ------------------------------------------------------------------
  function init() {
    const sec = document.querySelector('.aquarium-section');
    if (!sec) return;
    state.visits += 1;
    save();
    renderStats();
    renderChips();
    renderFlora();
    renderTank();
    applyMode();
    wire();
    ambientBubbles();
    if (state.focused) focusFish(state.focused);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
