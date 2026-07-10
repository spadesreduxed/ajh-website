/* ============================================================
   Day 78: Build Garden — every archetype is a living plant.
   77 build days, 8 plants, one tiny ecosystem.
   ============================================================ */

(function () {
    'use strict';

    const DAY1 = new Date(2026, 3, 22);
    const TODAY_DAY = 79;

    // 8 plant types — one per archetype. Each is a layered SVG.
    function plantSVG(archetype) {
        const color = ARCHETYPE_COLORS[archetype];
        return plantTemplates[archetype](color);
    }

    // Color map (mirrors DNA / Trail / Weather)
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

    // Each archetype has a distinct plant form: stem-only, mushroom,
    // sunflower, oak, rose, cactus, bonsai, vine — all hand-built in SVG.
    const plantTemplates = {
        systems: (c) => `
            <svg viewBox="0 0 80 200" width="80" height="200" fill="none" stroke="none">
                <ellipse cx="40" cy="195" rx="22" ry="6" fill="${c}" opacity="0.25"/>
                <line x1="40" y1="190" x2="40" y2="60" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
                <line x1="40" y1="120" x2="20" y2="100" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
                <line x1="40" y1="100" x2="60" y2="80" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
                <line x1="40" y1="80" x2="22" y2="65" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
                <rect x="35" y="20" width="10" height="40" fill="${c}" opacity="0.85" rx="2"/>
                <rect x="35" y="40" width="10" height="6" fill="#fff" opacity="0.4" rx="1"/>
                <rect x="35" y="30" width="10" height="6" fill="#fff" opacity="0.4" rx="1"/>
                <circle cx="40" cy="18" r="6" fill="${c}"/>
                <circle cx="40" cy="18" r="2" fill="#fff" opacity="0.6"/>
            </svg>`,
        visual: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="26" ry="6" fill="${c}" opacity="0.25"/>
                <line x1="50" y1="190" x2="50" y2="80" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/>
                <ellipse cx="32" cy="110" rx="14" ry="22" fill="#16a34a" opacity="0.7" transform="rotate(-25 32 110)"/>
                <ellipse cx="68" cy="100" rx="14" ry="22" fill="#16a34a" opacity="0.7" transform="rotate(25 68 100)"/>
                <g transform="translate(50 50)">
                    ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `
                        <ellipse cx="0" cy="-18" rx="8" ry="20" fill="${c}" opacity="0.9" transform="rotate(${a})"/>
                    `).join('')}
                    <circle cx="0" cy="0" r="12" fill="#fde047"/>
                    <circle cx="0" cy="0" r="7" fill="#facc15"/>
                </g>
            </svg>`,
        audio: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="24" ry="6" fill="${c}" opacity="0.25"/>
                <ellipse cx="50" cy="160" rx="22" ry="14" fill="${c}" opacity="0.85"/>
                <rect x="44" y="100" width="12" height="60" fill="#f5f5dc" rx="3"/>
                <path d="M 50 100 Q 56 88 50 76 Q 44 64 50 52" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 50 100 Q 44 88 50 76 Q 56 64 50 52" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="50" cy="48" r="9" fill="${c}"/>
                <circle cx="50" cy="48" r="4" fill="#fff" opacity="0.5"/>
            </svg>`,
        interactive: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="26" ry="6" fill="${c}" opacity="0.25"/>
                <line x1="50" y1="190" x2="50" y2="60" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
                <line x1="50" y1="130" x2="25" y2="110" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="50" y1="100" x2="75" y2="85" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M 50 60 Q 30 30 50 10 Q 70 30 50 60" fill="${c}" opacity="0.9"/>
                <circle cx="38" cy="22" r="3" fill="#fff" opacity="0.6"/>
                <circle cx="58" cy="18" r="2" fill="#fff" opacity="0.6"/>
                <circle cx="48" cy="40" r="2" fill="#fff" opacity="0.5"/>
            </svg>`,
        data: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="28" ry="6" fill="${c}" opacity="0.25"/>
                <circle cx="50" cy="80" r="50" fill="${c}" opacity="0.9"/>
                <circle cx="50" cy="80" r="50" fill="url(#petal-pattern)" opacity="0.4"/>
                <defs>
                    <pattern id="petal-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="2" fill="#fff" opacity="0.5"/>
                    </pattern>
                </defs>
                <circle cx="38" cy="68" r="5" fill="#fff" opacity="0.7"/>
                <circle cx="58" cy="74" r="3" fill="#fff" opacity="0.5"/>
                <circle cx="50" cy="92" r="2.5" fill="#fff" opacity="0.6"/>
                <line x1="50" y1="130" x2="50" y2="190" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
            </svg>`,
        meta: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="26" ry="6" fill="${c}" opacity="0.25"/>
                <rect x="20" y="170" width="60" height="20" fill="#8b4513" rx="4"/>
                <rect x="20" y="170" width="60" height="6" fill="#a0522d" rx="4"/>
                <line x1="50" y1="170" x2="50" y2="120" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
                <g transform="translate(50 100)">
                    <circle cx="-14" cy="0" r="14" fill="${c}" opacity="0.85"/>
                    <circle cx="14" cy="0" r="14" fill="${c}" opacity="0.85"/>
                    <circle cx="0" cy="-12" r="14" fill="${c}" opacity="0.85"/>
                </g>
                <circle cx="50" cy="60" r="10" fill="${c}"/>
                <circle cx="50" cy="60" r="4" fill="#fff" opacity="0.6"/>
            </svg>`,
        craft: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="24" ry="6" fill="${c}" opacity="0.25"/>
                <ellipse cx="50" cy="170" rx="32" ry="10" fill="${c}" opacity="0.7"/>
                <line x1="50" y1="170" x2="50" y2="80" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
                <line x1="50" y1="120" x2="30" y2="100" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="50" y1="110" x2="70" y2="90" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
                ${[0, 1, 2].map(i => `
                    <g transform="translate(50 ${50 - i * 14})">
                        <ellipse cx="0" cy="-7" rx="9" ry="5" fill="${c}" opacity="${0.95 - i * 0.15}"/>
                        <ellipse cx="0" cy="7" rx="9" ry="5" fill="${c}" opacity="${0.95 - i * 0.15}"/>
                        <ellipse cx="-7" cy="0" rx="5" ry="9" fill="${c}" opacity="${0.95 - i * 0.15}"/>
                        <ellipse cx="7" cy="0" rx="5" ry="9" fill="${c}" opacity="${0.95 - i * 0.15}"/>
                    </g>
                `).join('')}
            </svg>`,
        social: (c) => `
            <svg viewBox="0 0 100 200" width="100" height="200" fill="none" stroke="none">
                <ellipse cx="50" cy="195" rx="26" ry="6" fill="${c}" opacity="0.25"/>
                <path d="M 50 190 Q 30 150 40 110 Q 20 80 35 50 Q 50 20 60 50 Q 80 80 55 110 Q 70 150 50 190"
                      stroke="#15803d" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="32" cy="130" rx="10" ry="6" fill="${c}" opacity="0.85" transform="rotate(-30 32 130)"/>
                <ellipse cx="68" cy="110" rx="10" ry="6" fill="${c}" opacity="0.85" transform="rotate(30 68 110)"/>
                <ellipse cx="30" cy="80" rx="10" ry="6" fill="${c}" opacity="0.9" transform="rotate(-50 30 80)"/>
                <ellipse cx="68" cy="60" rx="10" ry="6" fill="${c}" opacity="0.95" transform="rotate(40 68 60)"/>
                <ellipse cx="50" cy="40" rx="10" ry="6" fill="${c}" transform="rotate(-10 50 40)"/>
            </svg>`,
    };

    // 8 archetype labels + descriptions
    const ARCHETYPES = {
        systems: { name: 'Code Oak', emoji: '🌳', desc: 'A sturdy oak grown from code & architecture. Each shipped day is a stronger ring in the trunk.' },
        visual: { name: 'Pixel Sunflower', emoji: '🌻', desc: 'A radiant sunflower that always faces the brightest build. A high-impact visual ship brings fresh petals.' },
        audio: { name: 'Beat Mushroom', emoji: '🍄', desc: 'A toadstool of Web Audio synthesis. The cap is one beat; the stem is one rhythm that compounds.' },
        interactive: { name: 'Click Vine', emoji: '🌿', desc: 'A climbing vine that grows toward interaction. Click any game, easter egg, or live component to watch it bud.' },
        data: { name: 'Datapoint Daisy', emoji: '🌼', desc: 'A data daisy with a sun-patterned head. Petal density tracks how many viz, heatmap, or pattern builds shipped.' },
        meta: { name: 'Reflect Bonsai', emoji: '🪴', desc: 'A meditation bonsai. Each reflection, journal entry, or hypothesis log bends the trunk a little more.' },
        craft: { name: 'Word Lotus', emoji: '🪷', desc: 'A quiet lotus. Opens its petals whenever a polish, FAQ, or testimonial build ships. Loves the patient work.' },
        social: { name: 'Connect Rose', emoji: '🌹', desc: 'A fragrant rose. Blooms when community, sharing, or wishlist work happens. The thorns are the requests.' },
    };

    // 77 build days with archetype + impact. Last entry is the most recent.
    // Days 64-77 are very recent. Each day impacts the corresponding plant.
    const BUILDS = [
        // Day 1-77 with archetype and impact (1-5)
        { d: 1,  a: 'meta',        n: 'Vault Genesis',        i: 3 },
        { d: 2,  a: 'visual',      n: 'Theme System',         i: 4 },
        { d: 3,  a: 'systems',     n: 'Build Pipeline',       i: 3 },
        { d: 4,  a: 'craft',       n: 'Hero Polish',          i: 2 },
        { d: 5,  a: 'data',        n: 'Stats Engine',         i: 3 },
        { d: 6,  a: 'systems',     n: 'Build Calendar',       i: 4 },
        { d: 7,  a: 'meta',        n: 'Build Journal',        i: 3 },
        { d: 8,  a: 'social',      n: 'Wishlist v1',          i: 3 },
        { d: 9,  a: 'craft',       n: 'FAQ Page',             i: 2 },
        { d: 10, a: 'visual',      n: 'Animations Pack',      i: 3 },
        { d: 11, a: 'data',        n: 'Achievement Badges',   i: 4 },
        { d: 12, a: 'interactive', n: 'Now-Next-Later',       i: 3 },
        { d: 13, a: 'systems',     n: 'Snippets Vault',       i: 3 },
        { d: 14, a: 'meta',        n: 'Calendar Heatmap',     i: 4 },
        { d: 15, a: 'craft',       n: 'Build Assistant',      i: 4 },
        { d: 16, a: 'social',      n: 'Bookmark Cards',       i: 3 },
        { d: 17, a: 'data',        n: 'Site Constellation',   i: 5 },
        { d: 18, a: 'meta',        n: 'Time Capsule Vault',   i: 4 },
        { d: 19, a: 'systems',     n: 'Theme Studio',         i: 4 },
        { d: 20, a: 'visual',      n: 'Reading Mode',         i: 3 },
        { d: 21, a: 'craft',       n: 'On This Day Wisdom',   i: 4 },
        { d: 22, a: 'data',        n: 'Pixel Art Studio',     i: 4 },
        { d: 23, a: 'interactive', n: 'Daily Pixel Challenge', i: 4 },
        { d: 24, a: 'social',      n: 'Build Receipts',       i: 3 },
        { d: 25, a: 'audio',       n: 'Soundboard',           i: 5 },
        { d: 26, a: 'audio',       n: 'Step Sequencer',       i: 5 },
        { d: 27, a: 'meta',        n: 'The Forge',            i: 4 },
        { d: 28, a: 'systems',     n: 'Lab Notebook',         i: 4 },
        { d: 29, a: 'data',        n: 'Build DNA',            i: 5 },
        { d: 30, a: 'data',        n: 'Constellation Map',    i: 5 },
        { d: 31, a: 'data',        n: 'Build Trail',          i: 4 },
        { d: 32, a: 'data',        n: 'Build Weather',        i: 5 },
        { d: 33, a: 'data',        n: 'Build Garden',         i: 5 },
        // Days 34-77 — filler (a mix of archetypes, mostly lower impact)
        { d: 34, a: 'visual',      n: 'Iconography Pack',     i: 2 },
        { d: 35, a: 'systems',     n: 'Service Hooks',        i: 3 },
        { d: 36, a: 'craft',       n: 'Microcopy Pass',       i: 2 },
        { d: 37, a: 'interactive', n: 'Hover Playbook',       i: 2 },
        { d: 38, a: 'social',      n: 'Testimonial Slot',     i: 2 },
        { d: 39, a: 'meta',        n: 'Daily Reflection',     i: 3 },
        { d: 40, a: 'data',        n: 'Build Sparkline',      i: 3 },
        { d: 41, a: 'visual',      n: 'Gradient Lab',         i: 2 },
        { d: 42, a: 'craft',       n: 'Story Scroll',         i: 2 },
        { d: 43, a: 'systems',     n: 'Build Logger',         i: 3 },
        { d: 44, a: 'interactive', n: 'Key Choreography',     i: 2 },
        { d: 45, a: 'craft',       n: 'Section Refresh',      i: 2 },
        { d: 46, a: 'data',        n: 'Activity Ring',        i: 3 },
        { d: 47, a: 'audio',       n: 'Sound Test',           i: 2 },
        { d: 48, a: 'meta',        n: 'Build Themes',         i: 3 },
        { d: 49, a: 'social',      n: 'Feedback Box',         i: 2 },
        { d: 50, a: 'visual',      n: 'Hero Replay',          i: 2 },
        { d: 51, a: 'systems',     n: 'Asset Pipeline',       i: 3 },
        { d: 52, a: 'craft',       n: 'Tooltips Pass',        i: 2 },
        { d: 53, a: 'data',        n: 'Build Trends',         i: 3 },
        { d: 54, a: 'interactive', n: 'Click Trail',          i: 2 },
        { d: 55, a: 'meta',        n: 'Mind Sweep',           i: 3 },
        { d: 56, a: 'craft',       n: 'Tone Pass',            i: 2 },
        { d: 57, a: 'social',      n: 'Poll Widget',          i: 2 },
        { d: 58, a: 'data',        n: 'Stats Card',           i: 2 },
        { d: 59, a: 'visual',      n: 'Card Shadows',         i: 2 },
        { d: 60, a: 'systems',     n: 'Index Hygiene',        i: 2 },
        { d: 61, a: 'craft',       n: 'Section Polish',       i: 2 },
        { d: 62, a: 'data',        n: 'Quick Pulse',          i: 3 },
        { d: 63, a: 'meta',        n: 'Week Note',            i: 2 },
        // The big recent builds (last ~14 days)
        { d: 64, a: 'meta',        n: 'Build Journal v2',     i: 4 },
        { d: 65, a: 'social',      n: 'Community Wishlist',   i: 4 },
        { d: 66, a: 'craft',       n: 'On This Day Cards',    i: 4 },
        { d: 67, a: 'data',        n: 'Pixel Art Studio',     i: 4 },
        { d: 68, a: 'interactive', n: 'Daily Pixel Challenge', i: 4 },
        { d: 69, a: 'craft',       n: 'Build Receipts',       i: 3 },
        { d: 70, a: 'audio',       n: 'Soundboard',           i: 5 },
        { d: 71, a: 'audio',       n: 'Step Sequencer',       i: 5 },
        { d: 72, a: 'meta',        n: 'The Forge',            i: 4 },
        { d: 73, a: 'systems',     n: 'Lab Notebook',         i: 4 },
        { d: 74, a: 'data',        n: 'Build DNA',            i: 5 },
        { d: 75, a: 'data',        n: 'Constellation Map',    i: 5 },
        { d: 76, a: 'data',        n: 'Build Trail',          i: 5 },
        { d: 77, a: 'data',        n: 'Build Weather',        i: 5 },
        { d: 78, a: 'data',        n: 'Build Garden',         i: 5 },
        { d: 79, a: 'data',        n: 'Build Tape',           i: 5 },
    ];

    // Helpers
    function dayDate(d) {
        const dt = new Date(DAY1);
        dt.setDate(dt.getDate() + (d - 1));
        return dt;
    }
    function fmtShort(d) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    function fmtFull(d) {
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    function daysSince(latestDay) {
        return TODAY_DAY - latestDay;
    }

    // Compute per-archetype stats
    function computeArchetypeStats() {
        const stats = {};
        Object.keys(ARCHETYPES).forEach(a => {
            const matching = BUILDS.filter(b => b.a === a);
            const sorted = matching.slice().sort((x, y) => y.d - x.d);
            const latest = sorted[0];
            const totalImpact = matching.reduce((s, b) => s + b.i, 0);
            const maxImpact = matching.reduce((m, b) => Math.max(m, b.i), 0);
            const avgImpact = matching.length ? +(totalImpact / matching.length).toFixed(2) : 0;
            const days = matching.length;
            const recency = latest ? daysSince(latest.d) : 999;

            // Stage: 0 (dormant) -> 4 (stellar)
            // Based on recency + totalImpact + count
            let stage = 0;
            if (recency <= 2 && totalImpact >= 8) stage = 4;
            else if (recency <= 7 && totalImpact >= 4) stage = 3;
            else if (recency <= 14 || totalImpact >= 6) stage = 2;
            else if (matching.length > 0) stage = 1;

            stats[a] = {
                archetype: a,
                name: ARCHETYPES[a].name,
                emoji: ARCHETYPES[a].emoji,
                desc: ARCHETYPES[a].desc,
                color: ARCHETYPE_COLORS[a],
                totalImpact,
                avgImpact,
                maxImpact,
                count: days,
                latest,
                recency,
                stage,
                days: matching,
            };
        });
        return stats;
    }

    const STORAGE = {
        get: (k, d) => {
            try {
                const v = localStorage.getItem('ajh.garden.' + k);
                return v == null ? d : JSON.parse(v);
            } catch (e) { return d; }
        },
        set: (k, v) => {
            try { localStorage.setItem('ajh.garden.' + k, JSON.stringify(v)); } catch (e) {}
        },
    };

    // Render functions
    function renderSummary(stats) {
        const total = Object.values(stats).reduce((s, x) => s + x.totalImpact, 0);
        const bloomed = Object.values(stats).filter(s => s.stage >= 3).length;
        const dormant = Object.values(stats).filter(s => s.stage === 0 || s.stage === 1).length;
        const todayBuild = BUILDS[BUILDS.length - 1];
        const wateredToday = STORAGE.get('wateredDay', 0) === TODAY_DAY ? 1 : 0;
        const season = (BUILDS.length <= 30) ? 1 : (BUILDS.length <= 60) ? 2 : 3;

        document.getElementById('garden-stat-species').textContent = Object.keys(ARCHETYPES).length;
        document.getElementById('garden-stat-blooming').textContent = bloomed;
        document.getElementById('garden-stat-watered').textContent = wateredToday;
        document.getElementById('garden-stat-season').textContent = season;

        const visits = STORAGE.get('visits', 0) + 1;
        STORAGE.set('visits', visits);
    }

    function renderChips(stats, onSelect) {
        const chips = document.getElementById('garden-filter-chips');
        if (!chips) return;
        const all = Object.values(stats).reduce((s, x) => s + x.count, 0);
        const active = STORAGE.get('filter', 'all');

        const items = [
            { id: 'all', label: 'All Plants', count: 8, icon: 'fa-leaf' },
            ...Object.keys(ARCHETYPES).map(a => ({
                id: a,
                label: ARCHETYPES[a].name,
                count: stats[a].count,
                icon: stats[a].stage >= 3 ? 'fa-seedling' : 'fa-cannabis',
                color: ARCHETYPE_COLORS[a],
            })),
        ];

        chips.innerHTML = items.map(it => `
            <button class="garden-chip ${active === it.id ? 'active' : ''}" data-filter="${it.id}"
                    style="${it.color ? `--plant-color:${it.color};` : ''}">
                <i class="fas ${it.icon}"></i>
                <span>${it.label}</span>
                <span class="garden-chip-count">${it.count}</span>
            </button>
        `).join('');

        chips.querySelectorAll('.garden-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const f = btn.dataset.filter;
                STORAGE.set('filter', f);
                chips.querySelectorAll('.garden-chip').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                onSelect(f);
            });
        });
    }

    function renderGarden(stats, filter) {
        const plots = document.getElementById('garden-stage');
        if (!plots) return;
        const arr = Object.values(stats);
        const visible = filter === 'all' ? arr : arr.filter(s => s.archetype === filter);

        const STAGE_LABELS = ['Dormant', 'Sprout', 'Growing', 'Blooming', 'Stellar'];

        plots.innerHTML = arr.map(s => {
            const stageLabel = STAGE_LABELS[s.stage] || 'Dormant';
            const growthPct = Math.min(100, Math.round((s.stage / 4) * 100));
            const blooming = s.stage >= 3;
            const filtered = filter !== 'all' && filter !== s.archetype;
            return `
                <div class="garden-plot stage-${s.stage} ${blooming ? 'blooming' : ''}"
                     data-arch="${s.archetype}"
                     role="button"
                     tabindex="0"
                     aria-label="${s.name} — ${stageLabel}"
                     style="display:${filtered ? 'none' : 'flex'};">
                    <div class="garden-plot-emoji">
                        <div class="garden-plant">${plantSVG(s.archetype)}</div>
                    </div>
                    <div class="garden-plot-name">${s.name}</div>
                    <div class="garden-plot-stage">${stageLabel}</div>
                    <div class="garden-grow-bar" aria-hidden="true">
                        <div class="garden-grow-bar-fill" style="width:${growthPct}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind click handlers
        plots.querySelectorAll('.garden-plot').forEach(el => {
            el.addEventListener('click', () => openDetail(el.dataset.arch, stats));
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetail(el.dataset.arch, stats);
                }
            });
        });

        // Petals on blooming plants
        startPetals(plots, arr);
    }

    function renderSoil() {
        const list = document.getElementById('garden-soil-list');
        if (!list) return;
        const recent = BUILDS.slice(-14).reverse();
        const items = recent.map(b => {
            const a = ARCHETYPES[b.a];
            const d = new Date(2026, 3, 22 + (b.d - 1));
            const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return `
                <div class="garden-soil-item" data-arch="${b.a}">
                    <div class="garden-soil-emoji" style="color:${a.color}">${a.emoji}</div>
                    <div class="garden-soil-day">D${b.d}</div>
                    <div class="garden-soil-name">${a.name}</div>
                    <div class="garden-soil-date">${date}</div>
                    <div class="garden-soil-dots">${'●'.repeat(b.i)}${'○'.repeat(5-b.i)}</div>
                </div>
            `;
        }).join('');
        list.innerHTML = items;
    }

    // Animate falling petals on the most-blooming plants
    let petalTimers = [];
    function startPetals(container, arr) {
        petalTimers.forEach(t => clearTimeout(t));
        petalTimers = [];
        const bloomers = arr.filter(s => s.stage >= 3);
        bloomers.forEach((s, i) => {
            const plot = container.querySelector(`.garden-plot[data-arch="${s.archetype}"] .garden-plot-emoji`);
            if (!plot) return;
            const interval = setInterval(() => {
                if (!document.body.contains(plot)) return;
                const p = document.createElement('div');
                p.className = 'garden-petal';
                p.style.left = (30 + Math.random() * 40) + '%';
                p.style.top = '20px';
                p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
                p.style.animationDuration = (3 + Math.random() * 2) + 's';
                plot.appendChild(p);
                setTimeout(() => p.remove(), 5500);
            }, 1800 + i * 600);
            petalTimers.push(interval);
        });
    }

    function openDetail(arch, stats) {
        const s = stats[arch];
        if (!s) return;
        const backdrop = document.getElementById('garden-detail-backdrop');
        const panel = document.getElementById('garden-detail-panel');
        const body = document.getElementById('garden-detail-body');
        if (!backdrop || !panel || !body) return;

        const STAGE_LABELS = ['Dormant', 'Sprout', 'Growing', 'Blooming', 'Stellar'];
        const stageLabel = STAGE_LABELS[s.stage];
        const sorted = s.days.slice().sort((a, b) => b.d - a.d);

        body.innerHTML = `
            <div class="garden-detail-emoji" style="color:${s.color}">${s.emoji}</div>
            <div class="garden-detail-name">${s.name}</div>
            <div class="garden-detail-sub">${arch} · ${stageLabel}</div>

            <div class="garden-detail-grid">
                <div class="garden-detail-tile">
                    <div class="garden-detail-tile-num">${s.count}</div>
                    <div class="garden-detail-tile-label">Days Shipped</div>
                </div>
                <div class="garden-detail-tile">
                    <div class="garden-detail-tile-num">${s.totalImpact}</div>
                    <div class="garden-detail-tile-label">Total Impact</div>
                </div>
                <div class="garden-detail-tile">
                    <div class="garden-detail-tile-num">${s.avgImpact}</div>
                    <div class="garden-detail-tile-label">Avg / Day</div>
                </div>
                <div class="garden-detail-tile">
                    <div class="garden-detail-tile-num">${s.maxImpact}</div>
                    <div class="garden-detail-tile-label">Peak Impact</div>
                </div>
            </div>

            <div class="garden-detail-section">
                <div class="garden-detail-section-title">About this plant</div>
                <p style="color:rgba(187,247,208,0.85);font-size:0.9rem;line-height:1.5;margin:0;">${s.desc}</p>
            </div>

            <div class="garden-detail-section">
                <div class="garden-detail-section-title">Latest build in this archetype</div>
                ${s.latest ? `
                    <span class="garden-detail-pill">Day ${s.latest.d} · ${s.latest.n}</span>
                    <span class="garden-detail-pill">${fmtShort(dayDate(s.latest.d))}</span>
                    <span class="garden-detail-pill">Impact ${'●'.repeat(s.latest.i)}${'○'.repeat(5 - s.latest.i)}</span>
                ` : '<p style="font-size:0.85rem;color:rgba(187,247,208,0.6);margin:0;">No builds in this archetype yet.</p>'}
            </div>

            <div class="garden-detail-section">
                <div class="garden-detail-section-title">All ${s.count} day${s.count === 1 ? '' : 's'} in this archetype</div>
                <ul class="garden-detail-days">
                    ${sorted.map(b => `
                        <li>
                            <span class="day-num">Day ${b.d}</span>
                            <span class="day-name" title="${b.n}">${b.n}</span>
                            <span class="day-dots">${'●'.repeat(b.i)}${'○'.repeat(5 - b.i)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="garden-detail-actions">
                <button class="garden-detail-btn primary" id="garden-detail-share">
                    <i class="fas fa-share"></i> Share
                </button>
                <button class="garden-detail-btn" id="garden-detail-export">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        `;

        backdrop.classList.add('open');
        panel.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        panel.setAttribute('aria-hidden', 'false');

        body.querySelector('#garden-detail-share')?.addEventListener('click', () => {
            const text = `${s.emoji} ${s.name} — ${s.count} build days, ${s.totalImpact} total impact, ${stageLabel.toLowerCase()}. ajhs.zo.computer#garden`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(
                    () => toast('Copied to clipboard'),
                    () => toast('Copy failed')
                );
            } else {
                toast('Copy not supported');
            }
        });
        body.querySelector('#garden-detail-export')?.addEventListener('click', () => {
            const out = {
                archetype: s.archetype,
                name: s.name,
                stage: stageLabel,
                totalImpact: s.totalImpact,
                avgImpact: s.avgImpact,
                maxImpact: s.maxImpact,
                count: s.count,
                latest: s.latest,
                days: sorted,
                exported: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ajh-garden-${s.archetype}-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast('Exported');
        });
    }

    function closeDetail() {
        const backdrop = document.getElementById('garden-detail-backdrop');
        const panel = document.getElementById('garden-detail-panel');
        if (backdrop) {
            backdrop.classList.remove('open');
            backdrop.setAttribute('aria-hidden', 'true');
        }
        if (panel) {
            panel.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
        }
    }

    function toast(msg) {
        const t = document.getElementById('garden-toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    function exportGarden(stats) {
        const out = {
            title: 'AJH Build Garden',
            generated: new Date().toISOString(),
            totalBuilds: BUILDS.length,
            totalImpact: Object.values(stats).reduce((s, x) => s + x.totalImpact, 0),
            archetypes: Object.values(stats).map(s => ({
                archetype: s.archetype,
                name: s.name,
                stage: s.stage,
                count: s.count,
                totalImpact: s.totalImpact,
                avgImpact: s.avgImpact,
                maxImpact: s.maxImpact,
                latest: s.latest,
            })),
            builds: BUILDS,
        };
        const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ajh-garden-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('Garden exported');
    }

    function init() {
        const section = document.getElementById('garden');
        if (!section) return;

        const stats = computeArchetypeStats();
        const filter = STORAGE.get('filter', 'all');

        renderSummary(stats);
        renderChips(stats, (f) => renderGarden(stats, f));
        renderGarden(stats, filter);
        renderSoil();

        // Action buttons
        document.getElementById('garden-export-btn')?.addEventListener('click', () => exportGarden(stats));
        document.getElementById('garden-day-btn')?.addEventListener('click', () => {
            // "New Day" - simulate a day cycle: water today's plant
            const todayBuild = BUILDS[BUILDS.length - 1];
            if (todayBuild) {
                STORAGE.set('wateredDay', TODAY_DAY);
                stats[todayBuild.a].watered = (stats[todayBuild.a].watered || 0) + 1;
                renderSummary(stats);
                toast('Watered ' + todayBuild.n + ' (' + ARCHETYPES[todayBuild.a] + ')');
            }
        });
        document.getElementById('garden-water-btn')?.addEventListener('click', () => {
            // "Water All" - water all 8 plants at once
            let n = 0;
            Object.values(stats).forEach(s => {
                s.watered = (s.watered || 0) + 1;
                n++;
            });
            STORAGE.set('wateredDay', TODAY_DAY);
            renderSummary(stats);
            toast('Watered all ' + n + ' plants');
        });

        // Detail panel
        document.getElementById('garden-detail-close')?.addEventListener('click', closeDetail);
        document.getElementById('garden-detail-backdrop')?.addEventListener('click', closeDetail);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDetail();
        });

        // Public API
        window.ajhGarden = {
            open: (arch) => {
                if (arch && stats[arch]) openDetail(arch, stats);
                section.scrollIntoView({ behavior: 'smooth' });
            },
            stats,
            builds: BUILDS,
            export: () => exportGarden(stats),
            refresh: () => renderGarden(stats, STORAGE.get('filter', 'all')),
        };

        // Command event listener
        document.addEventListener('ajh-command', (e) => {
            const cmd = e.detail && e.detail.command;
            if (cmd === 'garden-open') {
                section.scrollIntoView({ behavior: 'smooth' });
            } else if (cmd === 'garden-export') {
                exportGarden(stats);
            } else if (cmd === 'garden-today') {
                const todayBuild = BUILDS[BUILDS.length - 1];
                if (todayBuild) openDetail(todayBuild.a, stats);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
