(function () {
  'use strict';
  const KEY = 'ajh_proof_v1';
  const STEPS = ['scope', 'behavior', 'quality', 'record'];
  const $ = (id) => document.getElementById(id);
  const state = { title: '', owner: 'AJH', scope: '', behavior: '', quality: '', record: '', checks: {}, audit: null, history: [], views: 0, runs: 0 };
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {} state.checks ||= {}; state.history ||= []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char])); }
  function complete() { return STEPS.filter((step) => state.checks[step]).length; }
  function sourceIntake() { return window.ajhIntake?.state?.() || {}; }
  function sourceLighthouse() { return window.ajhLighthouse?.state?.() || {}; }
  function importIntake() {
    const data = sourceIntake(); const item = data.history?.[0];
    if (item) { state.title = `Proof: ${item.title}`; state.owner = item.owner || 'AJH'; state.scope = item.slice || 'Imported from the latest started slice.'; state.behavior = item.proof || 'Show the changed behavior in a local preview.'; state.record = `Started from Intake on ${item.date}. Return with a concrete observation and the next repair.`; }
    else { state.title = 'Proof of the next slice'; state.scope = 'Import a completed Intake or define the smallest result to verify.'; state.behavior = 'Name the visible behavior a visitor should be able to confirm.'; state.record = 'Keep the result local until it is checked, then export or copy the record.'; }
    state.checks.scope = Boolean(state.scope); state.checks.behavior = Boolean(state.behavior); state.checks.record = Boolean(state.record); save(); render(); open();
  }
  function importLighthouse() {
    const data = sourceLighthouse();
    if (!data.report?.length) return;
    const passed = data.report.filter((item) => item.passed).length; const warnings = data.report.length - passed;
    state.audit = { score: data.score, passed, warnings, ranAt: data.ranAt || new Date().toISOString() }; state.quality = `Build Lighthouse score ${data.score}/100 · ${passed} checks passed · ${warnings} warnings`; state.checks.quality = true; state.record = state.record || 'Inspect the remaining warnings before the next build expands scope.'; state.checks.record = Boolean(state.record); save(); render();
  }
  function runAudit() { if (window.ajhLighthouse?.run) { window.ajhLighthouse.run(); setTimeout(importLighthouse, 120); } }
  function reset() { Object.assign(state, { title: '', owner: 'AJH', scope: '', behavior: '', quality: '', record: '', checks: {}, audit: null }); save(); render(); }
  function renderAudit() {
    const target = $('proof-audit'); if (!target) return;
    if (!state.audit) { target.innerHTML = '<div class="proof-audit-empty">No Lighthouse result loaded. Run the local audit to add a quality signal.</div>'; return; }
    const healthy = state.audit.warnings === 0;
    target.innerHTML = `<div class="proof-audit-row ${healthy ? 'is-pass' : ''}"><i class="fas ${healthy ? 'fa-check' : 'fa-triangle-exclamation'}"></i><strong>${state.audit.score}/100</strong><span>${state.audit.passed} passed · ${state.audit.warnings} warnings · ${new Date(state.audit.ranAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></div>`;
  }
  function renderHistory() { const list = $('proof-history-list'); if (!list) return; list.innerHTML = state.history.length ? state.history.slice(0, 8).map((item) => `<div class="proof-history-item"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.owner)} · ${escapeHTML(item.date)} · ${item.score ?? '—'}/100</span><p>${escapeHTML(item.behavior || item.record || 'Proof recorded.')}</p></div>`).join('') : '<p class="proof-empty">No proof records yet. Complete the checks and record one concrete result.</p>'; }
  function render() {
    [['title','title'],['owner','owner'],['scope','scope'],['behavior','behavior'],['quality','quality'],['record','record']].forEach(([field,id]) => { const el = $('proof-' + id); if (el && document.activeElement !== el) el.value = state[field] || ''; });
    document.querySelectorAll('[data-proof-step]').forEach((input) => { input.checked = Boolean(state.checks[input.dataset.proofStep]); input.closest('.proof-check')?.classList.toggle('is-complete', input.checked); });
    const count = complete(); const ready = count === STEPS.length && state.title.trim();
    $('proof-progress').textContent = `${count}/${STEPS.length}`; $('proof-progress-bar').style.width = `${count * 25}%`; $('proof-count').textContent = `${count} of ${STEPS.length} checks complete`; $('proof-runs').textContent = `${state.runs} audits`; $('proof-views').textContent = `${state.views} opened`; $('proof-status').textContent = ready ? 'Ready to record' : count ? 'Evidence taking shape' : 'Awaiting evidence'; $('proof-message').textContent = ready ? 'The result has a compact, inspectable trail.' : `${STEPS.length - count} check${STEPS.length - count === 1 ? '' : 's'} left before this slice has a complete proof trail.`; $('proof-status-pill').textContent = ready ? 'Ready' : 'Local draft'; $('proof-status-card').classList.toggle('is-complete', Boolean(ready)); renderAudit(); renderHistory();
  }
  function update(field, value) { state[field] = value; save(); render(); }
  function summary() { return `AJH Build Proof — ${state.title || 'Untitled proof'}\nOwner: ${state.owner || 'AJH'}\nScope: ${state.scope || 'Not recorded'}\nBehavior: ${state.behavior || 'Not recorded'}\nQuality: ${state.quality || 'Not recorded'}\nRecord: ${state.record || 'Not recorded'}\nChecks: ${complete()}/${STEPS.length}`; }
  function copy() { navigator.clipboard?.writeText(summary()).then(() => { $('proof-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('proof-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy proof'; }, 1400); }); }
  function exportJSON() { const url = URL.createObjectURL(new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-proof-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function record() { if (complete() !== STEPS.length || !state.title.trim()) { $('proof-message').textContent = 'Add a proof title and complete all four checks before recording.'; $('proof-title').focus(); return; } const item = { title: state.title.trim(), owner: state.owner.trim() || 'AJH', scope: state.scope.trim(), behavior: state.behavior.trim(), quality: state.quality.trim(), record: state.record.trim(), score: state.audit?.score ?? null, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }; state.history = [item, ...state.history.filter((entry) => entry.title !== item.title)].slice(0, 8); state.audit = null; state.runs += 1; state.checks = {}; state.title = ''; state.scope = ''; state.behavior = ''; state.quality = ''; state.record = ''; save(); render(); $('proof-status').textContent = 'Proof recorded'; $('proof-message').textContent = 'The result is logged locally. Keep the exported record with the shipped change.'; }
  function open() { $('proof')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function boot() { load(); [['title','title'],['owner','owner'],['scope','scope'],['behavior','behavior'],['quality','quality'],['record','record']].forEach(([field,id]) => $('proof-' + id)?.addEventListener('input', (event) => update(field, event.target.value))); document.querySelectorAll('[data-proof-step]').forEach((input) => input.addEventListener('change', (event) => { state.checks[event.target.dataset.proofStep] = event.target.checked; save(); render(); })); $('proof-import-intake')?.addEventListener('click', importIntake); $('proof-import-lighthouse')?.addEventListener('click', importLighthouse); $('proof-audit-run')?.addEventListener('click', runAudit); $('proof-reset')?.addEventListener('click', reset); $('proof-copy')?.addEventListener('click', copy); $('proof-export')?.addEventListener('click', exportJSON); $('proof-record')?.addEventListener('click', record); $('proof-hero-btn')?.addEventListener('click', open); document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'v') open(); }); window.ajhProof = { open, importIntake, importLighthouse, runAudit, record, copy, exportJSON, state: () => ({ ...state, checks: { ...state.checks }, history: [...state.history] }) }; render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
