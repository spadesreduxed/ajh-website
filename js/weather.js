/* ============================================================
   Day 77: Build Weather — every build day is a weather report.
   ============================================================ */

(function () {
    'use strict';

    // Day 1 = 2026-04-22, today is Day 77 = 2026-07-06
    const DAY1 = new Date(2026, 3, 22);
    const TODAY_DAY = 83;

    // Archetype color map (mirrors DNA + Trail)
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

    // 8 weather archetypes mapped to DNA categories.
    // Each has an icon (Font Awesome weather), a label, a color, and a description.
    const WEATHER = {
        systems: {
            label: 'Engineered',
            icon: 'fa-bolt',
            emoji: '⚡',
            condition: 'High-Pressure Systems',
            desc: 'Structured builds with code architecture, automation, and frameworks.',
            color: '#a855f7',
        },
        visual: {
            label: 'Sunny',
            icon: 'fa-sun',
            emoji: '☀️',
            condition: 'Bright Skies',
            desc: 'Pure visual work — animations, design tokens, art, illustrations.',
            color: '#ec4899',
        },
        audio: {
            label: 'Torrential',
            icon: 'fa-cloud-showers-heavy',
            emoji: '🌧',
            condition: 'Sound Storms',
            desc: 'Audio synthesis, beat machines, soundboards — waves and tones.',
            color: '#3b82f6',
        },
        interactive: {
            label: 'Thunder',
            icon: 'fa-bolt-lightning',
            emoji: '⛈',
            condition: 'Interactive Storms',
            desc: 'Games, easter eggs, and anything you can click and watch react.',
            color: '#10b981',
        },
        data: {
            label: 'Cloudy',
            icon: 'fa-cloud',
            emoji: '☁️',
            condition: 'Data Overcast',
            desc: 'Viz, dashboards, heatmaps, genomes, starfields — pattern work.',
            color: '#f59e0b',
        },
        meta: {
            label: 'Foggy',
            icon: 'fa-smog',
            emoji: '🌫',
            condition: 'Meta Haze',
            desc: 'Reflection, journaling, hypothesis logs, thinking tools.',
            color: '#8b5cf6',
        },
        craft: {
            label: 'Partly Cloudy',
            icon: 'fa-cloud-sun',
            emoji: '⛅',
            condition: 'Craft Breezes',
            desc: 'Quotes, FAQs, testimonials, blog writing — polished prose.',
            color: '#06b6d4',
        },
        social: {
            label: 'Windy',
            icon: 'fa-wind',
            emoji: '💨',
            condition: 'Social Winds',
            desc: 'Sharing, communities, wishlists, public surfaces.',
            color: '#f43f5e',
        },
    };

    // Build data — 77 days, mirrors DNA/Trail exactly.
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
        { day: 27, name: 'Easter Egg + Cursor Trail',              category: 'interactive', impact: 2 },
        { day: 28, name: 'Live Clock + Hero Meta',                 category: 'visual',      impact: 2 },
        { day: 29, name: 'Typewriter Role Text',                   category: 'visual',      impact: 2 },
        { day: 30, name: 'Skills Bars + Filter',                   category: 'data',        impact: 2 },
        { day: 31, name: 'Project Filter System',                  category: 'systems',     impact: 3 },
        { day: 32, name: 'Project Detail Modal',                   category: 'systems',     impact: 3 },
        { day: 33, name: 'Testimonials + Footer',                  category: 'social',      impact: 2 },
        { day: 34, name: 'Hover Effects + Scroll Animations',      category: 'visual',      impact: 3 },
        { day: 35, name: 'Music Player',                           category: 'audio',       impact: 4 },
        { day: 36, name: 'Daily Challenge Gamification',           category: 'interactive', impact: 3 },
        { day: 37, name: '2026 Design Features',                   category: 'visual',      impact: 4 },
        { day: 38, name: 'Ambient Sound + Smart Nav',              category: 'audio',       impact: 3 },
        { day: 39, name: 'Scroll Reveal Animations',               category: 'visual',      impact: 2 },
        { day: 40, name: 'Productivity Corner',                    category: 'systems',     impact: 4 },
        { day: 41, name: 'Hero Date Display',                      category: 'visual',      impact: 1 },
        { day: 42, name: 'World Clock Widget',                     category: 'data',        impact: 2 },
        { day: 43, name: 'Weather Widget',                         category: 'data',        impact: 2 },
        { day: 44, name: 'Code Playground',                        category: 'interactive', impact: 3 },
        { day: 45, name: 'Crypto Price Tracker',                   category: 'data',        impact: 2 },
        { day: 46, name: 'Command Palette (Ctrl+K)',               category: 'systems',     impact: 4 },
        { day: 47, name: 'Site Tour + Interactive Timeline',       category: 'craft',       impact: 3 },
        { day: 48, name: 'API Status Dashboard',                   category: 'systems',     impact: 3 },
        { day: 49, name: 'Music Player (Lo-fi)',                   category: 'audio',       impact: 4 },
        { day: 50, name: 'Stats Bento + Live Visitor',             category: 'data',        impact: 3 },
        { day: 51, name: 'Keyboard Game',                          category: 'interactive', impact: 3 },
        { day: 52, name: 'On This Day Cards',                      category: 'craft',       impact: 3 },
        { day: 53, name: 'Focus Timer + Notes',                    category: 'systems',     impact: 3 },
        { day: 54, name: 'Daily Plan Board',                       category: 'craft',       impact: 3 },
        { day: 55, name: 'Reading Mode + List',                    category: 'craft',       impact: 3 },
        { day: 56, name: 'Code Snippets Vault',                    category: 'craft',       impact: 4 },
        { day: 57, name: 'Build Calendar Heatmap',                 category: 'data',        impact: 4 },
        { day: 58, name: 'Achievement Badges Expanded',            category: 'data',        impact: 3 },
        { day: 59, name: 'Bookmark Cards',                         category: 'social',      impact: 3 },
        { day: 60, name: 'Site Constellation Graph',               category: 'data',        impact: 4 },
        { day: 61, name: 'Time Capsule Vault',                     category: 'craft',       impact: 4 },
        { day: 62, name: 'Theme Studio',                           category: 'visual',      impact: 4 },
        { day: 63, name: 'Reading Mode + Reading List',            category: 'craft',       impact: 3 },
        { day: 64, name: 'Build Journal',                          category: 'meta',        impact: 3 },
        { day: 65, name: 'Community Wishlist',                     category: 'social',      impact: 3 },
        { day: 66, name: 'On This Day / Builder Wisdom',           category: 'craft',       impact: 4 },
        { day: 67, name: 'Pixel Art Studio',                       category: 'visual',      impact: 4 },
        { day: 68, name: 'Daily Pixel Challenge',                  category: 'interactive', impact: 3 },
        { day: 69, name: 'Build Receipts',                         category: 'craft',       impact: 4 },
        { day: 70, name: 'Soundboard (26 pads)',                   category: 'audio',       impact: 4 },
        { day: 71, name: 'Step Sequencer',                         category: 'audio',       impact: 4 },
        { day: 72, name: 'The Forge (Reflection Studio)',          category: 'meta',        impact: 4 },
        { day: 73, name: 'Lab Notebook (Hypothesis Log)',          category: 'meta',        impact: 4 },
        { day: 74, name: 'Build DNA (Pattern Genome)',             category: 'data',        impact: 4 },
        { day: 75, name: 'Constellation Map (75 Stars)',           category: 'visual',      impact: 4 },
        { day: 76, name: 'Build Trail (Chronological Ribbon)',     category: 'data',        impact: 3 },
        { day: 78, name: 'Build Garden', category: 'data', impact: 5 },
        { day: 79, name: 'Build Tape', category: 'data', impact: 5 },
        { day: 80, name: 'Build Skyline', category: 'data', impact: 5 },
        { day: 81, name: 'Build Aquarium', category: 'craft', impact: 5 },
        { day: 82, name: 'Build Observatory', category: 'data', impact: 5 },
        { day: 83, name: 'Build Waveform', category: 'audio', impact: 5 },
    ];

    // Short descriptions for the day list
    const DESCRIPTIONS = {
        systems: 'Engineering, automation, framework work.',
        visual: 'Design tokens, animations, polish, art.',
        audio: 'Web Audio synthesis, beats, soundscapes.',
        interactive: 'Games, easter eggs, clickable reactions.',
        data: 'Heatmaps, dashboards, viz, pattern work.',
        meta: 'Reflection, journaling, hypothesis logs.',
        craft: 'Writing, FAQs, quotes, polished prose.',
        social: 'Sharing, communities, public surfaces.',
    };

    const STORAGE = 'ajh_weather_v1';

    // ---- helpers ----
    function dayDate(day) {
        const d = new Date(DAY1);
        d.setDate(d.getDate() + (day - 1));
        return d;
    }

    function fmtLong(d) {
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    function fmtShort(d) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function fmtWeekday(d) {
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Convert impact 1-5 to "temperature" (°F feel)
    // impact 1 = 38° (chilly), 3 = 65° (mild), 5 = 92° (hot)
    function impactToTemp(impact) {
        return Math.round(38 + (impact - 1) * 13.5);
    }

    // Compose the local "now" — use real today if matching, else the highest day.
    function getNowDay() {
        return TODAY_DAY;
    }

    // Current-conditions synthetic reading
    function getCurrent() {
        const now = BUILDS.find(b => b.day === TODAY_DAY);
        if (!now) return null;
        const wx = WEATHER[now.category];
        return {
            build: now,
            weather: wx,
            temp: impactToTemp(now.impact),
            feels: impactToTemp(now.impact) - 2,
            humidity: 40 + (now.impact * 8),
            wind: 5 + (now.impact * 3),
        };
    }

    // ---- storage ----
    function load() {
        try {
            const raw = localStorage.getItem(STORAGE);
            if (!raw) return { filter: 'all', views: 0 };
            return JSON.parse(raw);
        } catch (e) {
            return { filter: 'all', views: 0 };
        }
    }
    function save(state) {
        try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch (e) {}
    }

    // ---- render: current conditions ----
    function renderCurrent(state) {
        const c = getCurrent();
        if (!c) return;
        const root = document.getElementById('wx-current-icon');
        const locEl = document.getElementById('wx-current-loc');
        const tempEl = document.getElementById('wx-current-temp');
        const condEl = document.getElementById('wx-current-cond');
        const descEl = document.getElementById('wx-current-desc');

        if (root) {
            root.innerHTML = `<i class="fas ${c.weather.icon}"></i>`;
        }
        if (locEl) {
            locEl.textContent = `Build Site · Day ${c.build.day} Forecast`;
        }
        if (tempEl) {
            tempEl.innerHTML = `${c.temp}<span class="wx-temp-unit">°F</span>`;
        }
        if (condEl) {
            condEl.textContent = `${c.weather.condition} · ${c.weather.label}`;
        }
        if (descEl) {
            descEl.textContent = `${fmtLong(dayDate(c.build.day))} — ${c.build.name}. ${c.weather.desc}`;
        }

        const fEl = document.getElementById('wx-current-feels');
        const hEl = document.getElementById('wx-current-humidity');
        const wEl = document.getElementById('wx-current-wind');
        const pEl = document.getElementById('wx-current-pressure');
        if (fEl) fEl.textContent = `${c.feels}°F`;
        if (hEl) hEl.textContent = `${c.humidity}%`;
        if (wEl) wEl.textContent = `${c.wind} mph`;
        if (pEl) pEl.textContent = `${(1010 + c.build.impact * 2).toFixed(0)} hPa`;
    }

    // ---- render: 7-day outlook ----
    function renderOutlook(state) {
        const wrap = document.getElementById('wx-outlook');
        if (!wrap) return;
        wrap.innerHTML = '';

        // Show last 3 + today + next 3
        const items = [];
        for (let d = Math.max(1, TODAY_DAY - 3); d <= TODAY_DAY + 3; d++) {
            const b = BUILDS.find(x => x.day === d);
            if (b) items.push(b);
        }

        items.forEach(b => {
            const wx = WEATHER[b.category];
            const d = dayDate(b.day);
            const isToday = b.day === TODAY_DAY;
            const isFuture = b.day > TODAY_DAY;
            const div = document.createElement('div');
            div.className = 'wx-day' + (isToday ? ' wx-day-today' : '') + (isFuture ? ' wx-day-future' : '');
            div.style.setProperty('--wx-day-color', wx.color);
            div.dataset.day = b.day;

            const nameLabel = isToday ? 'Today' : fmtWeekday(d);
            let impactDots = '';
            for (let i = 1; i <= 5; i++) {
                impactDots += `<span class="dot${i <= b.impact ? ' on' : ''}"></span>`;
            }

            div.innerHTML = `
                <span class="wx-day-name">${nameLabel}</span>
                <span class="wx-day-icon" style="color: ${wx.color}"><i class="fas ${wx.icon}"></i></span>
                <span class="wx-day-temp">${impactToTemp(b.impact)}°</span>
                <span class="wx-day-cond">${wx.label}</span>
                <span class="wx-day-impact" aria-label="Impact ${b.impact} of 5">${impactDots}</span>
            `;
            div.addEventListener('click', () => {
                // When a future day is clicked, copy a "forecast" line to clipboard.
                if (isFuture) {
                    const line = `Day ${b.day} forecast — ${wx.label} ${impactToTemp(b.impact)}°F · ${b.name}`;
                    copyToClipboard(line);
                    showToast(`<i class="fas fa-cloud-sun"></i> Day ${b.day} forecast copied`);
                } else {
                    const card = document.querySelector(`.wx-card[data-day="${b.day}"]`);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.style.outline = '2px solid ' + wx.color;
                        setTimeout(() => { card.style.outline = ''; }, 1400);
                    }
                }
            });
            wrap.appendChild(div);
        });
    }

    // ---- render: filter chips ----
    function renderChips(state) {
        const wrap = document.getElementById('wx-filter-chips');
        if (!wrap) return;
        wrap.innerHTML = '';
        const cats = ['all', ...Object.keys(WEATHER)];
        cats.forEach(cat => {
            const isAll = cat === 'all';
            const label = isAll ? 'All 77' : WEATHER[cat].label;
            const color = isAll ? '#7dd3fc' : WEATHER[cat].color;
            const count = isAll ? BUILDS.length : BUILDS.filter(b => b.category === cat).length;
            const chip = document.createElement('button');
            chip.className = 'wx-chip' + (state.filter === cat ? ' active' : '');
            chip.style.setProperty('--wx-chip-color', color);
            chip.innerHTML = `<span class="sw"></span> ${label} <span style="opacity:0.55">${count}</span>`;
            chip.addEventListener('click', () => {
                state.filter = cat;
                save(state);
                renderChips(state);
                renderList(state);
                renderClimate(state);
                renderSummary(state);
            });
            wrap.appendChild(chip);
        });
    }

    // ---- render: summary stats ----
    function renderSummary(state) {
        const filtered = state.filter === 'all' ? BUILDS : BUILDS.filter(b => b.category === state.filter);

        // The current "weather" of the build climate
        const counts = {};
        BUILDS.forEach(b => { counts[b.category] = (counts[b.category] || 0) + 1; });
        const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        const dominantWx = WEATHER[dominant];

        const avgImpact = BUILDS.reduce((s, b) => s + b.impact, 0) / BUILDS.length;
        const avgTemp = impactToTemp(avgImpact);
        const massive = BUILDS.filter(b => b.impact >= 4).length;
        const storm = BUILDS.filter(b => b.category === 'audio' || b.category === 'interactive').length;

        const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
        set('wx-stat-pattern', dominantWx.label);
        set('wx-stat-temp', `${avgTemp}°F`);
        set('wx-stat-storms', storm);
        set('wx-stat-massive', massive);
    }

    // ---- render: climate SVG strip ----
    function renderClimate(state) {
        const wrap = document.getElementById('wx-climate-svg');
        if (!wrap) return;
        const filtered = state.filter === 'all' ? BUILDS : BUILDS.filter(b => b.category === state.filter);
        if (filtered.length === 0) return;

        // viewBox uses width 1000, height 220
        const W = 1000;
        const H = 220;
        const padX = 30;
        const padTop = 30;
        const padBot = 36;
        const innerW = W - padX * 2;
        const innerH = H - padTop - padBot;
        const n = filtered.length;
        const stepX = n > 1 ? innerW / (n - 1) : 0;

        // Map impact 1..5 to y (5=highest, 1=lowest)
        const yFor = impact => padTop + innerH * (1 - (impact - 1) / 4);

        // Path
        let pathD = '';
        filtered.forEach((b, i) => {
            const x = padX + i * stepX;
            const y = yFor(b.impact);
            pathD += (i === 0 ? `M${x} ${y}` : ` L${x} ${y}`);
        });

        // Build a soft area under the curve
        let areaD = pathD + ` L${padX + (n - 1) * stepX} ${padTop + innerH} L${padX} ${padTop + innerH} Z`;

        // Compute averages per category for the climate bar at bottom
        const cats = Object.keys(WEATHER);
        const catCounts = cats.map(c => BUILDS.filter(b => b.category === c).length);
        const total = catCounts.reduce((s, x) => s + x, 0);
        let offsetX = padX;
        const barW = innerW / total;
        const climateBars = cats.map((c, i) => {
            const w = barW * catCounts[i];
            const color = WEATHER[c].color;
            const x = offsetX;
            offsetX += w;
            return `<rect x="${x}" y="${padTop + innerH + 6}" width="${w}" height="14" fill="${color}" opacity="0.85" />`;
        }).join('');

        // Today line marker
        const todayB = BUILDS.find(b => b.day === TODAY_DAY);
        const todayInFiltered = filtered.findIndex(b => b.day === TODAY_DAY);
        const todayX = todayInFiltered >= 0 ? padX + todayInFiltered * stepX : null;
        const todayY = todayInFiltered >= 0 ? yFor(todayB.impact) : null;

        // Build the SVG
        let svg = `
            <defs>
                <linearGradient id="wxArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="wxLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stop-color="#7dd3fc"/>
                    <stop offset="50%" stop-color="#c4b5fd"/>
                    <stop offset="100%" stop-color="#fcd34d"/>
                </linearGradient>
            </defs>
            <!-- gridlines -->
            <line x1="${padX}" y1="${padTop + innerH * 0.25}" x2="${W - padX}" y2="${padTop + innerH * 0.25}" stroke="rgba(125,211,252,0.08)" stroke-dasharray="3 4"/>
            <line x1="${padX}" y1="${padTop + innerH * 0.5}" x2="${W - padX}" y2="${padTop + innerH * 0.5}" stroke="rgba(125,211,252,0.08)" stroke-dasharray="3 4"/>
            <line x1="${padX}" y1="${padTop + innerH * 0.75}" x2="${W - padX}" y2="${padTop + innerH * 0.75}" stroke="rgba(125,211,252,0.08)" stroke-dasharray="3 4"/>
            <!-- y axis labels -->
            <text x="${padX - 6}" y="${padTop + 4}" fill="rgba(229,231,235,0.4)" font-size="9" text-anchor="end" font-family="JetBrains Mono, monospace">5 STELLAR</text>
            <text x="${padX - 6}" y="${padTop + innerH * 0.5 + 3}" fill="rgba(229,231,235,0.4)" font-size="9" text-anchor="end" font-family="JetBrains Mono, monospace">3</text>
            <text x="${padX - 6}" y="${padTop + innerH + 3}" fill="rgba(229,231,235,0.4)" font-size="9" text-anchor="end" font-family="JetBrains Mono, monospace">1 CHILLY</text>
            <!-- area + line -->
            <path d="${areaD}" fill="url(#wxArea)"/>
            <path d="${pathD}" fill="none" stroke="url(#wxLine)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;

        // Plot every point as a small dot colored by archetype
        filtered.forEach((b, i) => {
            const x = padX + i * stepX;
            const y = yFor(b.impact);
            const color = WEATHER[b.category].color;
            const isToday = b.day === TODAY_DAY;
            const r = isToday ? 6 : 3.4;
            svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="#0a0a14" stroke-width="1.5" data-day="${b.day}"/>`;
        });

        // Today marker
        if (todayX !== null) {
            svg += `<line x1="${todayX}" y1="${padTop - 8}" x2="${todayX}" y2="${padTop + innerH}" stroke="#fcd34d" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>`;
            svg += `<rect x="${todayX - 22}" y="${padTop - 22}" width="44" height="14" rx="7" fill="#fcd34d"/>`;
            svg += `<text x="${todayX}" y="${padTop - 12}" fill="#0c0d18" font-size="9" font-weight="700" text-anchor="middle" font-family="JetBrains Mono, monospace">TODAY</text>`;
        }

        // Climate bar at bottom
        svg += climateBars;

        // Climate bar labels
        cats.forEach((c, i) => {
            const w = barW * catCounts[i];
            const x = padX + cats.slice(0, i).reduce((s, _, j) => s + barW * catCounts[j], 0) + w / 2;
            if (w > 40) {
                svg += `<text x="${x}" y="${padTop + innerH + 32}" fill="rgba(229,231,235,0.65)" font-size="9" text-anchor="middle" font-family="JetBrains Mono, monospace">${WEATHER[c].label}</text>`;
            }
        });

        wrap.innerHTML = svg;
        wrap.setAttribute('viewBox', `0 0 ${W} ${H}`);
        wrap.setAttribute('preserveAspectRatio', 'none');

        // Hover tooltip
        const tip = document.getElementById('wx-climate-tip');
        const canvasWrap = document.getElementById('wx-climate-canvas-wrap');
        if (!tip || !canvasWrap) return;
        const dots = wrap.querySelectorAll('circle[data-day]');
        dots.forEach(dot => {
            dot.style.cursor = 'pointer';
            dot.addEventListener('mouseenter', (e) => {
                const day = +dot.getAttribute('data-day');
                const b = BUILDS.find(x => x.day === day);
                if (!b) return;
                const wx = WEATHER[b.category];
                const d = dayDate(b.day);
                tip.innerHTML = `<strong>Day ${b.day}</strong> · ${wx.label} ${impactToTemp(b.impact)}°<br>${b.name} · ${fmtShort(d)}`;
                // Convert SVG coords to pixel position
                const rect = wrap.getBoundingClientRect();
                const wrapRect = canvasWrap.getBoundingClientRect();
                const x = (+dot.getAttribute('cx') / W) * rect.width + (rect.left - wrapRect.left);
                const y = (+dot.getAttribute('cy') / H) * rect.height + (rect.top - wrapRect.top);
                tip.style.left = x + 'px';
                tip.style.top = y + 'px';
                tip.classList.add('show');
            });
            dot.addEventListener('mouseleave', () => { tip.classList.remove('show'); });
            dot.addEventListener('click', () => {
                const day = +dot.getAttribute('data-day');
                const b = BUILDS.find(x => x.day === day);
                if (!b) return;
                const line = `Day ${day} — ${WEATHER[b.category].label} ${impactToTemp(b.impact)}°F · ${b.name}`;
                copyToClipboard(line);
                showToast(`<i class="fas fa-cloud-sun"></i> Day ${day} forecast copied`);
            });
        });
    }

    // ---- render: day list ----
    function renderList(state) {
        const wrap = document.getElementById('wx-list');
        if (!wrap) return;
        const filtered = state.filter === 'all'
            ? BUILDS.slice().reverse()
            : BUILDS.filter(b => b.category === state.filter).slice().reverse();
        wrap.innerHTML = '';
        if (filtered.length === 0) {
            wrap.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: rgba(229,231,235,0.55);">
                    <i class="fas fa-cloud-moon" style="font-size: 2.4rem; margin-bottom: 12px; display: block; color: rgba(125,211,252,0.5);"></i>
                    <p>No days in this climate band yet.</p>
                </div>`;
            return;
        }
        filtered.forEach(b => {
            const wx = WEATHER[b.category];
            const d = dayDate(b.day);
            const isToday = b.day === TODAY_DAY;
            const card = document.createElement('div');
            card.className = 'wx-card';
            card.style.setProperty('--wx-card-color', wx.color);
            card.dataset.day = b.day;
            if (isToday) card.style.borderColor = wx.color;

            let impactDots = '';
            for (let i = 1; i <= 5; i++) {
                impactDots += `<span class="dot${i <= b.impact ? ' on' : ''}" style="width:7px;height:7px;border-radius:50%;background:${i <= b.impact ? wx.color : 'rgba(125,211,252,0.18)'}"></span>`;
            }

            card.innerHTML = `
                <div class="wx-card-head">
                    <div class="wx-card-icon" style="color: ${wx.color}"><i class="fas ${wx.icon}"></i></div>
                    <div class="wx-card-meta">
                        <div class="wx-card-day">${fmtLong(d)}${isToday ? ' · Today' : ''}</div>
                        <div class="wx-card-name">${b.name}</div>
                    </div>
                </div>
                <div class="wx-card-cond">${wx.condition} · ${wx.label} ${impactToTemp(b.impact)}°F</div>
                <div class="wx-card-desc">${DESCRIPTIONS[b.category]}</div>
                <div class="wx-card-stats">
                    <div class="wx-card-stat">
                        <span class="wx-card-stat-label">Impact</span>
                        <span class="wx-card-stat-value" style="display:flex;justify-content:center;gap:3px;align-items:center">${impactDots}</span>
                    </div>
                    <div class="wx-card-stat">
                        <span class="wx-card-stat-label">Temp</span>
                        <span class="wx-card-stat-value">${impactToTemp(b.impact)}°F</span>
                    </div>
                    <div class="wx-card-stat">
                        <span class="wx-card-stat-label">Wind</span>
                        <span class="wx-card-stat-value">${5 + b.impact * 3} mph</span>
                    </div>
                </div>
            `;
            wrap.appendChild(card);
        });
    }

    // ---- toast / clipboard ----
    let toastTimer = null;
    function showToast(html) {
        const t = document.getElementById('wx-toast');
        if (!t) return;
        t.innerHTML = html;
        t.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }
    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
    }

    // ---- actions ----
    function exportJSON() {
        const data = BUILDS.map(b => ({
            day: b.day,
            date: fmtLong(dayDate(b.day)),
            name: b.name,
            category: b.category,
            weather: WEATHER[b.category].label,
            condition: WEATHER[b.category].condition,
            impact: b.impact,
            temp_f: impactToTemp(b.impact),
            wind_mph: 5 + b.impact * 3,
            description: DESCRIPTIONS[b.category],
        }));
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ajh-build-weather-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
        showToast('<i class="fas fa-cloud-arrow-down"></i> Weather log downloaded');
    }

    function flyToToday() {
        const card = document.querySelector(`.wx-card[data-day="${TODAY_DAY}"]`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ---- init ----
    function init() {
        const state = load();
        state.views = (state.views || 0) + 1;
        save(state);

        renderCurrent(state);
        renderSummary(state);
        renderChips(state);
        renderOutlook(state);
        renderClimate(state);
        renderList(state);

        // Action buttons
        const todayBtn = document.getElementById('wx-today-btn');
        if (todayBtn) todayBtn.addEventListener('click', flyToToday);
        const exportBtn = document.getElementById('wx-export-btn');
        if (exportBtn) exportBtn.addEventListener('click', exportJSON);
        const refreshBtn = document.getElementById('wx-refresh-btn');
        if (refreshBtn) refreshBtn.addEventListener('click', () => {
            renderCurrent(state);
            renderSummary(state);
            renderOutlook(state);
            renderClimate(state);
            renderList(state);
            showToast('<i class="fas fa-rotate"></i> Forecast refreshed');
        });

        // Hero meta button
        const heroBtn = document.getElementById('weather-hero-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                document.getElementById('weather')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Public API
        window.ajhWeather = {
            flyToToday,
            export: exportJSON,
            setFilter: (cat) => {
                if (WEATHER[cat] || cat === 'all') {
                    state.filter = cat;
                    save(state);
                    renderChips(state);
                    renderList(state);
                    renderClimate(state);
                    renderSummary(state);
                }
            },
        };

        // Command palette bridge
        document.addEventListener('ajh-command', (e) => {
            const cmd = e.detail && e.detail.command;
            if (cmd === 'weather-open') {
                document.getElementById('weather')?.scrollIntoView({ behavior: 'smooth' });
            } else if (cmd === 'weather-today') {
                flyToToday();
            } else if (cmd === 'weather-export') {
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
