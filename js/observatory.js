/* ============================================================
   Day 82: Build Observatory — 82 days as moons orbiting a Builder Planet.
   Each build is a moon. Distance from the planet = day (1 close, 82 far).
   Size = impact. Color = archetype. Each moon has its own orbit
   speed (inverse: newer = faster, older = slower). Click any moon
   to read its day. Filter by archetype. Pause / warp / step
   controls. Keyboard: G O opens, ←/→ step, Space pauses.
   ============================================================ */

(function () {
  'use strict';

  const DAY1 = new Date(2026, 3, 22); // Apr 22 2026
  const TODAY_DAY = 83;
  const STORAGE_KEY = 'ajh_observatory_v1';

  // 8 archetypes
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

  // 82-day build history (Day 1 = 2026-04-22, Day 82 = today).
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
    { d: 82, a: 'data',        n: 'Build Observatory' },
    { d: 83, a: 'audio',        n: 'Build Waveform' },
  ];

  // Impact 1-5 per day
  function impactFor(d) {
    if ([11, 15, 17, 19, 22, 24, 25, 30, 37, 40, 44, 46, 48, 49, 57, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83].includes(d)) return 5;
    if ([2, 3, 6, 8, 9, 10, 14, 18, 20, 23, 26, 27, 28, 29, 32, 33, 34, 35, 36, 38, 39, 41, 42, 43, 45, 47, 50, 51, 52, 53, 54, 55, 56, 58, 59].includes(d)) return 4;
    if ([1, 4, 5, 7, 12, 13, 16, 21, 31].includes(d)) return 3;
    return 3;
  }
  const IMPACT = {};
  BUILDS.forEach(b => { IMPACT[b.d] = impactFor(b.d); });

  // Mulberry32 deterministic RNG
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t = (t + 0x6D2B79F5) >>> 0;
      let x = t;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash01(d, salt) {
    let h = 2166136261 ^ (salt | 0);
    h = Math.imul(h ^ d, 16777619);
    h = Math.imul(h ^ (h >>> 13), 16777619);
    h ^= h >>> 16;
    return ((h >>> 0) % 100000) / 100000;
  }

  const state = loadState();

  function loadState() {
    const defaults = {
      filter: 'all',
      paused: false,
      speed: 1.0,
      focused: null,
      mode: 'night', // 'night' | 'day'
      visits: 0,
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const saved = JSON.parse(raw);
      return Object.assign({}, defaults, saved);
    } catch (_) { return defaults; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  let orbitR = 0;
  let cx = 0, cy = 0;
  let cssW = 0, cssH = 0;
  let animationId = null;
  let lastTs = 0;
  let simulationT = 0; // running orbit time
  let drag = null; // {startX, startY, startRot, rot} — rot in degrees
  let zoom = 1.0;
  let worldRot = 0; // base rotation we apply to the whole system (drag)

  function toast(msg) {
    const el = document.getElementById('ob-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-on'), 1800);
  }

  // -- Compute orbit radius for a given day -----------------------------
  // Days 1..82 get radii from 130 to ~ 470 with a slight power curve.
  function radiusFor(d) {
    const t = (d - 1) / (TODAY_DAY - 1); // 0..1
    const minR = 130, maxR = 470;
    return minR + Math.pow(t, 0.85) * (maxR - minR);
  }

  // Each moon's angular speed (rad/sec). Newer = faster.
  function speedFor(d) {
    const baseOmega = 0.12; // rad/sec at day 1
    // Slow down as d grows: omega = base / (1 + d*0.04)
    return baseOmega / (1 + d * 0.04);
  }

  // Initial phase per day, deterministic
  function phaseFor(d) {
    return hash01(d, 0xC0FFEE) * Math.PI * 2;
  }

  // Inclination (tilt of orbit around X axis, in degrees)
  function inclinationFor(d) {
    return (hash01(d, 0xBEEF) - 0.5) * 18; // ±9°
  }

  // Tilt around Z axis (orbit line direction)
  function tiltFor(d) {
    return hash01(d, 0xFACE) * 360; // each moon gets a unique orbit plane direction
  }

  // Ellipse eccentricity 0..0.18
  function eccFor(d) {
    return hash01(d, 0xF00D) * 0.18;
  }

  // Size of moon (CSS px diameter)
  function sizeFor(d) {
    const imp = IMPACT[d] || 3;
    // impact 2..5 → 8..22 px
    return 6 + imp * 3.4;
  }

  function dateFor(d) {
    const dt = new Date(DAY1);
    dt.setDate(dt.getDate() + (d - 1));
    return dt;
  }
  function fmtDate(d) {
    return dateFor(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // -- Render ------------------------------------------------------------
  function renderStats() {
    const moons = BUILDS.length;
    const species = Object.keys(ARCHETYPE_COLORS).length;
    const biggest = BUILDS.reduce((a, b) => (IMPACT[a.d] || 0) > (IMPACT[b.d] || 0) ? a : b);
    const newKey = 'ob-stat-fish';
    const spKey  = 'ob-stat-species';
    const buKey  = 'ob-stat-bubbles';
    const bgKey  = 'ob-stat-biggest';
    const bgIcoKey = 'ob-stat-biggest-icon';
    // Reuse aquarium ids? No — use new observatory ids.
    setText('ob-stat-moons', moons);
    setText('ob-stat-archetypes', species);
    setText('ob-stat-orbits', state.visits);
    setText('ob-stat-biggest', 'D' + biggest.d);
    setText('ob-stat-biggest-name', biggest.n);
    if (document.getElementById(bgIcoKey)) {
      // change icon color
    }
  }
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderChips() {
    const wrap = document.getElementById('ob-chips');
    if (!wrap) return;
    wrap.innerHTML = '';
    const counts = { all: BUILDS.length };
    Object.keys(ARCHETYPE_COLORS).forEach(k => {
      counts[k] = BUILDS.filter(b => b.a === k).length;
    });
    const make = (key, label) => {
      const b = document.createElement('button');
      b.className = 'ob-chip' + (state.filter === key ? ' is-active' : '');
      b.dataset.key = key;
      b.style.setProperty('--ob-chip-color', key === 'all' ? '#c8b8ff' : ARCHETYPE_COLORS[key]);
      b.innerHTML = `<span class="ob-chip-dot" style="background:${key === 'all' ? '#c8b8ff' : ARCHETYPE_COLORS[key]}"></span><span class="ob-chip-label">${label}</span><span class="ob-chip-count">${counts[key]}</span>`;
      b.addEventListener('click', () => {
        state.filter = key;
        save();
        applyFilter();
        renderChips();
        toast('Filter: ' + label);
      });
      wrap.appendChild(b);
    };
    make('all', 'All');
    Object.keys(ARCHETYPE_LABELS).forEach(k => make(k, ARCHETYPE_LABELS[k]));
  }

  function applyFilter() {
    const moons = document.querySelectorAll('.ob-moon');
    moons.forEach(m => {
      const a = m.dataset.archetype;
      if (state.filter === 'all' || state.filter === a) {
        m.classList.remove('is-hidden');
      } else {
        m.classList.add('is-hidden');
      }
    });
  }

  function renderOrbits() {
    // The SVG orbits live inside #ob-system
    const system = document.getElementById('ob-system');
    if (!system) return;
    // Clear previous orbits
    system.querySelectorAll('.ob-orbit').forEach(n => n.remove());
    BUILDS.forEach(b => {
      if (state.filter !== 'all' && state.filter !== b.a) return;
      const r = radiusFor(b.d);
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ring.setAttribute('class', 'ob-orbit');
      ring.setAttribute('cx', '0');
      ring.setAttribute('cy', '0');
      ring.setAttribute('rx', String(r));
      ring.setAttribute('ry', String(r * 0.94));
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', ARCHETYPE_COLORS[b.a]);
      ring.setAttribute('stroke-opacity', '0.18');
      ring.setAttribute('stroke-width', '1');
      ring.setAttribute('data-day', String(b.d));
      ring.style.color = ARCHETYPE_COLORS[b.a];
      system.appendChild(ring);
    });
  }

  function renderMoons() {
    const system = document.getElementById('ob-system');
    if (!system) return;
    system.querySelectorAll('.ob-moon').forEach(n => n.remove());
    BUILDS.forEach(b => {
      const m = document.createElement('div');
      m.className = 'ob-moon';
      m.dataset.day = String(b.d);
      m.dataset.archetype = b.a;
      m.dataset.impact = String(IMPACT[b.d] || 3);
      m.style.setProperty('--ob-moon-color', ARCHETYPE_COLORS[b.a]);
      m.style.setProperty('--ob-moon-size', sizeFor(b.d) + 'px');
      m.setAttribute('role', 'button');
      m.setAttribute('tabindex', '0');
      m.setAttribute('aria-label', `Day ${b.d}: ${b.n}`);
      m.innerHTML = `
        <div class="ob-moon-body"></div>
        <div class="ob-moon-glow"></div>
        <div class="ob-moon-tip">D${b.d}</div>
      `;
      m.addEventListener('click', (e) => {
        e.stopPropagation();
        focusMoon(b.d);
      });
      m.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusMoon(b.d); }
      });
      system.appendChild(m);
    });
    applyFilter();
  }

  // -- Animation loop ---------------------------------------------------
  function step(ts) {
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!state.paused) {
      simulationT += dt * state.speed;
    }
    updatePositions();
    animationId = requestAnimationFrame(step);
  }

  function updatePositions() {
    const moons = document.querySelectorAll('.ob-moon');
    moons.forEach(m => {
      const d = +m.dataset.day;
      const r = radiusFor(d);
      const e = eccFor(d);
      const phase = phaseFor(d) + simulationT * speedFor(d);
      const a = r; // semi-major
      const b = r * (1 - e); // semi-minor
      // parametric ellipse
      const xLocal = a * Math.cos(phase);
      const yLocal = b * Math.sin(phase);
      // apply inclination (tilt around X axis) — for 2D we can scale Y
      const incl = inclinationFor(d) * Math.PI / 180;
      const z = yLocal * Math.sin(incl);
      const yFlat = yLocal * Math.cos(incl);
      // depth-based scaling
      const depth = (z + r) / (2 * r); // 0..1
      const scale = 0.55 + depth * 0.85; // 0.55..1.4
      const opacity = 0.35 + depth * 0.65;
      // tilt the orbit plane around Z (rotate by tiltFor)
      const tilt = tiltFor(d) * Math.PI / 180;
      const xr = xLocal * Math.cos(tilt) - yFlat * Math.sin(tilt);
      const yr = xLocal * Math.sin(tilt) + yFlat * Math.cos(tilt);
      // apply base world rotation (drag)
      const wrot = worldRot * Math.PI / 180;
      const xf = xr * Math.cos(wrot) - yr * Math.sin(wrot);
      const yf = xr * Math.sin(wrot) + yr * Math.cos(wrot);
      m.style.transform = `translate(${xf}px, ${yf}px) scale(${scale.toFixed(3)})`;
      m.style.opacity = opacity.toFixed(2);
      m.style.zIndex = Math.floor(depth * 100);
      // Light side: face the planet (origin) — fake a slight gradient by setting --tilt
      // We use a body class `is-back` if depth < 0.5
      m.classList.toggle('is-back', depth < 0.5);
    });
  }

  // -- Focus panel ------------------------------------------------------
  function focusMoon(dayNum) {
    const b = BUILDS.find(x => x.d === dayNum);
    if (!b) return;
    state.focused = dayNum;
    save();
    const panel = document.getElementById('ob-focus');
    if (!panel) return;
    setText('ob-focus-day', 'D' + b.d);
    setText('ob-focus-title', b.n);
    setText('ob-focus-archetype', ARCHETYPE_LABELS[b.a]);
    setText('ob-focus-date', fmtDate(b.d));
    setText('ob-focus-size', 'Size ' + (IMPACT[b.d] || 3) + '/5');
    setText('ob-focus-radius', 'Orbit ' + Math.round(radiusFor(b.d)) + 'px');
    setText('ob-focus-speed', 'Period ' + ((2 * Math.PI / speedFor(b.d))).toFixed(1) + 's');
    setText('ob-focus-emoji', b.d === TODAY_DAY ? '🌍' : (IMPACT[b.d] >= 5 ? '🌕' : (IMPACT[b.d] >= 4 ? '🌖' : '🌗')));
    // mark the moon as focused
    document.querySelectorAll('.ob-moon').forEach(m => m.classList.toggle('is-focused', +m.dataset.day === b.d));
    panel.classList.add('is-on');
    panel.hidden = false;
  }
  function closeFocus() {
    state.focused = null;
    save();
    const panel = document.getElementById('ob-focus');
    if (panel) {
      panel.classList.remove('is-on');
      setTimeout(() => { if (!state.focused) panel.hidden = true; }, 220);
    }
    document.querySelectorAll('.ob-moon').forEach(m => m.classList.remove('is-focused'));
  }

  function setMode(mode) {
    state.mode = mode;
    const sec = document.querySelector('.observatory-section');
    if (sec) {
      sec.classList.toggle('ob-light', mode === 'day');
      sec.classList.toggle('ob-night', mode === 'night');
    }
    save();
    const bg = document.getElementById('ob-bg');
    if (bg) bg.classList.toggle('ob-light', mode === 'day');
    document.querySelectorAll('.ob-mode-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.mode === mode);
    });
  }

  // -- Drag & zoom ------------------------------------------------------
  function wireDragZoom() {
    const sys = document.getElementById('ob-system');
    if (!sys) return;
    const start = (clientX, clientY) => {
      drag = { startX: clientX, startY: clientY, startRot: worldRot };
    };
    const move = (clientX, clientY) => {
      if (!drag) return;
      const dx = clientX - drag.startX;
      const dy = clientY - drag.startY;
      worldRot = drag.startRot + dx * 0.25;
      updatePositions();
    };
    const end = () => { drag = null; };

    sys.addEventListener('mousedown', e => { e.preventDefault(); start(e.clientX, e.clientY); });
    window.addEventListener('mousemove', e => move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);

    sys.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        const t = e.touches[0]; start(t.clientX, t.clientY);
      }
    }, { passive: true });
    sys.addEventListener('touchmove', e => {
      if (drag && e.touches.length === 1) {
        const t = e.touches[0]; move(t.clientX, t.clientY);
        e.preventDefault();
      }
    }, { passive: false });
    sys.addEventListener('touchend', end);

    // Zoom buttons
    const inBtn = document.getElementById('ob-zoom-in');
    const outBtn = document.getElementById('ob-zoom-out');
    const applyZoom = () => {
      sys.style.setProperty('--ob-zoom', zoom);
      document.documentElement.style.setProperty('--ob-zoom', zoom);
    };
    inBtn && inBtn.addEventListener('click', () => { zoom = Math.min(2.5, zoom + 0.2); applyZoom(); });
    outBtn && outBtn.addEventListener('click', () => { zoom = Math.max(0.4, zoom - 0.2); applyZoom(); });
    applyZoom();
  }

  // -- Wire -------------------------------------------------------------
  function wire() {
    document.getElementById('ob-feed')?.addEventListener('click', () => { simulationT += 1.0; toast('Time +1 orbit-year'); });
    document.getElementById('ob-meteor')?.addEventListener('click', () => burstComet());
    document.getElementById('ob-calm')?.addEventListener('click', () => { state.paused = !state.paused; save(); toast(state.paused ? 'Paused' : 'Resumed'); });
    document.getElementById('ob-jump-today')?.addEventListener('click', () => focusMoon(TODAY_DAY));
    document.getElementById('ob-shuffle')?.addEventListener('click', () => {
      const pool = BUILDS.filter(b => state.filter === 'all' || b.a === state.filter);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) focusMoon(pick.d);
    });
    document.getElementById('ob-export')?.addEventListener('click', () => exportJSON());
    document.getElementById('ob-prev')?.addEventListener('click', () => stepDay(-1));
    document.getElementById('ob-next')?.addEventListener('click', () => stepDay(1));
    document.getElementById('ob-focus-close')?.addEventListener('click', closeFocus);
    document.getElementById('ob-bg')?.addEventListener('click', () => closeFocus());
    document.getElementById('ob-mode-night')?.addEventListener('click', () => { setMode('night'); toast('Mode: Night'); });
    document.getElementById('ob-mode-day')?.addEventListener('click', () => { setMode('day'); toast('Mode: Day'); });
    // Speed slider
    const spd = document.getElementById('ob-speed');
    if (spd) {
      spd.value = String(state.speed);
      spd.addEventListener('input', () => {
        state.speed = parseFloat(spd.value);
        save();
      });
    }
    // Focus jump
    document.getElementById('ob-focus-jump')?.addEventListener('click', () => {
      if (!state.focused) return;
      // give the moon a kick
      simulationT += 0.6;
      toast('Warped to D' + state.focused);
    });
    wireDragZoom();
  }

  function stepDay(dir) {
    if (!state.focused) { focusMoon(TODAY_DAY); return; }
    const next = Math.max(1, Math.min(TODAY_DAY, state.focused + dir));
    focusMoon(next);
  }

  function burstComet() {
    // Spawn a comet that streaks across the system
    const sec = document.querySelector('.observatory-section');
    if (!sec) return;
    const c = document.createElement('div');
    c.className = 'ob-comet';
    const fromTop = Math.random() < 0.5;
    c.style.setProperty('--ob-comet-from-x', (Math.random() * 100) + '%');
    c.style.setProperty('--ob-comet-from-y', (fromTop ? '0%' : '100%'));
    c.style.setProperty('--ob-comet-to-x', (Math.random() * 100) + '%');
    c.style.setProperty('--ob-comet-to-y', (fromTop ? '100%' : '0%'));
    c.style.setProperty('--ob-comet-angle', (Math.random() * 360) + 'deg');
    sec.appendChild(c);
    setTimeout(() => c.remove(), 1600);
    toast('Comet passing…');
  }

  function exportJSON() {
    const out = {
      meta: { generated: new Date().toISOString(), total: BUILDS.length, day1: '2026-04-22' },
      builds: BUILDS.map(b => ({
        day: b.d,
        name: b.n,
        archetype: b.a,
        archetypeLabel: ARCHETYPE_LABELS[b.a],
        color: ARCHETYPE_COLORS[b.a],
        impact: IMPACT[b.d],
        date: fmtDate(b.d),
        orbitRadiusPx: Math.round(radiusFor(b.d)),
        orbitPeriodSec: +(2 * Math.PI / speedFor(b.d)).toFixed(2),
        size: sizeFor(b.d),
      })),
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'observatory-d82.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Observatory exported as JSON');
  }

  // -- Init -------------------------------------------------------------
  function init() {
    const sec = document.querySelector('.observatory-section');
    if (!sec) return;
    state.visits += 1;
    save();
    renderStats();
    renderChips();
    renderOrbits();
    renderMoons();
    setMode(state.mode || 'night');
    wire();
    if (state.focused) focusMoon(state.focused);
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(step);

    // Keyboard: G O opens
    document.addEventListener('keydown', (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key.toLowerCase() === 'g') {
        const handler = (e2) => {
          document.removeEventListener('keydown', handler, true);
          if (e2.key.toLowerCase() === 'o') {
            const s = document.getElementById('observatory');
            if (s) {
              e2.preventDefault();
              s.scrollIntoView({ behavior: 'smooth', block: 'start' });
              toast('Observatory opened.');
            }
          }
        };
        document.addEventListener('keydown', handler, true);
      } else if (e.key === ' ') {
        if (sec.getBoundingClientRect().top < window.innerHeight && sec.getBoundingClientRect().bottom > 0) {
          e.preventDefault();
          state.paused = !state.paused;
          toast(state.paused ? 'Paused' : 'Resumed');
        }
      } else if (e.key === 'ArrowLeft') {
        if (sec.getBoundingClientRect().top < window.innerHeight && sec.getBoundingClientRect().bottom > 0) {
          stepDay(-1);
        }
      } else if (e.key === 'ArrowRight') {
        if (sec.getBoundingClientRect().top < window.innerHeight && sec.getBoundingClientRect().bottom > 0) {
          stepDay(1);
        }
      } else if (e.key.toLowerCase() === 't') {
        if (sec.getBoundingClientRect().top < window.innerHeight && sec.getBoundingClientRect().bottom > 0) {
          focusMoon(TODAY_DAY);
        }
      } else if (e.key === 'Escape') {
        if (state.focused) closeFocus();
      }
    }, true);
  }

  // Public API
  window.Observatory = window.ajhObservatory = {
    open: () => document.getElementById('observatory')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    focus: focusMoon,
    feed: () => { simulationT += 1.0; toast('Time +1 orbit-year'); },
    togglePause: () => { state.paused = !state.paused; save(); },
    burstComet,
    setMode,
    spotlight: () => {
      const pool = BUILDS.filter(b => state.filter === 'all' || b.a === state.filter);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) focusMoon(pick.d);
    },
    export: exportJSON,
    exportJSON,
  };
  document.addEventListener('ajh-command', (e) => {
    const cmd = e.detail?.command;
    if (cmd === 'observatory-open')      window.Observatory.open();
    if (cmd === 'observatory-focus')     { const last = BUILDS[BUILDS.length - 1]; focusMoon(last.d); }
    if (cmd === 'observatory-pause')     window.Observatory.togglePause();
    if (cmd === 'observatory-comet')     window.Observatory.burstComet();
    if (cmd === 'observatory-export')    window.Observatory.export();
    if (cmd === 'observatory-spotlight') window.Observatory.spotlight();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
