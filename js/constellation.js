/* ============================================================
   Day 75 — Constellation Map
   75 build days as a starfield. Each star is one shipped feature.
   Position = archetype cluster + jitter. Brightness = impact.
   Connect the dots in time order. Click a star to read its build.
   ============================================================ */

(function () {
  'use strict';

  // 8 archetype clusters (must match DNA's ARCHETYPES)
  const ARCHETYPES = [
    { id: 'systems',     label: 'Systems',      icon: 'fa-cogs',         color: '#a855f7', cx: 22, cy: 28 },
    { id: 'visual',      label: 'Visual',       icon: 'fa-palette',      color: '#ec4899', cx: 78, cy: 26 },
    { id: 'audio',       label: 'Audio',        icon: 'fa-music',        color: '#3b82f6', cx: 88, cy: 60 },
    { id: 'interactive', label: 'Interactive',  icon: 'fa-gamepad',      color: '#10b981', cx: 76, cy: 82 },
    { id: 'data',        label: 'Data',         icon: 'fa-chart-line',   color: '#f59e0b', cx: 50, cy: 86 },
    { id: 'meta',        label: 'Meta',         icon: 'fa-brain',        color: '#8b5cf6', cx: 24, cy: 78 },
    { id: 'craft',       label: 'Craft',        icon: 'fa-feather-alt',  color: '#06b6d4', cx: 12, cy: 56 },
    { id: 'social',      label: 'Social',       icon: 'fa-share-nodes',  color: '#f43f5e', cx: 50, cy: 16 },
  ];

  // 75 build days, one star each
  const STARS = [
    { d: 1,  name: 'First Commit',                                  arch: 'meta',        impact: 4, date: '2026-04-22' },
    { d: 2,  name: 'Site Skeleton + Hero',                          arch: 'visual',      impact: 2, date: '2026-04-23' },
    { d: 3,  name: 'About + Skills Sections',                       arch: 'visual',      impact: 2, date: '2026-04-24' },
    { d: 4,  name: 'Projects + Contact',                            arch: 'social',      impact: 2, date: '2026-04-25' },
    { d: 5,  name: 'Theme Toggle + PWA',                            arch: 'systems',     impact: 4, date: '2026-04-26' },
    { d: 6,  name: 'Service Worker + Offline',                      arch: 'systems',     impact: 3, date: '2026-04-27' },
    { d: 7,  name: 'CI Workflow + 404 Page',                        arch: 'systems',     impact: 4, date: '2026-04-28' },
    { d: 8,  name: 'Achievement Badges',                            arch: 'data',        impact: 3, date: '2026-04-29' },
    { d: 9,  name: 'Stats Counter',                                 arch: 'data',        impact: 2, date: '2026-04-30' },
    { d: 10, name: 'Dark Mode Polish',                              arch: 'visual',      impact: 2, date: '2026-05-01' },
    { d: 11, name: 'Smooth Scrolling',                              arch: 'visual',      impact: 1, date: '2026-05-02' },
    { d: 12, name: 'Loading Screen',                                arch: 'visual',      impact: 2, date: '2026-05-03' },
    { d: 13, name: 'Cursor Trail',                                  arch: 'interactive', impact: 2, date: '2026-05-04' },
    { d: 14, name: 'Particle Background',                           arch: 'visual',      impact: 2, date: '2026-05-05' },
    { d: 15, name: 'Newsletter Form',                               arch: 'social',      impact: 2, date: '2026-05-06' },
    { d: 16, name: 'Gallery + Lightbox',                            arch: 'visual',      impact: 3, date: '2026-05-07' },
    { d: 17, name: 'Journey Timeline',                              arch: 'data',        impact: 3, date: '2026-05-08' },
    { d: 18, name: 'FAQ Section',                                   arch: 'craft',       impact: 2, date: '2026-05-09' },
    { d: 19, name: 'Testimonials',                                  arch: 'social',      impact: 2, date: '2026-05-10' },
    { d: 20, name: 'Search Modal',                                  arch: 'systems',     impact: 3, date: '2026-05-11' },
    { d: 21, name: 'Easter Egg Konami',                             arch: 'interactive', impact: 3, date: '2026-05-12' },
    { d: 22, name: 'Reading Progress',                              arch: 'visual',      impact: 2, date: '2026-05-13' },
    { d: 23, name: 'Scroll Animations',                             arch: 'visual',      impact: 2, date: '2026-05-14' },
    { d: 24, name: 'Blog Section',                                  arch: 'craft',       impact: 3, date: '2026-05-15' },
    { d: 25, name: 'Quote Rotator',                                 arch: 'craft',       impact: 2, date: '2026-05-16' },
    { d: 26, name: 'Magic 8-Ball',                                  arch: 'interactive', impact: 2, date: '2026-05-17' },
    { d: 27, name: 'Code Playground',                               arch: 'craft',       impact: 3, date: '2026-05-18' },
    { d: 28, name: 'Live Clock + Hero Meta',                        arch: 'systems',     impact: 2, date: '2026-05-19' },
    { d: 29, name: 'Weather Widget',                                arch: 'data',        impact: 3, date: '2026-05-20' },
    { d: 30, name: 'Skills with Animated Bars',                     arch: 'data',        impact: 3, date: '2026-05-21' },
    { d: 31, name: 'Project Filter System',                         arch: 'systems',     impact: 3, date: '2026-05-22' },
    { d: 32, name: 'Project Detail Modal',                          arch: 'systems',     impact: 3, date: '2026-05-23' },
    { d: 33, name: 'Enhanced Footer + Testimonials',                arch: 'social',      impact: 2, date: '2026-05-24' },
    { d: 34, name: 'Hover Effects + Scroll Reveal',                 arch: 'visual',      impact: 3, date: '2026-05-25' },
    { d: 35, name: 'Crypto Price Ticker',                           arch: 'data',        impact: 3, date: '2026-05-26' },
    { d: 36, name: 'GitHub Stats Integration',                      arch: 'data',        impact: 3, date: '2026-05-27' },
    { d: 37, name: '2026 Web Design (Glassmorphism, Bento, Tilt)',  arch: 'visual',      impact: 5, date: '2026-05-28' },
    { d: 38, name: 'Assistant + Bookmarks',                         arch: 'systems',     impact: 4, date: '2026-05-29' },
    { d: 39, name: 'Ambient Sound + Smart Nav + Reveal',            arch: 'audio',       impact: 4, date: '2026-05-30' },
    { d: 40, name: 'Productivity Corner',                           arch: 'meta',        impact: 4, date: '2026-05-31' },
    { d: 41, name: 'Hero Date Display',                             arch: 'systems',     impact: 2, date: '2026-06-01' },
    { d: 42, name: 'World Clock + 8 Cities',                        arch: 'data',        impact: 3, date: '2026-06-02' },
    { d: 43, name: 'Theme Studio',                                  arch: 'visual',      impact: 4, date: '2026-06-03' },
    { d: 44, name: 'Time Capsule',                                  arch: 'meta',        impact: 3, date: '2026-06-04' },
    { d: 45, name: 'Reading Mode',                                  arch: 'craft',       impact: 3, date: '2026-06-05' },
    { d: 46, name: 'Command Palette (Ctrl+K)',                      arch: 'interactive', impact: 4, date: '2026-06-06' },
    { d: 47, name: 'Site Tour + Interactive Timeline',              arch: 'meta',        impact: 3, date: '2026-06-07' },
    { d: 48, name: 'Daily Challenge + API Status',                  arch: 'meta',        impact: 4, date: '2026-06-08' },
    { d: 49, name: 'Music Player',                                  arch: 'audio',       impact: 4, date: '2026-06-09' },
    { d: 50, name: 'Stats Bento + Live Visitor Counter',            arch: 'data',        impact: 4, date: '2026-06-10' },
    { d: 51, name: 'Keyboard Game',                                 arch: 'interactive', impact: 3, date: '2026-06-11' },
    { d: 52, name: 'Build Journal',                                 arch: 'meta',        impact: 3, date: '2026-06-12' },
    { d: 53, name: 'Community Wishlist',                            arch: 'social',      impact: 3, date: '2026-06-13' },
    { d: 54, name: 'On This Day Wisdom',                            arch: 'craft',       impact: 4, date: '2026-06-14' },
    { d: 55, name: 'Reading List Integration',                      arch: 'craft',       impact: 3, date: '2026-06-15' },
    { d: 56, name: 'Code Snippets Vault',                           arch: 'craft',       impact: 4, date: '2026-06-16' },
    { d: 57, name: 'Build Calendar Heatmap',                        arch: 'data',        impact: 4, date: '2026-06-17' },
    { d: 58, name: 'Build Assistant',                               arch: 'interactive', impact: 4, date: '2026-06-18' },
    { d: 59, name: 'Bookmark Cards',                                arch: 'social',      impact: 4, date: '2026-06-19' },
    { d: 60, name: 'Site Constellation Graph',                      arch: 'visual',      impact: 4, date: '2026-06-19' },
    { d: 61, name: 'Time Capsule Vault',                            arch: 'meta',        impact: 4, date: '2026-06-20' },
    { d: 62, name: 'Theme Studio (Pro)',                            arch: 'visual',      impact: 4, date: '2026-06-21' },
    { d: 63, name: 'Reading Mode + Reading List',                   arch: 'craft',       impact: 3, date: '2026-06-22' },
    { d: 64, name: 'Build Journal (Three-Column)',                  arch: 'meta',        impact: 4, date: '2026-06-23' },
    { d: 65, name: 'Crypto Pulse Widget',                           arch: 'data',        impact: 3, date: '2026-06-24' },
    { d: 66, name: 'On This Day Wisdom Deck',                       arch: 'craft',       impact: 4, date: '2026-06-25' },
    { d: 67, name: 'Pixel Art Studio',                              arch: 'interactive', impact: 4, date: '2026-06-26' },
    { d: 68, name: 'Daily Pixel Challenge',                         arch: 'interactive', impact: 3, date: '2026-06-27' },
    { d: 69, name: 'Build Receipts (thermal)',                      arch: 'craft',       impact: 3, date: '2026-06-28' },
    { d: 70, name: 'Soundboard (26 pads)',                          arch: 'audio',       impact: 4, date: '2026-06-29' },
    { d: 71, name: 'Step Sequencer',                                arch: 'audio',       impact: 4, date: '2026-06-30' },
    { d: 72, name: 'The Forge (Reflection Studio)',                 arch: 'meta',        impact: 4, date: '2026-07-01' },
    { d: 73, name: 'Lab Notebook (Hypothesis Log)',                 arch: 'meta',        impact: 4, date: '2026-07-02' },
    { d: 74, name: 'Build DNA (Pattern Genome)',                    arch: 'data',        impact: 5, date: '2026-07-03' },
  ];

  // Day 75 — today's build, prepended so it's the first star rendered
  STARS.unshift({ d: 75, name: 'Constellation Map', arch: 'visual', impact: 5, date: '2026-07-04', current: true });

  // ---------- state ----------
  const STORAGE = {
    views: 'ajh_constellation75_views_v1',
    filter: 'ajh_constellation75_filter_v1',
    burst: 'ajh_constellation75_burst_v1',
  };

  let filter = (() => { try { return localStorage.getItem(STORAGE.filter) || 'all'; } catch { return 'all'; } })();
  let burstMode = (() => { try { return localStorage.getItem(STORAGE.burst) !== '0'; } catch { return true; } })();
  let viewCount = 0;

  try { viewCount = parseInt(localStorage.getItem(STORAGE.views) || '0', 10); } catch {}
  if (!Number.isFinite(viewCount)) viewCount = 0;

  // ---------- helpers ----------
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function setText(sel, val) { const el = $(sel); if (el) el.textContent = val; }
  function archColor(id) { const a = ARCHETYPES.find(x => x.id === id); return a ? a.color : '#a855f7'; }
  function archLabel(id) { const a = ARCHETYPES.find(x => x.id === id); return a ? a.label : id; }
  function archIcon(id) { const a = ARCHETYPES.find(x => x.id === id); return a ? a.icon : 'fa-star'; }
  function toast(msg) { let el = document.getElementById('cs-toast'); if (!el) { el = document.createElement('div'); el.id = 'cs-toast'; el.className = 'cs-toast'; document.body.appendChild(el); } el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2200); }
  function copyText(text) { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard')); } else { prompt('Copy:', text); } }

  // ---------- star positioning ----------
  // Each star is placed near its archetype cluster with controlled jitter.
  function positionStars() {
    const vbW = 1000, vbH = 700;
    return STARS.map((s, i) => {
      const a = ARCHETYPES.find(x => x.id === s.arch);
      if (!a) return { ...s, x: 500, y: 350, r: 4 };
      // Seeded pseudo-random for stable layout
      const seed = (i + 1) * 9301 + 49297;
      const r1 = ((seed * 233280) % 1000) / 1000;
      const r2 = (((seed + 1) * 233280) % 1000) / 1000;
      const r3 = (((seed + 2) * 233280) % 1000) / 1000;
      const angle = r1 * Math.PI * 2;
      const dist  = 30 + r2 * 110; // radius from cluster center, in viewBox units
      const x = a.cx / 100 * vbW + Math.cos(angle) * dist;
      const y = a.cy / 100 * vbH + Math.sin(angle) * dist;
      return { ...s, x, y, jitter: r3 };
    });
  }

  // ---------- filters ----------
  function applyFilter() {
    let list = STARS.slice();
    if (filter === 'big') list = list.filter(s => s.impact >= 4);
    else if (filter === 'massive') list = list.filter(s => s.impact >= 5);
    else if (filter === 'recent') list = list.slice(-10);
    else if (filter === 'current') list = list.filter(s => s.current);
    else if (ARCHETYPES.find(a => a.id === filter)) list = list.filter(s => s.arch === filter);
    return list;
  }

  // ---------- rendering ----------
  function renderSky() {
    const svg = $('#cs-sky');
    if (!svg) return;
    const positions = positionStars();
    // attach to STARS for later lookups
    STARS.forEach((s, i) => { s._x = positions[i].x; s._y = positions[i].y; s._jitter = positions[i].jitter; });

    // SVG viewBox is 1000x700; we map positions as-is.
    const visible = new Set(applyFilter().map(s => s.d));

    // --- cluster halos (faint colored zones) ---
    let clusterMarkup = '';
    ARCHETYPES.forEach(a => {
      clusterMarkup += `
        <g class="cs-cluster" data-arch="${a.id}">
          <circle cx="${a.cx / 100 * 1000}" cy="${a.cy / 100 * 700}" r="120" fill="url(#cs-halo-${a.id})" />
          <text x="${a.cx / 100 * 1000}" y="${a.cy / 100 * 700 + 165}" text-anchor="middle" class="cs-cluster-label" fill="${a.color}">
            ${a.label}
          </text>
        </g>`;
    });

    // --- constellation lines (connect consecutive visible days in time order) ---
    let linesMarkup = '';
    const visibleStars = STARS.filter(s => visible.has(s.d));
    for (let i = 0; i < visibleStars.length - 1; i++) {
      const a = visibleStars[i], b = visibleStars[i + 1];
      if (a.impact + b.impact >= 6) {
        const op = Math.min(0.55, (a.impact + b.impact) / 12);
        linesMarkup += `<line class="cs-line" x1="${a._x}" y1="${a._y}" x2="${b._x}" y2="${b._y}" stroke="url(#cs-line-grad)" stroke-opacity="${op.toFixed(2)}" />`;
      }
    }

    // --- stars themselves ---
    let starsMarkup = '';
    STARS.forEach(s => {
      const inView = visible.has(s.d);
      const r = 2 + s.impact * 1.4;
      const op = inView ? (0.55 + s.impact * 0.085) : 0.08;
      const twinkleDur = (2 + s._jitter * 4).toFixed(2);
      const glow = s.impact >= 4 ? 0.85 : 0.35;
      const c = archColor(s.arch);
      const cls = ['cs-star'];
      if (s.impact >= 5) cls.push('cs-star-massive');
      else if (s.impact === 4) cls.push('cs-star-big');
      if (s.current) cls.push('cs-star-current');
      if (!inView) cls.push('cs-star-dim');
      const dateLabel = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      starsMarkup += `
        <g class="${cls.join(' ')}" data-day="${s.d}" transform="translate(${s._x.toFixed(1)} ${s._y.toFixed(1)})" tabindex="0" role="button" aria-label="Day ${s.d}: ${escapeHtml(s.name)}">
          <circle class="cs-star-glow" r="${(r * 4).toFixed(1)}" fill="${c}" opacity="${glow.toFixed(2)}" />
          <circle class="cs-star-core" r="${r.toFixed(1)}" fill="${c}" opacity="${op.toFixed(2)}" style="animation-duration:${twinkleDur}s" />
          <text class="cs-star-label" y="${(r + 14).toFixed(0)}" text-anchor="middle" fill="#cdd6e0" font-size="11" opacity="${s.impact >= 4 ? 0.85 : 0}">Day ${s.d}</text>
          <title>Day ${s.d} \u2014 ${escapeHtml(s.name)} (${archLabel(s.arch)}, impact ${s.impact}) \u2014 ${dateLabel}</title>
        </g>`;
    });

    svg.innerHTML = `
      <defs>
        ${ARCHETYPES.map(a => `<radialGradient id="cs-halo-${a.id}"><stop offset="0%" stop-color="${a.color}" stop-opacity="0.18" /><stop offset="100%" stop-color="${a.color}" stop-opacity="0" /></radialGradient>`).join('')}
        <linearGradient id="cs-line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0" />
          <stop offset="50%" stop-color="#a855f7" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="transparent" />
      ${clusterMarkup}
      ${linesMarkup}
      ${starsMarkup}
    `;

    bindStars();
  }

  function bindStars() {
    $$('.cs-star').forEach(node => {
      node.addEventListener('click', () => {
        const day = parseInt(node.dataset.day, 10);
        openStar(day);
      });
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const day = parseInt(node.dataset.day, 10);
          openStar(day);
        }
      });
    });
  }

  // ---------- detail panel ----------
  function openStar(day) {
    const s = STARS.find(x => x.d === day);
    if (!s) return;
    const panel = $('#cs-panel');
    const body = $('#cs-panel-body');
    const a = ARCHETYPES.find(x => x.id === s.arch);
    if (!panel || !body) return;
    const dateLabel = new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const impactLabel = ['', 'Small', 'Solid', 'Big', 'Massive', 'Stellar'][s.impact] || 'Unknown';
    body.innerHTML = `
      <button class="cs-panel-close" id="cs-panel-close" aria-label="Close panel">&times;</button>
      <div class="cs-panel-arch" style="--arch-color: ${a.color}">
        <i class="fas ${a.icon}"></i>
        <span>${a.label}</span>
      </div>
      <h3 class="cs-panel-title">Day ${s.d}: ${escapeHtml(s.name)}</h3>
      <p class="cs-panel-date"><i class="fas fa-calendar"></i> ${dateLabel}</p>
      <div class="cs-panel-stats">
        <div class="cs-panel-stat">
          <span class="cs-panel-stat-num">${s.impact}</span>
          <span class="cs-panel-stat-label">Impact</span>
        </div>
        <div class="cs-panel-stat">
          <span class="cs-panel-stat-num">${a.label}</span>
          <span class="cs-panel-stat-label">Archetype</span>
        </div>
        <div class="cs-panel-stat">
          <span class="cs-panel-stat-num">${impactLabel}</span>
          <span class="cs-panel-stat-label">Magnitude</span>
        </div>
      </div>
      <div class="cs-panel-actions">
        <button class="cs-btn" id="cs-jump-blog"><i class="fas fa-newspaper"></i> Read in build log</button>
        <button class="cs-btn" id="cs-share"><i class="fas fa-share-nodes"></i> Share this star</button>
      </div>
      ${s.current ? '<p class="cs-panel-banner"><i class="fas fa-star"></i> Today\'s build \u2014 just shipped</p>' : ''}
    `;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');

    $('#cs-panel-close').addEventListener('click', closePanel);
    $('#cs-jump-blog').addEventListener('click', () => { location.hash = '#blog'; closePanel(); });
    $('#cs-share').addEventListener('click', () => shareStar(s));

    // bump visits counter
    viewCount++;
    try { localStorage.setItem(STORAGE.views, String(viewCount)); } catch (_) {}
    const vc = $('#cs-views'); if (vc) vc.textContent = viewCount;
  }

  function closePanel() {
    const panel = $('#cs-panel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  function shareStar(s) {
    const url = location.origin + location.pathname + '#constellation';
    const text = `\u2b50 Day ${s.d}: ${s.name} \u2014 ${archLabel(s.arch)} (impact ${s.impact}/5)\nFrom the AJH 75-day build: ` + url;
    if (navigator.share) {
      navigator.share({ title: `Day ${s.d}: ${s.name}`, text, url }).catch(() => copyText(text));
    } else {
      copyText(text);
    }
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('Star info copied to clipboard'));
    } else {
      prompt('Copy:', text);
    }
  }

  // ---------- fireworks burst mode ----------
  let burstTimer = null;
  function setBurst(on) {
    burstMode = !!on;
    try { localStorage.setItem(STORAGE.burst, burstMode ? '1' : '0'); } catch (_) {}
    const sky = $('#cs-sky');
    const btn = $('#cs-burst');
    if (sky) sky.classList.toggle('cs-burst', burstMode);
    if (btn) btn.classList.toggle('active', burstMode);
    if (burstMode) {
      // spawn bursts every 1.6s, focused on massive stars
      const massive = STARS.filter(s => s.impact >= 4);
      burstTimer = setInterval(() => {
        const s = massive[Math.floor(Math.random() * massive.length)];
        if (!s) return;
        spawnBurst(s._x, s._y, archColor(s.arch));
      }, 1600);
    } else if (burstTimer) {
      clearInterval(burstTimer);
      burstTimer = null;
    }
  }

  function spawnBurst(x, y, color) {
    const sky = $('#cs-sky');
    if (!sky) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cs-burst-spark');
    g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    const rays = 8 + Math.floor(Math.random() * 4);
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2 + Math.random() * 0.2;
      const dist = 30 + Math.random() * 50;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', '0');
      line.setAttribute('x2', dx.toFixed(1));
      line.setAttribute('y2', dy.toFixed(1));
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-linecap', 'round');
      g.appendChild(line);
    }
    // a center flash
    const flash = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    flash.setAttribute('r', '4');
    flash.setAttribute('fill', color);
    g.appendChild(flash);
    sky.appendChild(g);
    setTimeout(() => g.remove(), 1200);
  }

  // ---------- summary + filter UI ----------
  function renderSummary() {
    const stars = STARS;
    const total = stars.length;
    const avg = (stars.reduce((acc, s) => acc + s.impact, 0) / total).toFixed(2);
    const massive = stars.filter(s => s.impact >= 5).length;
    const big = stars.filter(s => s.impact === 4).length;
    setText('#cs-stat-total', total);
    setText('#cs-stat-avg', avg);
    setText('#cs-stat-massive', massive);
    setText('#cs-stat-big', big);
  }

  function renderFilterChips() {
    const wrap = $('#cs-filter-chips');
    if (!wrap) return;
    const chips = [
      { id: 'all', label: 'All 75', icon: 'fa-globe' },
      { id: 'recent', label: 'Last 10', icon: 'fa-clock' },
      { id: 'big', label: 'Big Days', icon: 'fa-star' },
      { id: 'massive', label: 'Massive', icon: 'fa-fire' },
    ];
    const archChips = ARCHETYPES.map(a => ({ id: `arch:${a.id}`, label: a.label, icon: a.icon, color: a.color }));
    wrap.innerHTML = [...chips, ...archChips].map(c => `
      <button class="cs-chip ${filter === c.id ? 'active' : ''}" data-filter="${c.id}" ${c.color ? `style="--chip-color:${c.color}"` : ''}>
        <i class="fas ${c.icon}"></i>
        <span>${c.label}</span>
      </button>
    `).join('');
    $$('.cs-chip', wrap).forEach(btn => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        try { localStorage.setItem(STORAGE.filter, filter); } catch (_) {}
        renderSky();
        renderFilterChips();
      });
    });
  }

  // ---------- init ----------
  function init() {
    if (!document.getElementById('constellation75')) return;
    viewCount = parseInt(localStorage.getItem(STORAGE.views) || '0', 10);
    burstMode = localStorage.getItem(STORAGE.burst) === '1';
    setText('#cs-views', viewCount);
    renderSummary();
    renderFilterChips();
    renderSky();
    setBurst(burstMode);

    $('#cs-burst')?.addEventListener('click', () => setBurst(!burstMode));
    $('#cs-reset-view')?.addEventListener('click', () => {
      filter = 'all';
      try { localStorage.setItem(STORAGE.filter, filter); } catch (_) {}
      renderSky();
      renderFilterChips();
    });
    $('#cs-export')?.addEventListener('click', exportJSON);

    // Hero meta button (in case it's not just a plain anchor)
    document.getElementById('constellation75-hero-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '#constellation75';
    });

    // Esc to close panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel();
    });

    // Click outside panel to close
    $('#cs-panel')?.addEventListener('click', (e) => {
      if (e.target.id === 'cs-panel') closePanel();
    });

    // Expose for command palette
    window.ajhConstellation75Open = () => {
      location.hash = '#constellation75';
      // Open today's star
      const today = STARS.find(s => s.current);
      if (today) openStar(today.d);
    };
    window.ajhConstellation75Burst = () => setBurst(!burstMode);
  }

  function exportJSON() {
    const payload = {
      generatedAt: new Date().toISOString(),
      totalStars: STARS.length,
      averageImpact: (STARS.reduce((a, s) => a + s.impact, 0) / STARS.length).toFixed(2),
      stars: STARS.map(({ _x, _y, _jitter, current, ...rest }) => rest),
      archetypes: ARCHETYPES,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ajh-constellation75-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Constellation exported as JSON');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
