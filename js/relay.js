(function () {
  'use strict';

  const KEY = 'ajh_relay_v1';
  const STEPS = ['context', 'scope', 'next'];
  const $ = (id) => document.getElementById(id);
  const state = { title: '', owner: 'AJH', source: '', brief: '', checks: {}, queue: [], views: 0, sent: 0 };

  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    if (!state.checks || typeof state.checks !== 'object') state.checks = {};
    if (!Array.isArray(state.queue)) state.queue = [];
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function completed() { return STEPS.filter((step) => state.checks[step]).length; }
  function summary(record = false) {
    const checks = STEPS.filter((step) => state.checks[step]);
    return `AJH Build Relay — ${state.title || 'Untitled next slice'}\nOwner: ${state.owner || 'AJH'}\nStarting from: ${state.source || 'No source recorded.'}\n${state.brief || 'No first move recorded.'}\nChecks: ${checks.length}/3 (${checks.length ? checks.join(', ') : 'none'})${record ? `\nSent: ${new Date().toLocaleString('en-US')}` : ''}`;
  }
  function renderQueue() {
    const list = $('relay-queue-list');
    if (!list) return;
    list.innerHTML = state.queue.length ? state.queue.slice(0, 5).map((item) => `<div class="relay-queue-item"><strong>${item.title}</strong><span>${item.date} · ${item.owner}</span><p>${item.brief || 'No first move recorded.'}</p></div>`).join('') : '<p class="relay-queue-empty">No relays yet. Send this one forward and tomorrow will have a starting point.</p>';
  }
  function render() {
    const done = completed();
    $('relay-title').value = state.title || '';
    $('relay-owner').value = state.owner || 'AJH';
    $('relay-source').value = state.source || '';
    $('relay-brief').value = state.brief || '';
    document.querySelectorAll('[data-relay-step]').forEach((input) => { input.checked = Boolean(state.checks[input.dataset.relayStep]); input.closest('.relay-check')?.classList.toggle('is-complete', input.checked); });
    $('relay-progress').textContent = `${done}/3`;
    $('relay-progress-bar').style.width = `${done * 33.333}%`;
    $('relay-count').textContent = `${done} of 3 checks complete`;
    $('relay-sent').textContent = `${state.sent} started`;
    $('relay-views').textContent = `${state.views} opened`;
    const ready = done === 3 && state.title.trim();
    $('relay-status').textContent = ready ? 'Ready to start' : done ? 'Relay in motion' : 'Waiting for handoff';
    $('relay-message').textContent = ready ? 'The next slice has context, a small scope, and a clear first move.' : `${3 - done} check${3 - done === 1 ? '' : 's'} left before the next build has a usable starting point.`;
    $('relay-status-pill').textContent = ready ? 'Ready' : 'Local draft';
    $('relay-status-card').classList.toggle('is-complete', Boolean(ready));
    $('relay-status-card').classList.toggle('is-active', done > 0 && !ready);
    renderQueue();
  }
  function update(field, value) { state[field] = value; save(); render(); }
  function importDispatch() {
    const data = window.ajhDispatch?.state?.();
    const handoff = data?.title?.trim() ? data : data?.history?.[0];
    if (!handoff) return;
    state.source = `Dispatch · ${handoff.title || 'Build Dispatch'}`;
    state.brief = handoff.note || 'Review the dispatched slice, then choose the smallest useful continuation.';
    state.checks.context = true;
    save(); render();
  }
  function importCheckpoint() {
    const data = window.ajhCheckpoint?.state?.();
    if (!data) return;
    state.source = `Checkpoint · ${data.title || 'Untitled slice'}`;
    state.brief = data.note || 'Carry the checkpoint intent into one small next move.';
    state.checks.context = true;
    save(); render();
  }
  function copy() {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(summary()).then(() => { $('relay-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('relay-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy relay'; }, 1400); });
  }
  function exportJSON() {
    const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-relay-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function send() {
    if (completed() !== 3 || !state.title.trim()) { $('relay-message').textContent = 'Add a next-slice title and complete all three checks before sending it forward.'; $('relay-title').focus(); return; }
    const item = { title: state.title.trim(), owner: state.owner.trim() || 'AJH', source: state.source.trim(), brief: state.brief.trim(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    state.queue = [item, ...state.queue.filter((entry) => entry.title !== item.title)].slice(0, 5);
    state.sent += 1; state.checks = {}; state.title = ''; state.source = ''; state.brief = ''; save(); render(); $('relay-status').textContent = 'Sent forward'; $('relay-message').textContent = 'Tomorrow has a starting point. The relay is recorded locally.';
  }
  function open() { $('relay')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function reset() { state.title = ''; state.owner = 'AJH'; state.source = ''; state.brief = ''; state.checks = {}; save(); render(); }
  function boot() {
    load();
    $('relay-title')?.addEventListener('input', (event) => update('title', event.target.value));
    $('relay-owner')?.addEventListener('input', (event) => update('owner', event.target.value));
    $('relay-source')?.addEventListener('input', (event) => update('source', event.target.value));
    $('relay-brief')?.addEventListener('input', (event) => update('brief', event.target.value));
    document.querySelectorAll('[data-relay-step]').forEach((input) => input.addEventListener('change', (event) => { state.checks[event.target.dataset.relayStep] = event.target.checked; save(); render(); }));
    $('relay-import-dispatch')?.addEventListener('click', importDispatch); $('relay-import-checkpoint')?.addEventListener('click', importCheckpoint); $('relay-reset')?.addEventListener('click', reset); $('relay-copy')?.addEventListener('click', copy); $('relay-export')?.addEventListener('click', exportJSON); $('relay-send')?.addEventListener('click', send); $('relay-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'r' && event.shiftKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) open(); });
    window.ajhRelay = { open, importDispatch, importCheckpoint, copy, exportJSON, send, reset, state: () => ({ ...state, checks: { ...state.checks }, queue: [...state.queue] }) };
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
