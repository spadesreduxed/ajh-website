(function () {
  'use strict';
  const KEY = 'ajh_landing_v1';
  const STEPS = ['signal', 'scope', 'handoff'];
  const $ = (id) => document.getElementById(id);
  const state = { title: '', owner: 'AJH', signal: '', scope: '', handoff: '', checks: {}, history: [], views: 0, landed: 0 };
  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    if (!state.checks || typeof state.checks !== 'object') state.checks = {};
    if (!Array.isArray(state.history)) state.history = [];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function completed() { return STEPS.filter((step) => state.checks[step]).length; }
  function summary() {
    return `AJH Build Landing — ${state.title || 'Untitled arrival'}\nOwner: ${state.owner || 'AJH'}\nSignal: ${state.signal || 'Not recorded'}\nScope: ${state.scope || 'Not recorded'}\nHandoff: ${state.handoff || 'Not recorded'}\nChecks: ${completed()}/3`;
  }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function renderHistory() {
    const list = $('landing-history-list');
    if (!list) return;
    list.innerHTML = state.history.length ? state.history.slice(0, 8).map((item) => `<div class="landing-history-item"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.owner)} · ${escapeHTML(item.date)}</span><p>${escapeHTML(item.handoff || item.scope || 'Arrival recorded.')}</p></div>`).join('') : '<p class="landing-empty">No arrivals logged yet. Complete the landing checks and record the next handoff.</p>';
  }
  function render() {
    [['title', 'title'], ['owner', 'owner'], ['signal', 'signal'], ['scope', 'scope'], ['handoff', 'handoff']].forEach(([field, id]) => { const el = $('landing-' + id); if (el && document.activeElement !== el) el.value = state[field] || ''; });
    document.querySelectorAll('[data-landing-step]').forEach((input) => { input.checked = Boolean(state.checks[input.dataset.landingStep]); input.closest('.landing-check')?.classList.toggle('is-complete', input.checked); });
    const count = completed();
    const ready = count === 3 && state.title.trim();
    $('landing-progress').textContent = `${count}/3`;
    $('landing-progress-bar').style.width = `${count * 33.333}%`;
    $('landing-count').textContent = `${count} of 3 checks complete`;
    $('landing-landed').textContent = `${state.landed} landed`;
    $('landing-views').textContent = `${state.views} opened`;
    $('landing-status').textContent = ready ? 'Arrival confirmed' : count ? 'Landing in progress' : 'Waiting for arrival';
    $('landing-message').textContent = ready ? 'The build has a readable result, a small handoff, and a clear next place to go.' : `${3 - count} check${3 - count === 1 ? '' : 's'} left before this build can land cleanly.`;
    $('landing-status-pill').textContent = ready ? 'Ready' : 'Local draft';
    $('landing-status-card').classList.toggle('is-complete', Boolean(ready));
    $('landing-status-card').classList.toggle('is-active', count > 0 && !ready);
    renderHistory();
  }
  function update(field, value) { state[field] = value; save(); render(); }
  function importFlight() {
    const data = window.ajhFlight?.state?.();
    const plan = data?.title?.trim() ? data : data?.queue?.[0];
    if (!plan) return;
    state.title = plan.title || '';
    state.owner = plan.owner || 'AJH';
    state.signal = plan.mission || 'Imported from Build Flight Plan';
    state.scope = plan.next || '';
    state.handoff = 'Verify the filed arrival, then record what the next build should inherit.';
    state.checks = { signal: Boolean(state.signal), scope: Boolean(state.scope), handoff: Boolean(state.handoff) };
    save(); render(); open();
  }
  function importLighthouse() {
    const data = window.ajhLighthouse?.state?.();
    if (!data) return;
    state.signal = `Lighthouse score ${data.score ?? 'ready'} · use the latest quality signal`;
    state.checks.signal = true;
    save(); render(); open();
  }
  function reset() { state.title = ''; state.owner = 'AJH'; state.signal = ''; state.scope = ''; state.handoff = ''; state.checks = {}; save(); render(); }
  function land() {
    if (completed() !== 3 || !state.title.trim()) { $('landing-message').textContent = 'Add an arrival title and complete all three checks before landing.'; $('landing-title').focus(); return; }
    const item = { title: state.title.trim(), owner: state.owner.trim() || 'AJH', signal: state.signal.trim(), scope: state.scope.trim(), handoff: state.handoff.trim(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    state.history = [item, ...state.history.filter((entry) => entry.title !== item.title)].slice(0, 8);
    state.landed += 1; state.checks = {}; state.title = ''; state.signal = ''; state.scope = ''; state.handoff = ''; save(); render();
    $('landing-status').textContent = 'Landed'; $('landing-message').textContent = 'The arrival is logged locally. Tomorrow has a clean handoff.';
  }
  function copy() { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(summary()).then(() => { $('landing-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('landing-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy landing'; }, 1400); }); }
  function exportJSON() { const url = URL.createObjectURL(new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-landing-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function open() { $('landing')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function boot() {
    load();
    [['title', 'title'], ['owner', 'owner'], ['signal', 'signal'], ['scope', 'scope'], ['handoff', 'handoff']].forEach(([field, id]) => $('landing-' + id)?.addEventListener('input', (event) => update(field, event.target.value)));
    document.querySelectorAll('[data-landing-step]').forEach((input) => input.addEventListener('change', (event) => { state.checks[event.target.dataset.landingStep] = event.target.checked; save(); render(); }));
    $('landing-import-flight')?.addEventListener('click', importFlight); $('landing-import-lighthouse')?.addEventListener('click', importLighthouse); $('landing-reset')?.addEventListener('click', reset); $('landing-copy')?.addEventListener('click', copy); $('landing-export')?.addEventListener('click', exportJSON); $('landing-land')?.addEventListener('click', land); $('landing-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'l') open(); });
    window.ajhLanding = { open, importFlight, importLighthouse, land, copy, exportJSON, state: () => ({ ...state, checks: { ...state.checks }, history: [...state.history] }) };
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();