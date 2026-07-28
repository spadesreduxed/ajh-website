(function () {
  'use strict';

  const KEY = 'ajh_dispatch_v1';
  const STEPS = ['slice', 'verify', 'handoff'];
  const $ = (id) => document.getElementById(id);
  const state = { title: '', owner: 'AJH', note: '', checks: {}, history: [], views: 0, dispatched: 0 };

  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    if (!state.checks || typeof state.checks !== 'object') state.checks = {};
    if (!Array.isArray(state.history)) state.history = [];
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function completed() { return STEPS.filter((step) => state.checks[step]).length; }

  function summary(record = false) {
    const checks = STEPS.filter((step) => state.checks[step]);
    return `AJH Build Dispatch — ${state.title || 'Untitled slice'}\nOwner: ${state.owner || 'AJH'}\n${state.note || 'No handoff note recorded.'}\nChecks: ${checks.length}/3 (${checks.length ? checks.join(', ') : 'none'})${record ? `\nDispatched: ${new Date().toLocaleString('en-US')}` : ''}`;
  }

  function renderHistory() {
    const list = $('dispatch-history-list');
    if (!list) return;
    list.innerHTML = state.history.length ? state.history.slice(0, 5).map((item) => `<div class="dispatch-history-item"><strong>${item.title}</strong><span>${item.date}</span><p>${item.note || 'No note recorded.'}</p></div>`).join('') : '<p class="dispatch-history-empty">No dispatches yet. Finish this one and it will appear here.</p>';
  }

  function render() {
    const done = completed();
    $('dispatch-title').value = state.title || '';
    $('dispatch-owner').value = state.owner || 'AJH';
    $('dispatch-note').value = state.note || '';
    document.querySelectorAll('[data-dispatch-step]').forEach((input) => {
      input.checked = Boolean(state.checks[input.dataset.dispatchStep]);
      input.closest('.dispatch-check')?.classList.toggle('is-complete', input.checked);
    });
    $('dispatch-progress').textContent = `${done}/3`;
    $('dispatch-progress-bar').style.width = `${done * 33.333}%`;
    $('dispatch-count').textContent = `${done} of 3 checks complete`;
    $('dispatch-dispatched').textContent = `${state.dispatched} sent`;
    $('dispatch-views').textContent = `${state.views} opened`;
    $('dispatch-status').textContent = done === 3 ? 'Ready to dispatch' : done ? 'Handoff in motion' : 'Assembling handoff';
    $('dispatch-message').textContent = done === 3 ? 'The record is complete. Dispatch it or keep refining the note.' : `${3 - done} check${done === 0 ? 's' : 's'} left before this slice is ready to dispatch.`;
    $('dispatch-status-pill').textContent = done === 3 ? 'Ready' : 'Local draft';
    $('dispatch-status-card').classList.toggle('is-complete', done === 3);
    $('dispatch-status-card').classList.toggle('is-active', done > 0 && done < 3);
    renderHistory();
  }

  function update(field, value) { state[field] = value; save(); render(); }

  function copy() {
    const text = summary();
    const finish = () => { $('dispatch-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('dispatch-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy dispatch'; }, 1400); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(finish).catch(() => {});
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-dispatch-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function dispatch() {
    if (completed() !== 3 || !state.title.trim()) {
      $('dispatch-message').textContent = 'Add a title and complete all three checks before dispatching.';
      $('dispatch-title').focus();
      return;
    }
    const item = { title: state.title.trim(), owner: state.owner.trim() || 'AJH', note: state.note.trim(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    state.history = [item, ...state.history.filter((entry) => entry.title !== item.title)].slice(0, 5);
    state.dispatched += 1; state.checks = {}; state.title = ''; state.note = ''; save(); render();
    $('dispatch-status').textContent = 'Dispatched'; $('dispatch-message').textContent = 'The handoff is recorded. Tomorrow starts with a clean slate.';
  }

  function open() { $('dispatch')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }

  function reset() { state.title = ''; state.owner = 'AJH'; state.note = ''; state.checks = {}; save(); render(); }

  function boot() {
    load();
    $('dispatch-title')?.addEventListener('input', (event) => update('title', event.target.value));
    $('dispatch-owner')?.addEventListener('input', (event) => update('owner', event.target.value));
    $('dispatch-note')?.addEventListener('input', (event) => update('note', event.target.value));
    document.querySelectorAll('[data-dispatch-step]').forEach((input) => input.addEventListener('change', (event) => { state.checks[event.target.dataset.dispatchStep] = event.target.checked; save(); render(); }));
    $('dispatch-copy')?.addEventListener('click', copy);
    $('dispatch-export')?.addEventListener('click', exportJSON);
    $('dispatch-send')?.addEventListener('click', dispatch);
    $('dispatch-reset')?.addEventListener('click', reset);
    $('dispatch-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'd' && event.shiftKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) open(); });
    window.ajhDispatch = { open, copy, exportJSON, dispatch, reset, state: () => ({ ...state, checks: { ...state.checks }, history: [...state.history] }) };
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
