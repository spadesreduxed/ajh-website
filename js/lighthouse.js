(function () {
  'use strict';

  const state = { report: [], score: 0, ranAt: null };
  const $ = (id) => document.getElementById(id);
  const checks = [
    {
      group: 'Accessibility', icon: 'universal-access',
      run: () => [
        ['Page language is declared', document.documentElement.lang === 'en', 'Add a meaningful lang attribute to <html>.'],
        ['One clear page heading exists', document.querySelectorAll('h1').length === 1, 'Keep one primary h1 so the page has a clear starting point.'],
        ['Images have alternative text', [...document.images].every((img) => img.hasAttribute('alt')), 'Add alt text to every image, or mark decorative images with alt="".'],
        ['Interactive controls have names', [...document.querySelectorAll('button')].filter((el) => !el.getAttribute('aria-label') && !el.textContent.trim() && !el.title).length === 0, 'Give icon-only buttons an aria-label or title.'],
      ],
    },
    {
      group: 'Metadata', icon: 'tags',
      run: () => [
        ['Title is useful', Boolean(document.title && document.title.length >= 10), 'Write a specific title that describes the person and the site.'],
        ['Description is present', Boolean(document.querySelector('meta[name="description"]')?.content?.trim()), 'Add a concise meta description for search and link previews.'],
        ['Canonical URL is present', Boolean(document.querySelector('link[rel="canonical"]')?.href), 'Add one canonical URL to prevent duplicate-URL confusion.'],
        ['Social preview image is present', Boolean(document.querySelector('meta[property="og:image"]')?.content), 'Add an Open Graph image so shared links have a visual preview.'],
      ],
    },
    {
      group: 'Resilience', icon: 'shield-halved',
      run: () => [
        ['Offline app shell is registered', Boolean(document.querySelector('link[rel="manifest"]')), 'Keep the manifest and service-worker registration aligned for the PWA shell.'],
        ['External font connections are warmed up', Boolean(document.querySelector('link[rel="preconnect"][href*="fonts.googleapis.com"]')), 'Preconnect to external font origins before loading the font stylesheet.'],
        ['Reduced-motion support exists', [...document.styleSheets].length > 0 && [...document.styleSheets].some((sheet) => { try { return [...sheet.cssRules].some((rule) => rule.cssText.includes('prefers-reduced-motion')); } catch (_) { return false; } }), 'Respect prefers-reduced-motion for animated experiences.'],
        ['A custom 404 page exists', Boolean(document.querySelector('a[href$="404.html"], link[href$="404.html"]')) || location.pathname.endsWith('404.html') || Boolean(document.querySelector('body')?.textContent.match(/404|page not found/i)), 'Keep a branded 404 page linked or available at the site root.'],
      ],
    },
    {
      group: 'Structure', icon: 'diagram-project',
      run: () => [
        ['Navigation links point to real sections', [...document.querySelectorAll('.nav-links a[href^="#"]')].every((link) => document.querySelector(link.getAttribute('href'))), 'Repair any navigation anchor that points to a missing section.'],
        ['Sections have identifiers', [...document.querySelectorAll('main section, body > section')].filter((section) => !section.id).length === 0, 'Give every major section a stable id for navigation and sharing.'],
        ['Lists use list markup', [...document.querySelectorAll('.nav-links')].every((nav) => nav.querySelectorAll('li').length > 0), 'Use semantic lists for grouped navigation.'],
        ['No duplicate section ids exist', new Set([...document.querySelectorAll('[id]')].map((el) => el.id)).size === document.querySelectorAll('[id]').length, 'Each id must be unique so links and scripts target one element.'],
      ],
    },
    {
      group: 'Performance', icon: 'gauge-high',
      run: () => [
        ['Scripts defer before interaction', [...document.scripts].filter((script) => script.src && !script.async && !script.defer && !script.src.includes('fontawesome')).length === 0, 'Defer non-critical scripts so the page can paint before JavaScript runs.'],
        ['Images avoid layout surprises', [...document.images].every((img) => img.width || img.getAttribute('width') || img.loading === 'lazy'), 'Give images dimensions or lazy-load them to reduce layout shift.'],
        ['The page is not an iframe wall', document.querySelectorAll('iframe').length <= 3, 'Keep embedded previews limited so the page stays responsive.'],
        ['The document is comfortably sized', document.documentElement.outerHTML.length < 1500000, 'Split unusually large inline payloads or defer non-critical data.'],
      ],
    },
  ];

  function run() {
    state.report = checks.flatMap((category) => category.run().map(([name, passed, fix]) => ({ group: category.group, icon: category.icon, name, passed, fix })));
    state.score = Math.round((state.report.filter((item) => item.passed).length / state.report.length) * 100);
    state.ranAt = new Date();
    render();
    save();
    document.getElementById('lighthouse')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function save() {
    try { localStorage.setItem('ajh_lighthouse_v1', JSON.stringify({ score: state.score, ranAt: state.ranAt?.toISOString(), report: state.report })); } catch (_) {}
  }

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem('ajh_lighthouse_v1') || 'null');
      if (stored?.report?.length) Object.assign(state, stored, { ranAt: stored.ranAt ? new Date(stored.ranAt) : null });
    } catch (_) {}
  }

  function copy() {
    if (!state.report.length) run();
    const passed = state.report.filter((item) => item.passed).length;
    const warnings = state.report.length - passed;
    const lines = [`AJH Build Lighthouse · ${state.score}/100`, `${passed} passed · ${warnings} to improve`, ''];
    state.report.forEach((item) => lines.push(`${item.passed ? 'PASS' : 'WARN'} · ${item.group} · ${item.name}${item.passed ? '' : ` — ${item.fix}`}`));
    const text = lines.join('\n');
    navigator.clipboard?.writeText(text).then(() => toast('Report copied')).catch(() => toast('Copy is unavailable in this browser'));
    return text;
  }

  function exportJSON() {
    if (!state.report.length) run();
    const blob = new Blob([JSON.stringify({ score: state.score, ranAt: state.ranAt, report: state.report }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ajh-lighthouse-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function toast(message) {
    const el = $('lh-next-text');
    if (el) el.textContent = message;
  }

  function render() {
    const passed = state.report.filter((item) => item.passed).length;
    const warnings = state.report.length - passed;
    $('lh-score').textContent = state.score;
    $('lh-score-label').textContent = state.score >= 90 ? 'Bright signal' : state.score >= 75 ? 'Good signal' : 'Needs attention';
    $('lh-score-message').textContent = `${passed} of ${state.report.length} checks pass. The warnings are small, concrete next moves — not a verdict.`;
    $('lh-pass-count').textContent = passed;
    $('lh-warn-count').textContent = warnings;
    $('lh-score-ring').style.setProperty('--lh-score', `${state.score * 3.6}deg`);
    $('lh-progress-bar').style.width = `${state.score}%`;
    const groups = [...new Set(state.report.map((item) => item.group))];
    $('lh-results').innerHTML = groups.map((group) => `<article class="lh-card"><div class="lh-card-head"><i class="fas fa-${state.report.find((item) => item.group === group).icon}"></i><h3>${group}</h3><span>${state.report.filter((item) => item.group === group && item.passed).length}/${state.report.filter((item) => item.group === group).length}</span></div><ul>${state.report.filter((item) => item.group === group).map((item) => `<li class="${item.passed ? 'is-pass' : 'is-warn'}"><i class="fas fa-${item.passed ? 'check' : 'triangle-exclamation'}"></i><div><strong>${item.name}</strong>${item.passed ? '' : `<small>${item.fix}</small>`}</div></li>`).join('')}</ul></article>`).join('');
    const firstWarning = state.report.find((item) => !item.passed);
    $('lh-next-text').textContent = firstWarning ? `${firstWarning.group}: ${firstWarning.fix}` : 'Everything is green. Pick one small detail and make tomorrow even better.';
    $('lh-next').classList.toggle('is-ready', Boolean(state.report.length));
  }

  function boot() {
    load();
    if (state.report.length) render();
    $('lh-run')?.addEventListener('click', run);
    $('lh-copy')?.addEventListener('click', copy);
    $('lh-export')?.addEventListener('click', exportJSON);
    $('lighthouse-hero-btn')?.addEventListener('click', () => setTimeout(run, 450));
    document.addEventListener('keydown', (event) => {
      if (event.target.matches('input, textarea, select, button, a')) return;
      if (event.key.toLowerCase() === 'h' && event.shiftKey && event.altKey) run();
    });
    window.ajhLighthouse = { run, copy, exportJSON, state: () => state };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
