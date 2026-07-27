(function () {
  'use strict';

  const KEY = 'ajh_checkpoint_v1';
  const STEPS = ['intent', 'build', 'verify', 'record'];
  const $ = (id) => document.getElementById(id);
  const state = { title: '', note: '', checks: {}, views: 0 };

  function load() {
    try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
    if (!state.checks || typeof state.checks !== 'object') state.checks = {};
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function count() { return STEPS.filter((step) => state.checks[step]).length; }

  function render() {
    const completed = count();
    $('checkpoint-title').value = state.title || '';
    $('checkpoint-note').value = state.note || '';
    document.querySelectorAll('[data-checkpoint-step]').forEach((input) => {
      input.checked = Boolean(state.checks[input.dataset.checkpointStep]);
      input.closest('.checkpoint-check')?.classList.toggle('is-complete', input.checked);
    });
    $('checkpoint-progress').textContent = `${completed}/4`;
    $('checkpoint-progress-bar').style.width = `${completed * 25}%`;
    $('checkpoint-count').textContent = `${completed} of 4 checks complete`;
    $('checkpoint-views').textContent = `${state.views} opened`;
    const card = $('checkpoint-status-card');
    const status = completed === 4 ? 'Ready to hand off' : completed ? 'In motion' : 'Ready to start';
    const message = completed === 4 ? 'The slice has a complete trail. Export it or leave tomorrow a clean handoff.' : completed ? `${4 - completed} check${completed === 3 ? '' : 's'} left before this build is ready to hand off.` : 'Give the next build a name, then make the first check explicit.';
    $('checkpoint-status').textContent = status;
    $('checkpoint-message').textContent = message;
    card.classList.toggle('is-active', completed > 0 && completed < 4);
    card.classList.toggle('is-complete', completed === 4);
    card.classList.toggle('is-idle', completed === 0);
  }

  function update(field, value) {
    state[field] = value;
    save();
    render();
  }

  function loadBrief() {
    const input = $('pulse-brief-input');
    if (!input || !input.value.trim()) return;
    state.title = input.value.trim().split(/[.!?]/)[0].slice(0, 100);
    state.note = input.value.trim();
    save();
    render();
  }

  function summary() {
    const checked = STEPS.filter((step) => state.checks[step]);
    return `AJH Build Checkpoint — ${state.title || 'Untitled slice'}\n${state.note || 'No intent recorded.'}\nChecks: ${checked.length}/4 (${checked.length ? checked.join(', ') : 'none'})`;
  }

  function copy() {
    const text = summary();
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => { $('checkpoint-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('checkpoint-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy status'; }, 1400); });
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `ajh-build-checkpoint-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function open() {
    $('checkpoint')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.views += 1;
    save();
    render();
  }

  function boot() {
    load();
    $('checkpoint-title')?.addEventListener('input', (event) => update('title', event.target.value));
    $('checkpoint-note')?.addEventListener('input', (event) => update('note', event.target.value));
    document.querySelectorAll('[data-checkpoint-step]').forEach((input) => input.addEventListener('change', (event) => { state.checks[event.target.dataset.checkpointStep] = event.target.checked; save(); render(); }));
    $('checkpoint-load-brief')?.addEventListener('click', loadBrief);
    $('checkpoint-clear')?.addEventListener('click', () => { state.title = ''; state.note = ''; state.checks = {}; save(); render(); });
    $('checkpoint-copy')?.addEventListener('click', copy);
    $('checkpoint-export')?.addEventListener('click', exportJSON);
    $('checkpoint-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'k' && event.shiftKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) open(); });
    window.ajhCheckpoint = { open, copy, exportJSON, state: () => ({ ...state, checks: { ...state.checks } }) };
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
