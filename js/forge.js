/* ============================================================
   Day 72: The Forge — Build Reflection Studio
   ============================================================ */

(function () {
  const STORAGE_KEY = 'ajh_forge_reflections_v1';
  const STREAK_KEY = 'ajh_forge_streak_v1';
  const RATING_KEY = 'ajh_forge_ratings_v1';

  const TAGS = [
    { id: 'ship', icon: 'fa-rocket', label: 'Ship' },
    { id: 'fix', icon: 'fa-wrench', label: 'Fix' },
    { id: 'design', icon: 'fa-pen-ruler', label: 'Design' },
    { id: 'tool', icon: 'fa-toolbox', label: 'Tool' },
    { id: 'meta', icon: 'fa-layer-group', label: 'Meta' },
    { id: 'milestone', icon: 'fa-trophy', label: 'Milestone' },
  ];

  const MOODS = [
    { id: 'fire', emoji: '🔥', label: 'On Fire' },
    { id: 'grind', emoji: '⚙️', label: 'Grinding' },
    { id: 'flow', emoji: '🌊', label: 'In Flow' },
    { id: 'spark', emoji: '✨', label: 'Sparky' },
    { id: 'teach', emoji: '📚', label: 'Learning' },
    { id: 'rest', emoji: '☕', label: 'Recharging' },
  ];

  const DIMENSIONS = [
    { id: 'difficulty', label: 'Difficulty', desc: 'How hard was it?' },
    { id: 'pride', label: 'Pride', desc: 'How proud of the result?' },
    { id: 'reach', label: 'Reach', desc: 'How many people will see this?' },
    { id: 'polish', label: 'Polish', desc: 'How shipped does it feel?' },
    { id: 'fun', label: 'Fun', desc: 'How fun was the build?' },
  ];

  const SUGGEST_RULES = [
    { match: /\b(ship|launch|release|deploy)\b/i, tag: 'ship' },
    { match: /\b(fix|bug|broken|repair)\b/i, tag: 'fix' },
    { match: /\b(design|style|css|layout|theme)\b/i, tag: 'design' },
    { match: /\b(tool|utility|helper|widget)\b/i, tag: 'tool' },
    { match: /\b(refactor|clean|reorganize|restructure)\b/i, tag: 'meta' },
    { match: /\b(100|50|25|streak|milestone|anniversary|first)\b/i, tag: 'milestone' },
  ];

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function dateKey(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function load(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function suggestTag(text) {
    for (const r of SUGGEST_RULES) {
      if (r.match.test(text)) return r.tag;
    }
    return null;
  }

  function getReflections() {
    return load(STORAGE_KEY, []);
  }

  function setReflections(list) {
    save(STORAGE_KEY, list);
  }

  function getOrCreateToday() {
    const list = getReflections();
    const k = todayKey();
    let today = list.find(r => r.date === k);
    if (!today) {
      today = {
        date: k,
        timestamp: Date.now(),
        text: '',
        tag: null,
        mood: null,
        ratings: { difficulty: 3, pride: 3, reach: 3, polish: 3, fun: 3 },
        tweeted: false,
      };
      list.unshift(today);
      setReflections(list);
    }
    return { today, list };
  }

  function getStreak() {
    return load(STREAK_KEY, 0);
  }

  function bumpStreak() {
    const list = getReflections();
    const hasText = list.find(r => r.date === todayKey() && (r.text || '').trim().length > 0);
    if (!hasText) return getStreak();

    const dates = list
      .filter(r => (r.text || '').trim().length > 0)
      .map(r => r.date)
      .sort();
    if (dates.length === 0) return 0;

    const today = new Date(todayKey());
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const k = dateKey(d);
      if (dates.includes(k)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    save(STREAK_KEY, streak);
    return streak;
  }

  function averageRatings(ratings) {
    const vals = DIMENSIONS.map(d => ratings[d.id] || 0).filter(v => v > 0);
    if (vals.length === 0) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function ratingColor(avg) {
    if (avg >= 4.5) return 'text-emerald-400';
    if (avg >= 3.5) return 'text-lime-400';
    if (avg >= 2.5) return 'text-amber-400';
    if (avg >= 1.5) return 'text-orange-400';
    return 'text-red-400';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function pluralize(n, one, many) {
    return n + ' ' + (n === 1 ? one : (many || one + 's'));
  }

  function buildAvgBar(avg) {
    const pct = (avg / 5) * 100;
    return `
      <div class="forge-avg-row">
        <div class="forge-avg-bar">
          <div class="forge-avg-bar-fill" style="width: ${pct.toFixed(1)}%"></div>
        </div>
        <div class="forge-avg-num">${avg.toFixed(1)} <span>/ 5</span></div>
      </div>
    `;
  }

  function init() {
    const sec = document.getElementById('forge');
    if (!sec) return;

    // Expose global open hook for the command palette / hero meta
    window.ajhForgeOpen = (tab) => {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (tab) switchTab(tab);
    };
    window.ajhForgeSaveToday = () => saveReflection();

    // Hero meta button: open Forge on the Reflect tab
    const heroBtn = document.getElementById('forge-hero-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        switchTab('reflect');
      });
    }

    const tabs = sec.querySelectorAll('.forge-tab');
    const panels = sec.querySelectorAll('.forge-panel');

    function switchTab(name) {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
    }

    tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

    // =========================
    // Reflect Tab
    // =========================
    const ratingsWrap = sec.querySelector('#forge-ratings');
    const ratingDesc = sec.querySelector('#forge-rating-desc');
    const moodGrid = sec.querySelector('#forge-moods');
    const tagGrid = sec.querySelector('#forge-tags');
    const writeText = sec.querySelector('#forge-write-text');
    const charCount = sec.querySelector('#forge-char-count');
    const submitBtn = sec.querySelector('#forge-submit');
    const tweetBtn = sec.querySelector('#forge-tweet');
    const suggestBadge = sec.querySelector('#forge-tag-suggest');
    const totalCard = sec.querySelector('#forge-today-total');
    const streakEl = sec.querySelector('#forge-streak-num');
    const avgEl = sec.querySelector('#forge-avg');
    const barsWrap = sec.querySelector('#forge-avg-bars');

    let activeTab = 'reflect';
    let { today, list } = getOrCreateToday();

    // Render rating rows
    function renderRatings() {
      ratingsWrap.innerHTML = DIMENSIONS.map(d => `
        <div class="forge-rating-row" data-dim="${d.id}">
          <div class="forge-rating-label">
            <span class="forge-rating-name">${d.label}</span>
            <span class="forge-rating-desc">${d.desc}</span>
          </div>
          <div class="forge-stars" role="radiogroup" aria-label="${d.label}">
            ${[1, 2, 3, 4, 5].map(v => `
              <button class="forge-star" data-val="${v}" aria-label="${v} of 5" role="radio" aria-checked="${today.ratings[d.id] === v}">
                <i class="fa${today.ratings[d.id] >= v ? 's' : 'r'} fa-star"></i>
              </button>
            `).join('')}
          </div>
        </div>
      `).join('');

      ratingsWrap.querySelectorAll('.forge-star').forEach(btn => {
        btn.addEventListener('click', () => {
          const dim = btn.closest('.forge-rating-row').dataset.dim;
          const val = parseInt(btn.dataset.val, 10);
          today.ratings[dim] = val;
          // Update visual
          ratingsWrap.querySelectorAll(`.forge-rating-row[data-dim="${dim}"] .forge-star`).forEach((s, idx) => {
            const v = parseInt(s.dataset.val, 10);
            const icon = s.querySelector('i');
            icon.className = v <= val ? 'fas fa-star' : 'far fa-star';
            s.setAttribute('aria-checked', v === val ? 'true' : 'false');
          });
          const labels = ['—', 'Felt off', 'OK', 'Solid', 'Sharp', 'Elite'];
          ratingDesc.textContent = `${DIMENSIONS.find(d => d.id === dim).label}: ${labels[val]}`;
          updateTotals();
        });
      });
    }

    // Render moods
    function renderMoods() {
      moodGrid.innerHTML = MOODS.map(m => `
        <button class="forge-mood ${today.mood === m.id ? 'selected' : ''}" data-mood="${m.id}">
          <span class="forge-mood-emoji">${m.emoji}</span>
          <span class="forge-mood-label">${m.label}</span>
        </button>
      `).join('');

      moodGrid.querySelectorAll('.forge-mood').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.mood;
          today.mood = today.mood === id ? null : id;
          moodGrid.querySelectorAll('.forge-mood').forEach(m => {
            m.classList.toggle('selected', m.dataset.mood === today.mood);
          });
        });
      });
    }

    // Render tags
    function renderTags() {
      tagGrid.innerHTML = TAGS.map(t => `
        <button class="forge-tag ${today.tag === t.id ? 'active' : ''}" data-tag="${t.id}">
          <i class="fas ${t.icon}"></i> ${t.label}
        </button>
      `).join('');

      tagGrid.querySelectorAll('.forge-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.tag;
          today.tag = today.tag === id ? null : id;
          tagGrid.querySelectorAll('.forge-tag').forEach(t => {
            t.classList.toggle('active', t.dataset.tag === today.tag);
          });
        });
      });
    }

    // Write
    writeText.value = today.text || '';
    charCount.textContent = (today.text || '').length;

    writeText.addEventListener('input', () => {
      const v = writeText.value;
      today.text = v;
      charCount.textContent = v.length;
      charCount.classList.toggle('over', v.length > 280);
      charCount.classList.toggle('near', v.length > 240 && v.length <= 280);

      const suggest = suggestTag(v);
      if (suggest && !today.tag) {
        suggestBadge.innerHTML = `<i class="fas fa-magic-wand-sparkles"></i> Suggested: <strong>${TAGS.find(t => t.id === suggest).label}</strong> <button class="forge-suggest-apply" data-tag="${suggest}">Apply</button>`;
        suggestBadge.style.display = 'inline-flex';
        suggestBadge.querySelector('.forge-suggest-apply')?.addEventListener('click', (e) => {
          today.tag = e.currentTarget.dataset.tag;
          renderTags();
          suggestBadge.style.display = 'none';
        });
      } else {
        suggestBadge.style.display = 'none';
      }
    });

    function saveToday(silent) {
      const all = getReflections();
      const idx = all.findIndex(r => r.date === today.date);
      if (idx >= 0) all[idx] = today;
      else all.unshift(today);
      setReflections(all);
      list = all;
      if (!silent) {
        const streak = bumpStreak();
        streakEl.textContent = streak;
        sec.querySelector('#forge-confetti').classList.add('fire');
        setTimeout(() => sec.querySelector('#forge-confetti').classList.remove('fire'), 1200);
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
        setTimeout(() => { submitBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> Save Reflection'; }, 1500);
      }
      updateTotals();
    }

    submitBtn.addEventListener('click', () => saveToday(false));

    tweetBtn.addEventListener('click', () => {
      if (!today.text) {
        alert('Write something first ✍️');
        return;
      }
      saveToday(true);
      const mood = MOODS.find(m => m.id === today.mood);
      const tag = TAGS.find(t => t.id === today.tag);
      const lines = [
        `Day 72 of building daily.`,
        `🔨 The Forge — Build Reflection Studio`,
        today.text.length > 200 ? today.text.slice(0, 200) + '…' : today.text,
      ];
      if (mood) lines.push(`${mood.emoji} ${mood.label}`);
      if (tag) lines.push(`#${tag}`);
      lines.push('#Day72 #BuildInPublic');
      const tweet = lines.join('\n\n');
      const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet);
      window.open(url, '_blank');
      today.tweeted = true;
      saveToday(true);
    });

    // Totals & summary
    function updateTotals() {
      const filled = (today.text || '').trim().length > 0;
      const total = averageRatings(today.ratings);
      avgEl.innerHTML = filled
        ? `<div class="forge-avg-display">${total.toFixed(1)} <span class="forge-avg-out">/ 5</span></div>`
        : '<div class="forge-avg-display muted">— <span class="forge-avg-out">/ 5</span></div>';

      barsWrap.innerHTML = buildAvgBar(total);
      barsWrap.querySelector('.forge-avg-bar-fill').style.background = `linear-gradient(90deg, #f97316, #ef4444)`;

      const tag = TAGS.find(t => t.id === today.tag);
      const mood = MOODS.find(m => m.id === today.mood);
      totalCard.innerHTML = `
        <div class="forge-total-row">
          <div class="forge-total-label">Tag</div>
          <div class="forge-total-value">${tag ? `<i class="fas ${tag.icon}"></i> ${tag.label}` : '<em>— pick one</em>'}</div>
        </div>
        <div class="forge-total-row">
          <div class="forge-total-label">Mood</div>
          <div class="forge-total-value">${mood ? `${mood.emoji} ${mood.label}` : '<em>— pick one</em>'}</div>
        </div>
        <div class="forge-total-row">
          <div class="forge-total-label">Average</div>
          <div class="forge-total-value">${filled ? total.toFixed(1) + ' / 5' : '—'}</div>
        </div>
        <div class="forge-total-row">
          <div class="forge-total-label">Reflection</div>
          <div class="forge-total-value">${filled ? (today.text.length + ' chars') : '<em>— write it</em>'}</div>
        </div>
      `;
    }

    // =========================
    // History Tab
    // =========================
    const historyList = sec.querySelector('#forge-history-list');
    const historyEmpty = sec.querySelector('#forge-history-empty');
    const historyFilter = sec.querySelector('#forge-history-filter');
    const historySort = sec.querySelector('#forge-history-sort');
    const historyCount = sec.querySelector('#forge-history-count');
    const heatmapWrap = sec.querySelector('#forge-heatmap');

    function renderHistory() {
      const filter = historyFilter.value;
      const sort = historySort.value;
      const all = getReflections().filter(r => (r.text || '').trim().length > 0);
      let list = all.slice();
      if (filter !== 'all') list = list.filter(r => r.tag === filter);
      if (sort === 'newest') list.sort((a, b) => b.timestamp - a.timestamp);
      else if (sort === 'oldest') list.sort((a, b) => a.timestamp - b.timestamp);
      else if (sort === 'highest') list.sort((a, b) => averageRatings(b.ratings) - averageRatings(a.ratings));
      else if (sort === 'lowest') list.sort((a, b) => averageRatings(a.ratings) - averageRatings(b.ratings));

      historyCount.textContent = `${list.length} of ${all.length} ${list.length === 1 ? 'reflection' : 'reflections'}`;

      if (list.length === 0) {
        historyList.innerHTML = '';
        historyEmpty.style.display = 'block';
        return;
      }
      historyEmpty.style.display = 'none';

      historyList.innerHTML = list.map(r => {
        const tag = TAGS.find(t => t.id === r.tag);
        const mood = MOODS.find(m => m.id === r.mood);
        const avg = averageRatings(r.ratings);
        const date = new Date(r.date + 'T12:00:00');
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const md = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `
          <article class="forge-history-item">
            <div class="forge-history-date">
              <span class="forge-history-day">${day}</span>
              <span class="forge-history-md">${md}</span>
            </div>
            <div class="forge-history-body">
              <div class="forge-history-title">
                ${tag ? `<span class="forge-history-tag"><i class="fas ${tag.icon}"></i> ${tag.label}</span>` : ''}
                ${mood ? `<span class="forge-history-mood">${mood.emoji} ${mood.label}</span>` : ''}
                <span class="forge-history-avg">${avg.toFixed(1)} / 5</span>
              </div>
              <p class="forge-history-text">${escapeHtml(r.text)}</p>
              <div class="forge-history-ratings">
                ${DIMENSIONS.map(d => `<span class="forge-history-rating"><strong>${d.label}</strong> ${r.ratings[d.id]}/5</span>`).join('')}
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    historyFilter.addEventListener('change', renderHistory);
    historySort.addEventListener('change', renderHistory);

    // Heatmap (last 14 days)
    function renderHeatmap() {
      const all = getReflections();
      const byDate = {};
      all.forEach(r => { byDate[r.date] = r; });

      const cells = [];
      const today = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const k = dateKey(d);
        const r = byDate[k];
        const has = r && (r.text || '').trim().length > 0;
        const avg = has ? averageRatings(r.ratings) : 0;
        const level = has ? Math.ceil(avg) : 0;
        cells.push({ date: k, has, level, reflection: r });
      }

      heatmapWrap.innerHTML = `
        <div class="forge-heatmap-grid">
          ${cells.map(c => `
            <div class="forge-cell level-${c.level}" title="${c.date}${c.has ? ' · ' + c.level + '/5' : ' · no reflection'}" data-date="${c.date}">
              <span class="forge-cell-day">${new Date(c.date + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric' })}</span>
            </div>
          `).join('')}
        </div>
        <div class="forge-heatmap-legend">
          <span>Less</span>
          <span class="forge-cell level-0"></span>
          <span class="forge-cell level-1"></span>
          <span class="forge-cell level-2"></span>
          <span class="forge-cell level-3"></span>
          <span class="forge-cell level-4"></span>
          <span class="forge-cell level-5"></span>
          <span>More</span>
        </div>
      `;

      // 7-day average
      const last7 = cells.slice(-7).filter(c => c.has);
      const avg7 = last7.length ? (last7.reduce((s, c) => s + c.level, 0) / last7.length).toFixed(1) : '—';
      const prev7 = cells.slice(0, 7).filter(c => c.has);
      const avgPrev = prev7.length ? (prev7.reduce((s, c) => s + c.level, 0) / prev7.length).toFixed(1) : '—';

      sec.querySelector('#forge-avg-7').textContent = avg7;
      sec.querySelector('#forge-avg-prev').textContent = avgPrev;
      const diffEl = sec.querySelector('#forge-diff');
      if (avg7 !== '—' && avgPrev !== '—') {
        const diff = (parseFloat(avg7) - parseFloat(avgPrev)).toFixed(1);
        const sign = diff > 0 ? '+' : '';
        diffEl.innerHTML = `<span class="forge-diff-num ${diff > 0 ? 'up' : diff < 0 ? 'down' : ''}">${sign}${diff}</span> vs last week`;
      } else {
        diffEl.textContent = '— vs last week';
      }

      heatmapWrap.querySelectorAll('.forge-cell').forEach(c => {
        c.addEventListener('click', () => {
          const date = c.dataset.date;
          const r = byDate[date];
          if (r && (r.text || '').trim().length > 0) {
            alert(`${date}\n\n${r.text}\n\nAverage: ${averageRatings(r.ratings).toFixed(1)} / 5`);
          }
        });
      });
    }

    // =========================
    // Focus Tab (5-minute focus block)
    // =========================
    const focusRing = sec.querySelector('#forge-focus-ring');
    const focusTime = sec.querySelector('#forge-focus-time');
    const focusStart = sec.querySelector('#forge-focus-start');
    const focusReset = sec.querySelector('#forge-focus-reset');
    const focusLabel = sec.querySelector('#forge-focus-label');
    const focusTickRow = sec.querySelector('#forge-focus-ticks');
    const focusHistory = sec.querySelector('#forge-focus-history');
    const focusTotal = sec.querySelector('#forge-focus-totals');

    let focusRunning = false;
    let focusStartTime = 0;
    let focusElapsed = 0;
    let focusInterval = null;
    const FOCUS_DURATION = 5 * 60; // 5 min

    function renderFocusTicks(progress) {
      const total = 5; // 5 segments = 5 minutes
      const filled = Math.floor(progress * total);
      focusTickRow.innerHTML = Array.from({ length: total }).map((_, i) => `
        <div class="forge-tick ${i < filled ? 'passed' : ''}"></div>
      `).join('');
    }

    function updateFocusUI() {
      const elapsed = focusElapsed + (focusRunning ? Math.floor((Date.now() - focusStartTime) / 1000) : 0);
      const remaining = Math.max(0, FOCUS_DURATION - elapsed);
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      focusTime.textContent = `${m}:${String(s).padStart(2, '0')}`;
      const progress = Math.min(1, elapsed / FOCUS_DURATION);
      const angle = progress * 360;
      focusRing.style.setProperty('--progress', `${angle}deg`);

      if (focusRunning) {
        focusLabel.textContent = 'In the zone…';
        focusStart.innerHTML = '<i class="fas fa-pause"></i> Pause';
      } else if (elapsed > 0 && elapsed < FOCUS_DURATION) {
        focusLabel.textContent = 'Paused';
        focusStart.innerHTML = '<i class="fas fa-play"></i> Resume';
      } else if (elapsed >= FOCUS_DURATION) {
        focusLabel.textContent = 'Done. Rest 5.';
        focusStart.innerHTML = '<i class="fas fa-play"></i> Start';
      } else {
        focusLabel.textContent = 'Ready to focus';
        focusStart.innerHTML = '<i class="fas fa-play"></i> Start 5 min';
      }
      renderFocusTicks(progress);
    }

    focusStart.addEventListener('click', () => {
      const elapsed = focusElapsed + (focusRunning ? Math.floor((Date.now() - focusStartTime) / 1000) : 0);
      if (elapsed >= FOCUS_DURATION) {
        focusElapsed = 0;
        focusStartTime = 0;
        focusRunning = false;
        updateFocusUI();
        return;
      }
      if (focusRunning) {
        focusElapsed += Math.floor((Date.now() - focusStartTime) / 1000);
        focusRunning = false;
        clearInterval(focusInterval);
        focusInterval = null;
      } else {
        focusRunning = true;
        focusStartTime = Date.now();
        focusInterval = setInterval(() => {
          const cur = focusElapsed + Math.floor((Date.now() - focusStartTime) / 1000);
          updateFocusUI();
          if (cur >= FOCUS_DURATION) {
            clearInterval(focusInterval);
            focusInterval = null;
            focusRunning = false;
            focusElapsed = FOCUS_DURATION;
            updateFocusUI();
            recordFocusSession();
            try {
              if (Notification.permission === 'granted') {
                new Notification('Focus complete 🔨', { body: '5 minutes in. Time to rest, then back to the build.' });
              }
            } catch (e) {}
            sec.querySelector('#forge-confetti').classList.add('fire');
            setTimeout(() => sec.querySelector('#forge-confetti').classList.remove('fire'), 1200);
          }
        }, 250);
      }
      updateFocusUI();
    });

    focusReset.addEventListener('click', () => {
      if (focusInterval) clearInterval(focusInterval);
      focusInterval = null;
      focusRunning = false;
      focusElapsed = 0;
      focusStartTime = 0;
      updateFocusUI();
    });

    function recordFocusSession() {
      const sessions = load('ajh_forge_focus_sessions', []);
      sessions.unshift({ date: todayKey(), timestamp: Date.now() });
      save('ajh_forge_focus_sessions', sessions);
      renderFocusHistory();
    }

    function renderFocusHistory() {
      const sessions = load('ajh_forge_focus_sessions', []);
      const today = sessions.filter(s => s.date === todayKey()).length;
      const total = sessions.length;
      focusTotal.innerHTML = `
        <span><strong>${today}</strong> today</span>
        <span><strong>${total}</strong> all-time</span>
        <span><strong>${Math.round(total * 5 / 60 * 10) / 10}</strong> hr focused</span>
      `;

      // Last 7 days as dots
      const days = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days[dateKey(d)] = 0;
      }
      sessions.forEach(s => { if (days[s.date] !== undefined) days[s.date]++; });
      const max = Math.max(1, ...Object.values(days));
      focusHistory.innerHTML = Object.entries(days).map(([k, v]) => {
        const d = new Date(k + 'T12:00:00');
        const h = v / max;
        return `<div class="forge-focus-bar" style="--h: ${h}" title="${k}: ${v} ${v === 1 ? 'session' : 'sessions'}"><span>${d.getDate()}</span></div>`;
      }).join('');
    }

    // =========================
    // Wire up everything
    // =========================
    renderRatings();
    renderMoods();
    renderTags();
    updateTotals();
    streakEl.textContent = getStreak();

    renderHistory();
    renderHeatmap();
    renderFocusTicks(0);
    updateFocusUI();
    renderFocusHistory();

    // Keyboard
    document.addEventListener('keydown', (e) => {
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      const rect = sec.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      if (e.key === 'F' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (activeTab !== 'focus') switchTab('focus');
        focusStart.click();
      } else if (e.key === 'H' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (activeTab !== 'history') switchTab('history');
      } else if (e.key === 'R' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (activeTab !== 'reflect') switchTab('reflect');
      }
    });

    // Track active tab via click
    tabs.forEach(t => t.addEventListener('click', () => { activeTab = t.dataset.tab; }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
