(function () {
  'use strict';
  const KEY = 'ajh_handoff_v1';
  const steps = ['signal', 'move', 'proof', 'context'];
  const state = { title: '', owner: '', next: '', proof: '', context: '', checks: {}, history: [], views: 0 };
  const $ = (id) => document.getElementById(id);
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {} state.checks ||= {}; state.history ||= []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function update(field, value) { state[field] = value; save(); render(); }
  function sourceArchive() { return window.ajhArchive?.state?.() || {}; }
  function sourcePulse() { return window.ajhPulse?.state?.() || {}; }
  function importArchive() {
    const data = sourceArchive(); const latest = (data.records || []).at(-1);
    if (!latest) return;
    state.title = `Continue after Day ${latest.d}`; state.next = `Inspect the next smallest move after ${latest.n}.`; state.proof = `Recheck the archived signal for Day ${latest.d} and confirm the next change locally.`; state.context = `Latest archive record: Day ${latest.d} — ${latest.n}. Keep the next slice small and leave unrelated work out.`; state.checks.signal = true; save(); render();
  }
  function importPulse() {
    const data = sourcePulse();
    if (!data.note) return;
    state.next = data.note; state.checks.signal = true; save(); render();
  }
  function reset() { Object.assign(state, { title: '', owner: '', next: '', proof: '', context: '', checks: {} }); save(); render(); }
  function complete() { return steps.filter((step) => state.checks[step]).length; }
  function render() {
    const count = complete(); const pct = count / steps.length * 100; const remaining = steps.length - count;
    $('handoff-progress').textContent = `${count}/${steps.length}`; $('handoff-count').textContent = `${count} of ${steps.length} checks complete`; $('handoff-progress-bar').style.width = `${pct}%`; $('handoff-message').textContent = count === steps.length ? 'The next day has a portable starting point.' : `${remaining} check${remaining === 1 ? '' : 's'} left before tomorrow has a clean starting point.`; $('handoff-status').textContent = count === steps.length ? 'Ready to carry forward' : count ? 'Handoff taking shape' : 'Awaiting a handoff'; $('handoff-status-pill').textContent = count === steps.length ? 'Ready' : 'Local draft'; $('handoff-packaged').textContent = `${state.history.length} packaged`; $('handoff-views').textContent = `${state.views} opened`;
    [['title','title'],['owner','owner'],['next','next'],['proof','proof'],['context','context']].forEach(([field,id]) => { const el = $('handoff-' + id); if (el && document.activeElement !== el) el.value = state[field] || ''; });
    document.querySelectorAll('[data-handoff-step]').forEach((input) => { input.checked = !!state.checks[input.dataset.handoffStep]; });
    const list = $('handoff-history-list'); list.innerHTML = state.history.length ? state.history.slice().reverse().map((item) => `<div><strong>${escapeHTML(item.title || 'Untitled handoff')}</strong><br><span>${escapeHTML(item.next || 'No next move recorded')} · ${new Date(item.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>`).join('') : '<div>No packaged handoffs yet.</div>';
  }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char])); }
  function snapshot() { return { title: 'AJH Build Handoff', generatedAt: new Date().toISOString(), ...state, checks: { ...state.checks }, history: [...state.history] }; }
  function text() { return `AJH Build Handoff\n${state.title || 'Untitled handoff'} · ${state.owner || 'AJH'}\nNext move: ${state.next || 'Not defined'}\nProof: ${state.proof || 'Not defined'}\nContext: ${state.context || 'Not defined'}\nChecks: ${complete()}/${steps.length}`; }
  function copy() { navigator.clipboard?.writeText(text()); }
  function exportJSON() { const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-handoff-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function packageHandoff() { if (complete() < steps.length) return; state.history.push({ title: state.title, next: state.next, at: new Date().toISOString() }); if (state.history.length > 12) state.history = state.history.slice(-12); save(); render(); }
  function open() { $('handoff')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function boot() {
    load(); render();
    [['title','title'],['owner','owner'],['next','next'],['proof','proof'],['context','context']].forEach(([field,id]) => $('handoff-' + id)?.addEventListener('input', (e) => update(field, e.target.value)));
    document.querySelectorAll('[data-handoff-step]').forEach((input) => input.addEventListener('change', (e) => { state.checks[e.target.dataset.handoffStep] = e.target.checked; save(); render(); }));
    $('handoff-import-archive')?.addEventListener('click', importArchive); $('handoff-import-pulse')?.addEventListener('click', importPulse); $('handoff-reset')?.addEventListener('click', reset); $('handoff-copy')?.addEventListener('click', copy); $('handoff-export')?.addEventListener('click', exportJSON); $('handoff-package')?.addEventListener('click', packageHandoff); $('handoff-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'h') open(); });
    window.ajhHandoff = { open, importArchive, importPulse, packageHandoff, copy, exportJSON, state: () => snapshot() };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
