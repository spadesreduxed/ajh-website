(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const KEY = 'ajh_repair_v1';
  const state = { draft: {}, history: [], views: 0, repairs: 0 };
  const fields = ['title', 'owner', 'signal', 'repair', 'expected', 'notes'];
  const steps = ['signal', 'repair', 'expected'];
  function safe(fn, fallback) { try { return fn(); } catch (_) { return fallback; } }
  function load() { const saved = safe(() => JSON.parse(localStorage.getItem(KEY) || '{}'), {}); Object.assign(state, saved); state.draft ||= {}; state.history ||= []; state.views ||= 0; state.repairs ||= 0; }
  function save() { safe(() => localStorage.setItem(KEY, JSON.stringify(state)), null); }
  function getDraft() { fields.forEach((name) => { const el = $('repair-' + name); if (el) state.draft[name] = el.value; }); steps.forEach((name) => { const el = document.querySelector(`[data-repair-step="${name}"]`); if (el) state.draft['step_' + name] = el.checked; }); }
  function setDraft() { fields.forEach((name) => { const el = $('repair-' + name); if (el) el.value = state.draft[name] || ''; }); steps.forEach((name) => { const el = document.querySelector(`[data-repair-step="${name}"]`); if (el) el.checked = Boolean(state.draft['step_' + name]); }); }
  function renderHistory() { const box = $('repair-history-list'); if (!box) return; box.innerHTML = state.history.length ? state.history.slice(0, 6).map((item) => `<div class="repair-history-item"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.repair)}</span><span>${escapeHTML(item.date)}</span></div>`).join('') : '<span class="repair-card-label">No repairs recorded yet. Keep the first patch small.</span>'; }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function update() { getDraft(); const checked = steps.filter((name) => state.draft['step_' + name]).length; const pct = checked / steps.length * 100; $('repair-progress').textContent = `${checked}/${steps.length}`; $('repair-count').textContent = `${checked} of ${steps.length} checks complete`; $('repair-progress-bar').style.width = pct + '%'; $('repair-status').textContent = checked === steps.length ? 'Ready to verify' : checked ? 'Repair taking shape' : 'Choose one repair'; $('repair-message').textContent = checked === steps.length ? 'The next fix has a signal, a small patch, and a named check.' : `${steps.length - checked} checks left before this repair has a clean proof line.`; $('repair-status-pill').textContent = checked === steps.length ? 'Ready to record' : 'Local draft'; save(); }
  function draftText() { getDraft(); return [`AJH BUILD REPAIR`, state.draft.title || 'Untitled repair', `Owner: ${state.draft.owner || 'AJH'}`, `Signal: ${state.draft.signal || '—'}`, `Repair: ${state.draft.repair || '—'}`, `Expected: ${state.draft.expected || '—'}`, `Verification: ${state.draft.notes || '—'}`].join('\n'); }
  function copy() { const button = $('repair-copy'); const done = () => { button.innerHTML = '<i class="fas fa-check"></i> Copied repair'; setTimeout(() => { button.innerHTML = '<i class="fas fa-share-nodes"></i> Copy repair'; }, 1600); }; if (navigator.clipboard?.writeText) navigator.clipboard.writeText(draftText()).then(done).catch(() => fallbackCopy(done)); else fallbackCopy(done); }
  function fallbackCopy(done) { const area = document.createElement('textarea'); area.value = draftText(); area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); try { document.execCommand('copy'); done(); } catch (_) {} area.remove(); }
  function exportJSON() { getDraft(); const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...state.draft }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `ajh-repair-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500); }
  function record() { update(); if (steps.some((name) => !state.draft['step_' + name])) { $('repair-message').textContent = 'Finish the three checks before recording this repair.'; return; } const item = { title: state.draft.title || 'Untitled repair', repair: state.draft.repair || 'Small patch recorded', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }; state.history.unshift(item); state.history = state.history.slice(0, 12); state.repairs += 1; state.draft = {}; setDraft(); save(); renderHistory(); update(); $('repair-repairs').textContent = state.repairs; $('repair-status').textContent = 'Repair recorded'; $('repair-message').textContent = 'Good. The next build can inspect the recorded patch instead of reopening the whole problem.'; }
  function reset() { state.draft = {}; setDraft(); update(); }
  function importProof() {
    const proof = window.ajhProof?.state?.() || {};
    const latest = proof.history?.[0];
    const source = latest || proof;
    const title = source.title || 'The next verified repair';
    const signal = [source.behavior && `Behavior: ${source.behavior}`, source.quality && `Quality: ${source.quality}`, source.record && `Record: ${source.record}`].filter(Boolean).join(' · ');
    state.draft = {
      title: `Repair: ${title}`,
      owner: source.owner || 'AJH',
      signal: signal || 'No proof record is loaded yet. Run or record Build Proof, then import it here.',
      repair: source.record ? `Inspect the proof record: ${source.record}` : 'Choose the smallest patch that would make the proof stronger.',
      expected: source.behavior ? `The visitor can still confirm: ${source.behavior}` : 'Name the visible change that should be different after the patch.',
      notes: latest ? `Imported from Build Proof on ${latest.date || 'the latest pass'}. Keep this repair smaller than the problem.` : 'Imported from the current Build Proof draft. Record the proof before expanding scope.',
      step_signal: Boolean(signal),
      step_repair: false,
      step_expected: Boolean(source.behavior),
    };
    setDraft(); update(); $('repair-message').textContent = latest ? 'Proof imported. Turn its record into one small patch, then name the expected change.' : 'Proof draft imported. Finish the signal before choosing the patch.'; $('repair').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function boot() { if (!$('repair')) return; load(); state.views += 1; setDraft(); renderHistory(); fields.forEach((name) => $('repair-' + name)?.addEventListener('input', update)); steps.forEach((name) => document.querySelector(`[data-repair-step="${name}"]`)?.addEventListener('change', update)); $('repair-import-proof')?.addEventListener('click', importProof); $('repair-copy')?.addEventListener('click', copy); $('repair-export')?.addEventListener('click', exportJSON); $('repair-record')?.addEventListener('click', record); $('repair-reset')?.addEventListener('click', reset); $('repair-views').textContent = state.views; $('repair-repairs').textContent = state.repairs; $('repair-hero-btn')?.addEventListener('click', () => $('repair').scrollIntoView({ behavior: 'smooth' })); document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'x') $('repair')?.scrollIntoView({ behavior: 'smooth' }); }); window.ajhRepair = { open: () => $('repair')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), importProof, copy, exportJSON, record, state: () => ({ ...state, draft: { ...state.draft }, history: [...state.history] }) }; update(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
