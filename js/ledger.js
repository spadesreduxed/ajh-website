(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const state = { filter: 'all', query: '', viewed: 0 };
  const builds = [
    { d: 1, a: 'meta', n: 'Animated Gradient Hero', i: 4 }, { d: 2, a: 'craft', n: 'Loading States', i: 3 },
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
    { d: 39, a: 'craft', n: 'Ambient Sound', i: 4 }, { d: 40, a: 'craft', n: 'Cursor Effects', i: 4 },
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
    { d: 85, a: 'systems', n: 'Compass Field Notes', i: 5 }, { d: 86, a: 'systems', n: 'Build Lighthouse', i: 5 },
    { d: 87, a: 'data', n: 'Release Notes', i: 4 }, { d: 88, a: 'systems', n: 'Release Archive', i: 5 },
    { d: 89, a: 'systems', n: 'Lighthouse History', i: 4 }, { d: 90, a: 'systems', n: 'Build Ledger', i: 4 },
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
  ];
  function date(day) { const dates = { 102: 'Aug 5, 2026', 103: 'Aug 6, 2026', 104: 'Aug 7, 2026', 101: 'Aug 4, 2026', 100: 'Aug 3, 2026', 99: 'Aug 2, 2026', 98: 'Aug 1, 2026', 97: 'Jul 31, 2026', 96: 'Jul 30, 2026', 95: 'Jul 29, 2026', 94: 'Jul 28, 2026', 93: 'Jul 27, 2026', 92: 'Jul 26, 2026' }; return dates[day] || new Date(2026, 3, 21 + day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function isoDate(day) { const dates = { 104: '2026-08-07', 101: '2026-08-04', 100: '2026-08-03', 99: '2026-08-02', 98: '2026-08-01', 97: '2026-07-31', 96: '2026-07-30', 95: '2026-07-29', 94: '2026-07-28', 93: '2026-07-27', 92: '2026-07-26', 103: '2026-08-06' }; return dates[day] || `2026-04-${String(21 + day).padStart(2, '0')}`; }
  function journalCard(day) { return [...document.querySelectorAll('#blog .blog-card')].find((el) => el.textContent.includes(`Day ${day}`)); }
  function visible(b) { const q = state.query.trim().toLowerCase(); return (state.filter === 'all' || b.a === state.filter) && (!q || `${b.d} ${b.n} ${b.a}`.toLowerCase().includes(q)); }
  function render() {
    const rows = builds.filter(visible); const impact = rows.reduce((sum, b) => sum + b.i, 0);
    $('ledger-count').textContent = rows.length; $('ledger-impact').textContent = `${impact} impact points`; $('ledger-latest').textContent = `${state.viewed} journal${state.viewed === 1 ? '' : 's'} opened`;
    $('ledger-body').innerHTML = rows.slice().reverse().map((b) => `<tr><th scope="row">Day ${b.d}</th><td><strong>${b.n}</strong></td><td><span class="ledger-type ledger-${b.a}">${b.a}</span></td><td><span class="ledger-impact" aria-label="Impact ${b.i} out of 5">${'●'.repeat(b.i)}${'○'.repeat(5 - b.i)}</span></td><td><time datetime="${isoDate(b.d)}">${date(b.d)}</time></td><td><a class="ledger-open" href="#blog" data-day="${b.d}">Journal <i class="fas fa-arrow-right"></i></a></td></tr>`).join('');
    $('ledger-empty').hidden = rows.length > 0;
    document.querySelectorAll('.ledger-filter').forEach((btn) => { const active = btn.dataset.filter === state.filter; btn.classList.toggle('is-active', active); btn.setAttribute('aria-selected', String(active)); });
    document.querySelectorAll('.ledger-open').forEach((link) => link.addEventListener('click', () => { const card = journalCard(link.dataset.day); state.viewed += 1; save(); card?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
  }
  function save() { try { localStorage.setItem('ajh_ledger_v1', JSON.stringify(state)); } catch (_) {} }
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem('ajh_ledger_v1') || '{}')); } catch (_) {} }
  function exportCSV() { const rows = builds.filter(visible); const csv = [['day', 'build', 'archetype', 'impact', 'date'], ...rows.map((b) => [b.d, b.n, b.a, b.i, date(b.d)])].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = `ajh-build-ledger-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function boot() { load(); if (!['all', 'systems', 'data', 'craft', 'audio', 'interactive'].includes(state.filter)) state.filter = 'all'; $('ledger-search').value = state.query; render(); $('ledger-search').addEventListener('input', (e) => { state.query = e.target.value; save(); render(); }); document.querySelectorAll('.ledger-filter').forEach((btn) => btn.addEventListener('click', () => { state.filter = btn.dataset.filter; save(); render(); })); $('ledger-export').addEventListener('click', exportCSV); $('ledger-hero-btn')?.addEventListener('click', () => $('ledger')?.scrollIntoView({ behavior: 'smooth', block: 'start' })); document.addEventListener('keydown', (e) => { if (e.target.matches('input, textarea, select, button, a')) return; if (e.key.toLowerCase() === 'l' && e.shiftKey) $('ledger')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); window.ajhLedger = { builds: () => builds.map((b) => ({ ...b })), exportCSV, state: () => state }; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
