// ============================================================
// Day 69: Build Receipts
// ============================================================
(function () {
  // --- 68-day build data (Day 1 = 2026-04-22, Day 68 = 2026-06-27) ---
  const BUILDS = [
    { d:  1, title: 'First Commit',                date: '2026-04-22', tags: ['launch','foundation','core'],         level: 3, desc: 'Shipped the first commit to the AJH website. Foundation day. Picked the structure, the colors, the rhythm — and pressed commit.', features: ['Repo initialized', 'Hero section', 'About + Projects', 'Color tokens', 'Typography'] },
    { d:  2, title: 'Navigation & Smooth Scroll',  date: '2026-04-23', tags: ['nav','ux'],                              level: 2, desc: 'Sticky nav with smooth-scroll anchors and a scroll-to-top button.', features: ['Sticky nav', 'Smooth scroll', 'Scroll-to-top FAB'] },
    { d:  3, title: 'Contact Form',                 date: '2026-04-24', tags: ['forms','ux'],                            level: 2, desc: 'Working contact form with validation, success and error states.', features: ['Form validation', 'Submit handler', 'Success / error UI'] },
    { d:  4, title: 'Projects Grid',                date: '2026-04-25', tags: ['projects','ui'],                         level: 2, desc: 'Project card grid with hover effects and category tags.', features: ['Card grid', 'Hover effects', 'Category tags'] },
    { d:  5, title: 'Dark Theme',                   date: '2026-04-26', tags: ['theme','a11y'],                          level: 2, desc: 'First dark theme pass with palette, contrast, and CSS variables.', features: ['Dark palette', 'Contrast pass', 'CSS variables'] },
    { d:  6, title: 'Particles & Loader',           date: '2026-04-27', tags: ['motion','design'],                       level: 2, desc: 'Animated particle background and a page-load intro animation.', features: ['Particle system', 'Page loader', 'Loader animation'] },
    { d:  7, title: 'PWA Foundations',              date: '2026-04-28', tags: ['pwa','infra'],                           level: 3, desc: 'Made the site installable: manifest, service worker, offline shell.', features: ['manifest.json', 'Service worker', 'Offline cache'] },
    { d:  8, title: 'Counter Animations',           date: '2026-04-29', tags: ['motion','ui'],                           level: 1, desc: 'Animate stat counters when scrolled into view.', features: ['Counter hook', 'IntersectionObserver', 'Easing'] },
    { d:  9, title: 'Newsletter Signup',            date: '2026-04-30', tags: ['forms','infra'],                         level: 1, desc: 'Email signup form for the newsletter section.', features: ['Signup form', 'Validation', 'Submission flow'] },
    { d: 10, title: 'Keyboard Shortcuts Panel',     date: '2026-05-01', tags: ['power','ux'],                            level: 2, desc: 'A panel that lists every keyboard shortcut on the site.', features: ['Shortcut registry', 'Help panel', '? to open'] },
    { d: 11, title: 'Scroll Progress Bar',          date: '2026-05-02', tags: ['ux','motion'],                           level: 1, desc: 'Top progress bar that fills as you scroll down the page.', features: ['Progress bar', 'Scroll listener', 'Throttled updates'] },
    { d: 12, title: 'FAQ Accordion',                date: '2026-05-03', tags: ['content','ui'],                          level: 2, desc: 'Accordion-style FAQ section with smooth height animation.', features: ['Accordion', 'Smooth height', 'Single-open mode'] },
    { d: 13, title: 'Gallery + Lightbox',           date: '2026-05-04', tags: ['ui','media'],                            level: 2, desc: 'Image gallery grid with click-to-zoom lightbox.', features: ['Gallery grid', 'Lightbox modal', 'Keyboard nav'] },
    { d: 14, title: 'CI/CD + 404 + Achievements',   date: '2026-05-05', tags: ['ci','design','ship'],                    level: 4, desc: 'Added GitHub Actions deploy, a custom 404 page with glitch animation, and an Achievements section.', features: ['.github/workflows', '404 page', 'Achievements section'] },
    { d: 15, title: 'Journey Timeline',             date: '2026-05-06', tags: ['content','ui'],                          level: 2, desc: 'Vertical timeline of build milestones.', features: ['Timeline layout', 'Year dots', 'Mobile reflow'] },
    { d: 16, title: 'Skills Grid + Tags',           date: '2026-05-07', tags: ['content','ui'],                          level: 2, desc: 'Skills grid with tech tags and proficiency badges.', features: ['Skill cards', 'Tech tags', 'Proficiency dots'] },
    { d: 17, title: 'Project Cards Refresh',        date: '2026-05-08', tags: ['projects','ui'],                         level: 2, desc: 'Redesigned the project cards with new hover and layout.', features: ['Card redesign', 'New hover', 'Layout polish'] },
    { d: 18, title: 'Testimonials',                 date: '2026-05-09', tags: ['content','ui'],                          level: 1, desc: 'Testimonials section with three quote cards.', features: ['Quote cards', 'Author meta', 'Hover effect'] },
    { d: 19, title: 'Footer Expansion',             date: '2026-05-10', tags: ['ui','content'],                          level: 1, desc: 'Bigger footer with social links, mission, and quick links.', features: ['Social row', 'Mission', 'Quick links'] },
    { d: 20, title: 'Current / Working On',         date: '2026-05-11', tags: ['content','meta'],                        level: 2, desc: 'A "current" section showing what I am working on right now.', features: ['Current block', 'Live updates', 'Pinned tag'] },
    { d: 21, title: 'Skill Bars Animation',         date: '2026-05-12', tags: ['motion','ui'],                           level: 2, desc: 'Animated skill bars that fill when scrolled into view.', features: ['Bar fills', 'IntersectionObserver', 'Easing'] },
    { d: 22, title: 'Project Detail Modal',         date: '2026-05-13', tags: ['projects','ui'],                         level: 2, desc: 'Click a project card to open a full detail modal.', features: ['Modal', 'Detail body', 'Tech tags'] },
    { d: 23, title: 'Project Filters',              date: '2026-05-14', tags: ['projects','ui'],                         level: 2, desc: 'Filter buttons for the projects grid (All / Gaming / Tools / etc).', features: ['Filter chips', 'Active state', 'Fade in/out'] },
    { d: 24, title: '3D Tilt Cards',                date: '2026-05-15', tags: ['motion','design'],                       level: 2, desc: 'Subtle 3D tilt effect on project cards using perspective transforms.', features: ['3D tilt', 'Mouse tracking', 'Will-change'] },
    { d: 25, title: 'Typewriter Effect',            date: '2026-05-16', tags: ['motion','ui'],                           level: 1, desc: 'Typewriter animation for hero text on first visit.', features: ['Typewriter', 'Cursor caret', 'One-shot'] },
    { d: 26, title: 'Live Visitor Counter',         date: '2026-05-17', tags: ['meta','ui'],                             level: 1, desc: 'A simulated live-visitor counter in the hero meta.', features: ['Live count', 'Tick every 5s', 'Animated number'] },
    { d: 27, title: 'Productivity Corner Pt 1',     date: '2026-05-18', tags: ['productivity','tools'],                  level: 2, desc: 'Focus timer, quick notes, daily goals, break reminder — early scaffolding.', features: ['Focus timer', 'Notes', 'Goals', 'Break reminder'] },
    { d: 28, title: 'Live Clock + Hero Date',       date: '2026-05-19', tags: ['ux','ui'],                               level: 1, desc: 'Hero meta got a live Eastern Time clock and a date display.', features: ['Live clock', 'Hero date', 'Auto-update'] },
    { d: 29, title: 'Command Palette (Ctrl+K)',     date: '2026-05-20', tags: ['power','tools','ship'],                  level: 4, desc: 'A 25+ command launcher with categories, fuzzy search, and keyboard navigation.', features: ['25+ commands', 'Fuzzy search', 'Keyboard nav', 'Categories'] },
    { d: 30, title: 'World Clock Widget',           date: '2026-05-21', tags: ['tools','ui'],                            level: 2, desc: 'World clock modal with 8 major cities.', features: ['8 cities', 'Real-time updates', 'Modal'] },
    { d: 31, title: 'Focus Timer (Pomodoro)',       date: '2026-05-22', tags: ['productivity','tools'],                  level: 2, desc: 'A 25-minute focus timer with start / pause / reset.', features: ['Start / pause / reset', 'Desktop notification', 'Sync with hero'] },
    { d: 32, title: 'Quick Notes Widget',           date: '2026-05-23', tags: ['productivity','tools'],                  level: 2, desc: 'Quick notes modal that auto-saves to localStorage.', features: ['Auto-save', 'Modal', 'localStorage'] },
    { d: 33, title: 'Daily Goals Tracker',          date: '2026-05-24', tags: ['productivity','tools'],                  level: 2, desc: 'Three daily goals with a progress bar, persisted to localStorage.', features: ['3 goals', 'Progress bar', 'localStorage'] },
    { d: 34, title: 'Break Reminder',               date: '2026-05-25', tags: ['productivity','tools'],                  level: 1, desc: 'Break reminder that fires a notification after a set interval.', features: ['Notification', 'Interval picker', 'Toggle'] },
    { d: 35, title: 'Productivity Polish',          date: '2026-05-26', tags: ['productivity','tools','ship'],           level: 4, desc: 'Productivity Corner ships with all 5 tools wired together.', features: ['Focus timer', 'Notes', 'Goals', 'Break reminder', 'Streak'] },
    { d: 36, title: 'Time-Based Greeting',          date: '2026-05-27', tags: ['ux','ui'],                               level: 1, desc: 'Hero subtitle changes by time of day (morning / afternoon / evening / night).', features: ['Time greeting', 'Auto-update', 'i18n-ready'] },
    { d: 37, title: '2026 Design Features',         date: '2026-05-28', tags: ['design','motion','ship'],                level: 4, desc: 'Glassmorphism, bento grid, kinetic typography, magnetic buttons, liquid buttons, 3D tilt, blob backgrounds, noise texture, page transitions.', features: ['Glassmorphism', 'Bento grid', 'Kinetic title', 'Magnetic buttons', '3D tilt'] },
    { d: 38, title: 'Music Player',                 date: '2026-05-29', tags: ['audio','fun','ship'],                    level: 4, desc: 'Full audio player: visualizer, playlist, volume, shuffle, repeat, keyboard controls.', features: ['Visualizer', '5 tracks', 'Volume / mute', 'Shuffle / repeat', 'Spacebar toggle'] },
    { d: 39, title: 'Daily Challenge System',       date: '2026-05-30', tags: ['fun','tools','ship'],                    level: 4, desc: 'Gamification layer with 15 progressive levels and XP rewards.', features: ['15 levels', 'XP', 'Badge collection', 'Streak', 'localStorage'] },
    { d: 40, title: 'API Status Dashboard',         date: '2026-05-31', tags: ['meta','tools'],                          level: 2, desc: 'Live monitoring for GitHub, Vault API, Games DB, Proxy Network.', features: ['Live latency', 'Status indicators', 'Auto-refresh'] },
    { d: 41, title: 'Site Tour',                    date: '2026-06-01', tags: ['ux','meta'],                             level: 2, desc: 'First-visit guided tour that walks through every section.', features: ['Multi-step tour', 'Skip / next', 'localStorage flag'] },
    { d: 42, title: 'Interactive Timeline',         date: '2026-06-02', tags: ['ui','motion'],                           level: 1, desc: 'Click any timeline item to expand and reveal more content.', features: ['Expand on click', 'Glow effect', 'Pulse dot'] },
    { d: 43, title: 'Achievement Badges',           date: '2026-06-03', tags: ['fun','ui'],                              level: 2, desc: '12 unlockable badges with progress, confetti, and toasts.', features: ['12 badges', 'Progress', 'Confetti', 'Toasts'] },
    { d: 44, title: 'Reading Mode',                 date: '2026-06-04', tags: ['reader','ux'],                           level: 2, desc: 'Distraction-free read with word counts and read time.', features: ['Reader view', 'Word counts', 'Read time', 'Print stylesheet'] },
    { d: 45, title: 'Reading List',                 date: '2026-06-05', tags: ['reader','content'],                      level: 2, desc: 'A reading list section that pairs with Reading Mode.', features: ['List view', 'Mark complete', 'Filter'] },
    { d: 46, title: 'Code Snippets Vault',          date: '2026-06-06', tags: ['developer','tools','ship'],              level: 4, desc: 'A personal snippet library with 10 starters, language filter, search, copy, edit, delete, localStorage.', features: ['10 seed snippets', 'Language filter', 'Search', 'CRUD', 'Copy counter'] },
    { d: 47, title: 'Daily Plan Board',             date: '2026-06-07', tags: ['productivity','tools','ship'],           level: 4, desc: 'A Now/Next/Later kanban for the build queue with drag, check, add, remove.', features: ['3 columns', 'Drag to advance', 'Check to ship', 'Add / remove', 'localStorage'] },
    { d: 48, title: 'Build Calendar Heatmap',       date: '2026-06-08', tags: ['meta','design','ship','milestone'],      level: 4, desc: 'GitHub-style contribution graph of all build days, with click-to-read modals and view filters.', features: ['57-day heatmap', 'Click-to-read modal', 'Summary stats', 'All / 30 / Featured views', 'Share-this-build'] },
    { d: 49, title: 'Time Capsule Vault',           date: '2026-06-09', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'Write notes to your future self, sealed until a date. Countdowns, mood tags, shareable previews.', features: ['Compose / seal / unlock', 'Live countdowns', 'Mood tags', 'Share via Web Share', 'localStorage'] },
    { d: 50, title: 'Build Journal',                date: '2026-06-10', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'Shipped / Learned / Broke daily log with mood picker and weekly ring.', features: ['3 columns', 'Mood picker', 'Weekly ring', 'Save', 'Share'] },
    { d: 51, title: 'Community Wishlist',           date: '2026-06-11', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'Submit, upvote / downvote, status filters, sort, JSON-ready data model.', features: ['Submit', 'Upvote / downvote', 'Status filters', 'Sort', 'JSON-ready'] },
    { d: 52, title: 'Daily Wisdom',                 date: '2026-06-12', tags: ['meta','tools','ship','milestone'],       level: 4, desc: '365-card wisdom deck with day-of-year anchor, filter, bookmarks, share, flip, and bank.', features: ['365 cards', 'Day-of-year anchor', 'Filter', 'Bookmarks', 'Flip'] },
    { d: 53, title: 'Theme Studio',                 date: '2026-06-13', tags: ['design','tools','ship','milestone'],    level: 4, desc: 'Live CSS variable customizer with 6 presets, save / share / randomize / export.', features: ['6 presets', 'Live preview', 'Save', 'Randomize', 'Export'] },
    { d: 54, title: 'Stats Bento Grid',             date: '2026-06-14', tags: ['design','meta','ship','milestone'],      level: 4, desc: 'Modern bento stats layout with 5 cards spanning columns, gradient accents, hover animations.', features: ['5-card bento', 'Gradient accents', 'Hover anim', 'Live updates'] },
    { d: 55, title: 'Keyboard Game',                date: '2026-06-15', tags: ['fun','tools','ship','milestone'],        level: 4, desc: 'Type the highlighted key to score. Combo multiplier, ESC to stop.', features: ['Random keys', 'Combo system', 'Score', 'ESC to stop'] },
    { d: 56, title: 'Quote Vault',                  date: '2026-06-16', tags: ['fun','tools','ship','milestone'],        level: 4, desc: 'Inspirational quotes with favorites and sharing.', features: ['Quote bank', 'Favorites', 'Share', 'Daily draw'] },
    { d: 57, title: 'Build Assistant',              date: '2026-06-17', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'A chatbot that knows every build day. Press A to open, ask by day / date / tag.', features: ['Pattern-match KB', 'Local chat memory', 'Day / date / tag search', '60+ suggestions'] },
    { d: 58, title: 'Bookmark Cards',               date: '2026-06-18', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'Every section has a generated share card with title, icon, description, copy link.', features: ['25+ share cards', 'Pin / sort / search', 'Detail modal', 'Native share'] },
    { d: 59, title: 'Site Constellation',           date: '2026-06-19', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'Interactive 2D graph of every section on this site with 27 nodes and 59 edges.', features: ['27 nodes', '59 edges', 'Drag to reposition', 'Search / filter', 'Zoom'] },
    { d: 60, title: 'Site Constellation Pt 2',      date: '2026-06-20', tags: ['design','meta','ship','milestone'],      level: 4, desc: 'Category chips, ring layout, and detail panel for the constellation graph.', features: ['Category chips', 'Ring layout', 'Detail panel', 'Tooltips'] },
    { d: 61, title: 'Time Capsule Pt 2',            date: '2026-06-21', tags: ['design','meta','ship','milestone'],      level: 4, desc: 'Mood tags, sealed previews, and Next Unlock tile for time capsules.', features: ['Mood tags', 'Sealed previews', 'Next Unlock tile', 'Share sealed'] },
    { d: 62, title: 'Reading Mode Pt 2',            date: '2026-06-22', tags: ['design','reader','milestone'],           level: 3, desc: 'Print stylesheet, reading-time estimate, and list polish.', features: ['Print stylesheet', 'Read time', 'List polish'] },
    { d: 63, title: 'Build Journal Pt 2',           date: '2026-06-23', tags: ['design','meta','ship','milestone'],      level: 4, desc: 'JSON export, tweet-sized share, and a polish pass on the journal.', features: ['JSON export', 'Tweet share', 'Polish'] },
    { d: 64, title: 'On This Day / Wisdom Pt 2',    date: '2026-06-24', tags: ['design','meta','ship','milestone'],      level: 4, desc: 'Filter chips and bank polish for the 365-card wisdom deck.', features: ['Filter chips', 'Bank polish', 'Keyboard nav'] },
    { d: 65, title: 'Community Wishlist Pt 2',      date: '2026-06-25', tags: ['design','meta','ship','milestone'],      level: 4, desc: 'Status badges and a polish pass on the community wishlist.', features: ['Status badges', 'Polish', 'Share'] },
    { d: 66, title: 'On This Day — Final',          date: '2026-06-26', tags: ['meta','tools','ship','milestone'],       level: 4, desc: 'The On This Day section reaches its final form with day-of-year anchor.', features: ['Day-of-year anchor', 'Final form', 'Share'] },
    { d: 67, title: 'Pixel Art Studio',             date: '2026-06-27', tags: ['fun','tools','ship','milestone'],        level: 4, desc: 'A 16x16 pixel editor with palette, save / share / export.', features: ['16x16 editor', '16-color palette', 'Save', 'Share', 'Export PNG'] },
    { d: 68, title: 'Daily Pixel Challenge',        date: '2026-06-28', tags: ['fun','tools','ship','milestone'],        level: 4, desc: 'A rotating daily prompt that pairs with the Pixel Art Studio. 250-prompt bank, 8 categories.', features: ['250 prompts', '8 categories', 'Streak', 'Reroll', 'Share'] }
  ];

  // Today (Day 69) is intentionally not in the BUILDS list — it would
  // be the receipt the user just printed.
  const TODAY = { d: 69, title: 'Build Receipts', date: '2026-06-28', tags: ['meta','tools','ship','milestone'], level: 4, desc: 'Day 69 ships Build Receipts: a printable, shareable receipt for any day of the build. Pick today, dig up day 1, or hit Random for a surprise. Each receipt is styled like classic thermal paper — perforated edges, monospace font, barcode, dotted dividers, dotted impact meter. Print it, copy it as text, share it via Web Share, or download a .txt file. Search across 68 days by title / tag / day number, filter by Featured / Ship / Design / Tools / Meta / Milestone, and step through days with arrow keys.', features: ['Thermal-paper style', 'Barcode + ID', 'Print / Copy / Share / Download', 'Search + 6 filter chips', 'Random + Today shortcuts', 'localStorage stats'] };

  const ALL = [TODAY, ...BUILDS].slice().sort((a, b) => b.d - a.d);

  // ---- storage ----
  const STATS_KEY = 'ajh_receipts_stats_v1';
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { printed: 0, shared: 0, copied: 0 }; }
    catch (_) { return { printed: 0, shared: 0, copied: 0 }; }
  }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (_) {} }
  let stats = loadStats();

  // ---- state ----
  let current = TODAY;
  let filter = 'all';
  let search = '';

  // ---- helpers ----
  function $(id) { return document.getElementById(id); }
  function pad3(n) { return String(n).padStart(3, '0'); }
  function fmtDate(iso) {
    const d = new Date(iso + 'T12:00:00');
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();
  }

  // Build a deterministic barcode from day #
  function renderBarcode(day) {
    const wrap = $('rcpt-barcode');
    if (!wrap) return;
    const seed = day * 9301 + 49297;
    const n = 36;
    let bars = '';
    for (let i = 0; i < n; i++) {
      const w = ((seed * (i + 1)) % 5) + 1;
      bars += `<span class="bc-bar" style="width:${w}px; margin-right:${(((seed * (i + 3)) % 3) + 1)}px"></span>`;
    }
    wrap.innerHTML = bars;
  }

  // Render the dotted impact meter
  function renderImpact(level) {
    const wrap = $('rcpt-impact');
    if (!wrap) return;
    let html = '';
    for (let i = 0; i < 4; i++) {
      html += `<span class="rcpt-impact-dot${i < level ? ' lit' : ''}" aria-hidden="true"></span>`;
    }
    wrap.innerHTML = html;
  }

  // Render the receipt for the given build
  function render(build) {
    $('rcpt-num').textContent = pad3(build.d);
    $('rcpt-day').textContent = 'Day ' + build.d;
    $('rcpt-date').textContent = fmtDate(build.date);
    $('rcpt-title').textContent = build.title;
    $('rcpt-streak').textContent = build.d + ' days';
    renderImpact(build.level || 1);
    $('rcpt-commits').textContent = '1';
    $('rcpt-feature-count').textContent = build.features ? build.features.length : 0;
    $('rcpt-tag-count').textContent = build.tags ? build.tags.length : 0;
    $('rcpt-days-in').textContent = build.d;
    $('rcpt-desc').textContent = build.desc || '—';

    const items = $('rcpt-items');
    if (items) {
      items.innerHTML = (build.features || []).map((f) => `<li>1 × ${escapeHtml(f)}</li>`).join('') || '<li>—</li>';
    }

    const tags = $('rcpt-tags');
    if (tags) {
      tags.innerHTML = (build.tags || []).map((t) => `<span class="rcpt-tag">${escapeHtml(t)}</span>`).join('') || '<span class="rcpt-tag">—</span>';
    }

    $('rcpt-id').textContent = 'AJH-2026-' + pad3(build.d);

    renderBarcode(build.d);

    // Highlight active item in the index
    document.querySelectorAll('.receipt-item').forEach((el) => {
      el.classList.toggle('active', parseInt(el.dataset.day, 10) === build.d);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  // Build the index list (filtered by search + filter chip)
  function visibleList() {
    const q = search.trim().toLowerCase();
    return ALL.filter((b) => {
      if (filter === 'featured') {
        if (!b.tags || !b.tags.includes('ship')) return false;
      } else if (filter !== 'all') {
        if (!b.tags || !b.tags.includes(filter)) return false;
      }
      if (!q) return true;
      const hay = (b.title + ' ' + (b.tags || []).join(' ') + ' day' + b.d + ' ' + b.date).toLowerCase();
      return hay.includes(q);
    });
  }

  function renderList() {
    const list = $('receipts-list');
    if (!list) return;
    const items = visibleList();
    list.innerHTML = items.map((b) => `
      <div class="receipt-item${b.d === current.d ? ' active' : ''}" data-day="${b.d}">
        <span class="receipt-item-num">#${pad3(b.d)}</span>
        <span class="receipt-item-title">${escapeHtml(b.title)}</span>
        <span class="receipt-item-meta">${escapeHtml(b.date)}</span>
      </div>
    `).join('') || '<p class="receipts-empty">No matches.</p>';

    list.querySelectorAll('.receipt-item').forEach((el) => {
      el.addEventListener('click', () => {
        const d = parseInt(el.dataset.day, 10);
        const build = ALL.find((b) => b.d === d);
        if (build) { current = build; render(build); }
      });
    });
  }

  function updateStats() {
    $('receipts-total').textContent = ALL.length;
    $('receipts-printed').textContent = stats.printed;
    $('receipts-shared').textContent = stats.shared;
    $('receipts-copied').textContent = stats.copied;
  }

  // ---- copy / share / download ----
  function receiptText(b) {
    const lines = [];
    const w = (s) => s;
    lines.push('================================');
    lines.push('     AJH BUILD CO. — 2026       ');
    lines.push('================================');
    lines.push('RECEIPT #' + pad3(b.d) + '                  2026');
    lines.push('--------------------------------');
    lines.push('DAY     : Day ' + b.d);
    lines.push('DATE    : ' + fmtDate(b.date));
    lines.push('TITLE   : ' + b.title);
    lines.push('IMPACT  : ' + '●'.repeat(b.level || 1) + '○'.repeat(4 - (b.level || 1)));
    lines.push('STREAK  : ' + b.d + ' days');
    lines.push('--------------------------------');
    lines.push('FEATURES SHIPPED');
    (b.features || []).forEach((f) => lines.push('  1 × ' + f));
    lines.push('--------------------------------');
    lines.push('TAGS');
    lines.push('  ' + (b.tags || []).join(', '));
    lines.push('--------------------------------');
    lines.push('COMMITS : 1');
    lines.push('FEATURES: ' + (b.features || []).length);
    lines.push('TAGS    : ' + (b.tags || []).length);
    lines.push('DAYS IN : ' + b.d);
    lines.push('--------------------------------');
    lines.push(b.desc || '');
    lines.push('--------------------------------');
    lines.push('ID: AJH-2026-' + pad3(b.d));
    lines.push('★ THANK YOU FOR BUILDING ★');
    lines.push('No refunds. No regrets. Day by day.');
    lines.push('');
    return lines.join('\n');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      resolve();
    });
  }

  function downloadFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function showToast(msg) {
    let t = document.getElementById('receipts-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'receipts-toast';
      t.className = 'receipts-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  // ---- wire ----
  function wire() {
    // Today button
    $('receipts-today')?.addEventListener('click', () => {
      current = TODAY; render(current); renderList();
      const sec = document.getElementById('receipts');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Random button
    $('receipts-random')?.addEventListener('click', () => {
      const items = visibleList();
      if (!items.length) return;
      const pick = items[Math.floor(Math.random() * items.length)];
      current = pick; render(pick); renderList();
    });

    // Search
    const searchEl = $('receipts-search');
    searchEl?.addEventListener('input', (e) => {
      search = e.target.value || '';
      renderList();
    });

    // Filter chips
    document.querySelectorAll('#receipts-filters .receipt-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#receipts-filters .receipt-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter || 'all';
        renderList();
      });
    });

    // Print
    $('receipt-print')?.addEventListener('click', () => {
      stats.printed++; saveStats(stats); updateStats();
      window.print();
      showToast('Print dialog opened');
    });

    // Copy
    $('receipt-copy')?.addEventListener('click', async () => {
      await copyToClipboard(receiptText(current));
      stats.copied++; saveStats(stats); updateStats();
      showToast('Receipt copied ✓');
    });

    // Share
    $('receipt-share')?.addEventListener('click', async () => {
      const text = `Day ${current.d} — ${current.title}\n${(current.tags || []).map((t) => '#' + t).join(' ')}\najhs.github.io`;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'AJH Build Day ' + current.d, text });
          stats.shared++; saveStats(stats); updateStats();
          showToast('Shared ✓');
        } catch (_) {
          // user canceled
        }
      } else {
        await copyToClipboard(text);
        stats.shared++; saveStats(stats); updateStats();
        showToast('Copied share text ✓');
      }
    });

    // Download
    $('receipt-download')?.addEventListener('click', () => {
      downloadFile(receiptText(current), 'ajh-build-day-' + pad3(current.d) + '.txt');
      showToast('Downloaded .txt');
    });
  }

  // ---- keyboard shortcuts while section is in view ----
  function wireKeys() {
    document.addEventListener('keydown', (e) => {
      const sec = document.getElementById('receipts');
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        document.getElementById('receipts-random')?.click();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        document.getElementById('receipts-today')?.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
    });
  }

  function step(delta) {
    const items = visibleList();
    const idx = items.findIndex((b) => b.d === current.d);
    if (idx < 0) return;
    let next = idx + delta;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    current = items[next];
    render(current); renderList();
  }

  // Expose
  function init() {
    if (!document.getElementById('receipts')) return;
    render(current);
    renderList();
    updateStats();
    wire();
    wireKeys();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initBuildReceipts = init;
})();
