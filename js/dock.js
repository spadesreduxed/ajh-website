(function () {
  'use strict';
  const KEY = 'ajh_dock_v1';
  const $ = (id) => document.getElementById(id);
  const state = { note: '', views: 0, syncs: 0, lastSync: '', history: [] };
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {} if (!Array.isArray(state.history)) state.history = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function sourceData() {
    const pulse = window.ajhPulse?.state?.() || {};
    const landing = window.ajhLanding?.state?.() || {};
    const lighthouse = window.ajhLighthouse?.state?.() || {};
    const flight = window.ajhFlight?.state?.() || {};
    return { pulse, landing, lighthouse, flight };
  }
  function sources() {
    const { pulse, landing, lighthouse, flight } = sourceData();
    const latestScore = Number.isFinite(lighthouse.score) && lighthouse.report?.length ? `${lighthouse.score}/100 quality` : 'Run the quality audit';
    const landingReady = landing.landed > 0 || landing.history?.length;
    const flightReady = flight.queue?.length || flight.title?.trim();
    return [
      { id: 'pulse', ready: Boolean(pulse.note || pulse.views || pulse.score), text: pulse.note || 'Signal calculated from the build history', label: pulse.note ? 'Brief ready' : pulse.views ? 'Signal ready' : 'Waiting' },
      { id: 'landing', ready: Boolean(landingReady), text: landingReady ? `${landing.landed || landing.history?.length || 0} arrival record(s) available` : 'No arrival record yet', label: landingReady ? 'Arrived' : 'Waiting' },
      { id: 'lighthouse', ready: Boolean(lighthouse.report?.length), text: latestScore, label: lighthouse.report?.length ? 'Audited' : 'Waiting' },
      { id: 'flight', ready: Boolean(flightReady), text: flightReady ? `${flight.queue?.length || 0} filed route(s) available` : 'No filed route yet', label: flightReady ? 'Filed' : 'Waiting' },
    ];
  }
  function summary() {
    const rows = sources();
    return `AJH Build Dock · Day 99\n${rows.map((row) => `${row.label} · ${row.id}: ${row.text}`).join('\n')}\nOperator note: ${state.note || 'No note recorded.'}\nSignals ready: ${rows.filter((row) => row.ready).length}/4`;
  }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function renderHistory() {
    const list = $('dock-history-list');
    if (!list) return;
    list.innerHTML = state.history.length ? state.history.slice(0, 6).map((item) => `<div class="dock-history-item"><strong>${escapeHTML(item.ready)}/4 signals · ${escapeHTML(item.date)}</strong><span>${escapeHTML(item.note || 'No operator note recorded.')}</span></div>`).join('') : '<p class="dock-history-empty">No snapshots yet. Sync the current signal when the dock is useful.</p>';
    $('dock-history-summary').textContent = state.history.length ? `${state.history.length} local snapshot${state.history.length === 1 ? '' : 's'} · latest had ${state.history[0].ready}/4 signals ready` : 'Sync snapshots stay in this browser until you export or copy them.';
  }
  function render() {
    const rows = sources();
    const ready = rows.filter((row) => row.ready).length;
    rows.forEach((row) => { const lane = $(`dock-lane-${row.id}`); if (!lane) return; lane.classList.toggle('is-ready', row.ready); lane.querySelector('[data-dock-text]').textContent = row.text; const status = lane.querySelector('[data-dock-status]'); status.textContent = row.label; status.classList.toggle('is-ready', row.ready); });
    if ($('dock-note') && document.activeElement !== $('dock-note')) $('dock-note').value = state.note || '';
    $('dock-ready').textContent = `${ready}/4`; $('dock-syncs').textContent = `${state.syncs} synced`; $('dock-views').textContent = `${state.views} opened`;
    $('dock-status').textContent = ready === 4 ? 'Dock aligned' : ready ? 'Signals coming in' : 'Awaiting signals';
    $('dock-message').textContent = ready === 4 ? 'The latest pipeline context is together. Leave the operator note, then carry the snapshot forward.' : `${4 - ready} source${4 - ready === 1 ? '' : 's'} still need useful context before the dock is fully aligned.`;
    $('dock-status-pill').textContent = ready === 4 ? 'Aligned' : 'Local view'; $('dock-status-card').classList.toggle('is-complete', ready === 4); $('dock-status-card').classList.toggle('is-active', ready > 0 && ready < 4);
    $('dock-last-sync').textContent = state.lastSync ? `Last sync · ${state.lastSync}` : 'No sync recorded yet'; $('dock-next-copy').textContent = ready === 4 ? 'Carry this snapshot into tomorrow, then choose the smallest move that keeps the signal honest.' : 'Sync once the source surfaces have useful context, then carry this snapshot into tomorrow.';
    renderHistory();
  }
  function sync() { const ready = sources().filter((row) => row.ready).length; state.syncs += 1; state.lastSync = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); state.history = [{ ready, note: state.note.trim(), date: state.lastSync }, ...state.history].slice(0, 6); save(); render(); }
  function copy() { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(summary()).then(() => { $('dock-copy').innerHTML = '<i class="fas fa-check"></i> Copied'; setTimeout(() => { $('dock-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy dock'; }, 1400); }); }
  function exportJSON() { const blob = new Blob([JSON.stringify({ ...state, sources: sources(), exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-dock-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function open() { $('dock')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function boot() { load(); $('dock-note')?.addEventListener('input', (event) => { state.note = event.target.value; save(); }); $('dock-sync')?.addEventListener('click', sync); $('dock-hero-action')?.addEventListener('click', sync); $('dock-copy')?.addEventListener('click', copy); $('dock-export')?.addEventListener('click', exportJSON); $('dock-hero-btn')?.addEventListener('click', open); document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'o') open(); }); window.ajhDock = { open, sync, copy, exportJSON, state: () => ({ ...state, sources: sources() }) }; render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();