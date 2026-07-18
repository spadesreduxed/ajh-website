(function () {
  'use strict';
  const BUILDS = [
    { d: 87, a: 'data', n: 'Release Notes', i: 4, date: 'Jul 17, 2026', text: 'A searchable, filterable changelog that makes the daily build streak easier to scan and share.' },
    { d: 86, a: 'systems', n: 'Build Lighthouse', i: 5, date: 'Jul 16, 2026', text: 'A client-side quality audit for accessibility, metadata, resilience, structure, and performance.' },
    { d: 85, a: 'systems', n: 'Compass Field Notes', i: 5, date: 'Jul 15, 2026', text: 'A direction-aware planning layer that turns the build history into a concrete next move.' },
    { d: 84, a: 'systems', n: 'Build Compass', i: 5, date: 'Jul 14, 2026', text: 'Four directions map the work so the next build can be chosen with intention.' },
    { d: 83, a: 'audio', n: 'Build Waveform', i: 5, date: 'Jul 13, 2026', text: 'Every build becomes a frequency in a playable spectrum with listen, history, and export modes.' },
    { d: 82, a: 'data', n: 'Build Observatory', i: 5, date: 'Jul 12, 2026', text: 'A solar system of moons turns the full streak into an explorable orbit map.' },
    { d: 81, a: 'craft', n: 'Build Aquarium', i: 5, date: 'Jul 11, 2026', text: 'A living tank gives every build a species, swim pattern, current, and moment of focus.' },
    { d: 80, a: 'data', n: 'Build Skyline', i: 5, date: 'Jul 10, 2026', text: 'A city of deterministic buildings makes the streak visible at a glance, day or night.' },
    { d: 79, a: 'audio', n: 'Build Tape', i: 5, date: 'Jul 8, 2026', text: 'A vintage cassette deck turns the build log into a playable side-A and side-B mixtape.' },
    { d: 78, a: 'craft', n: 'Build Garden', i: 5, date: 'Jul 7, 2026', text: 'Eight hand-built SVG plants grow from the same underlying build history.' },
    { d: 77, a: 'data', n: 'Build Weather', i: 5, date: 'Jul 6, 2026', text: 'A forecast engine translates build impact into conditions, climate, and a rolling outlook.' },
    { d: 76, a: 'interactive', n: 'Build Trail', i: 5, date: 'Jul 5, 2026', text: 'A horizontal ribbon lays every shipped day end to end with filters and focus details.' },
    { d: 75, a: 'data', n: 'Constellation Map', i: 5, date: 'Jul 4, 2026', text: 'Seventy-five build days become a starfield with archetype clusters and connecting lines.' },
    { d: 74, a: 'data', n: 'Build DNA', i: 5, date: 'Jul 3, 2026', text: 'A weighted fingerprint reveals the builder archetypes shaping the streak.' },
    { d: 73, a: 'data', n: 'Lab Notebook', i: 5, date: 'Jul 2, 2026', text: 'Hypotheses and outcomes make experiments visible instead of letting them disappear into the log.' },
  ];
  const state = { filter: 'all', query: '', views: 0 };
  const $ = (id) => document.getElementById(id);
  function save() { try { localStorage.setItem('ajh_releases_v1', JSON.stringify(state)); } catch (_) {} }
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem('ajh_releases_v1') || '{}')); } catch (_) {} }
  function visible(build) { const q = state.query.trim().toLowerCase(); return (state.filter === 'all' || build.a === state.filter) && (!q || `${build.d} ${build.n} ${build.a} ${build.text}`.toLowerCase().includes(q)); }
  function stars(i) { return '★'.repeat(i) + '☆'.repeat(5 - i); }
  function render() {
    const shown = BUILDS.filter(visible); const impact = shown.reduce((sum, build) => sum + build.i, 0);
    $('releases-count').textContent = shown.length; $('releases-impact').textContent = `${impact} impact points`;
    $('releases-grid').innerHTML = shown.map((build) => `<article class="release-card"><div class="release-card-top"><span class="release-day">DAY ${build.d}</span><span class="release-date">${build.date}</span></div><h3>${build.n}</h3><p>${build.text}</p><div class="release-card-bottom"><span class="release-type">${build.a}</span><span class="release-impact" aria-label="Impact ${build.i} out of 5">${stars(build.i)}</span><button class="release-open" data-day="${build.d}">Open ↗</button></div></article>`).join('');
    $('releases-empty').hidden = shown.length > 0; document.querySelectorAll('.release-filter').forEach((button) => button.classList.toggle('is-active', button.dataset.filter === state.filter));
    document.querySelectorAll('.release-open').forEach((button) => button.addEventListener('click', () => { const build = BUILDS.find((item) => item.d === Number(button.dataset.day)); if (build) share(build); }));
  }
  function open() { $('releases')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); state.views += 1; save(); }
  function snapshot() { return { title: 'AJH Release Notes', filter: state.filter, query: state.query, generatedAt: new Date().toISOString(), releases: BUILDS.filter(visible) }; }
  function exportJSON() { const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot(), null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = `ajh-release-notes-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function share(build) { const target = build ? `Day ${build.d}: ${build.n} — ${build.text}` : `AJH Release Notes · ${BUILDS.filter(visible).length} releases shown`; const data = { title: 'AJH Release Notes', text: target, url: `${location.href.split('#')[0]}#releases` }; if (navigator.share) navigator.share(data).catch(() => {}); else navigator.clipboard?.writeText(`${target}\n${data.url}`); }
  function boot() { load(); if (!['all', 'craft', 'systems', 'data', 'audio', 'interactive'].includes(state.filter)) state.filter = 'all'; $('releases-search').value = state.query; render(); $('releases-search').addEventListener('input', (event) => { state.query = event.target.value; save(); render(); }); document.querySelectorAll('.release-filter').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter; save(); render(); })); $('releases-share').addEventListener('click', () => share()); $('releases-export').addEventListener('click', exportJSON); document.addEventListener('keydown', (event) => { if (event.target.matches('input, textarea, select, button, a')) return; if (event.key.toLowerCase() === 'r' && event.shiftKey) open(); }); window.ajhReleases = { open, share, exportJSON, state: () => state }; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
