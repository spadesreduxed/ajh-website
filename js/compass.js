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
    { d: 85, a: 'systems', n: 'Compass Field Notes', i: 5 },
    { d: 86, a: 'systems', n: 'Build Lighthouse', i: 5 },
    { d: 87, a: 'data', n: 'Release Notes', i: 4 },
    { d: 88, a: 'systems', n: 'Release Archive', i: 5 },
    { d: 89, a: 'systems', n: 'Lighthouse History', i: 4 },
    { d: 90, a: 'systems', n: 'Build Ledger', i: 4 },
    { d: 91, a: 'systems', n: 'Build Pulse', i: 4 },
    { d: 92, a: 'systems', n: 'Next-Build Brief', i: 4 },
    { d: 93, a: 'systems', n: 'Build Checkpoint', i: 4 },
    { d: 94, a: 'systems', n: 'Build Dispatch', i: 4 },
    { d: 95, a: 'systems', n: 'Build Relay', i: 4 },
    { d: 96, a: 'systems', n: 'Build Runway', i: 4 },
    { d: 97, a: 'systems', n: 'Build Flight Plan', i: 4 },
    { d: 98, a: 'systems', n: 'Build Landing', i: 4 },
    { d: 99, a: 'systems', n: 'Build Dock', i: 4 },
    { d: 100, a: 'systems', n: 'Build Passport', i: 4 },
    { d: 101, a: 'systems', n: 'Build Archive', i: 4 },
    { d: 102, a: 'systems', n: 'Build Handoff', i: 4 },
    { d: 103, a: 'systems', n: 'Build Intake', i: 4 },
    { d: 104, a: 'systems', n: 'Build Proof', i: 5 },
    { d: 105, a: 'systems', n: 'Build Repair', i: 4 },
    { d: 106, a: 'systems', n: 'Proof → Repair Bridge', i: 4 },
    { d: 107, a: 'systems', n: 'Repair → Proof Bridge', i: 4 },
  ];

  const ARCH = {
    systems: { label: 'Systems', color: '#a78bfa' }, visual: { label: 'Visual', color: '#f472b6' },
    audio: { label: 'Audio', color: '#60a5fa' }, interactive: { label: 'Interactive', color: '#34d399' },
    data: { label: 'Data', color: '#fbbf24' }, meta: { label: 'Meta', color: '#c084fc' },
    craft: { label: 'Craft', color: '#22d3ee' }, social: { label: 'Social', color: '#fb7185' },
  };
  const KEY = 'ajh_compass_v1';
  const TOTAL = BUILDS.length;
  const state = { filter: 'all', selected: 107, theme: 'dark', views: 0 };
  const $ = (id) => document.getElementById(id);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    state.selected = clamp(Number(state.selected) || TOTAL, 1, TOTAL);
    if (!ARCH[state.filter] && state.filter !== 'all') state.filter = 'all';
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function point(build) {
    const angle = ((build.d - 1) / TOTAL) * Math.PI * 2 - Math.PI / 2;
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
    return `<svg class="cp-svg" viewBox="0 0 800 560" role="img" aria-label="Compass map of ${TOTAL} build days"><circle class="cp-ring" cx="400" cy="280" r="120"/><circle class="cp-ring" cx="400" cy="280" r="180"/><line class="cp-axis" x1="400" y1="50" x2="400" y2="510" stroke="var(--cp-accent)"/><line class="cp-axis" x1="170" y1="280" x2="630" y2="280" stroke="var(--cp-accent)"/><text class="cp-axis-label" x="400" y="28" fill="var(--cp-accent)">N / SYSTEMS</text><text class="cp-axis-label" x="400" y="538" fill="var(--cp-accent)">S / SHIPPING</text><text class="cp-axis-label" x="660" y="284" fill="var(--cp-accent)">E / CRAFT</text><text class="cp-axis-label" x="140" y="284" fill="var(--cp-accent)">W / LEARNING</text><circle class="cp-center" cx="400" cy="280" r="55"/><text class="cp-center-label" x="400" y="276">AJH</text><text class="cp-center-label" x="400" y="292" font-size="9">${TOTAL} BUILDS</text>${points}</svg>`;
  }
  const DIRECTIONS = {
    systems: { label: 'Systems', color: '#a78bfa', keys: ['systems', 'data'], text: 'Strengthen the foundation: improve reliability, tooling, and the parts that let every future build ship faster.' },
    shipping: { label: 'Shipping', color: '#34d399', keys: ['interactive', 'social'], text: 'Put the work in more hands: polish the feedback loop, invite participation, and make the next release easier to use.' },
    craft: { label: 'Craft', color: '#f472b6', keys: ['craft', 'visual'], text: 'Sharpen the surface: spend the next build on hierarchy, motion restraint, and the small details people feel.' },
    learning: { label: 'Learning', color: '#60a5fa', keys: ['audio', 'meta'], text: 'Run a deliberate experiment: document the hypothesis, measure the result, and turn the lesson into the next move.' },
  };
  function directionScores() {
    return Object.entries(DIRECTIONS).map(([id, direction]) => {
      const builds = BUILDS.filter((build) => direction.keys.includes(build.a));
      return { id, ...direction, builds, score: builds.reduce((sum, build) => sum + build.i, 0), count: builds.length };
    });
  }
  function recommendation() {
    return directionScores().sort((a, b) => a.score - b.score || a.count - b.count)[0];
  }
  function updateRecommendation() {
    const next = recommendation();
    $('cp-recommendation-axis').textContent = next.label;
    $('cp-recommendation-axis').style.color = next.color;
    $('cp-recommendation-text').textContent = next.text;
    $('cp-recommendation-meta').textContent = `${next.score} impact points · ${next.count} builds · the least-used direction right now`;
  }
  function date(day) { const dates = { 107: 'Aug 10, 2026', 106: 'Aug 9, 2026', 105: 'Aug 8, 2026', 102: 'Aug 5, 2026', 103: 'Aug 6, 2026', 104: 'Aug 7, 2026', 101: 'Aug 4, 2026', 100: 'Aug 3, 2026', 99: 'Aug 2, 2026', 98: 'Aug 1, 2026', 97: 'Jul 31, 2026', 96: 'Jul 30, 2026', 95: 'Jul 29, 2026', 94: 'Jul 28, 2026', 93: 'Jul 27, 2026', 92: 'Jul 26, 2026' }; return dates[day] || new Date(2026, 3, 21 + day + 4).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function updateFocus() {
    const b = BUILDS.find((build) => build.d === state.selected) || BUILDS[BUILDS.length - 1]; const meta = ARCH[b.a];
    $('cp-focus-day').textContent = 'Day ' + b.d; $('cp-focus-day').style.color = meta.color;
    $('cp-focus-name').textContent = b.n; $('cp-focus-arch').textContent = meta.label; $('cp-focus-date').textContent = date(b.d);
    $('cp-focus-impact').textContent = 'Impact ' + b.i + '/5'; $('cp-focus-desc').textContent = b.n + ' sits on the ' + meta.label.toLowerCase() + ' axis of the build compass. The map turns the 105-day streak into direction: where the work points, and what to build next.';
  }
  function render() {
    $('cp-stage').innerHTML = compassSvg(); updateFocus(); updateRecommendation();
    $('cp-stat-builds').textContent = String(TOTAL); $('cp-stat-filter').textContent = state.filter === 'all' ? 'All' : ARCH[state.filter].label; $('cp-stat-direction').textContent = ARCH[BUILDS[state.selected - 1].a].label; $('cp-stat-views').textContent = String(state.views);
    document.querySelectorAll('.cp-filter').forEach((b) => b.classList.toggle('is-active', b.dataset.filter === state.filter));
    document.querySelectorAll('.cp-point').forEach((el) => { const select = () => { state.selected = Number(el.dataset.day); state.views += 1; save(); render(); }; el.addEventListener('click', select); el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } }); });
  }
  function open() { $('compass')?.scrollIntoView({ behavior: 'smooth' }); }
  function jump(day) { state.selected = clamp(day, 1, TOTAL); save(); render(); }
  function exportSVG() {
    const source = $('cp-stage')?.querySelector('svg');
    if (!source) return;
    const copy = source.cloneNode(true);
    copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    copy.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `.cp-svg{background:#07111d}.cp-ring{fill:none;stroke:#59daff;stroke-opacity:.18;stroke-dasharray:4 8}.cp-axis{stroke:#59daff;stroke-opacity:.18;stroke-dasharray:2 9}.cp-axis-label,.cp-center-label{font:11px monospace;text-anchor:middle;letter-spacing:.1em;fill:#eaf8ff}.cp-center-label{font-weight:700}.cp-center{fill:#123047;stroke:#59daff;stroke-opacity:.7}.cp-point text{fill:#eaf8ff;font:10px monospace;text-anchor:middle;opacity:.8}`;
    copy.prepend(style);
    const xml = new XMLSerializer().serializeToString(copy);
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `ajh-compass-${new Date().toISOString().slice(0, 10)}.svg`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function boot() {
    load(); $('compass').classList.toggle('cp-light', state.theme === 'light'); render();
    document.querySelectorAll('.cp-filter').forEach((b) => b.addEventListener('click', () => { state.filter = b.dataset.filter; save(); render(); }));
    $('cp-theme')?.addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; $('compass').classList.toggle('cp-light', state.theme === 'light'); save(); });
    $('cp-today')?.addEventListener('click', () => jump(TOTAL)); $('cp-random')?.addEventListener('click', () => jump(1 + Math.floor(Math.random() * TOTAL)));
    $('cp-next')?.addEventListener('click', () => jump(state.selected === TOTAL ? 1 : state.selected + 1)); $('cp-prev')?.addEventListener('click', () => jump(state.selected === 1 ? TOTAL : state.selected - 1));
    $('cp-export')?.addEventListener('click', exportSVG);
    $('cp-jump-journal')?.addEventListener('click', () => $('journal')?.scrollIntoView({ behavior: 'smooth' }));
    $('compass-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'c' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) open(); });
    window.ajhCompass = { open, jump, next: () => jump(state.selected === TOTAL ? 1 : state.selected + 1), prev: () => jump(state.selected === 1 ? TOTAL : state.selected - 1), random: () => jump(1 + Math.floor(Math.random() * TOTAL)), exportSVG, recommendation, builds: () => BUILDS.map((build) => ({ ...build })), state: () => state };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
