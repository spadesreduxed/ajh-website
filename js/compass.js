(function () {
  'use strict';

  const BUILDS = [
    { d: 1, a: 'craft', n: 'Animated Gradient Hero', i: 4 }, { d: 2, a: 'craft', n: 'Loading States', i: 3 },
    { d: 3, a: 'systems', n: 'Keyboard Shortcuts', i: 4 }, { d: 4, a: 'visual', n: 'Particle Background', i: 3 },
    { d: 5, a: 'craft', n: 'Hero Polish', i: 3 }, { d: 6, a: 'craft', n: '3D Tilt Cards', i: 4 },
    { d: 7, a: 'craft', n: 'Aurora Background', i: 4 }, { d: 8, a: 'craft', n: 'Easter Eggs', i: 2 },
    { d: 9, a: 'craft', n: 'Sound Effects', i: 3 }, { d: 10, a: 'craft', n: 'Hero Clocks', i: 2 },
    { d: 11, a: 'visual', n: 'Glassmorphism', i: 4 }, { d: 12, a: 'interactive', n: 'Theme Switcher', i: 3 },
    { d: 13, a: 'craft', n: 'Custom Cursor', i: 3 }, { d: 14, a: 'craft', n: 'Scroll Animations', i: 4 },
    { d: 15, a: 'craft', n: 'Loading Skeleton', i: 3 }, { d: 16, a: 'interactive', n: 'Mini Games', i: 4 },
    { d: 17, a: 'craft', n: '3D Hero Scene', i: 5 }, { d: 18, a: 'data', n: 'Project Filters', i: 3 },
    { d: 19, a: 'meta', n: 'Build Counter', i: 3 }, { d: 20, a: 'craft', n: 'Animated Logos', i: 3 },
    { d: 21, a: 'data', n: 'Daily Counter Bump', i: 2 }, { d: 22, a: 'data', n: 'Blog System', i: 4 },
    { d: 23, a: 'craft', n: 'CSS Grid Showcase', i: 3 }, { d: 24, a: 'interactive', n: 'Pomodoro Timer', i: 4 },
    { d: 25, a: 'data', n: 'Site Search', i: 4 }, { d: 26, a: 'interactive', n: 'Konami Code', i: 3 },
    { d: 27, a: 'visual', n: 'Parallax Polish', i: 3 }, { d: 28, a: 'data', n: 'Newsletter Signup', i: 3 },
    { d: 29, a: 'craft', n: 'Accordion Refactor', i: 3 }, { d: 30, a: 'craft', n: '3D Tilt Polish', i: 3 },
    { d: 31, a: 'data', n: 'Blog Cleanup', i: 2 }, { d: 32, a: 'craft', n: 'Notification System', i: 3 },
    { d: 33, a: 'interactive', n: 'Random Quote', i: 3 }, { d: 34, a: 'craft', n: 'Sticky Notes', i: 3 },
    { d: 35, a: 'craft', n: 'Sticky Notes Polish', i: 3 }, { d: 36, a: 'craft', n: 'Hero Refresh', i: 3 },
    { d: 37, a: 'craft', n: 'Hero Clocks', i: 3 }, { d: 38, a: 'craft', n: 'Hero Polish', i: 3 },
    { d: 39, a: 'craft', n: 'Hero Polish', i: 3 }, { d: 40, a: 'craft', n: 'Cursor Effects', i: 4 },
    { d: 41, a: 'craft', n: 'Nav Transitions', i: 3 }, { d: 42, a: 'craft', n: 'Card Hover States', i: 3 },
    { d: 43, a: 'craft', n: 'Section Anchors', i: 3 }, { d: 44, a: 'craft', n: 'Loading Spinners', i: 3 },
    { d: 45, a: 'data', n: 'Build Tracker', i: 4 }, { d: 46, a: 'meta', n: 'Counter Increments', i: 1 },
    { d: 47, a: 'interactive', n: 'Hero Game', i: 5 }, { d: 48, a: 'data', n: 'Stats Dashboard', i: 4 },
    { d: 49, a: 'craft', n: 'Smooth Scrolling', i: 3 }, { d: 50, a: 'data', n: 'Code Snippets', i: 4 },
    { d: 51, a: 'craft', n: 'Hero Polish', i: 3 }, { d: 52, a: 'craft', n: 'Easter Eggs', i: 3 },
    { d: 53, a: 'craft', n: 'SVG Icons', i: 3 }, { d: 54, a: 'data', n: 'Build Log', i: 4 },
    { d: 55, a: 'craft', n: '404 Page', i: 3 }, { d: 56, a: 'data', n: 'Code Snippets Vault', i: 5 },
    { d: 57, a: 'craft', n: 'SVG Glyphs', i: 4 }, { d: 58, a: 'craft', n: 'Marquee Banner', i: 3 },
    { d: 59, a: 'craft', n: 'Hero Spotlight', i: 4 }, { d: 60, a: 'data', n: 'Build Index', i: 4 },
    { d: 61, a: 'craft', n: 'Hero Polish', i: 3 }, { d: 62, a: 'craft', n: 'Skill Showcase', i: 4 },
    { d: 63, a: 'data', n: 'Build Index Expand', i: 3 }, { d: 64, a: 'data', n: 'Build Journal', i: 5 },
    { d: 65, a: 'interactive', n: 'Whack-a-Bug', i: 4 }, { d: 66, a: 'craft', n: 'Hero Clocks v2', i: 3 },
    { d: 67, a: 'craft', n: 'Pixel Art Studio', i: 5 }, { d: 68, a: 'interactive', n: 'Daily Pixel Challenge', i: 5 },
    { d: 69, a: 'data', n: 'Build Receipts', i: 5 }, { d: 70, a: 'audio', n: 'Soundboard', i: 5 },
    { d: 71, a: 'audio', n: 'Step Sequencer', i: 5 }, { d: 72, a: 'craft', n: 'Hero Polish', i: 3 },
    { d: 73, a: 'data', n: 'Lab Notebook', i: 5 }, { d: 74, a: 'data', n: 'Build DNA', i: 5 },
    { d: 75, a: 'data', n: 'Constellation Map', i: 5 }, { d: 76, a: 'data', n: 'Build Trail', i: 5 },
    { d: 77, a: 'data', n: 'Build Weather', i: 5 }, { d: 78, a: 'data', n: 'Build Garden', i: 5 },
    { d: 79, a: 'data', n: 'Build Tape', i: 5 }, { d: 80, a: 'data', n: 'Build Skyline', i: 5 },
    { d: 81, a: 'craft', n: 'Build Aquarium', i: 5 }, { d: 82, a: 'data', n: 'Build Observatory', i: 5 },
    { d: 83, a: 'audio', n: 'Build Waveform', i: 5 }, { d: 84, a: 'systems', n: 'Build Compass', i: 5 },
  ];

  const ARCH = {
    systems: { label: 'Systems', color: '#a78bfa' }, visual: { label: 'Visual', color: '#f472b6' },
    audio: { label: 'Audio', color: '#60a5fa' }, interactive: { label: 'Interactive', color: '#34d399' },
    data: { label: 'Data', color: '#fbbf24' }, meta: { label: 'Meta', color: '#c084fc' },
    craft: { label: 'Craft', color: '#22d3ee' }, social: { label: 'Social', color: '#fb7185' },
  };
  const KEY = 'ajh_compass_v1';
  const state = { filter: 'all', selected: 84, theme: 'dark', views: 0 };
  const $ = (id) => document.getElementById(id);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    state.selected = clamp(Number(state.selected) || 84, 1, 84);
    if (!ARCH[state.filter] && state.filter !== 'all') state.filter = 'all';
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function point(build) {
    const angle = ((build.d - 1) / 84) * Math.PI * 2 - Math.PI / 2;
    const radius = 90 + build.i * 30;
    return { x: 400 + Math.cos(angle) * radius, y: 280 + Math.sin(angle) * radius, angle }; 
  }
  function visible(build) { return state.filter === 'all' || build.a === state.filter; }
  function compassSvg() {
    const points = BUILDS.map((b) => {
      const p = point(b); const meta = ARCH[b.a]; const dim = visible(b) ? '' : ' cp-point-is-dim';
      const selected = b.d === state.selected ? ' is-selected' : '';
      return `<g class="cp-point${dim}${selected}" data-day="${b.d}" tabindex="0" role="button" aria-label="Day ${b.d}, ${b.n}, ${meta.label}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${5 + b.i * 1.8}" fill="${meta.color}" fill-opacity="${visible(b) ? .78 : .14}" stroke="${meta.color}"/><text x="${p.x.toFixed(1)}" y="${(p.y - 12).toFixed(1)}">${b.d}</text></g>`;
    }).join('');
    return `<svg class="cp-svg" viewBox="0 0 800 560" role="img" aria-label="Compass map of 84 build days"><circle class="cp-ring" cx="400" cy="280" r="120"/><circle class="cp-ring" cx="400" cy="280" r="180"/><line class="cp-axis" x1="400" y1="50" x2="400" y2="510" stroke="var(--cp-accent)"/><line class="cp-axis" x1="170" y1="280" x2="630" y2="280" stroke="var(--cp-accent)"/><text class="cp-axis-label" x="400" y="28" fill="var(--cp-accent)">N / SYSTEMS</text><text class="cp-axis-label" x="400" y="538" fill="var(--cp-accent)">S / SHIPPING</text><text class="cp-axis-label" x="660" y="284" fill="var(--cp-accent)">E / CRAFT</text><text class="cp-axis-label" x="140" y="284" fill="var(--cp-accent)">W / LEARNING</text><circle class="cp-center" cx="400" cy="280" r="55"/><text class="cp-center-label" x="400" y="276">AJH</text><text class="cp-center-label" x="400" y="292" font-size="9">84 BUILDS</text>${points}</svg>`;
  }
  function updateFocus() {
    const b = BUILDS[state.selected - 1]; const meta = ARCH[b.a];
    $('cp-focus-day').textContent = 'Day ' + b.d; $('cp-focus-day').style.color = meta.color;
    $('cp-focus-name').textContent = b.n; $('cp-focus-arch').textContent = meta.label; $('cp-focus-date').textContent = new Date(2026, 3, 21 + b.d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    $('cp-focus-impact').textContent = 'Impact ' + b.i + '/5'; $('cp-focus-desc').textContent = b.n + ' sits on the ' + meta.label.toLowerCase() + ' axis of the build compass. The map turns the 84-day streak into direction: where the work points, and what to build next.';
  }
  function render() {
    $('cp-stage').innerHTML = compassSvg(); updateFocus();
    $('cp-stat-builds').textContent = '84'; $('cp-stat-filter').textContent = state.filter === 'all' ? 'All' : ARCH[state.filter].label; $('cp-stat-direction').textContent = ARCH[BUILDS[state.selected - 1].a].label; $('cp-stat-views').textContent = String(state.views);
    document.querySelectorAll('.cp-filter').forEach((b) => b.classList.toggle('is-active', b.dataset.filter === state.filter));
    document.querySelectorAll('.cp-point').forEach((el) => { const select = () => { state.selected = Number(el.dataset.day); state.views += 1; save(); render(); }; el.addEventListener('click', select); el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } }); });
  }
  function open() { $('compass')?.scrollIntoView({ behavior: 'smooth' }); }
  function jump(day) { state.selected = clamp(day, 1, 84); save(); render(); }
  function boot() {
    load(); render();
    document.querySelectorAll('.cp-filter').forEach((b) => b.addEventListener('click', () => { state.filter = b.dataset.filter; save(); render(); }));
    $('cp-theme')?.addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; $('compass').classList.toggle('cp-light', state.theme === 'light'); save(); });
    $('cp-today')?.addEventListener('click', () => jump(84)); $('cp-random')?.addEventListener('click', () => jump(1 + Math.floor(Math.random() * 84)));
    $('cp-next')?.addEventListener('click', () => jump(state.selected === 84 ? 1 : state.selected + 1)); $('cp-prev')?.addEventListener('click', () => jump(state.selected === 1 ? 84 : state.selected - 1));
    $('compass-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'c' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) open(); });
    window.ajhCompass = { open, jump, next: () => jump(state.selected === 84 ? 1 : state.selected + 1), prev: () => jump(state.selected === 1 ? 84 : state.selected - 1), random: () => jump(1 + Math.floor(Math.random() * 84)), state: () => state };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
