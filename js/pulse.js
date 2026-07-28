(function () {
  'use strict';
  const KEY = 'ajh_pulse_v1';
  const ARCHETYPES = [
    ['systems', 'Systems', '#b9a4ff'], ['data', 'Data', '#ffd166'], ['craft', 'Craft', '#5bdcc4'],
    ['audio', 'Audio', '#76b9ff'], ['interactive', 'Interactive', '#ff8dc4'], ['visual', 'Visual', '#f0a8ff'],
    ['meta', 'Meta', '#c084fc'], ['social', 'Social', '#fb7185'],
  ];
  const $ = (id) => document.getElementById(id);
  const state = { views: 0, note: '', noteDismissed: false };
  function builds() { return window.ajhCompass?.builds?.() || []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {} }
  function direction(scores) {
    const groups = [
      { name: 'Systems', keys: ['systems', 'data'], text: 'Strengthen the foundation: make the next build easier to trust and easier to ship.' },
      { name: 'Shipping', keys: ['interactive', 'social'], text: 'Put the work in more hands: improve feedback, participation, and the path from curiosity to use.' },
      { name: 'Craft', keys: ['craft', 'visual'], text: 'Sharpen the surface: spend the next build on hierarchy, restraint, and the details people feel.' },
      { name: 'Learning', keys: ['audio', 'meta'], text: 'Run a deliberate experiment: document the hypothesis, measure the result, and turn the lesson into the next move.' },
    ];
    return groups.map((group) => ({ ...group, score: group.keys.reduce((sum, key) => sum + (scores[key]?.impact || 0), 0), count: group.keys.reduce((sum, key) => sum + (scores[key]?.count || 0), 0) })).sort((a, b) => a.score - b.score || a.count - b.count)[0];
  }
  function briefFor(next, latest) {
    return `Day ${latest.d + 1} · ${next.name}: ${next.text} Start with one small, shippable slice and leave a note about what changed.`;
  }
  function renderBrief(next, latest) {
    const card = $('pulse-brief');
    if (!card) return;
    card.hidden = state.noteDismissed;
    const input = $('pulse-brief-input');
    if (input && document.activeElement !== input) { input.value = state.note; input.placeholder = briefFor(next, latest); }
    $('pulse-brief-status').textContent = state.note ? 'Saved locally' : 'Suggested from the signal — write your own version';
    $('pulse-brief-toggle').textContent = state.noteDismissed ? 'Restore' : 'Dismiss';
    $('pulse-brief-toggle').setAttribute('aria-expanded', String(!state.noteDismissed));
  }
  function render() {
    const all = builds(); if (!all.length) return;
    const recent = all.slice(-10); const totalImpact = all.reduce((sum, build) => sum + build.i, 0); const recentImpact = recent.reduce((sum, build) => sum + build.i, 0); const average = recentImpact / recent.length;
    const scores = Object.fromEntries(ARCHETYPES.map(([key]) => [key, { impact: 0, count: 0 }]));
    all.forEach((build) => { if (!scores[build.a]) scores[build.a] = { impact: 0, count: 0 }; scores[build.a].impact += build.i; scores[build.a].count += 1; });
    const momentum = recentImpact / (recent.length * 5); const consistency = all.length >= 2 ? Math.min(1, all.length / 94) : .2; const signal = Math.round((momentum * .65 + consistency * .35) * 100);
    const next = direction(scores); const latest = all[all.length - 1];
    $('pulse-score').textContent = signal; $('pulse-score-note').textContent = signal >= 85 ? 'Strong and steady' : signal >= 70 ? 'Good momentum' : 'Room to sharpen';
    $('pulse-latest').textContent = `Day ${latest.d}`; $('pulse-latest-note').textContent = latest.n; $('pulse-impact').textContent = `${totalImpact} pts`; $('pulse-impact-note').textContent = `${all.length} builds recorded`; $('pulse-avg').textContent = `${average.toFixed(1)} / 5`; $('pulse-avg-note').textContent = `last ${recent.length} builds`;
    $('pulse-bars').innerHTML = recent.map((build) => `<span class="pulse-bar" title="Day ${build.d}: ${build.n} · Impact ${build.i}/5"><span class="pulse-bar-fill" style="height:${build.i * 20}%"></span><span class="pulse-bar-label">${build.d}</span></span>`).join('');
    const max = Math.max(...Object.values(scores).map((item) => item.impact), 1);
    $('pulse-archetypes').innerHTML = ARCHETYPES.filter(([key]) => scores[key]?.count).map(([key, label, color]) => `<div class="pulse-lane"><span class="pulse-lane-name">${label}</span><span class="pulse-lane-track"><span class="pulse-lane-fill" style="width:${Math.max(5, scores[key].impact / max * 100)}%;--lane:${color}"></span></span><span class="pulse-lane-value">${scores[key].impact}</span></div>`).join('');
    $('pulse-next-axis').textContent = next.name; $('pulse-next-text').textContent = next.text; $('pulse-status').textContent = `${state.views} exploration${state.views === 1 ? '' : 's'}`;
    renderBrief(next, latest);
  }
  function open() { state.noteDismissed = false; $('pulse')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function refresh() { render(); }
  function saveBrief() { const input = $('pulse-brief-input'); if (!input) return; state.note = input.value.trim(); state.noteDismissed = false; save(); render(); }
  function dismissBrief() { state.noteDismissed = true; save(); render(); }
  function restoreBrief() { state.noteDismissed = false; save(); render(); }
  function toggleBrief() { state.noteDismissed ? restoreBrief() : dismissBrief(); }
  function clearBrief() { state.note = ''; state.noteDismissed = false; save(); render(); }
  function boot() {
    load(); render(); $('pulse-refresh')?.addEventListener('click', refresh); $('pulse-hero-btn')?.addEventListener('click', open);
    $('pulse-brief-save')?.addEventListener('click', saveBrief); $('pulse-brief-clear')?.addEventListener('click', clearBrief); $('pulse-brief-toggle')?.addEventListener('click', () => state.noteDismissed ? restoreBrief() : dismissBrief());
    document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.key.toLowerCase() === 'p' && event.shiftKey) open(); });
    window.ajhPulse = { open, refresh, saveBrief, clearBrief, restoreBrief, state: () => state };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
