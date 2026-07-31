(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const KEY = 'ajh_flight_v1';
  const QUEUE_KEY = 'ajh_flight_queue_v1';
  const VIEW_KEY = 'ajh_flight_views_v1';
  const defaults = { title: '', owner: 'AJH', mission: '', next: '', steps: { brief: false, scope: false, verify: false } };
  let state = load(KEY, defaults);
  let queue = load(QUEUE_KEY, []);
  let views = Number(localStorage.getItem(VIEW_KEY) || 0);

  function load(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed : [];
      return { ...fallback, ...(parsed || {}), steps: { ...fallback.steps, ...((parsed || {}).steps || {}) } };
    } catch (_) {
      return Array.isArray(fallback) ? [] : { ...fallback, steps: { ...fallback.steps } };
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(0, 8)));
      localStorage.setItem(VIEW_KEY, String(views));
    } catch (_) {}
  }
  function open() {
    $('flight')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    views += 1;
    save();
    render();
  }
  function importRunway() {
    const runway = window.ajhRunway?.state?.();
    const item = runway?.title?.trim() ? runway : runway?.queue?.[0];
    if (!item) return;
    state = {
      title: item.title || '',
      owner: item.owner || 'AJH',
      mission: item.context || item.brief || 'Build Runway',
      next: item.brief || '',
      steps: { brief: Boolean(item.title), scope: Boolean(item.brief), verify: Boolean(item.checks?.verify || item.steps?.verify) }
    };
    save();
    render();
    open();
  }
  function importPulse() {
    const pulse = window.ajhPulse?.state?.();
    if (!pulse) return;
    state.mission = pulse.note || 'Use the Build Pulse recommendation as the destination.';
    state.steps.brief = true;
    save();
    render();
    open();
  }
  function status() {
    const count = Object.values(state.steps).filter(Boolean).length;
    if (count === 3) return ['Flight filed', 'All preflight checks are complete. This build has a clear destination and arrival check.', 'is-complete'];
    if (count > 0) return ['Preflight in progress', `${3 - count} check${count === 2 ? '' : 's'} left before this build is ready to file.`, 'is-active'];
    return ['Awaiting a destination', 'Name the mission, define the smallest route, and confirm the arrival check before filing.', ''];
  }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function renderLog() {
    const el = $('flight-log-list');
    if (!el) return;
    el.innerHTML = queue.length ? queue.map((item) => `<div class="flight-log-item"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.owner)} · ${escapeHTML(item.filed)}</span><p>${escapeHTML(item.mission || item.next || 'Destination filed for the next daily build.')}</p></div>`).join('') : '<p class="flight-empty">No flight plans filed yet. Complete preflight and file the next build.</p>';
  }
  function render() {
    [['title', 'title'], ['owner', 'owner'], ['mission', 'mission'], ['next', 'next']].forEach(([key, id]) => {
      const el = $('flight-' + id);
      if (el && document.activeElement !== el) el.value = state[key] || '';
    });
    document.querySelectorAll('[data-flight-step]').forEach((input) => {
      input.checked = Boolean(state.steps[input.dataset.flightStep]);
      input.closest('.flight-check')?.classList.toggle('is-complete', input.checked);
    });
    const [title, message, className] = status();
    const count = Object.values(state.steps).filter(Boolean).length;
    $('flight-status').textContent = title;
    $('flight-message').textContent = message;
    $('flight-status-card').className = `flight-card flight-status-card ${className}`;
    $('flight-progress').textContent = `${count}/3`;
    $('flight-progress-bar').style.width = `${count / 3 * 100}%`;
    $('flight-count').textContent = `${count} of 3 checks complete`;
    $('flight-launched').textContent = `${queue.length} filed`;
    $('flight-views').textContent = `${views} opened`;
    renderLog();
  }
  function filePlan() {
    const count = Object.values(state.steps).filter(Boolean).length;
    if (!state.title.trim() || !state.mission.trim() || !state.next.trim() || count < 3) {
      $('flight-title')?.focus();
      return;
    }
    queue.unshift({ ...state, filed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    queue = queue.slice(0, 8);
    save();
    render();
  }
  function copy() {
    const text = `AJH Build Flight Plan\n${state.title || 'Untitled build'}\nOwner: ${state.owner || 'AJH'}\nDestination: ${state.mission || 'Not recorded'}\nRoute / arrival check: ${state.next || 'Not recorded'}\nPreflight: ${Object.values(state.steps).filter(Boolean).length}/3`;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => {
      $('flight-copy').innerHTML = '<i class="fas fa-check"></i> Copied';
      setTimeout(() => { $('flight-copy').innerHTML = '<i class="fas fa-share-nodes"></i> Copy flight plan'; }, 1400);
    });
  }
  function exportJSON() {
    const blob = new Blob([JSON.stringify({ state, queue, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ajh-build-flight-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function reset() {
    state = { ...defaults, steps: { ...defaults.steps } };
    save();
    render();
  }
  function boot() {
    [['title', 'title'], ['owner', 'owner'], ['mission', 'mission'], ['next', 'next']].forEach(([key, id]) => $("flight-" + id)?.addEventListener('input', (event) => { state[key] = event.target.value; save(); render(); }));
    document.querySelectorAll('[data-flight-step]').forEach((input) => input.addEventListener('change', (event) => { state.steps[event.target.dataset.flightStep] = event.target.checked; save(); render(); }));
    $('flight-import-runway')?.addEventListener('click', importRunway);
    $('flight-import-pulse')?.addEventListener('click', importPulse);
    $('flight-reset')?.addEventListener('click', reset);
    $('flight-copy')?.addEventListener('click', copy);
    $('flight-export')?.addEventListener('click', exportJSON);
    $('flight-launch')?.addEventListener('click', filePlan);
    $('flight-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'f') open(); });
    window.ajhFlight = { open, importRunway, importPulse, launch: filePlan, exportJSON, state: () => ({ ...state, steps: { ...state.steps }, queue: [...queue] }) };
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
