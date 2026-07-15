/* ============================================================
   Day 79: Build Tape — a vintage cassette player for 79 days of build.
   ============================================================ */

(function () {
  'use strict';

  const DAY1 = new Date(2026, 3, 22); // Apr 22 2026
  const TODAY_DAY = 83;
  const TOTAL_TRACKS = 83;
  const TRACK_SECONDS = 3.2; // each "track" plays for 3.2s
  const STORAGE_KEY = 'ajh_tape_v1';

  // Archetype color map (mirrors DNA / Trail / Weather / Garden)
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

  const ARCHETYPE_ICONS = {
    systems:     'fa-gears',
    visual:      'fa-palette',
    audio:       'fa-music',
    interactive: 'fa-hand-pointer',
    data:        'fa-chart-line',
    meta:        'fa-layer-group',
    craft:       'fa-pen-ruler',
    social:      'fa-people-group',
  };

  // 79-day build history (Day 1 = 2026-04-22).
  const BUILDS = [
    { d: 1,  a: 'meta',        n: 'Vault Genesis',        i: 3 },
    { d: 2,  a: 'visual',      n: 'Theme System',         i: 4 },
    { d: 3,  a: 'systems',     n: 'Build Pipeline',       i: 3 },
    { d: 4,  a: 'craft',       n: 'Hero Polish',          i: 2 },
    { d: 5,  a: 'data',        n: 'Stats Engine',         i: 3 },
    { d: 6,  a: 'systems',     n: 'Build Calendar',       i: 4 },
    { d: 7,  a: 'meta',        n: 'Build Journal',        i: 3 },
    { d: 8,  a: 'social',      n: 'Wishlist v1',          i: 3 },
    { d: 9,  a: 'craft',       n: 'FAQ Page',             i: 2 },
    { d: 10, a: 'visual',      n: 'Animations Pack',      i: 3 },
    { d: 11, a: 'data',        n: 'Achievement Badges',   i: 4 },
    { d: 12, a: 'interactive', n: 'Now-Next-Later',       i: 3 },
    { d: 13, a: 'systems',     n: 'Snippets Vault',       i: 3 },
    { d: 14, a: 'meta',        n: 'Calendar Heatmap',     i: 4 },
    { d: 15, a: 'craft',       n: 'Build Assistant',      i: 4 },
    { d: 16, a: 'social',      n: 'Bookmark Cards',       i: 3 },
    { d: 17, a: 'data',        n: 'Site Constellation',   i: 5 },
    { d: 18, a: 'meta',        n: 'Time Capsule Vault',   i: 4 },
    { d: 19, a: 'systems',     n: 'Theme Studio',         i: 4 },
    { d: 20, a: 'visual',      n: 'Reading Mode',         i: 3 },
    { d: 21, a: 'craft',       n: 'On This Day Wisdom',   i: 4 },
    { d: 22, a: 'data',        n: 'Pixel Art Studio',     i: 4 },
    { d: 23, a: 'interactive', n: 'Daily Pixel Challenge', i: 4 },
    { d: 24, a: 'social',      n: 'Build Receipts',       i: 3 },
    { d: 25, a: 'audio',       n: 'Soundboard',           i: 5 },
    { d: 26, a: 'audio',       n: 'Step Sequencer',       i: 5 },
    { d: 27, a: 'meta',        n: 'The Forge',            i: 4 },
    { d: 28, a: 'systems',     n: 'Lab Notebook',         i: 4 },
    { d: 29, a: 'data',        n: 'Build DNA',            i: 5 },
    { d: 30, a: 'data',        n: 'Constellation Map',    i: 5 },
    { d: 31, a: 'data',        n: 'Build Trail',          i: 4 },
    { d: 32, a: 'data',        n: 'Build Weather',        i: 5 },
    { d: 33, a: 'data',        n: 'Build Garden',         i: 5 },
    { d: 34, a: 'visual',      n: 'Iconography Pack',     i: 2 },
    { d: 35, a: 'systems',     n: 'Service Hooks',        i: 3 },
    { d: 36, a: 'craft',       n: 'Microcopy Pass',       i: 2 },
    { d: 37, a: 'interactive', n: 'Hover Playbook',       i: 2 },
    { d: 38, a: 'social',      n: 'Testimonial Slot',     i: 2 },
    { d: 39, a: 'meta',        n: 'Daily Reflection',     i: 3 },
    { d: 40, a: 'data',        n: 'Build Sparkline',      i: 3 },
    { d: 41, a: 'visual',      n: 'Gradient Lab',         i: 2 },
    { d: 42, a: 'craft',       n: 'Story Scroll',         i: 2 },
    { d: 43, a: 'systems',     n: 'Build Logger',         i: 3 },
    { d: 44, a: 'interactive', n: 'Key Choreography',     i: 2 },
    { d: 45, a: 'craft',       n: 'Section Refresh',      i: 2 },
    { d: 46, a: 'data',        n: 'Activity Ring',        i: 3 },
    { d: 47, a: 'audio',       n: 'Sound Test',           i: 2 },
    { d: 48, a: 'meta',        n: 'Build Themes',         i: 3 },
    { d: 49, a: 'social',      n: 'Feedback Box',         i: 2 },
    { d: 50, a: 'visual',      n: 'Hero Replay',          i: 2 },
    { d: 51, a: 'systems',     n: 'Asset Pipeline',       i: 3 },
    { d: 52, a: 'craft',       n: 'Tooltips Pass',        i: 2 },
    { d: 53, a: 'data',        n: 'Build Trends',         i: 3 },
    { d: 54, a: 'interactive', n: 'Click Trail',          i: 2 },
    { d: 55, a: 'meta',        n: 'Mind Sweep',           i: 3 },
    { d: 56, a: 'craft',       n: 'Tone Pass',            i: 2 },
    { d: 57, a: 'social',      n: 'Poll Widget',          i: 2 },
    { d: 58, a: 'data',        n: 'Stats Card',           i: 2 },
    { d: 59, a: 'visual',      n: 'Card Shadows',         i: 2 },
    { d: 60, a: 'systems',     n: 'Index Hygiene',        i: 2 },
    { d: 61, a: 'craft',       n: 'Section Polish',       i: 2 },
    { d: 62, a: 'data',        n: 'Quick Pulse',          i: 3 },
    { d: 63, a: 'meta',        n: 'Week Note',            i: 2 },
    { d: 64, a: 'meta',        n: 'Build Journal v2',     i: 4 },
    { d: 65, a: 'social',      n: 'Community Wishlist',   i: 4 },
    { d: 66, a: 'craft',       n: 'On This Day Cards',    i: 4 },
    { d: 67, a: 'data',        n: 'Pixel Art Studio',     i: 4 },
    { d: 68, a: 'interactive', n: 'Daily Pixel Challenge', i: 4 },
    { d: 69, a: 'craft',       n: 'Build Receipts',       i: 3 },
    { d: 70, a: 'audio',       n: 'Soundboard',           i: 5 },
    { d: 71, a: 'audio',       n: 'Step Sequencer',       i: 5 },
    { d: 72, a: 'meta',        n: 'The Forge',            i: 4 },
    { d: 73, a: 'systems',     n: 'Lab Notebook',         i: 4 },
    { d: 74, a: 'data',        n: 'Build DNA',            i: 5 },
    { d: 75, a: 'data',        n: 'Constellation Map',    i: 5 },
    { d: 76, a: 'data',        n: 'Build Trail',          i: 5 },
    { d: 77, a: 'data',        n: 'Build Weather',        i: 5 },
    { d: 78, a: 'data',        n: 'Build Garden',         i: 5 },
    { d: 79, a: 'data',        n: 'Build Tape',           i: 5 },
  ];

  // Storage helpers
  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // State
  const state = load(STORAGE_KEY, { position: 79, speed: 1, filter: 'all', visits: 0, shuffle: false });

  // DOM helpers (always null-safe)
  const $ = (id) => document.getElementById(id);
  function setText(id, t) { const el = $(id); if (el) el.textContent = t; }
  function setHTML(id, h) { const el = $(id); if (el) el.innerHTML = h; }
  function setStyle(id, prop, val) { const el = $(id); if (el) el.style[prop] = val; }
  function setCssVar(el, prop, val) { if (el) el.style.setProperty(prop, val); }
  function fmtTime(secs) {
    secs = Math.max(0, Math.floor(secs));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  function dayDate(d) {
    const dt = new Date(DAY1);
    dt.setDate(dt.getDate() + (d - 1));
    return dt;
  }
  function fmtDate(d) {
    return dayDate(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
  function fmtDateShort(d) {
    return dayDate(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function impactDots(i) {
    let s = '';
    for (let k = 0; k < 5; k++) s += '<span class="tape-dot' + (k < i ? ' on' : '') + '"></span>';
    return s;
  }
  function toast(msg) {
    const t = $('tape-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('on'), 2200);
  }
  function totalSeconds() { return TOTAL_TRACKS * TRACK_SECONDS; }
  function currentSeconds() { return (state.position - 1 + (state._elapsed || 0)) * TRACK_SECONDS; }
  function currentBuild() { return BUILDS[state.position - 1]; }
  function side() { return state.position <= Math.ceil(TOTAL_TRACKS / 2) ? 'A' : 'B'; }

  // ===== Render: summary =====
  function renderSummary() {
    const total = BUILDS.length;
    const sum = BUILDS.reduce((a, b) => a + b.i, 0);
    setText('tape-stat-tracks', total);
    setText('tape-stat-impact', sum);
    setText('tape-stat-now', 'D' + state.position);
    setText('tape-stat-time', fmtTime(currentSeconds()));
  }

  // ===== Render: chips =====
  const ARCHETYPE_LABELS = {
    all: 'All Tracks',
    systems: 'Systems',
    visual: 'Visual',
    audio: 'Audio',
    interactive: 'Interactive',
    data: 'Data',
    meta: 'Meta',
    craft: 'Craft',
    social: 'Social',
  };
  function renderChips() {
    const wrap = $('tape-chips');
    if (!wrap) return;
    wrap.innerHTML = '';
    const keys = ['all', 'systems', 'visual', 'audio', 'interactive', 'data', 'meta', 'craft', 'social'];
    keys.forEach((k) => {
      const count = k === 'all' ? BUILDS.length : BUILDS.filter(b => b.a === k).length;
      const btn = document.createElement('button');
      btn.className = 'tape-chip' + (state.filter === k ? ' active' : '');
      btn.dataset.k = k;
      if (k !== 'all') setCssVar(btn, '--chip-color', ARCHETYPE_COLORS[k]);
      btn.innerHTML = '<span class="tape-chip-label">' + ARCHETYPE_LABELS[k] + '</span><span class="tape-chip-count">' + count + '</span>';
      btn.addEventListener('click', () => {
        state.filter = k;
        save(STORAGE_KEY, state);
        renderChips();
        renderTracklist();
      });
      wrap.appendChild(btn);
    });
  }

  // ===== Render: cassette (deck color + now playing) =====
  function renderCassette() {
    const c = currentBuild();
    if (!c) return;
    const color = ARCHETYPE_COLORS[c.a] || '#a855f7';
    const deck = $('tape-deck');
    if (deck) {
      setCssVar(deck, '--cassette-color', color);
      deck.dataset.archetype = c.a;
    }
    setText('tape-np-day', 'DAY ' + c.d);
    setText('tape-np-name', c.n);
    setText('tape-np-arch', (ARCHETYPE_LABELS[c.a] || c.a) + ' · impact ' + c.i);
    setText('tape-np-date', fmtDate(c.d));
    setHTML('tape-np-impact', impactDots(c.i));
    setText('tape-label-title', 'AJH // 2026');
    setText('tape-label-sub', BUILDS.length + ' BUILDS · ' + avgImpact() + ' AVG IMPACT');
    // Counter (3 digits)
    const d1 = $('tape-counter-1');
    const d2 = $('tape-counter-2');
    const d3 = $('tape-counter-3');
    const s = String(state.position).padStart(3, '0');
    if (d1) d1.textContent = s[0];
    if (d2) d2.textContent = s[1];
    if (d3) d3.textContent = s[2];
  }
  function avgImpact() {
    if (!BUILDS.length) return '0.00';
    return (BUILDS.reduce((a, b) => a + b.i, 0) / BUILDS.length).toFixed(2);
  }
  function total() { return BUILDS.length; }

  // ===== Render: track list =====
  function filteredBuilds() {
    if (state.filter === 'all') return BUILDS;
    return BUILDS.filter(b => b.a === state.filter);
  }
  function renderTracklist() {
    const list = $('tape-tracklist-list');
    if (!list) return;
    const filtered = filteredBuilds();
    list.innerHTML = '';
    filtered.forEach((b) => {
      const color = ARCHETYPE_COLORS[b.a];
      const row = document.createElement('button');
      row.className = 'tape-track' + (b.d === state.position ? ' active' : '');
      row.dataset.d = b.d;
      setCssVar(row, '--track-color', color);
      row.innerHTML =
        '<span class="tape-track-num">' + String(b.d).padStart(2, '0') + '</span>' +
        '<span class="tape-track-name">' + b.n + '</span>' +
        '<span class="tape-track-arch" title="' + b.a + '"><i class="fas ' + (ARCHETYPE_ICONS[b.a] || 'fa-circle') + '"></i></span>' +
        '<span class="tape-track-impact">' + impactDots(b.i) + '</span>' +
        '<span class="tape-track-date">' + fmtDateShort(b.d) + '</span>' +
        '<span class="tape-track-go"><i class="fas fa-play"></i></span>';
      row.addEventListener('click', () => jumpTo(b.d));
      list.appendChild(row);
    });
    // Side label inside the tracklist header
    const sideLabel = $('tape-tracklist-side');
    if (sideLabel) sideLabel.textContent = 'Side ' + side();
  }

  // ===== Render: reel rotation =====
  function renderReels() {
    const leftEl = $('tape-reel-left');
    const rightEl = $('tape-reel-right');
    if (!leftEl || !rightEl) return;
    if (state._playing) {
      const a = (state._elapsed || 0) * 90; // 90 deg/sec
      setStyle('tape-reel-left', 'transform', 'rotate(' + a + 'deg)');
      setStyle('tape-reel-right', 'transform', 'rotate(' + (-a) + 'deg)');
    }
  }

  // ===== Render: progress bar =====
  function renderProgress() {
    const total = totalSeconds();
    const cur = Math.min(total, currentSeconds());
    const pct = total > 0 ? (cur / total) * 100 : 0;
    setStyle('tape-np-progress-bar', 'width', pct + '%');
  }

  // ===== Render: side label =====
  function updateSideLabel() {
    setText('tape-counter-side', 'SIDE ' + side());
    const label = $('tape-label-band');
    if (label) {
      const sd = side();
      label.textContent = sd === 'A' ? 'SIDE A ▶' : '◀ SIDE B';
    }
  }

  // ===== Player logic =====
  let _tickHandle = null;
  let _lastTick = 0;
  function startTick() {
    stopTick();
    _lastTick = performance.now();
    _tickHandle = requestAnimationFrame(tick);
  }
  function stopTick() {
    if (_tickHandle) cancelAnimationFrame(_tickHandle);
    _tickHandle = null;
  }
  function tick(now) {
    if (!state._playing) return;
    const dt = (now - _lastTick) / 1000;
    _lastTick = now;
    state._elapsed = Math.min(TRACK_SECONDS, (state._elapsed || 0) + dt * state.speed);
    if (state._elapsed >= TRACK_SECONDS) {
      state._elapsed = 0;
      if (state.position < TOTAL_TRACKS) {
        state.position += 1;
        renderCassette();
        renderTracklist();
        save(STORAGE_KEY, state);
        renderSummary();
      } else {
        state._playing = false;
        stopTick();
        const playBtn = $('tape-play');
        if (playBtn) playBtn.classList.remove('playing');
        toast('End of tape — rewinding to side A');
        state.position = 1;
        state._elapsed = 0;
        renderCassette();
        renderTracklist();
        save(STORAGE_KEY, state);
      }
    }
    renderProgress();
    renderReels();
    _tickHandle = requestAnimationFrame(tick);
  }
  function play() {
    if (state.position > TOTAL_TRACKS) state.position = 1;
    if (state.position < 1) state.position = 1;
    state._elapsed = state._elapsed || 0;
    state._playing = true;
    const playBtn = $('tape-play');
    if (playBtn) playBtn.classList.add('playing');
    startTick();
    save(STORAGE_KEY, state);
  }
  function pause() {
    state._playing = false;
    const playBtn = $('tape-play');
    if (playBtn) playBtn.classList.remove('playing');
    stopTick();
    save(STORAGE_KEY, state);
  }
  function toggle() {
    state._playing ? pause() : play();
  }
  function next() {
    if (state.position < TOTAL_TRACKS) state.position += 1;
    state._elapsed = 0;
    renderCassette(); renderTracklist(); save(STORAGE_KEY, state); renderSummary();
  }
  function prev() {
    if (state.position > 1) state.position -= 1;
    state._elapsed = 0;
    renderCassette(); renderTracklist(); save(STORAGE_KEY, state); renderSummary();
  }
  function rewind() {
    state.position = 1; state._elapsed = 0;
    renderCassette(); renderTracklist(); save(STORAGE_KEY, state); renderSummary();
    toast('Rewound to start');
  }
  function fastForward() {
    state.position = TOTAL_TRACKS; state._elapsed = 0;
    renderCassette(); renderTracklist(); save(STORAGE_KEY, state); renderSummary();
    toast('Fast-forwarded to end');
  }
  function jumpTo(d) {
    if (d < 1) d = 1; if (d > TOTAL_TRACKS) d = TOTAL_TRACKS;
    state.position = d; state._elapsed = 0;
    renderCassette(); renderTracklist(); save(STORAGE_KEY, state); renderSummary();
  }
  function exportJSON() {
    const blob = new Blob([JSON.stringify({ generated: new Date().toISOString(), total: TOTAL_TRACKS, state, builds: BUILDS }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ajh-tape-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click(); URL.revokeObjectURL(url);
    toast('Tape exported as JSON');
  }

  // ===== Init =====
  function init() {
    if (!$('tape')) return; // section not on this page
    if (state.position < 1) state.position = 1;
    if (state.position > TOTAL_TRACKS) state.position = TOTAL_TRACKS;
    if (!state.filter) state.filter = 'all';
    if (!state.speed) state.speed = 1;
    state._elapsed = 0;
    state._playing = false;
    state.visits = (state.visits || 0) + 1;
    save(STORAGE_KEY, state);

    renderSummary();
    renderChips();
    renderCassette();
    renderTracklist();
    renderProgress();
    updateSideLabel();

    const onClick = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', fn); };
    onClick('tape-play', toggle);
    onClick('tape-prev', prev);
    onClick('tape-next', next);
    onClick('tape-rewind', rewind);
    onClick('tape-fwd', fastForward);
    onClick('tape-export', exportJSON);
    onClick('tape-flip', () => {
      state.position = state.position <= Math.ceil(TOTAL_TRACKS / 2) ? Math.ceil(TOTAL_TRACKS / 2) + 1 : 1;
      state._elapsed = 0;
      save(STORAGE_KEY, state);
      renderCassette(); renderTracklist(); renderSummary(); updateSideLabel();
      toast('Flipped to Side ' + side());
    });
    onClick('tape-shuffle', () => {
      state.shuffle = !state.shuffle;
      save(STORAGE_KEY, state);
      const btn = $('tape-shuffle'); if (btn) btn.classList.toggle('active', state.shuffle);
      toast('Shuffle ' + (state.shuffle ? 'ON' : 'OFF'));
    });

    // Keyboard: Space to play/pause when tape section is in view
    document.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space' && state._tapeInView) { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowLeft' && state._tapeInView) { e.preventDefault(); e.shiftKey ? jumpTo(state.position - 5) : prev(); }
      if (e.code === 'ArrowRight' && state._tapeInView) { e.preventDefault(); e.shiftKey ? jumpTo(state.position + 5) : next(); }
    });

    // Track when tape section is in view
    const sec = $('tape');
    if (sec && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => state._tapeInView = en.isIntersecting);
      }, { threshold: 0.4 });
      obs.observe(sec);
    }

    // Re-render the cassette label/header on resize
    window.addEventListener('resize', renderCassette);

    // Public API
    window.ajhTape = {
      play, pause, toggle, next, prev, rewind, fastForward, jumpTo, exportJSON,
      setFilter: (f) => { state.filter = f; save(STORAGE_KEY, state); renderChips(); renderTracklist(); },
      state: () => state,
      open: () => { $('tape')?.scrollIntoView({ behavior: 'smooth' }); setTimeout(play, 250); },
    };

    // Command event listener
    document.addEventListener('ajh-command', (e) => {
      const d = e.detail;
      if (!d) return;
      if (d.type === 'tape-play' || d.command === 'tape-play') toggle();
      if (d.type === 'tape-jump') jumpTo(d.day || state.position);
      if (d.type === 'tape-export') exportJSON();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
