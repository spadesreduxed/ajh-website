(function () {
  'use strict';

  const KEY = 'ajh_runway_v1';
  const STEPS = ['context', 'scope', 'verify'];
  const $ = (id) => document.getElementById(id);
  const state = { title: '', owner: 'AJH', context: '', brief: '', checks: {}, queue: [], views: 0, launched: 0 };

  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    if (!state.checks || typeof state.checks !== 'object') state.checks = {};
    if (!Array.isArray(state.queue)) state.queue = [];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function done() { return STEPS.filter((step) => state.checks[step]).length; }
  function summary() {
    const checks = STEPS.filter((step) => state.checks[step]);
    return `AJH Build Runway — ${state.title || 'Untitled next build'}\nOwner: ${state.owner || 'AJH'}\nContext: ${state.context || 'No context recorded.'}\n${state.brief || 'No first move recorded.'}\nChecks: ${checks.length}/3 (${checks.length ? checks.join(', ') : 'none'})`;
  }
  function renderQueue() {
    const list = $('runway-list');
    if (!list) return;
    list.innerHTML = state.queue.length ? state.queue.slice(0, 5).map((item) => `<div class="runway-item"><strong>${item.title}</strong><span>${item.date} · ${item.owner}</span><p>${item.brief || 'No first move recorded.'}</p></div>`).join('') : '<p class="runway-empty">No launches yet. Finish this runway and send the next build into the queue.</p>';
  }
  function render() {
    const count = done();
    $('runway-title').value = state.title || '';
    $('runway-owner').value = state.owner || 'AJH';
    $('runway-context').value = state.context || '';
    $('runway-brief').value = state.brief || '';
    document.querySelectorAll('[data-runway-step]').forEach((input) => { input.checked = Boolean(state.checks[input.dataset.runwayStep]); input.closest('.runway-lane')?.classList.toggle('is-complete', input.checked); });
    $('runway-progress').textContent = `${count}/3`;
    $('runway-progress-bar').style.width = `${count * 33.333}%`;
    $('runway-count').textContent = `${count} of 3 checks complete`;
    $('runway-launched').textContent = `${state.launched} launched`;
    $('runway-views').textContent = `${state.views} opened`;
    const ready = count === 3 && state.title.trim();
    $('runway-status').textContent = ready ? 'Ready for takeoff' : count ? 'Runway in progress' : 'Awaiting a next build';
    $('runway-message').textContent = ready ? 'The context is loaded, the scope is small, and the first move is verified.' : `${3 - count} check${3 - count === 1 ? '' : 's'} left before the next build has a reliable runway.`;
    $('runway-status-pill').textContent = ready ? 'Ready' : 'Local draft';
    $('runway-status-card').classList.toggle('is-complete', Boolean(ready));
    $('runway-status-card').classList.toggle('is-active', count > 0 && !ready);
    renderQueue();
  }
  function update(field, value) { state[field] = value; save(); render(); }
  function importRelay() {
    const data = window.ajhRelay?.state?.();
    const relay = data?.title?.trim() ? data : data?.queue?.[0];
    if (!relay) return;
    state.context = `Relay · ${relay.title || 'Build Relay'}`;
    state.brief = relay.brief || 'Choose the smallest useful first move from the relayed context.';
    state.checks.context = true;
    save(); render();
  }
  function importPulse() {
    const data = window.ajhPulse?.state?.();
    if (!data) return;
    state.context = 'Pulse signal · choose the lightest direction';
    state.brief = data.note || 'Use the Pulse recommendation to define one small, shippable slice.';
    state.checks.context = true;
    save(); render();
  }
  function reset() { state.title = ''; state.owner = 'AJH'; state.context = ''; state.brief = ''; state.checks = {}; save(); render(); }
  function copy() {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(summary()).then(() => { $('runway-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('runway-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy runway'; }, 1400); });
  }
  function exportJSON() {
    const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-runway-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function launch() {
    if (done() !== 3 || !state.title.trim()) { $('runway-message').textContent = 'Add a next-build title and complete all three checks before launch.'; $('runway-title').focus(); return; }
    const item = { title: state.title.trim(), owner: state.owner.trim() || 'AJH', context: state.context.trim(), brief: state.brief.trim(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    state.queue = [item, ...state.queue.filter((entry) => entry.title !== item.title)].slice(0, 5);
    state.launched += 1; state.checks = {}; state.title = ''; state.context = ''; state.brief = ''; save(); render();
    $('runway-status').textContent = 'Launched'; $('runway-message').textContent = 'The next build is in the local launch queue.';
  }
  function open() { $('runway')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function boot() {
    load();
    $('runway-title')?.addEventListener('input', (e) => update('title', e.target.value));
    $('runway-owner')?.addEventListener('input', (e) => update('owner', e.target.value));
    $('runway-context')?.addEventListener('input', (e) => update('context', e.target.value));
    $('runway-brief')?.addEventListener('input', (e) => update('brief', e.target.value));
    document.querySelectorAll('[data-runway-step]').forEach((input) => input.addEventListener('change', (e) => { state.checks[e.target.dataset.runwayStep] = e.target.checked; save(); render(); }));
    $('runway-import-relay')?.addEventListener('click', importRelay); $('runway-import-pulse')?.addEventListener('click', importPulse); $('runway-reset')?.addEventListener('click', reset); $('runway-copy')?.addEventListener('click', copy); $('runway-export')?.addEventListener('click', exportJSON); $('runway-launch')?.addEventListener('click', launch); $('runway-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'u' && e.shiftKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) open(); });
    window.ajhRunway = { open, importRelay, importPulse, copy, exportJSON, launch, reset, state: () => ({ ...state, checks: { ...state.checks }, queue: [...state.queue] }) };
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
