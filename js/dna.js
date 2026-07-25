/* ============================================================
   Day 74: Build DNA — Pattern Genome & Build Style Fingerprint
   Synthesizes a "DNA strand" from the build's actual behavior.
   ============================================================ */

(function () {
  'use strict';

  // The 8 builder archetypes (DNA axis categories) — each maps to features actually shipped
  const ARCHETYPES = [
    { id: 'systems', icon: 'fa-cogs', label: 'Systems Builder', color: '#a855f7',
      desc: 'State machines, schedulers, persistence layers, and intricate logic.' },
    { id: 'visual', icon: 'fa-palette', label: 'Visual Stylist', color: '#ec4899',
      desc: 'Color, motion, glassmorphism, gradients, and aesthetic flourishes.' },
    { id: 'audio', icon: 'fa-music', label: 'Audio Alchemist', color: '#3b82f6',
      desc: 'Web Audio synths, sequencers, soundboards, and tonal experiments.' },
    { id: 'interactive', icon: 'fa-gamepad', label: 'Interaction Designer', color: '#10b981',
      desc: 'Mini-games, command palettes, hotkeys, and tactile feedback.' },
    { id: 'data', icon: 'fa-chart-line', label: 'Data Storyteller', color: '#f59e0b',
      desc: 'Heatmaps, bento stats, charts, and at-a-glance summaries.' },
    { id: 'meta', icon: 'fa-brain', label: 'Meta Architect', color: '#8b5cf6',
      desc: 'Logs, journals, reflections, hypotheses, and self-analysis.' },
    { id: 'craft', icon: 'fa-feather-alt', label: 'Craftsperson', color: '#06b6d4',
      desc: 'Snippets, wisdom cards, quotes, and curated libraries.' },
    { id: 'social', icon: 'fa-share-nodes', label: 'Community Architect', color: '#f43f5e',
      desc: 'Sharing, exports, public surfaces, and guest experiences.' },
  ];

  // Seed build log — every Day we've shipped, with archetype + impact rating (1-5)
  // This is the actual build history of the AJH GitHub Pages site, weighted by real impact
  const BUILDS = [
    { day: 1,  name: 'First Commit',                    category: 'meta',      impact: 4 },
    { day: 2,  name: 'Site Skeleton + Hero',            category: 'visual',    impact: 2 },
    { day: 3,  name: 'About + Skills Sections',         category: 'visual',    impact: 2 },
    { day: 4,  name: 'Projects + Contact',              category: 'visual',    impact: 2 },
    { day: 5,  name: 'Theme Toggle + PWA',              category: 'systems',   impact: 4 },
    { day: 6,  name: 'Service Worker + Offline',        category: 'systems',   impact: 3 },
    { day: 7,  name: 'CI Workflow + 404 Page',          category: 'systems',   impact: 4 },
    { day: 8,  name: 'Achievement Badges',              category: 'data',      impact: 3 },
    { day: 9,  name: 'Stats Counter',                   category: 'data',      impact: 2 },
    { day: 10, name: 'Dark Mode Polish',                category: 'visual',    impact: 2 },
    { day: 11, name: 'Smooth Scrolling',                category: 'visual',    impact: 1 },
    { day: 12, name: 'Loading Screen',                  category: 'visual',    impact: 2 },
    { day: 13, name: 'Cursor Trail',                    category: 'interactive', impact: 2 },
    { day: 14, name: 'Particle Background',             category: 'visual',    impact: 2 },
    { day: 15, name: 'Newsletter Form',                 category: 'social',    impact: 2 },
    { day: 16, name: 'Gallery + Lightbox',              category: 'visual',    impact: 3 },
    { day: 17, name: 'Journey Timeline',                category: 'data',      impact: 3 },
    { day: 18, name: 'FAQ Section',                     category: 'craft',     impact: 2 },
    { day: 19, name: 'Testimonials',                    category: 'social',    impact: 2 },
    { day: 20, name: 'Search Modal',                    category: 'systems',   impact: 3 },
    { day: 21, name: 'Easter Egg Konami',               category: 'interactive', impact: 3 },
    { day: 22, name: 'Reading Progress',                category: 'visual',    impact: 2 },
    { day: 23, name: 'Scroll Animations',               category: 'visual',    impact: 2 },
    { day: 24, name: 'Blog Section',                    category: 'craft',     impact: 3 },
    { day: 25, name: 'Quote Rotator',                   category: 'craft',     impact: 2 },
    { day: 26, name: 'Magic 8-Ball',                    category: 'interactive', impact: 2 },
    { day: 27, name: 'Code Playground',                 category: 'craft',     impact: 3 },
    { day: 28, name: 'Live Clock + Hero Meta',          category: 'systems',   impact: 2 },
    { day: 29, name: 'Weather Widget',                  category: 'data',      impact: 3 },
    { day: 30, name: 'Skills with Animated Bars',       category: 'data',      impact: 3 },
    { day: 31, name: 'Project Filter System',           category: 'systems',   impact: 3 },
    { day: 32, name: 'Project Detail Modal',            category: 'systems',   impact: 3 },
    { day: 33, name: 'Enhanced Footer + Testimonials',  category: 'social',    impact: 2 },
    { day: 34, name: 'Hover Effects + Scroll Reveal',   category: 'visual',    impact: 3 },
    { day: 35, name: 'Crypto Price Ticker',             category: 'data',      impact: 3 },
    { day: 36, name: 'GitHub Stats Integration',        category: 'data',      impact: 3 },
    { day: 37, name: '2026 Web Design (Glassmorphism, Bento, Kinetic, Tilt)', category: 'visual', impact: 5 },
    { day: 38, name: 'Assistant + Bookmarks',           category: 'systems',   impact: 4 },
    { day: 39, name: 'Ambient Sound + Smart Nav + Scroll Reveal', category: 'audio', impact: 4 },
    { day: 40, name: 'Productivity Corner (Focus Timer, Notes, Goals)', category: 'meta', impact: 4 },
    { day: 41, name: 'Hero Date Display',               category: 'systems',   impact: 2 },
    { day: 42, name: 'World Clock + 8 Cities',          category: 'data',      impact: 3 },
    { day: 43, name: 'Theme Studio',                    category: 'visual',    impact: 4 },
    { day: 44, name: 'Time Capsule',                    category: 'meta',      impact: 3 },
    { day: 45, name: 'Reading Mode',                    category: 'craft',     impact: 3 },
    { day: 46, name: 'Command Palette (Ctrl+K)',        category: 'interactive', impact: 4 },
    { day: 47, name: 'Site Tour + Interactive Timeline', category: 'meta',     impact: 3 },
    { day: 48, name: 'Daily Challenge Gamification + API Status', category: 'meta', impact: 4 },
    { day: 49, name: 'Music Player',                    category: 'audio',     impact: 4 },
    { day: 50, name: 'Stats Bento Grid + Live Visitor Counter', category: 'data', impact: 4 },
    { day: 51, name: 'Keyboard Game',                   category: 'interactive', impact: 3 },
    { day: 52, name: 'Build Journal',                   category: 'meta',      impact: 3 },
    { day: 53, name: 'Community Wishlist',              category: 'social',    impact: 3 },
    { day: 54, name: 'On This Day Wisdom (66)',         category: 'craft',     impact: 4 },
    { day: 55, name: 'Reading List Integration',        category: 'craft',     impact: 3 },
    { day: 56, name: 'Code Snippets Vault',             category: 'craft',     impact: 4 },
    { day: 57, name: 'Build Calendar Heatmap',          category: 'data',      impact: 4 },
    { day: 58, name: 'Constellation Map',               category: 'visual',    impact: 3 },
    { day: 59, name: 'Printable Build Receipts',        category: 'craft',     impact: 3 },
    { day: 60, name: 'Daily Plan Board',                category: 'meta',      impact: 3 },
    { day: 61, name: 'Daily Quote Cards',               category: 'craft',     impact: 2 },
    { day: 62, name: 'Reading Time Tracker',            category: 'data',      impact: 2 },
    { day: 63, name: 'Pomodoro Pro Stats',              category: 'data',      impact: 2 },
    { day: 64, name: 'GitHub PR Pulse',                 category: 'data',      impact: 3 },
    { day: 65, name: 'Code Style Linter (client-side)', category: 'craft',     impact: 3 },
    { day: 66, name: 'On This Day Wisdom Deck',         category: 'craft',     impact: 4 },
    { day: 67, name: 'Pixel Art Studio',                category: 'interactive', impact: 4 },
    { day: 68, name: 'Daily Pixel Challenge',           category: 'interactive', impact: 3 },
    { day: 69, name: 'Build Receipts (thermal)',        category: 'craft',     impact: 3 },
    { day: 70, name: 'Soundboard (26 pads)',            category: 'audio',     impact: 4 },
    { day: 71, name: 'Step Sequencer',                  category: 'audio',     impact: 4 },
    { day: 72, name: 'The Forge (Reflection Studio)',  category: 'meta',      impact: 4 },
    { day: 73, name: 'Lab Notebook (Hypothesis Log)',  category: 'meta',      impact: 4 },
    { day: 74, name: 'Build DNA (Pattern Genome)',                category: 'data',      impact: 5 },
    { day: 75, name: 'Constellation Map (75 Stars)',              category: 'visual',    impact: 4 },
    { day: 76, name: 'Build Trail (Chronological Ribbon)',         category: 'data',      impact: 3 },
    { day: 77, name: 'Build Weather (Forecast Engine)',            category: 'data',      impact: 4 },
    { day: 78, name: 'Build Garden (8 SVG Plants)',                category: 'craft',     impact: 4 },
    { day: 79, name: 'Build Tape (Cassette Player)',               category: 'audio',     impact: 4 },
    { day: 80, name: 'Build Skyline (80 Buildings)',               category: 'visual',    impact: 5 },
    { day: 81, name: 'Build Aquarium (81 Fish)',                    category: 'craft',     impact: 4 },
    { day: 82, name: 'Build Observatory (82 Moons)',                category: 'data',      impact: 5 },
    { day: 83, name: 'Build Waveform (83 Frequencies)',             category: 'audio',     impact: 5 },
  ];

  // Personality archetypes — derived from top-2 archetype mix
  const PERSONALITIES = [
    {
      id: 'systems-first',
      name: 'The Architect',
      icon: 'fa-drafting-compass',
      traits: ['Pragmatic', 'Ship-obsessed', 'Pattern-hunter'],
      blurb: 'You build tools that build tools. Your instinct is to design the data model first, the UI second. The Lab, the Forge, and the Snippets vault are your craft.',
    },
    {
      id: 'visual-first',
      name: 'The Stylist',
      icon: 'fa-palette',
      traits: ['Aesthetic-led', 'Motion-aware', 'Tactile'],
      blurb: 'You lead with feel. The Bento grid, the kinetic type, the morphing blob — these are your native language. The site reads like a magazine, not a spec sheet.',
    },
    {
      id: 'audio-first',
      name: 'The Sound Designer',
      icon: 'fa-headphones',
      traits: ['Ear-first', 'Pattern-aware', 'Tactile'],
      blurb: 'You build with your ears. Synthesizers, sequencers, soundboards — you\'re not afraid of Web Audio\'s quirkiness. The site is interactive, not just visual.',
    },
    {
      id: 'meta-first',
      name: 'The Reflector',
      icon: 'fa-brain',
      traits: ['Self-aware', 'Long-game', 'Insight-led'],
      blurb: 'You build to understand your building. Logs, journals, hypotheses — every project is a hypothesis to test. The site is the build AND the lab notes.',
    },
    {
      id: 'data-first',
      name: 'The Cartographer',
      icon: 'fa-chart-area',
      traits: ['Quant-minded', 'Pattern-spotter', 'Honest'],
      blurb: 'You measure to manage. Heatmaps, stats counters, calendar grids — you turn the build into a dataset. Numbers are your friend, not your enemy.',
    },
    {
      id: 'craft-first',
      name: 'The Curator',
      icon: 'fa-feather-alt',
      traits: ['Taste-driven', 'Patient', 'Editor-mind'],
      blurb: 'You build collections. Snippets, quotes, wisdom decks, receipts — you treat code like a library you keep coming back to. Quality over volume, every time.',
    },
    {
      id: 'balanced',
      name: 'The Generalist',
      icon: 'fa-yin-yang',
      traits: ['Versatile', 'Curious', 'Omnivorous'],
      blurb: 'You don\'t pick a lane — you sample. Audio today, data viz tomorrow, a journal the day after. The site is a sketchbook, not a monument.',
    },
  ];

  // Local storage key
  const STORAGE_KEY = 'ajh_dna_v1';

  // State
  let state = {
    logFilter: 'all',
    logView: 30,
  };

  // Load persisted state
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign({}, state, parsed);
      }
    } catch (e) {
      console.warn('Build DNA: state load failed', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  // Compute archetype distribution
  function computeArchetypes() {
    const counts = {};
    ARCHETYPES.forEach(a => { counts[a.id] = 0; });

    BUILDS.forEach(b => {
      if (counts[b.category] !== undefined) {
        counts[b.category] += b.impact;
      }
    });

    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    return ARCHETYPES.map(a => ({
      ...a,
      score: counts[a.id],
      pct: total > 0 ? Math.round((counts[a.id] / total) * 100) : 0,
    })).sort((x, y) => y.score - x.score);
  }

  // Compute personality from top archetypes
  function computePersonality(archetypes) {
    const top1 = archetypes[0];
    const top2 = archetypes[1];
    if (!top1 || top1.score === 0) {
      return PERSONALITIES.find(p => p.id === 'balanced');
    }
    if (top1.pct >= 28) {
      const id = `${top1.id}-first`;
      const found = PERSONALITIES.find(p => p.id === id);
      if (found) return found;
    }
    // Mixed: pick the meta if reflection-led
    if (top1.id === 'meta' && top1.pct >= 18) return PERSONALITIES.find(p => p.id === 'meta-first');
    return PERSONALITIES.find(p => p.id === 'balanced');
  }

  // Format big numbers
  function fmt(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  // Build the 8-bit "DNA strand" SVG (one cell per archetype, color = score)
  function renderStrandSVG(archetypes) {
    const cellSize = 28;
    const gap = 4;
    const padX = 8;
    const padY = 8;
    const cols = 8;
    const width = padX * 2 + cols * cellSize + (cols - 1) * gap;
    const height = cellSize + padY * 2;

    const maxScore = Math.max(...archetypes.map(a => a.score), 1);

    let cells = '';
    archetypes.forEach((a, i) => {
      const x = padX + i * (cellSize + gap);
      const y = padY;
      const intensity = a.score / maxScore;
      const opacity = 0.30 + 0.70 * intensity;
      const glow = '';
      const useGlow = intensity > 0.7 ? ` filter="url(#glow${i})"` : '';
      cells += `
        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="6" fill="${a.color}" opacity="${opacity}"${useGlow}/>
        <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 4}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="-apple-system, system-ui, sans-serif" style="pointer-events:none">${a.score}</text>
      `;
    });

    // defs first
    const defs = archetypes.map((a, i) => {
      const intensity = a.score / Math.max(...archetypes.map(x => x.score), 1);
      return intensity > 0.7 ? `<filter id="glow${i}"><feGaussianBlur stdDeviation="2.5"/></filter>` : '';
    }).join('');

    return `<svg viewBox="0 0 ${width} ${height}" class="dna-strand-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Build DNA strand">
      <defs>${defs}</defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="rgba(168, 85, 247, 0.04)" rx="10"/>
      ${cells}
    </svg>`;
  }

  // Generate personality fingerprint summary
  function computeSummary(archetypes) {
    const total = BUILDS.length;
    const impact = BUILDS.reduce((s, b) => s + b.impact, 0);
    const avgImpact = (impact / total).toFixed(2);
    const bigShips = BUILDS.filter(b => b.impact >= 4).length;
    const distinctCategories = new Set(BUILDS.map(b => b.category)).size;
    return { total, impact, avgImpact, bigShips, distinctCategories };
  }

  // Render the personality block
  function renderPersonality(personality) {
    if (!personality) return '';
    return `
      <div class="dna-personality">
        <div class="dna-personality-head">
          <div class="dna-personality-icon"><i class="fas ${personality.icon}"></i></div>
          <div class="dna-personality-info">
            <h3 class="dna-personality-name">${personality.name}</h3>
            <p class="dna-personality-sub">Your build personality</p>
          </div>
        </div>
        <p class="dna-personality-blurb">${personality.blurb}</p>
        <div class="dna-traits">
          ${personality.traits.map(t => `<span class="dna-trait">${t}</span>`).join('')}
        </div>
      </div>
    `;
  }

  // Render the legend
  function renderLegend(archetypes) {
    return `
      <div class="dna-legend">
        ${archetypes.map(a => `
          <div class="dna-legend-item">
            <span class="dna-legend-swatch" style="background:${a.color}"></span>
            <span>${a.label}</span>
            <span style="color:#a89ec9;margin-left:auto;font-weight:600">${a.score}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render the archetypes bar list
  function renderArchetypes(archetypes) {
    return `
      <div class="dna-archetypes">
        ${archetypes.map(a => `
          <div class="dna-arch" data-arch="${a.id}">
            <div class="dna-arch-head">
              <span class="dna-arch-label"><i class="fas ${a.icon}" style="color:${a.color}"></i> ${a.label}</span>
              <span class="dna-arch-pct">${a.pct}%</span>
            </div>
            <div class="dna-arch-bar">
              <div class="dna-arch-fill" style="width:${a.pct}%;background:linear-gradient(90deg,${a.color}cc,${a.color}66)"></div>
            </div>
            <p class="dna-arch-meta">${a.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Render the build log feed
  function renderLog() {
    const filter = state.logFilter;
    const view = state.logView;
    const cats = filter === 'all' ? null : filter.split('+');

    const filtered = BUILDS.filter(b => {
      if (!cats) return true;
      return cats.includes(b.category);
    });

    const sorted = filtered.sort((a, b) => b.day - a.day).slice(0, view);

    if (sorted.length === 0) {
      return `<div class="dna-log-empty"><i class="fas fa-dna"></i><div>No builds match this filter.</div></div>`;
    }

    return sorted.map(b => {
      const arch = ARCHETYPES.find(a => a.id === b.category);
      return `
        <div class="dna-log-item" data-day="${b.day}">
          <div class="dna-log-day">
            <span class="dna-log-day-num">${b.day}</span>
            <span class="dna-log-day-label">Day</span>
          </div>
          <div class="dna-log-content">
            <h4 class="dna-log-name">${b.name}</h4>
            <div class="dna-log-meta">
              <span class="dna-log-tag" style="background:${arch.color}22;border-color:${arch.color}55;color:${arch.color}"><i class="fas ${arch.icon}"></i> ${arch.label}</span>
              <span>★ ${b.impact}/5 impact</span>
            </div>
          </div>
          <div class="dna-log-spark">${renderSparkline(b.impact)}</div>
        </div>
      `;
    }).join('');
  }

  // Render mini sparkline for a build
  function renderSparkline(impact) {
    const w = 64, h = 24;
    const max = 5;
    const bars = [Math.max(1, impact - 1), Math.max(1, impact - 0), impact, impact + 1, impact];
    const bh = bars.map(v => Math.max(2, (v / max) * h));
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:100%">
      ${bh.map((b, i) => {
        const x = (w / bh.length) * i + 2;
        const bw = (w / bh.length) - 4;
        return `<rect x="${x}" y="${h - b}" width="${bw}" height="${b}" rx="1.5" fill="#c084fc" opacity="${0.5 + (i / bh.length) * 0.5}"/>`;
      }).join('')}
    </svg>`;
  }

  // Render summary stats
  function renderSummary(summary) {
    return `
      <div class="dna-summary">
        <div class="dna-stat">
          <i class="fas fa-calendar-day"></i>
          <div class="dna-stat-num dna-num-mono">${summary.total}</div>
          <div class="dna-stat-label">Days Built</div>
        </div>
        <div class="dna-stat">
          <i class="fas fa-bolt"></i>
          <div class="dna-stat-num dna-num-mono">${summary.impact}</div>
          <div class="dna-stat-label">Total Impact</div>
        </div>
        <div class="dna-stat">
          <i class="fas fa-fire"></i>
          <div class="dna-stat-num dna-num-mono">${summary.bigShips}</div>
          <div class="dna-stat-label">Big Ships</div>
        </div>
        <div class="dna-stat">
          <i class="fas fa-shapes"></i>
          <div class="dna-stat-num dna-num-mono">${summary.distinctCategories}/8</div>
          <div class="dna-stat-label">Categories</div>
        </div>
      </div>
    `;
  }

  // Render the "today's focus" recommendation
  function renderFocus(archetypes) {
    // The underbuilt archetype is the recommendation
    const sorted = [...archetypes].sort((a, b) => a.score - b.score);
    const underbuilt = sorted[0];
    const top = archetypes[0];
    if (!underbuilt || underbuilt.id === top.id) {
      // Edge: already balanced
      return `
        <div class="dna-focus">
          <div class="dna-focus-head">
            <h3 class="dna-focus-title"><i class="fas fa-compass"></i> Today's Recommended Stretch</h3>
            <span class="dna-focus-day">Day 74</span>
          </div>
          <p class="dna-focus-body">Your DNA is unusually well-balanced. To keep stretching, try a build in the area you have the <strong>least</strong> practice in. If that feels safe, level up your dominant archetype with a higher-impact ship.</p>
          <div class="dna-focus-areas">
            <span class="dna-focus-area underbuilt"><i class="fas ${underbuilt.icon}"></i> Lean into ${underbuilt.label}</span>
            <span class="dna-focus-area urgent"><i class="fas fa-arrow-trend-up"></i> Push ${top.label} to impact 5</span>
          </div>
        </div>
      `;
    }
    return `
      <div class="dna-focus">
        <div class="dna-focus-head">
          <h3 class="dna-focus-title"><i class="fas fa-compass"></i> Today's Recommended Stretch</h3>
          <span class="dna-focus-day">Day 74</span>
        </div>
        <p class="dna-focus-body">Your DNA is dominated by <strong>${top.label}</strong> at <strong>${top.pct}%</strong>. To round out the genome, lean into <strong>${underbuilt.label}</strong> — your lowest-scoring archetype at just <strong>${underbuilt.pct}%</strong>. A small build there is worth three in your comfort zone.</p>
        <div class="dna-focus-areas">
          <span class="dna-focus-area underbuilt"><i class="fas ${underbuilt.icon}"></i> Stretch: ${underbuilt.label}</span>
          <span class="dna-focus-area urgent"><i class="fas ${top.icon}"></i> Dominant: ${top.label}</span>
        </div>
        <div class="dna-focus-actions">
          <button class="dna-focus-btn primary" data-dna-share><i class="fas fa-share"></i> Share my DNA</button>
          <button class="dna-focus-btn" data-dna-reseed><i class="fas fa-rotate"></i> Reseed history</button>
        </div>
      </div>
    `;
  }

  // Build the section
  function build() {
    const archetypes = computeArchetypes();
    const personality = computePersonality(archetypes);
    const summary = computeSummary(archetypes);

    return `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-dna"></i> Build DNA</span>
          <h2 class="section-title">Your Build Genome</h2>
          <p class="section-subtitle">A fingerprint of how you actually build — synthesized from ${BUILDS.length} days of shipped code, weighted by impact, mapped to eight builder archetypes.</p>
        </div>

        ${renderSummary(summary)}

        <div class="dna-stage">
          <div class="dna-card">
            <h3 class="dna-card-title"><i class="fas fa-fingerprint"></i> DNA Strand</h3>
            <p class="dna-card-sub">8 cells, one per archetype, sized by total impact.</p>
            ${renderStrandSVG(archetypes)}
            ${renderLegend(archetypes)}
          </div>

          <div class="dna-card">
            <h3 class="dna-card-title"><i class="fas fa-user-astronaut"></i> Build Personality</h3>
            <p class="dna-card-sub">Derived from your top archetype mix.</p>
            ${renderPersonality(personality)}
          </div>
        </div>

        <div class="dna-card" style="margin-top:14px">
          <h3 class="dna-card-title"><i class="fas fa-chart-bar"></i> Archetype Distribution</h3>
          <p class="dna-card-sub">Where your impact lives, ranked from strongest to weakest.</p>
          ${renderArchetypes(archetypes)}
        </div>

        ${renderFocus(archetypes)}

        <div class="dna-card" style="margin-top:14px">
          <h3 class="dna-log-title"><i class="fas fa-list"></i> Build Log — Last ${state.logView} Days</h3>
          <div class="dna-log-toolbar">
            <div class="dna-log-filters" id="dna-log-filters">
              <button class="dna-log-filter active" data-filter="all">All</button>
              <button class="dna-log-filter" data-filter="systems+visual+audio+interactive+data+meta+craft+social">All Archetypes</button>
              <button class="dna-log-filter" data-filter="meta+data">Meta &amp; Data</button>
              <button class="dna-log-filter" data-filter="visual+audio+craft">Craft &amp; Aesthetics</button>
              <button class="dna-log-filter" data-filter="systems+interactive">Systems</button>
              <button class="dna-log-filter" data-filter="social">Social</button>
            </div>
            <div>
              <button class="dna-log-btn" data-dna-view="15"><i class="fas fa-compress"></i> 15</button>
              <button class="dna-log-btn" data-dna-view="30"><i class="fas fa-list"></i> 30</button>
              <button class="dna-log-btn" data-dna-view="74"><i class="fas fa-expand"></i> All</button>
            </div>
          </div>
          <div class="dna-log" id="dna-log">${renderLog()}</div>
        </div>

        <p class="dna-hint"><i class="fas fa-keyboard"></i> Tap any log entry to focus it. Filter chips show archetype slices. <kbd>/</kbd> to focus section. <kbd>Esc</kbd> to clear filter.</p>
      </div>
    `;
  }

  // Toast
  function toast(msg) {
    let el = document.getElementById('dna-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dna-toast';
      el.className = 'dna-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = `<i class="fas fa-dna"></i> ${msg}`;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // Share DNA
  function shareDNA() {
    const archetypes = computeArchetypes();
    const personality = computePersonality(archetypes);
    const top = archetypes[0];
    const text = `🧬 My Build DNA (${BUILDS.length} days shipped):\n\n` +
      `Personality: ${personality.name}\n` +
      `Dominant: ${top.label} (${top.pct}%)\n` +
      `Big ships: ${BUILDS.filter(b => b.impact >= 4).length}\n\n` +
      `Built at ajhs.github.io/ajh-website — what's your DNA?`;

    if (navigator.share) {
      navigator.share({ title: 'My Build DNA', text }).catch(() => {
        copyToClipboard(text);
      });
    } else {
      copyToClipboard(text);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        toast('DNA copied to clipboard');
      }).catch(() => toast('Copy failed'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); toast('DNA copied to clipboard'); }
      catch (e) { toast('Copy failed'); }
      document.body.removeChild(ta);
    }
  }

  function reseedHistory() {
    if (!confirm('Reset build history to the seed library? Custom entries will be lost.')) return;
    localStorage.removeItem(STORAGE_KEY);
    state = { logFilter: 'all', logView: 30 };
    render();
    toast('Build history reseeded');
  }

  // Filter log
  function setFilter(filter, btn) {
    state.logFilter = filter;
    saveState();
    const log = document.getElementById('dna-log');
    if (log) log.innerHTML = renderLog();
    const filters = document.querySelectorAll('#dna-log-filters .dna-log-filter');
    filters.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  function setView(n) {
    state.logView = n;
    saveState();
    const log = document.getElementById('dna-log');
    if (log) {
      log.innerHTML = renderLog();
      // update title to show count
      const title = document.querySelector('.dna-log-title');
      if (title) title.innerHTML = `<i class="fas fa-list"></i> Build Log — Last ${n === BUILDS.length ? 'All' : n} Days`;
    }
  }

  // Render the full section
  function render() {
    const section = document.getElementById('dna');
    if (!section) return;
    // Preserve the header
    const header = section.querySelector('.section-header');
    if (!header) {
      section.innerHTML = build();
    } else {
      // Replace just the body, keep header
      const tmp = document.createElement('div');
      tmp.innerHTML = build();
      const newHeader = tmp.querySelector('.section-header');
      if (newHeader) section.replaceChild(newHeader.cloneNode(true), header);
      // Remove existing body and append new
      const existing = section.querySelector('.container');
      if (existing) existing.remove();
      const newContainer = tmp.querySelector('.container');
      if (newContainer) section.appendChild(newContainer);
    }
    bind();
  }

  // Bind events
  function bind() {
    // Filter chips
    const filters = document.querySelectorAll('#dna-log-filters .dna-log-filter');
    filters.forEach(b => {
      b.addEventListener('click', () => setFilter(b.dataset.filter, b));
    });

    // View buttons
    document.querySelectorAll('[data-dna-view]').forEach(b => {
      b.addEventListener('click', () => setView(parseInt(b.dataset.dnaView, 10)));
    });

    // Share / reseed
    const share = document.querySelector('[data-dna-share]');
    if (share) share.addEventListener('click', shareDNA);
    const reseed = document.querySelector('[data-dna-reseed]');
    if (reseed) reseed.addEventListener('click', reseedHistory);

    // Log items: focus on click
    document.querySelectorAll('.dna-log-item').forEach(item => {
      item.addEventListener('click', () => {
        const day = item.dataset.day;
        toast(`Day ${day} build focused`);
        item.style.boxShadow = '0 0 0 2px rgba(168, 85, 247, 0.6)';
        setTimeout(() => { item.style.boxShadow = ''; }, 1500);
      });
    });
  }

  // Init
  function init() {
    loadState();
    const section = document.getElementById('dna');
    if (!section) return;

    // Render dynamic content into static placeholders
    const strand = document.getElementById('dna-strand-svg');
    const legendEl = document.getElementById('dna-legend');
    const personalityEl = document.getElementById('dna-personality');
    const archEl = document.getElementById('dna-archetypes');
    const totalBuilds = document.getElementById('dna-total-builds');
    const totalImpact = document.getElementById('dna-total-impact');
    const avgImpact = document.getElementById('dna-avg-impact');
    const bigDays = document.getElementById('dna-big-days');
    const logEl = document.getElementById('dna-log');
    const focusBody = document.getElementById('dna-focus-body');
    const focusDay = document.getElementById('dna-focus-day');
    const focusAreas = document.getElementById('dna-focus-areas');

    if (strand || archEl || logEl) {
      const archetypes = computeArchetypes();
      const personality = computePersonality(archetypes);
      const summary = computeSummary(archetypes);

      if (strand) strand.outerHTML = renderStrandSVG(archetypes);
      if (legendEl) legendEl.innerHTML = renderLegend(archetypes);
      if (personalityEl) personalityEl.innerHTML = renderPersonality(personality);
      if (archEl) archEl.innerHTML = renderArchetypes(archetypes);
      if (logEl) logEl.innerHTML = renderLog();
      if (totalBuilds) totalBuilds.textContent = summary.total;
      if (totalImpact) totalImpact.textContent = summary.impact;
      if (avgImpact) avgImpact.textContent = summary.avgImpact;
      if (bigDays) bigDays.textContent = summary.bigShips;
      if (focusDay) focusDay.textContent = 'Day ' + summary.total;
      if (focusBody) focusBody.innerHTML = 'Analyzed <strong>' + summary.total + ' build days</strong> across <strong>' + summary.distinctCategories + ' archetype categories</strong>. Total impact: <strong>' + summary.impact + '</strong>. Avg impact per build: <strong>' + summary.avgImpact + '</strong>. ' + summary.bigShips + ' days reached "massive" impact.';
      if (focusAreas) {
        const sorted = archetypes.slice().sort((a, b) => a.pct - b.pct);
        const underbuilt = sorted.slice(0, 2);
        const top = sorted[sorted.length - 1];
        focusAreas.innerHTML = '<span class="dna-focus-area"><i class="fas fa-crown"></i> Strongest: ' + top.label + ' (' + top.pct + '%)</span>' +
          underbuilt.map(u => '<span class="dna-focus-area underbuilt"><i class="fas fa-arrow-up"></i> Stretch: ' + u.label + ' (' + u.pct + '%)</span>').join('');
      }
    }
    bind();

    // Hero button
    const heroBtn = document.getElementById('dna-hero-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        const sec = document.getElementById('dna');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Global "/" key focuses the DNA section
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !e.target.matches('input, textarea, select')) {
        const dna = document.getElementById('dna');
        if (dna) {
          const rect = dna.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Already in view — focus search if any (no search here, just toast)
            e.preventDefault();
            toast('Press Esc to reset, click a build to focus it');
          }
        }
      }
    });
  }

  // Public API
  window.ajhDNAOpen = function () {
    const section = document.getElementById('dna');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.ajhDNAShare = shareDNA;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
