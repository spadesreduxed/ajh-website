(function () {
  'use strict';
  const KEY = 'ajh_archive_v1';
  const FILTERS = ['all', 'build', 'systems', 'evidence', 'quality', 'handoff', 'plan'];
  const state = { filter: 'all', query: '', views: 0, refreshed: 0, fullHistory: false };
  const $ = (id) => document.getElementById(id);
  const dates = { 102: 'Aug 5, 2026', 101: 'Aug 4, 2026', 100: 'Aug 3, 2026', 99: 'Aug 2, 2026', 98: 'Aug 1, 2026', 97: 'Jul 31, 2026', 96: 'Jul 30, 2026', 95: 'Jul 29, 2026', 94: 'Jul 28, 2026', 93: 'Jul 27, 2026', 92: 'Jul 26, 2026' };
  const descriptions = {
    systems: 'A systems slice that keeps the daily build pipeline legible and ready to continue.',
    quality: 'A quality signal for checking what is true before the next build moves.',
    evidence: 'A portable record that makes the shipped work easier to trust and inspect.',
    handoff: 'A clear starting point for carrying context into the next daily build.',
    plan: 'A small destination and route for turning momentum into the next shippable slice.'
  };
  const tagMap = {
    'Build Lighthouse': ['quality'],
    'Lighthouse History': ['quality', 'evidence'],
    'Build Passport': ['evidence', 'handoff'],
    'Build Dock': ['systems', 'evidence'],
    'Build Landing': ['handoff', 'evidence'],
    'Build Flight Plan': ['plan', 'handoff'],
    'Build Runway': ['plan', 'handoff'],
    'Build Relay': ['handoff'],
    'Build Dispatch': ['handoff', 'evidence'],
    'Build Checkpoint': ['quality', 'evidence'],
    'Build Pulse': ['systems', 'plan'],
    'Next-Build Brief': ['plan'],
    'Build Ledger': ['systems', 'evidence'],
    'Release Notes': ['evidence'],
    'Release Archive': ['evidence'],
    'Build Archive': ['systems', 'evidence', 'handoff']
  };
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {} if (!FILTERS.includes(state.filter)) state.filter = 'all'; state.fullHistory = state.fullHistory === true; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} }
  function date(day) { return dates[day] || new Date(2026, 3, 21 + day + 4).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function tags(build) { return tagMap[build.n] || [build.a]; }
  function source() { return (window.ajhCompass?.builds?.() || []).map((build) => ({ ...build, date: date(build.d), tags: tags(build) })); }
  function signalCount(name) {
    const stateFor = (key) => window[key]?.state?.() || {};
    if (name === 'Build Passport') return stateFor('ajhPassport').stamped || 0;
    if (name === 'Build Dock') return stateFor('ajhDock').syncs || 0;
    if (name === 'Build Landing') return stateFor('ajhLanding').landed || 0;
    if (name === 'Build Lighthouse' || name === 'Lighthouse History') return stateFor('ajhLighthouse').history?.length || 0;
    if (name === 'Build Flight Plan') return stateFor('ajhFlight').queue?.length || 0;
    if (name === 'Build Runway') return stateFor('ajhRunway').queue?.length || 0;
    if (name === 'Build Relay') return stateFor('ajhRelay').queue?.length || 0;
    if (name === 'Build Dispatch') return stateFor('ajhDispatch').history?.length || 0;
    if (name === 'Build Checkpoint') return Object.keys(stateFor('ajhCheckpoint').checks || {}).length;
    return 0;
  }
  function records() {
    return source().map((build) => {
      const buildTags = build.n === 'Build Archive' ? ['build', ...tags(build)] : ['build', ...tags(build)];
      return { ...build, tags: buildTags, signals: signalCount(build.n), description: descriptions[buildTags[1]] || `${build.n} is part of AJH's daily build streak — a ${build.a} experiment shipped on Day ${build.d}.` };
    });
  }
  function visible(record) {
    const query = state.query.trim().toLowerCase();
    return (state.filter === 'all' || record.tags.includes(state.filter)) && (!query || `${record.d} ${record.n} ${record.a} ${record.description} ${record.tags.join(' ')}`.toLowerCase().includes(query));
  }
  function escapeHTML(value) { return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function localSummary() {
    const entries = [
      ['Passport', window.ajhPassport?.state?.().stamped || 0],
      ['Dock', window.ajhDock?.state?.().syncs || 0],
      ['Landing', window.ajhLanding?.state?.().landed || 0],
      ['Lighthouse', window.ajhLighthouse?.state?.().history?.length || 0],
      ['Flight Plan', window.ajhFlight?.state?.().queue?.length || 0],
      ['Runway', window.ajhRunway?.state?.().queue?.length || 0],
      ['Relay', window.ajhRelay?.state?.().queue?.length || 0],
      ['Dispatch', window.ajhDispatch?.state?.().history?.length || 0]
    ];
    return entries.filter((entry) => entry[1] > 0);
  }
  function render() {
    const all = records();
    const filtered = all.filter(visible);
    const rows = state.fullHistory || state.query || state.filter !== 'all' ? filtered : filtered.slice(-24);
    const local = localSummary();
    $('archive-total').textContent = all.length;
    $('archive-local').textContent = local.length;
    $('archive-shown').textContent = `${rows.length} shown`;
    $('archive-scope').textContent = state.fullHistory || state.query || state.filter !== 'all' ? 'Full filtered trail' : 'Latest 24';
    $('archive-views').textContent = `${state.views} opened`;
    $('archive-refreshes').textContent = `${state.refreshed} refreshed`;
    $('archive-show-all').innerHTML = `<i class="fas fa-arrows-to-circle"></i> ${state.fullHistory ? 'Show latest 24' : 'Show full trail'}`;
    $('archive-show-all').setAttribute('aria-pressed', String(state.fullHistory));
    $('archive-grid').innerHTML = rows.slice().reverse().map((record) => `<article class="archive-card"><div class="archive-card-top"><span class="archive-day">Day ${record.d}</span><span class="archive-signal">${record.signals ? `${record.signals} signal${record.signals === 1 ? '' : 's'}` : 'History'}</span></div><h3>${escapeHTML(record.n)}</h3><p>${escapeHTML(record.description)}</p><div class="archive-card-bottom"><span class="archive-type">${escapeHTML(record.tags[1] || record.a)}</span><span>${escapeHTML(record.date)}</span><button class="archive-open" type="button" data-day="${record.d}">Inspect ↗</button></div></article>`).join('');
    $('archive-empty').hidden = rows.length > 0;
    document.querySelectorAll('.archive-filter').forEach((button) => { const active = button.dataset.filter === state.filter; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
    document.querySelectorAll('.archive-open').forEach((button) => button.addEventListener('click', () => copyRecord(Number(button.dataset.day))));
  }
  function manifest() { const rows = records(); return { title: 'AJH Build Archive', generatedAt: new Date().toISOString(), totalBuilds: rows.length, filter: state.filter, query: state.query, fullHistory: state.fullHistory, localRecords: localSummary(), records: rows }; }
  function flash(button, label, icon) { button.innerHTML = `<i class="fas fa-${icon}"></i> ${label}`; setTimeout(() => { button.innerHTML = '<i class="fas fa-share-nodes"></i> Copy manifest'; }, 1400); }
  function copyText(text) { return navigator.clipboard?.writeText(text); }
  function copy() { const data = manifest(); const latest = data.records[data.records.length - 1]; const text = `AJH Build Archive · ${data.totalBuilds} builds\nLatest: Day ${latest.d} — ${latest.n}\nLocal records: ${data.localRecords.length}\nView: ${location.href.split('#')[0]}#archive`; copyText(text)?.then(() => flash($('archive-copy'), 'Copied', 'check')); }
  function copyRecord(day) { const record = records().find((item) => item.d === day); if (!record) return; copyText(`Day ${record.d}: ${record.n}\n${record.description}\n${record.date}`)?.then(() => flash($('archive-copy'), 'Record copied', 'check')); }
  function exportJSON() { const url = URL.createObjectURL(new Blob([JSON.stringify(manifest(), null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = `ajh-build-archive-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function open() { $('archive')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); render(); }
  function refresh() { state.refreshed += 1; save(); render(); }
  function boot() {
    load();
    $('archive-search').value = state.query;
    $('archive-search').addEventListener('input', (event) => { state.query = event.target.value; save(); render(); });
    document.querySelectorAll('.archive-filter').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter; save(); render(); }));
    $('archive-refresh')?.addEventListener('click', refresh);
    $('archive-show-all')?.addEventListener('click', () => { state.fullHistory = !state.fullHistory; save(); render(); });
    $('archive-copy')?.addEventListener('click', copy);
    $('archive-export')?.addEventListener('click', exportJSON);
    $('archive-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.shiftKey && event.key.toLowerCase() === 'a') open(); });
    window.ajhArchive = { open, refresh, copy, exportJSON, state: () => ({ ...state, records: records(), localRecords: localSummary() }) };
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
