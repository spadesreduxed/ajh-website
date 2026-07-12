/* ============================================================
   Day 80: Build Skyline — 80 days as a cityscape.
   Each build is a building. Height by impact, width by name,
   lit windows from a seed, color by archetype.
   ============================================================ */

(function () {
  'use strict';

  const DAY1 = new Date(2026, 3, 22); // Apr 22 2026
  const TODAY_DAY = 80;
  const TOTAL_BUILDINGS = 80;
  const STORAGE_KEY = 'ajh_skyline_v1';

  // Same archetype palette used by DNA / Trail / Weather / Garden / Tape
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

  // 80-day build history (Day 1 = 2026-04-22).
  const BUILDS = [
    { d: 1,  a: 'meta',        n: 'Vault Genesis' },
    { d: 2,  a: 'visual',      n: 'Theme System' },
    { d: 3,  a: 'systems',     n: 'Build Pipeline' },
    { d: 4,  a: 'craft',       n: 'Hero Polish' },
    { d: 5,  a: 'data',        n: 'Stats Engine' },
    { d: 6,  a: 'systems',     n: 'Build Calendar' },
    { d: 7,  a: 'meta',        n: 'Build Journal' },
    { d: 8,  a: 'social',      n: 'Wishlist v1' },
    { d: 9,  a: 'craft',       n: 'FAQ Page' },
    { d: 10, a: 'visual',      n: 'Animations Pack' },
    { d: 11, a: 'data',        n: 'Achievement Badges' },
    { d: 12, a: 'interactive', n: 'Now-Next-Later' },
    { d: 13, a: 'systems',     n: 'Snippets Vault' },
    { d: 14, a: 'meta',        n: 'Calendar Heatmap' },
    { d: 15, a: 'craft',       n: 'Build Assistant' },
    { d: 16, a: 'social',      n: 'Bookmark Cards' },
    { d: 17, a: 'data',        n: 'Site Constellation' },
    { d: 18, a: 'meta',        n: 'Time Capsule Vault' },
    { d: 19, a: 'systems',     n: 'Theme Studio' },
    { d: 20, a: 'visual',      n: 'Reading Mode' },
    { d: 21, a: 'craft',       n: 'On This Day Wisdom' },
    { d: 22, a: 'data',        n: 'Pixel Art Studio' },
    { d: 23, a: 'interactive', n: 'Daily Pixel Challenge' },
    { d: 24, a: 'social',      n: 'Build Receipts' },
    { d: 25, a: 'audio',       n: 'Soundboard' },
    { d: 26, a: 'audio',       n: 'Step Sequencer' },
    { d: 27, a: 'meta',        n: 'The Forge' },
    { d: 28, a: 'systems',     n: 'Lab Notebook' },
    { d: 29, a: 'data',        n: 'Build DNA' },
    { d: 30, a: 'data',        n: 'Constellation Map' },
    { d: 31, a: 'data',        n: 'Build Trail' },
    { d: 32, a: 'data',        n: 'Build Weather' },
    { d: 33, a: 'data',        n: 'Build Garden' },
    { d: 34, a: 'visual',      n: 'Iconography Pack' },
    { d: 35, a: 'systems',     n: 'Service Hooks' },
    { d: 36, a: 'craft',       n: 'Microcopy Pass' },
    { d: 37, a: 'interactive', n: 'Hover Playbook' },
    { d: 38, a: 'social',      n: 'Testimonial Slot' },
    { d: 39, a: 'meta',        n: 'Daily Reflection' },
    { d: 40, a: 'data',        n: 'Build Sparkline' },
    { d: 41, a: 'visual',      n: 'Gradient Lab' },
    { d: 42, a: 'craft',       n: 'Story Scroll' },
    { d: 43, a: 'systems',     n: 'Build Logger' },
    { d: 44, a: 'interactive', n: 'Key Choreography' },
    { d: 45, a: 'craft',       n: 'Section Refresh' },
    { d: 46, a: 'data',        n: 'Activity Ring' },
    { d: 47, a: 'audio',       n: 'Sound Test' },
    { d: 48, a: 'meta',        n: 'Build Themes' },
    { d: 49, a: 'social',      n: 'Feedback Box' },
    { d: 50, a: 'visual',      n: 'Hero Replay' },
    { d: 51, a: 'systems',     n: 'Asset Pipeline' },
    { d: 52, a: 'craft',       n: 'Tooltips Pass' },
    { d: 53, a: 'data',        n: 'Build Trends' },
    { d: 54, a: 'interactive', n: 'Click Trail' },
    { d: 55, a: 'meta',        n: 'Mind Sweep' },
    { d: 56, a: 'craft',       n: 'Tone Pass' },
    { d: 57, a: 'social',      n: 'Poll Widget' },
    { d: 58, a: 'data',        n: 'Stats Card' },
    { d: 59, a: 'visual',      n: 'Card Shadows' },
    { d: 60, a: 'systems',     n: 'Index Hygiene' },
    { d: 61, a: 'craft',       n: 'Section Polish' },
    { d: 62, a: 'data',        n: 'Quick Pulse' },
    { d: 63, a: 'meta',        n: 'Week Note' },
    { d: 64, a: 'meta',        n: 'Build Journal v2' },
    { d: 65, a: 'social',      n: 'Community Wishlist' },
    { d: 66, a: 'craft',       n: 'On This Day Cards' },
    { d: 67, a: 'data',        n: 'Pixel Art Studio' },
    { d: 68, a: 'interactive', n: 'Daily Pixel Challenge' },
    { d: 69, a: 'craft',       n: 'Build Receipts' },
    { d: 70, a: 'audio',       n: 'Soundboard' },
    { d: 71, a: 'audio',       n: 'Step Sequencer' },
    { d: 72, a: 'meta',        n: 'The Forge' },
    { d: 73, a: 'systems',     n: 'Lab Notebook' },
    { d: 74, a: 'data',        n: 'Build DNA' },
    { d: 75, a: 'data',        n: 'Constellation Map' },
    { d: 76, a: 'data',        n: 'Build Trail' },
    { d: 77, a: 'data',        n: 'Build Weather' },
    { d: 78, a: 'data',        n: 'Build Garden' },
    { d: 79, a: 'data',        n: 'Build Tape' },
    { d: 80, a: 'data',        n: 'Build Skyline' },
  ];

  // Impact estimates per build (matches prior features: 2–5)
  const IMPACT = {};
  BUILDS.forEach(b => { IMPACT[b.d] = impactFor(b.d); });

  function impactFor(d) {
    // Mirrors trail/garden/constellation: recent "big" features are 5, polish is 2-3
    if ([11, 17, 25, 26, 29, 30, 32, 33, 74, 75, 76, 77, 78, 79, 80].includes(d)) return 5;
    if ([2, 6, 14, 15, 18, 19, 21, 22, 23, 27, 28, 64, 65, 66, 67, 68, 71, 72, 73].includes(d)) return 4;
    if ([1, 3, 5, 7, 8, 10, 12, 13, 16, 20, 24, 39, 40, 43, 46, 48, 51, 53, 55, 58, 62, 69, 70].includes(d)) return 3;
    return 2;
  }

  // ---- helpers ----
  const $ = (s, r) => (r || document).querySelector(s);
  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setHtml = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };

  // deterministic small hash for windows
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function seededRand(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  // ---- state ----
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p === 'object') {
          return {
            mode: p.mode || 'night',         // 'day' | 'night' | 'sunset'
            filter: p.filter || 'all',       // 'all' | archetype
            time: typeof p.time === 'number' ? p.time : 0.65,
            paused: !!p.paused,
            focused: p.focused || null,
            visits: p.visits || 0,
          };
        }
      }
    } catch (e) { /* ignore */ }
    return { mode: 'night', filter: 'all', time: 0.65, paused: false, focused: null, visits: 0 };
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---- derived: archetype counts ----
  const archCounts = (() => {
    const m = { all: BUILDS.length };
    BUILDS.forEach(b => { m[b.a] = (m[b.a] || 0) + 1; });
    return m;
  })();

  // ---- render summary ----
  function renderSummary() {
    setText('sky-stat-buildings', BUILDS.length);
    setText('sky-stat-impact', sumImpact());
    setText('sky-stat-arch', Object.keys(archCounts).length - 1);
    setText('sky-stat-windows', countLitWindows());
    const days = BUILDS.length;
    setText('sky-stat-streak', days);
  }
  function countLitWindows() {
    return document.querySelectorAll('.sky-window.is-lit, .sky-window.is-warm, .sky-window.is-cool').length;
  }
  function sumImpact() {
    return BUILDS.reduce((s, b) => s + (IMPACT[b.d] || 0), 0);
  }

  // ---- render chips ----
  function renderChips() {
    const wrap = $('#sky-chips');
    if (!wrap) return;
    const keys = ['all'].concat(Object.keys(ARCHETYPE_LABELS));
    const order = ['all', 'data', 'meta', 'systems', 'visual', 'interactive', 'audio', 'craft', 'social'];
    const items = order.filter(k => keys.includes(k));
    wrap.innerHTML = '';
    items.forEach(k => {
      const count = archCounts[k] || 0;
      const btn = document.createElement('button');
      btn.className = 'sky-chip' + (state.filter === k ? ' is-active' : '');
      btn.dataset.filter = k;
      const color = k === 'all' ? '#f5e8c8' : (ARCHETYPE_COLORS[k] || '#f5e8c8');
      btn.style.setProperty('--chip-color', color);
      btn.innerHTML =
        '<span class="sky-chip-label">' + (k === 'all' ? 'All' : ARCHETYPE_LABELS[k]) + '</span>' +
        '<span class="sky-chip-count">' + count + '</span>';
      btn.addEventListener('click', () => {
        state.filter = k;
        save();
        renderChips();
        renderCity();
        toast((k === 'all' ? 'All buildings' : (ARCHETYPE_LABELS[k] + ' buildings')) + ' — ' + count);
      });
      wrap.appendChild(btn);
    });
  }

  // ---- render city (the main skyline) ----
  function renderCity() {
    const stage = $('#sky-stage');
    if (!stage) return;
    stage.innerHTML = '';

    const groundY = 220; // px from top of stage where the ground starts
    const minW = 18, maxW = 44;
    const minH = 36, maxH = 180;

    BUILDS.forEach((b, idx) => {
      if (state.filter !== 'all' && b.a !== state.filter) return;

      const color = ARCHETYPE_COLORS[b.a] || '#a855f7';
      const imp = IMPACT[b.d] || 3;
      // height: 2-5 impact -> minH..maxH
      const h = Math.round(minH + ((imp - 2) / 3) * (maxH - minH));
      // width: deterministic from name length
      const w = Math.max(minW, Math.min(maxW, Math.round(minW + (b.n.length / 18) * (maxW - minW))));

      // shape variant: 0 = box, 1 = stepped top, 2 = pyramid top, 3 = antenna
      const rng = seededRand(hash(b.n + b.d));
      const variant = Math.floor(rng() * 4);
      const windowsOn = Math.floor(rng() * 100);
      const windowRng = seededRand(hash(b.n + 'w' + b.d));

      const bldg = document.createElement('div');
      bldg.className = 'sky-building sky-variant-' + variant;
      bldg.style.height = h + 'px';
      bldg.style.width = w + 'px';
      bldg.style.background = 'linear-gradient(180deg, ' + color + ' 0%, ' + darken(color, 0.4) + ' 100%)';
      bldg.style.borderColor = lighten(color, 0.18);
      bldg.style.setProperty('--sky-building-glow', color);
      bldg.dataset.day = b.d;
      bldg.dataset.arch = b.a;
      bldg.dataset.impact = imp;
      bldg.dataset.name = b.n;
      bldg.dataset.color = color;
      bldg.style.setProperty('--day-idx', idx);

      // windows grid: ~ rows/cols proportional
      const cols = Math.max(2, Math.floor(w / 7));
      const rows = Math.max(3, Math.floor(h / 9));
      const winPad = 2;
      const winW = Math.max(2, Math.floor((w - winPad * 2 - (cols - 1) * 1) / cols));
      const winH = Math.max(2, Math.floor((h - winPad * 2 - (rows - 1) * 1) / rows));
      const winWrap = document.createElement('div');
      winWrap.className = 'sky-windows';
      winWrap.style.setProperty('--cols', cols);
      winWrap.style.setProperty('--rows', rows);
      winWrap.style.setProperty('--win-w', winW + 'px');
      winWrap.style.setProperty('--win-h', winH + 'px');
      winWrap.style.setProperty('--win-pad', winPad + 'px');
      winWrap.style.setProperty('--win-gap', '1px');

      for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('span');
        cell.className = 'sky-window';
        const lit = windowRng() < 0.55; // 55% windows lit
        if (lit) cell.classList.add('is-lit');
        const flicker = windowRng();
        if (lit && flicker < 0.18) cell.classList.add('is-flicker');
        const c = windowRng();
        if (lit && c < 0.20) cell.classList.add('is-warm');
        else if (lit && c < 0.40) cell.classList.add('is-cool');
        winWrap.appendChild(cell);
      }
      bldg.appendChild(winWrap);

      // top decoration per variant
      if (variant === 1) {
        // stepped top — small box on top
        const top = document.createElement('div');
        top.className = 'sky-top-stepped';
        top.style.background = 'linear-gradient(180deg, ' + lighten(color, 0.05) + ' 0%, ' + color + ' 100%)';
        bldg.appendChild(top);
      } else if (variant === 2) {
        // pyramid top
        const top = document.createElement('div');
        top.className = 'sky-top-pyramid';
        const wTop = Math.max(8, Math.round(w * 0.55));
        top.style.borderLeftWidth = Math.round(wTop / 2) + 'px';
        top.style.borderRightWidth = Math.round(wTop / 2) + 'px';
        top.style.borderBottomColor = color;
        bldg.appendChild(top);
      } else if (variant === 3) {
        // antenna
        const ant = document.createElement('div');
        ant.className = 'sky-antenna';
        ant.style.background = color;
        bldg.appendChild(ant);
        const blinker = document.createElement('span');
        blinker.className = 'sky-antenna-light';
        blinker.style.background = color;
        blinker.style.boxShadow = '0 0 6px ' + color;
        ant.appendChild(blinker);
      }

      // impact dots
      const dots = document.createElement('div');
      dots.className = 'sky-impact-dots';
      for (let i = 0; i < 5; i++) {
        const d = document.createElement('span');
        d.className = 'sky-impact-dot' + (i < imp ? ' is-on' : '');
        d.style.background = i < imp ? color : 'rgba(255,255,255,0.18)';
        dots.appendChild(d);
      }
      bldg.appendChild(dots);

      // day label (shown on hover via CSS, but always exists in DOM for SR)
      const lbl = document.createElement('span');
      lbl.className = 'sky-bldg-label';
      lbl.textContent = 'D' + b.d;
      lbl.style.color = '#fff';
      bldg.appendChild(lbl);

      // click → focus
      bldg.addEventListener('click', () => focusBuilding(b.d));
      bldg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusBuilding(b.d); }
      });
      bldg.tabIndex = 0;
      bldg.setAttribute('role', 'button');
      bldg.setAttribute('aria-label', 'Day ' + b.d + ' — ' + b.n + ' — ' + ARCHETYPE_LABELS[b.a] + ' — impact ' + imp);

      stage.appendChild(bldg);
    });

    // ground reflection line
    const ground = document.createElement('div');
    ground.className = 'sky-ground';
    stage.appendChild(ground);

    applyModeClasses();
  }

  function darken(hex, amt) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * (1 - amt))));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function lighten(hex, amt) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + (255 - v) * amt)));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // ---- focus panel ----
  function focusBuilding(day) {
    const b = BUILDS.find(x => x.d === day);
    if (!b) return;
    state.focused = day;
    save();
    const color = ARCHETYPE_COLORS[b.a] || '#a855f7';
    const imp = IMPACT[b.d] || 3;
    const date = dateForDay(b.d);
    const archName = ARCHETYPE_LABELS[b.a] || b.a;
    const sameArch = BUILDS.filter(x => x.a === b.a).length;
    const sameArchPct = Math.round((sameArch / BUILDS.length) * 100);
    setHtml('sky-focus-day', 'Day ' + b.d);
    setHtml('sky-focus-name', b.n);
    const tag = $('#sky-focus-tag');
    if (tag) { tag.textContent = archName; tag.style.background = color; tag.style.color = '#fff'; }
    setHtml('sky-focus-date', date);
    setHtml('sky-focus-arch', archName);
    setHtml('sky-focus-impact', '★'.repeat(imp) + '☆'.repeat(5 - imp));
    setHtml('sky-focus-pct', sameArchPct + '% of city');
    setHtml('sky-focus-coord', '#' + String(b.d).padStart(2, '0'));
    const panel = $('#sky-focus');
    if (panel) {
      panel.classList.add('is-open');
      panel.style.setProperty('--focus-glow', color);
    }
    // highlight in grid
    document.querySelectorAll('.sky-building').forEach(el => {
      el.classList.toggle('is-focused', Number(el.dataset.day) === day);
    });
  }
  function closeFocus() {
    state.focused = null;
    save();
    const panel = $('#sky-focus');
    if (panel) panel.classList.remove('is-open');
    document.querySelectorAll('.sky-building').forEach(el => el.classList.remove('is-focused'));
  }

  function dateForDay(d) {
    const dt = new Date(DAY1);
    dt.setDate(dt.getDate() + (d - 1));
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ---- mode + time of day ----
  function applyModeClasses() {
    const section = $('.skyline-section');
    if (!section) return;
    section.classList.remove('sky-mode-day', 'sky-mode-night', 'sky-mode-sunset');
    section.classList.add('sky-mode-' + state.mode);
    section.style.setProperty('--sky-time', String(state.time));

    // sun / moon position
    const sun = $('#sky-sun');
    if (sun) {
      const t = state.time;
      const x = 10 + t * 80; // 10% to 90% across
      const y = 80 - Math.sin(t * Math.PI) * 60; // arc
      sun.style.left = x + '%';
      sun.style.top = y + '%';
    }
    const moon = $('#sky-moon');
    if (moon) {
      const t = state.time;
      const x = 10 + t * 80;
      const y = 80 - Math.sin(t * Math.PI) * 60;
      moon.style.left = x + '%';
      moon.style.top = y + '%';
    }
  }

  function setMode(m) {
    state.mode = m;
    if (m === 'day') state.time = 0.2;
    else if (m === 'sunset') state.time = 0.5;
    else state.time = 0.8;
    save();
    applyModeClasses();
    // active button
    document.querySelectorAll('.sky-mode-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.mode === m);
    });
    toast('Time of day: ' + m.charAt(0).toUpperCase() + m.slice(1));
  }

  // ---- time slider (continuous day/night) ----
  let raf = null;
  function startTimeLoop() {
    cancelAnimationFrame(raf);
    const tick = () => {
      if (!state.paused) {
        state.time = (state.time + 0.0006) % 1;
        applyModeClasses();
        const slider = $('#sky-time-slider');
        if (slider) slider.value = String(Math.round(state.time * 100));
        save();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  // ---- toast ----
  let toastTimer = null;
  function toast(msg) {
    const t = $('#sky-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 1800);
  }

  // ---- export ----
  function exportJSON() {
    const data = {
      generated: new Date().toISOString(),
      total: BUILDS.length,
      totalImpact: sumImpact(),
      archetypes: archCounts,
      mode: state.mode,
      time: state.time,
      buildings: BUILDS.map(b => ({
        day: b.d,
        name: b.n,
        archetype: b.a,
        archetypeLabel: ARCHETYPE_LABELS[b.a],
        color: ARCHETYPE_COLORS[b.a],
        impact: IMPACT[b.d] || 0,
        date: dateForDay(b.d),
      })),
    };
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ajh-skyline-day' + TODAY_DAY + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Skyline exported (' + BUILDS.length + ' buildings)');
    } catch (e) {
      toast('Export failed');
    }
  }

  // ---- wire UI ----
  function wire() {
    // mode buttons
    document.querySelectorAll('.sky-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    // time slider
    const slider = $('#sky-time-slider');
    if (slider) {
      slider.value = String(Math.round(state.time * 100));
      slider.addEventListener('input', () => {
        state.time = Number(slider.value) / 100;
        // infer mode
        if (state.time < 0.35) state.mode = 'day';
        else if (state.time < 0.65) state.mode = 'sunset';
        else state.mode = 'night';
        document.querySelectorAll('.sky-mode-btn').forEach(b => b.classList.toggle('is-active', b.dataset.mode === state.mode));
        applyModeClasses();
        save();
      });
    }
    // pause / play
    const pause = $('#sky-pause');
    if (pause) {
      pause.addEventListener('click', () => {
        state.paused = !state.paused;
        pause.innerHTML = state.paused ? '<i class="fas fa-play"></i><span>Resume time</span>' : '<i class="fas fa-pause"></i><span>Pause time</span>';
        toast(state.paused ? 'Time paused' : 'Time running');
      });
    }
    // focus close
    const fc = $('#sky-focus-close');
    if (fc) fc.addEventListener('click', closeFocus);
    const back = $('#sky-focus-back');
    if (back) back.addEventListener('click', closeFocus);
    // export
    const ex = $('#sky-export');
    if (ex) ex.addEventListener('click', exportJSON);
    // jump to today
    const today = $('#sky-jump-today');
    if (today) {
      today.addEventListener('click', () => {
        focusBuilding(TODAY_DAY);
        const el = document.querySelector('.sky-building[data-day="' + TODAY_DAY + '"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });
    }
    // jump to start
    const start = $('#sky-jump-start');
    if (start) {
      start.addEventListener('click', () => {
        focusBuilding(1);
        const el = document.querySelector('.sky-building[data-day="1"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });
    }
    // tour (focus 1, 25, 50, 80)
    const tour = $('#sky-tour');
    if (tour) {
      tour.addEventListener('click', () => {
        const stops = [1, 25, 50, TODAY_DAY];
        let i = 0;
        const id = setInterval(() => {
          if (i >= stops.length) { clearInterval(id); return; }
          focusBuilding(stops[i]);
          const el = document.querySelector('.sky-building[data-day="' + stops[i] + '"]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          i++;
        }, 1400);
        toast('Tour: 4 stops across the city');
      });
    }
    // jump to arch button (from focus panel)
    const ja = $('#sky-focus-jump');
    if (ja) {
      ja.addEventListener('click', () => {
        if (!state.focused) return;
        const el = document.querySelector('.sky-building[data-day="' + state.focused + '"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      });
    }
  }

  // ---- keyboard ----
  function keyboard(e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/i.test(e.target.tagName)) return;
    if (state.focused) {
      if (e.key === 'Escape') { e.preventDefault(); closeFocus(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const sorted = BUILDS.map(b => b.d).sort((a, b) => a - b);
        const idx = sorted.indexOf(state.focused);
        const next = e.key === 'ArrowRight' ? sorted[Math.min(idx + 1, sorted.length - 1)] : sorted[Math.max(idx - 1, 0)];
        focusBuilding(next);
        const el = document.querySelector('.sky-building[data-day="' + next + '"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        return;
      }
    }
    if (e.key === 'd' || e.key === 'D') { setMode('day'); }
    if (e.key === 's' || e.key === 'S') { setMode('sunset'); }
    if (e.key === 'n' || e.key === 'N') { setMode('night'); }
    if (e.key === ' ') { e.preventDefault(); state.paused = !state.paused; save(); const p = $('#sky-pause'); if (p) p.innerHTML = state.paused ? '<i class="fas fa-play"></i><span>Resume time</span>' : '<i class="fas fa-pause"></i><span>Pause time</span>'; }
  }

  // ---- public API ----
  function open() {
    const el = $('#skyline');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  function jumpToDay(d) { focusBuilding(d); }
  function setFilter(f) { state.filter = f; save(); renderChips(); renderCity(); }
  function getState() { return JSON.parse(JSON.stringify(state)); }

  function init() {
    if (!$('#skyline')) return;
    state.visits = (state.visits || 0) + 1;
    save();
    renderChips();
    renderCity();
    renderSummary();
    wire();
    applyModeClasses();
    startTimeLoop();
    document.addEventListener('keydown', keyboard);
    // mark active mode button
    document.querySelectorAll('.sky-mode-btn').forEach(b => b.classList.toggle('is-active', b.dataset.mode === state.mode));
    window.ajhSkyline = { open, jumpToDay, setFilter, setMode, getState, focus: focusBuilding, exportJSON, version: 1 };
    // command event
    document.addEventListener('ajh-command', (e) => {
      const d = e.detail || {};
      if (d.cmd === 'skyline-open') open();
      else if (d.cmd === 'skyline-export') exportJSON();
      else if (d.cmd === 'skyline-tour') { $('#sky-tour')?.click(); }
      else if (d.cmd === 'skyline-jump-today') { $('#sky-jump-today')?.click(); }
    });
    // G K shortcut
    let gPending = false;
    document.addEventListener('keydown', (e) => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/i.test(e.target.tagName)) return;
      if (e.key === 'g' || e.key === 'G') { gPending = true; setTimeout(() => gPending = false, 900); return; }
      if (gPending && (e.key === 'k' || e.key === 'K')) { gPending = false; open(); }
    });
    console.log('🌆 Build Skyline initialized (Day 80, ' + BUILDS.length + ' buildings)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
