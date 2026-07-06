/* ============================================================
   Day 76: Build Trail — horizontal chronological ribbon of
   every shipped build day.
   ============================================================ */

(function () {
    'use strict';

    // Build archetype color map (matches DNA)
    const ARCHETYPE_COLORS = {
        systems: '#a855f7',
        visual: '#ec4899',
        audio: '#3b82f6',
        interactive: '#10b981',
        data: '#f59e0b',
        meta: '#8b5cf6',
        craft: '#06b6d4',
        social: '#f43f5e',
    };

    const ARCHETYPE_ICONS = {
        systems: 'fa-cogs',
        visual: 'fa-palette',
        audio: 'fa-music',
        interactive: 'fa-gamepad',
        data: 'fa-chart-line',
        meta: 'fa-brain',
        craft: 'fa-feather-alt',
        social: 'fa-share-nodes',
    };

    // Day 1 = 2026-04-22
    const DAY1 = new Date(2026, 3, 22);

    function dayDate(day) {
        const d = new Date(DAY1);
        d.setDate(d.getDate() + (day - 1));
        return d;
    }

    function fmtDate(d) {
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    function fmtShort(d) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function fmtMonth(d) {
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // Seed builds — every shipped build day with archetype + impact
    // Mirrors DNA BUILDS so the lenses tell the same story
    const BUILDS = [
        { day: 1,  name: 'First Commit',                           category: 'meta',        impact: 4 },
        { day: 2,  name: 'Site Skeleton + Hero',                   category: 'visual',      impact: 2 },
        { day: 3,  name: 'About + Skills Sections',                category: 'visual',      impact: 2 },
        { day: 4,  name: 'Projects + Contact',                     category: 'visual',      impact: 2 },
        { day: 5,  name: 'Theme Toggle + PWA',                     category: 'systems',     impact: 4 },
        { day: 6,  name: 'Service Worker + Offline',               category: 'systems',     impact: 3 },
        { day: 7,  name: 'CI Workflow + 404 Page',                 category: 'systems',     impact: 4 },
        { day: 8,  name: 'Achievement Badges',                     category: 'data',        impact: 3 },
        { day: 9,  name: 'Stats Counter',                          category: 'data',        impact: 2 },
        { day: 10, name: 'Dark Mode Polish',                       category: 'visual',      impact: 2 },
        { day: 11, name: 'Smooth Scrolling',                       category: 'visual',      impact: 1 },
        { day: 12, name: 'Loading Screen',                         category: 'visual',      impact: 2 },
        { day: 13, name: 'Cursor Trail',                           category: 'interactive', impact: 2 },
        { day: 14, name: 'Particle Background',                    category: 'visual',      impact: 2 },
        { day: 15, name: 'Newsletter Form',                        category: 'social',      impact: 2 },
        { day: 16, name: 'Gallery + Lightbox',                     category: 'visual',      impact: 3 },
        { day: 17, name: 'Journey Timeline',                       category: 'data',        impact: 3 },
        { day: 18, name: 'FAQ Section',                            category: 'craft',       impact: 2 },
        { day: 19, name: 'Testimonials',                           category: 'social',      impact: 2 },
        { day: 20, name: 'Search Modal',                           category: 'systems',     impact: 3 },
        { day: 21, name: 'Easter Egg Konami',                      category: 'interactive', impact: 3 },
        { day: 22, name: 'Reading Progress',                       category: 'visual',      impact: 2 },
        { day: 23, name: 'Scroll Animations',                      category: 'visual',      impact: 2 },
        { day: 24, name: 'Blog Section',                           category: 'craft',       impact: 3 },
        { day: 25, name: 'Quote Rotator',                          category: 'craft',       impact: 2 },
        { day: 26, name: 'Magic 8-Ball',                           category: 'interactive', impact: 2 },
        { day: 27, name: 'Code Playground',                        category: 'craft',       impact: 3 },
        { day: 28, name: 'Live Clock + Hero Meta',                 category: 'systems',     impact: 2 },
        { day: 29, name: 'Weather Widget',                         category: 'data',        impact: 3 },
        { day: 30, name: 'Skills with Animated Bars',              category: 'data',        impact: 3 },
        { day: 31, name: 'Project Filter System',                  category: 'systems',     impact: 3 },
        { day: 32, name: 'Project Detail Modal',                   category: 'systems',     impact: 3 },
        { day: 33, name: 'Enhanced Footer + Testimonials',         category: 'social',      impact: 2 },
        { day: 34, name: 'Hover Effects + Scroll Reveal',          category: 'visual',      impact: 3 },
        { day: 35, name: 'Crypto Price Ticker',                    category: 'data',        impact: 3 },
        { day: 36, name: 'GitHub Stats Integration',               category: 'data',        impact: 3 },
        { day: 37, name: '2026 Design (Glass, Bento, Kinetic)',    category: 'visual',      impact: 5 },
        { day: 38, name: 'Assistant + Bookmarks',                  category: 'systems',     impact: 4 },
        { day: 39, name: 'Ambient Sound + Smart Nav + Reveal',     category: 'audio',       impact: 4 },
        { day: 40, name: 'Productivity Corner (Focus, Notes)',     category: 'meta',        impact: 4 },
        { day: 41, name: 'Hero Date Display',                      category: 'systems',     impact: 2 },
        { day: 42, name: 'World Clock + 8 Cities',                 category: 'data',        impact: 3 },
        { day: 43, name: 'Theme Studio',                           category: 'visual',      impact: 4 },
        { day: 44, name: 'Time Capsule',                           category: 'meta',        impact: 3 },
        { day: 45, name: 'Reading Mode',                           category: 'craft',       impact: 3 },
        { day: 46, name: 'Command Palette (Ctrl+K)',               category: 'interactive', impact: 4 },
        { day: 47, name: 'Site Tour + Interactive Timeline',       category: 'meta',        impact: 3 },
        { day: 48, name: 'Daily Challenge + API Status',           category: 'meta',        impact: 4 },
        { day: 49, name: 'Music Player',                           category: 'audio',       impact: 4 },
        { day: 50, name: 'Stats Bento + Live Visitor Counter',     category: 'data',        impact: 4 },
        { day: 51, name: 'Keyboard Game',                          category: 'interactive', impact: 3 },
        { day: 52, name: 'Build Journal',                          category: 'meta',        impact: 3 },
        { day: 53, name: 'Community Wishlist',                     category: 'social',      impact: 3 },
        { day: 54, name: 'On This Day Wisdom (66)',                category: 'craft',       impact: 4 },
        { day: 55, name: 'Reading List Integration',               category: 'craft',       impact: 3 },
        { day: 56, name: 'Code Snippets Vault',                    category: 'craft',       impact: 4 },
        { day: 57, name: 'Build Calendar Heatmap',                 category: 'data',        impact: 4 },
        { day: 58, name: 'Constellation Map',                      category: 'visual',      impact: 3 },
        { day: 59, name: 'Printable Build Receipts',               category: 'craft',       impact: 3 },
        { day: 60, name: 'Daily Plan Board',                       category: 'meta',        impact: 3 },
        { day: 61, name: 'Daily Quote Cards',                      category: 'craft',       impact: 2 },
        { day: 62, name: 'Reading Time Tracker',                   category: 'data',        impact: 2 },
        { day: 63, name: 'Pomodoro Pro Stats',                     category: 'data',        impact: 2 },
        { day: 64, name: 'GitHub PR Pulse',                        category: 'data',        impact: 3 },
        { day: 65, name: 'Code Style Linter (client-side)',        category: 'craft',       impact: 3 },
        { day: 66, name: 'On This Day Wisdom Deck',                category: 'craft',       impact: 4 },
        { day: 67, name: 'Pixel Art Studio',                       category: 'interactive', impact: 4 },
        { day: 68, name: 'Daily Pixel Challenge',                  category: 'interactive', impact: 3 },
        { day: 69, name: 'Build Receipts (thermal)',               category: 'craft',       impact: 3 },
        { day: 70, name: 'Soundboard (26 pads)',                   category: 'audio',       impact: 4 },
        { day: 71, name: 'Step Sequencer',                         category: 'audio',       impact: 4 },
        { day: 72, name: 'The Forge (Reflection Studio)',          category: 'meta',        impact: 4 },
        { day: 73, name: 'Lab Notebook (Hypothesis Log)',          category: 'meta',        impact: 4 },
        { day: 74, name: 'Build DNA (Pattern Genome)',             category: 'data',        impact: 4 },
        { day: 75, name: 'Constellation Map (75 Stars)',           category: 'visual',      impact: 4 },
        { day: 76, name: 'Build Trail (Chronological Ribbon)',     category: 'data',        impact: 3 },
        { day: 77, name: 'Build Weather (Forecast Engine)',        category: 'data',        impact: 4 },
    ];

    // Build descriptions (short) for detail panel
    const DESCRIPTIONS = {
        1: 'Shipped the first commit of the AJH GitHub Pages site. Set up the workspace, the README, and the initial index.html with a single "Building things" header.',
        5: 'Added a working theme toggle (light/dark), registered the site as an installable PWA, and wired the manifest with proper icons.',
        7: 'Set up the GitHub Actions CI workflow, designed a custom 404 page with a glitch animation, and added favicon support.',
        37: 'Sweeping design refresh: glassmorphism, bento grids, kinetic typography, magnetic buttons, 3D card tilt, and morphing blob backgrounds.',
        46: 'A keyboard-driven command launcher activated by Ctrl+K. 25+ commands covering navigation, actions, tools, and external pages.',
        49: 'Full-featured audio player with synthesized visualizer, play/pause/next controls, volume slider, 5 demo tracks, and Space-to-toggle.',
        70: '26-pad Web Audio synth across 6 categories (UI, Arcade, Synth, Nature, Retro, Voice) with no audio files — every sound synthesized in the browser.',
        74: 'Pattern genome of the build: 8 archetype distribution, personality card, build log feed, and focus card. Your build has a fingerprint.',
        75: 'Constellation map of 75 stars plotted across 8 archetype clusters. Click any star to read what shipped that day.',
        76: 'Horizontal chronological ribbon of all 75+1 build days. The third lens on the same data — alongside the sky (constellation) and the genome (DNA).',
    };

    function getDesc(b) {
        return DESCRIPTIONS[b.day] || `Shipped ${b.name} on day ${b.day}. Category: ${b.category}, impact: ${b.impact}/5.`;
    }

    const STORAGE = 'ajh_trail_v1';
    const TODAY_DAY = 76; // Day 76 = 2026-07-05

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { filter: 'all', visits: 0 };
    }

    function saveState(s) {
        try { localStorage.setItem(STORAGE, JSON.stringify(s)); } catch (e) {}
    }

    let state = loadState();
    state.visits = (state.visits || 0) + 1;
    saveState(state);

    // ---- DOM refs ----
    const stage = document.getElementById('trail-stage');
    const rail = document.getElementById('trail-rail');
    const progressFill = document.getElementById('trail-progress-fill');
    const filterChips = document.getElementById('trail-filter-chips');
    const panel = document.getElementById('trail-detail-panel');
    const panelBody = document.getElementById('trail-detail-body');
    const panelBackdrop = document.getElementById('trail-detail-backdrop');
    const leaderList = document.getElementById('trail-leaderboard-list');
    const toast = document.getElementById('trail-toast');

    if (!stage || !rail) return;

    // ---- Build era groupings (by month) ----
    function buildEras() {
        const eras = [];
        let cur = null;
        for (const b of BUILDS) {
            const d = dayDate(b.day);
            const label = fmtMonth(d);
            if (!cur || cur.label !== label) {
                cur = { label, days: [] };
                eras.push(cur);
            }
            cur.days.push(b);
        }
        return eras;
    }

    // ---- Render cards ----
    function cardClass(b) {
        if (b.day === TODAY_DAY) return 'trail-card today';
        if (b.impact >= 5) return 'trail-card stellar';
        if (b.impact >= 4) return 'trail-card massive';
        return 'trail-card';
    }

    function cardHTML(b) {
        const d = dayDate(b.day);
        const color = ARCHETYPE_COLORS[b.category] || '#00d4ff';
        const icon = ARCHETYPE_ICONS[b.category] || 'fa-circle';
        const dots = [1, 2, 3, 4, 5].map(n =>
            `<span class="trail-impact-dot ${n <= b.impact ? 'lit' : ''}"></span>`
        ).join('');

        return `
            <div class="${cardClass(b)}"
                 data-day="${b.day}"
                 data-category="${b.category}"
                 style="--trail-color: ${color};"
                 role="button"
                 tabindex="0"
                 aria-label="Day ${b.day} — ${b.name}">
                <div class="trail-card-head">
                    <span class="trail-day-num">D${b.day}</span>
                    <span class="trail-date">${fmtShort(d)}</span>
                </div>
                <div class="trail-name">${b.name}</div>
                <div class="trail-card-foot">
                    <div class="trail-impact">${dots}</div>
                    <i class="fas ${icon} trail-cat-icon"></i>
                </div>
                <div class="trail-node"></div>
            </div>
        `;
    }

    function eraHTML(era) {
        return `
            <div class="trail-era">
                <span class="trail-era-label">${era.label}</span>
                <span class="trail-era-count">${era.days.length} build${era.days.length === 1 ? '' : 's'}</span>
            </div>
        `;
    }

    function renderRail() {
        const eras = buildEras();
        let html = '';
        let first = true;
        for (const era of eras) {
            if (!first) {
                // era divider is implicit between month groups
            }
            html += eraHTML(era);
            for (const b of era.days) {
                html += cardHTML(b);
            }
            first = false;
        }
        rail.innerHTML = html;
        bindCards();
    }

    function applyFilter(category) {
        state.filter = category;
        saveState(state);
        const cards = rail.querySelectorAll('.trail-card');
        cards.forEach(c => {
            const cat = c.getAttribute('data-category');
            const day = parseInt(c.getAttribute('data-day'), 10);
            const show = category === 'all'
                || (category === 'today' && day === TODAY_DAY)
                || cat === category;
            c.style.display = show ? '' : 'none';
        });
        // Update chip active state
        if (filterChips) {
            filterChips.querySelectorAll('.trail-chip').forEach(chip => {
                chip.classList.toggle('active', chip.getAttribute('data-filter') === category);
            });
        }
    }

    function renderChips() {
        if (!filterChips) return;
        const cats = [
            { id: 'all', label: 'All 76' },
            { id: 'today', label: 'Today' },
            { id: 'systems', label: 'Systems' },
            { id: 'visual', label: 'Visual' },
            { id: 'audio', label: 'Audio' },
            { id: 'interactive', label: 'Interactive' },
            { id: 'data', label: 'Data' },
            { id: 'meta', label: 'Meta' },
            { id: 'craft', label: 'Craft' },
            { id: 'social', label: 'Social' },
        ];
        filterChips.innerHTML = cats.map(c =>
            `<button class="trail-chip ${c.id === state.filter ? 'active' : ''}" data-filter="${c.id}">${c.label}</button>`
        ).join('');
        filterChips.querySelectorAll('.trail-chip').forEach(chip => {
            chip.addEventListener('click', () => applyFilter(chip.getAttribute('data-filter')));
        });
    }

    function bindCards() {
        const cards = rail.querySelectorAll('.trail-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const day = parseInt(card.getAttribute('data-day'), 10);
                const b = BUILDS.find(x => x.day === day);
                if (b) openDetail(b);
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const day = parseInt(card.getAttribute('data-day'), 10);
                    const b = BUILDS.find(x => x.day === day);
                    if (b) openDetail(b);
                }
            });
        });
    }

    // ---- Progress bar (scroll position) ----
    function updateProgress() {
        if (!stage || !progressFill) return;
        const max = stage.scrollWidth - stage.clientWidth;
        const pct = max > 0 ? (stage.scrollLeft / max) * 100 : 0;
        progressFill.style.width = pct + '%';
    }

    // ---- Drag-to-scroll ----
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    stage.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - stage.offsetLeft;
        startScroll = stage.scrollLeft;
        stage.classList.add('dragging');
    });
    stage.addEventListener('mouseleave', () => {
        isDown = false;
        stage.classList.remove('dragging');
    });
    stage.addEventListener('mouseup', () => {
        isDown = false;
        stage.classList.remove('dragging');
    });
    stage.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - stage.offsetLeft;
        const walk = (x - startX) * 1.4;
        stage.scrollLeft = startScroll - walk;
    });
    stage.addEventListener('scroll', updateProgress);

    // ---- Wheel: convert vertical to horizontal when shift not held ----
    stage.addEventListener('wheel', (e) => {
        // Only intercept when scrolling vertically
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            stage.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // ---- Detail panel ----
    function openDetail(b) {
        if (!panel || !panelBody) return;
        const d = dayDate(b.day);
        const color = ARCHETYPE_COLORS[b.category] || '#00d4ff';
        const icon = ARCHETYPE_ICONS[b.category] || 'fa-circle';
        const dots = [1, 2, 3, 4, 5].map(n =>
            `<span class="trail-impact-dot ${n <= b.impact ? 'lit' : ''}" style="--trail-color: ${color};"></span>`
        ).join('');

        // Cumulative impact up to and including this day
        const cumulative = BUILDS.filter(x => x.day <= b.day).reduce((a, x) => a + x.impact, 0);

        panelBody.innerHTML = `
            <div class="trail-detail-day" style="color: ${color};">Day ${b.day}${b.day === TODAY_DAY ? ' · Today' : ''}</div>
            <h3 class="trail-detail-title">${b.name}</h3>
            <div class="trail-detail-date">${fmtDate(d)}</div>

            <div class="trail-detail-stats">
                <div class="trail-detail-stat">
                    <span class="trail-detail-stat-val" style="color: ${color};">${b.impact}/5</span>
                    <span class="trail-detail-stat-label">Impact</span>
                </div>
                <div class="trail-detail-stat">
                    <span class="trail-detail-stat-val">${cumulative}</span>
                    <span class="trail-detail-stat-label">Cumulative</span>
                </div>
            </div>

            <div class="trail-detail-section">
                <div class="trail-detail-section-title">Archetype</div>
                <span class="trail-detail-archetype" style="background: ${color}22; border-color: ${color}66; color: ${color};">
                    <i class="fas ${icon}"></i> ${b.category.charAt(0).toUpperCase() + b.category.slice(1)}
                </span>
                <span class="trail-detail-archetype">${dots}</span>
            </div>

            <div class="trail-detail-section">
                <div class="trail-detail-section-title">What shipped</div>
                <p class="trail-detail-desc">${getDesc(b)}</p>
            </div>

            <div class="trail-detail-section">
                <div class="trail-detail-section-title">Trail spark</div>
                <svg class="trail-detail-spark" viewBox="0 0 200 60" preserveAspectRatio="none" aria-label="Cumulative impact sparkline">${renderSpark(b.day)}</svg>
            </div>

            <div class="trail-detail-actions">
                <button class="trail-detail-btn primary" data-action="share">
                    <i class="fas fa-share-nodes"></i> Share
                </button>
                <button class="trail-detail-btn" data-action="copy">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
        `;
        panel.style.setProperty('--trail-color', color);
        panel.classList.add('open');
        panelBackdrop.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');

        // Wire actions
        panelBody.querySelectorAll('.trail-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                if (action === 'share') shareDay(b);
                if (action === 'copy') copyDay(b);
            });
        });
    }

    function closeDetail() {
        if (!panel) return;
        panel.classList.remove('open');
        panelBackdrop.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
    }

    panelBackdrop.addEventListener('click', closeDetail);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel && panel.classList.contains('open')) {
            closeDetail();
        }
    });

    function closeBtn() {
        const btn = document.getElementById('trail-detail-close');
        if (btn) btn.addEventListener('click', closeDetail);
    }

    function renderSpark(upTo) {
        const pts = BUILDS.filter(b => b.day <= upTo).map((b, i) => {
            const x = (i / Math.max(1, upTo - 1)) * 200;
            const y = 55 - (b.impact / 5) * 50;
            return `${x},${y}`;
        }).join(' ');
        const last = BUILDS.find(b => b.day === upTo);
        const color = ARCHETYPE_COLORS[last.category] || '#00d4ff';
        return `
            <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
            <line x1="0" y1="55" x2="200" y2="55" stroke="rgba(0, 212, 255, 0.15)" stroke-width="1" stroke-dasharray="2 2" />
        `;
    }

    // ---- Leaderboard ----
    function renderLeaderboard() {
        if (!leaderList) return;
        const top = [...BUILDS].sort((a, b) => b.impact - a.impact || a.day - b.day).slice(0, 5);
        const ranks = ['gold', 'silver', 'bronze'];
        leaderList.innerHTML = top.map((b, i) => {
            const color = ARCHETYPE_COLORS[b.category] || '#00d4ff';
            const rankClass = i < 3 ? ranks[i] : '';
            return `
                <div class="trail-leader-item" data-day="${b.day}">
                    <span class="trail-leader-rank ${rankClass}">${i + 1}</span>
                    <span class="trail-leader-name">D${b.day} · ${b.name}</span>
                    <span class="trail-leader-meta" style="color: ${color};">${b.impact}/5</span>
                </div>
            `;
        }).join('');
        leaderList.querySelectorAll('.trail-leader-item').forEach(item => {
            item.addEventListener('click', () => {
                const day = parseInt(item.getAttribute('data-day'), 10);
                const b = BUILDS.find(x => x.day === day);
                if (b) openDetail(b);
            });
        });
    }

    // ---- Summary stats ----
    function renderSummary() {
        const total = BUILDS.length;
        const massive = BUILDS.filter(b => b.impact >= 4).length;
        const totalImpact = BUILDS.reduce((a, b) => a + b.impact, 0);
        const avg = (totalImpact / total).toFixed(2);

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('trail-stat-total', total);
        set('trail-stat-massive', massive);
        set('trail-stat-avg', avg);
        set('trail-stat-day', TODAY_DAY);
    }

    // ---- Actions ----
    function shareDay(b) {
        const text = `Day ${b.day} · ${b.name} (Impact ${b.impact}/5) — AJH Build Trail`;
        if (navigator.share) {
            navigator.share({ title: 'Build Trail', text, url: location.href }).catch(() => {});
        } else {
            copyText(text);
            showToast('Copied to clipboard');
        }
    }

    function copyDay(b) {
        const text = `Day ${b.day} · ${b.name} — ${fmtDate(dayDate(b.day))}\nImpact: ${b.impact}/5\nCategory: ${b.category}\n\n${getDesc(b)}`;
        copyText(text);
        showToast('Day details copied');
    }

    function copyText(t) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(t).catch(() => fallbackCopy(t));
        } else {
            fallbackCopy(t);
        }
    }

    function fallbackCopy(t) {
        const ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
    }

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function exportJSON() {
        const data = {
            generatedAt: new Date().toISOString(),
            day1Date: '2026-04-22',
            today: TODAY_DAY,
            count: BUILDS.length,
            totalImpact: BUILDS.reduce((a, b) => a + b.impact, 0),
            builds: BUILDS.map(b => ({
                day: b.day,
                name: b.name,
                category: b.category,
                impact: b.impact,
                date: dayDate(b.day).toISOString().slice(0, 10),
                description: getDesc(b),
            })),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ajh-build-trail-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Trail exported');
    }

    // ---- Scroll to today on load ----
    function scrollToToday() {
        const todayCard = rail.querySelector('.trail-card.today');
        if (!todayCard || !stage) return;
        // Center the today card
        const target = todayCard.offsetLeft - (stage.clientWidth / 2) + (todayCard.offsetWidth / 2);
        stage.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }

    // ---- Keyboard nav ----
    function bindKeys() {
        document.addEventListener('keydown', (e) => {
            const sec = document.getElementById('trail');
            if (!sec) return;
            const rect = sec.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;
            // Don't intercept when typing in an input
            const tag = (e.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;

            if (e.key === 'ArrowRight' && !e.shiftKey) {
                e.preventDefault();
                stage.scrollBy({ left: 200, behavior: 'smooth' });
            } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
                e.preventDefault();
                stage.scrollBy({ left: -200, behavior: 'smooth' });
            } else if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                scrollToToday();
            } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                stage.scrollTo({ left: 0, behavior: 'smooth' });
            } else if (e.key === 'e' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                stage.scrollTo({ left: stage.scrollWidth, behavior: 'smooth' });
            }
        });
    }

    // ---- Init ----
    function init() {
        renderSummary();
        renderChips();
        renderRail();
        renderLeaderboard();
        closeBtn();
        bindKeys();
        applyFilter(state.filter || 'all');
        requestAnimationFrame(() => {
            updateProgress();
            scrollToToday();
        });

        // Buttons
        const todayBtn = document.getElementById('trail-today-btn');
        if (todayBtn) todayBtn.addEventListener('click', scrollToToday);
        const startBtn = document.getElementById('trail-start-btn');
        if (startBtn) startBtn.addEventListener('click', () => stage.scrollTo({ left: 0, behavior: 'smooth' }));
        const endBtn = document.getElementById('trail-end-btn');
        if (endBtn) endBtn.addEventListener('click', () => stage.scrollTo({ left: stage.scrollWidth, behavior: 'smooth' }));
        const exportBtn = document.getElementById('trail-export-btn');
        if (exportBtn) exportBtn.addEventListener('click', exportJSON);

        // Hero button scroll
        const heroBtn = document.getElementById('trail-hero-btn');
        if (heroBtn) heroBtn.addEventListener('click', () => {
            document.getElementById('trail')?.scrollIntoView({ behavior: 'smooth' });
        });

        // Public API
        window.ajhTrail = {
            open: (day) => {
                const b = BUILDS.find(x => x.day === day);
                if (b) openDetail(b);
            },
            scrollToToday,
            export: exportJSON,
        };

        // Wire into command palette if available
        document.addEventListener('ajh-command', (e) => {
            const cmd = e.detail && e.detail.command;
            if (cmd === 'trail-open') {
                document.getElementById('trail')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(scrollToToday, 400);
            } else if (cmd === 'trail-export') {
                exportJSON();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
