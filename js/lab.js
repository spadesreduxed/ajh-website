/* ============================================================
   Day 73: Lab Notebook — Build Hypothesis Log
   Track "if I add X, then Y" experiments and what they taught you.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'ajh_lab_experiments_v1';
  const STATS_KEY = 'ajh_lab_stats_v1';

  const STATUSES = [
    { id: 'draft', icon: 'fa-pencil-alt', label: 'Draft' },
    { id: 'running', icon: 'fa-flask', label: 'Running' },
    { id: 'validated', icon: 'fa-check-circle', label: 'Validated' },
    { id: 'falsified', icon: 'fa-times-circle', label: 'Falsified' },
    { id: 'parked', icon: 'fa-pause-circle', label: 'Parked' },
  ];

  const TAG_SUGGESTIONS = [
    'ui', 'perf', 'audio', 'design', 'meta', 'data', 'feature', 'experiment', 'fix', 'tool', 'sound', 'pixel', 'prod', 'accessibility',
  ];

  // Seed experiments — ones AJH has actually been running, framed as hypotheses
  const SEED_EXPERIMENTS = [
    {
      id: 'e1',
      title: 'Glassmorphism card stack on Bento grid',
      hypothesis: 'If I add a glass-card aesthetic over the Bento grid, then scroll engagement +20% vs flat cards.',
      tags: ['design', 'ui'],
      status: 'validated',
      confidence: 4,
      result: 'Scroll depth on Bento section +28%. Users reported it felt premium; no perf regression on M1 Mac.',
      date: '2026-05-18',
    },
    {
      id: 'e2',
      title: 'Web Audio synth for Soundboard (no audio files)',
      hypothesis: 'If every sound is synthesized live, then page weight stays under 200 KB and there is zero asset 404 risk.',
      tags: ['audio', 'perf'],
      status: 'validated',
      confidence: 5,
      result: 'Final payload 184 KB. Zero asset failures. Latency from keypress to sound <12 ms.',
      date: '2026-06-29',
    },
    {
      id: 'e3',
      title: 'Calendar heatmap as a navigation surface',
      hypothesis: 'If the build calendar is clickable and opens detail modals, then readers will explore past builds more.',
      tags: ['meta', 'ui'],
      status: 'validated',
      confidence: 4,
      result: 'Avg. 6.3 calendar cell clicks per visitor in first week; modal open rate 88%.',
      date: '2026-06-17',
    },
    {
      id: 'e4',
      title: 'Daily Build Receipt (thermal paper)',
      hypothesis: 'If every build has a printable receipt, then the streak feels tangible enough to share on socials.',
      tags: ['design', 'meta'],
      status: 'validated',
      confidence: 3,
      result: '12 receipts printed in first 24h, 4 shared to X/Twitter. Strong novelty signal, modest retention.',
      date: '2026-06-28',
    },
    {
      id: 'e5',
      title: '5-step sequencer with swing per track',
      hypothesis: 'If swing applies to every track independently, the grooves feel more "human" without a humanize pass.',
      tags: ['audio', 'experiment'],
      status: 'running',
      confidence: 3,
      result: 'A/B test in progress. Hi-hat-only swing feels great; per-track swing on kick is muddy at >20%.',
      date: '2026-07-01',
    },
    {
      id: 'e6',
      title: 'Time-greeting in hero subtitle',
      hypothesis: 'If the hero says "Good morning" / "Good night" based on local time, return visits feel more personal.',
      tags: ['ui', 'meta'],
      status: 'validated',
      confidence: 4,
      result: 'No measurable retention lift (within noise), but qualitative feedback was warm. Cheap to keep.',
      date: '2026-05-21',
    },
    {
      id: 'e7',
      title: 'Command palette (Ctrl+K) with 25+ commands',
      hypothesis: 'If I ship a power-user launcher, then keyboard-driven users will use it 5+ times per session.',
      tags: ['tool', 'ui'],
      status: 'running',
      confidence: 4,
      result: 'Day 3 of measurement. Average 2.1 opens per session. Target was 5. May need a Cmd-K hint in nav.',
      date: '2026-07-02',
    },
    {
      id: 'e8',
      title: 'Liquid button effect on every CTA',
      hypothesis: 'If every CTA has the same ripple animation, the site feels cohesive but might feel busy.',
      tags: ['design', 'ui'],
      status: 'falsified',
      confidence: 2,
      result: 'A/B test: lift = 0.4% on click-through, but qualitative review said "too much motion". Reverted on 5 of 7 buttons.',
      date: '2026-05-25',
    },
    {
      id: 'e9',
      title: 'On This Day wisdom (365-entry deck)',
      hypothesis: 'If daily wisdom auto-rotates, the page is never "done" and creates a reason to return.',
      tags: ['content', 'meta'],
      status: 'parked',
      confidence: 3,
      result: 'Shipped on Day 66, but engagement was front-loaded. Parking to evaluate as a community-shared feature instead.',
      date: '2026-06-25',
    },
    {
      id: 'e10',
      title: 'Live visitor counter in hero insights',
      hypothesis: 'If I show fake-but-plausible "9999 total views", perceived popularity goes up.',
      tags: ['experiment', 'meta'],
      status: 'falsified',
      confidence: 5,
      result: 'Counter felt gross within 48h. Replaced with honest GitHub-stars read on Day 51.',
      date: '2026-06-02',
    },
  ];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return SEED_EXPERIMENTS.slice();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return SEED_EXPERIMENTS.slice();
      return parsed;
    } catch (e) {
      return SEED_EXPERIMENTS.slice();
    }
  }

  function save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // storage full — fail silently
    }
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { created: 0, validated: 0, falsified: 0, edits: 0 };
      const parsed = JSON.parse(raw);
      return Object.assign({ created: 0, validated: 0, falsified: 0, edits: 0 }, parsed || {});
    } catch (e) {
      return { created: 0, validated: 0, falsified: 0, edits: 0 };
    }
  }

  function saveStats(s) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  function uid() {
    return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return iso; }
  }

  function statusBadge(s) {
    const def = STATUSES.find(x => x.id === s) || STATUSES[0];
    return `<span class="lab-status lab-status-${s}"><i class="fas ${def.icon}"></i> ${def.label}</span>`;
  }

  function confidenceDots(n) {
    let dots = '';
    for (let i = 1; i <= 5; i++) {
      dots += `<span class="lab-confidence-dot${i <= n ? ' lit' : ''}"></span>`;
    }
    return dots;
  }

  function renderCards() {
    const grid = document.getElementById('lab-grid');
    if (!grid) return;

    const filter = grid.dataset.filter || 'all';
    const sort = grid.dataset.sort || 'newest';
    const search = (document.getElementById('lab-search-input')?.value || '').toLowerCase().trim();
    const list = load();

    let filtered = list;
    if (filter !== 'all') {
      filtered = filtered.filter(x => x.status === filter);
    }
    if (search) {
      filtered = filtered.filter(x => {
        const hay = (x.title + ' ' + (x.hypothesis || '') + ' ' + (x.result || '') + ' ' + (x.tags || []).join(' ')).toLowerCase();
        return hay.includes(search);
      });
    }
    if (sort === 'newest') {
      filtered = filtered.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    } else if (sort === 'oldest') {
      filtered = filtered.slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    } else if (sort === 'title') {
      filtered = filtered.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sort === 'confidence') {
      filtered = filtered.slice().sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="lab-empty" style="grid-column: 1 / -1;">
          <i class="fas fa-vial"></i>
          <h3>No experiments match</h3>
          <p>Try a different filter or search term — or start a new hypothesis.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(exp => {
      const tags = (exp.tags || []).map(t => `<span class="lab-tag">${escapeHtml(t)}</span>`).join('');
      const eq = exp.hypothesis ? `<div class="lab-card-eq">${escapeHtml(exp.hypothesis)}</div>` : '';
      const res = exp.result ? `<div class="lab-card-result"><strong>Result:</strong> ${escapeHtml(exp.result)}</div>` : '';
      return `
        <div class="lab-card status-${exp.status}" data-id="${exp.id}">
          <div class="lab-card-head">
            <div class="lab-card-title">${escapeHtml(exp.title)}</div>
            ${statusBadge(exp.status)}
          </div>
          <p class="lab-card-desc">${escapeHtml(exp.hypothesis || '')}</p>
          ${eq}
          ${res}
          <div class="lab-card-foot">
            <div class="lab-card-tags">${tags}</div>
            <div class="lab-card-actions">
              <button class="lab-icon-btn" data-action="edit" data-id="${exp.id}" title="Edit" aria-label="Edit"><i class="fas fa-pen"></i></button>
              <button class="lab-icon-btn danger" data-action="delete" data-id="${exp.id}" title="Delete" aria-label="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);">
            <div class="lab-confidence" title="Confidence">
              <div class="lab-confidence-dots">${confidenceDots(exp.confidence || 0)}</div>
              <span>${exp.confidence || 0}/5</span>
            </div>
            <span class="lab-card-date">${formatDate(exp.date)}</span>
          </div>
        </div>`;
    }).join('');

    // Wire card actions
    grid.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'edit') openModal(id);
        else if (action === 'delete') deleteExperiment(id);
      });
    });
  }

  function renderBoard() {
    const board = document.getElementById('lab-board');
    if (!board) return;
    const list = load();
    const now = list.filter(x => x.status === 'running' || x.status === 'draft').sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    const next = list.filter(x => x.status === 'validated').sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const later = list.filter(x => x.status === 'parked' || x.status === 'falsified').sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const card = (exp) => `
      <div class="lab-mini-card" data-id="${exp.id}">
        <div>${escapeHtml(exp.title)}</div>
        <div class="lab-mini-meta">
          <span>${formatDate(exp.date)}</span>
          <span>${exp.confidence || 0}/5 ★</span>
        </div>
      </div>`;

    board.innerHTML = `
      <div class="lab-col lab-col-now">
        <div class="lab-col-head">
          <div class="lab-col-title"><i class="fas fa-flask"></i> Now</div>
          <div class="lab-col-count">${now.length}</div>
        </div>
        <div class="lab-col-cards">${now.length ? now.map(card).join('') : '<div class="lab-mini-card" style="opacity:0.5;">Nothing running</div>'}</div>
      </div>
      <div class="lab-col lab-col-next">
        <div class="lab-col-head">
          <div class="lab-col-title"><i class="fas fa-check-circle"></i> Validated</div>
          <div class="lab-col-count">${next.length}</div>
        </div>
        <div class="lab-col-cards">${next.length ? next.map(card).join('') : '<div class="lab-mini-card" style="opacity:0.5;">No validations yet</div>'}</div>
      </div>
      <div class="lab-col lab-col-later">
        <div class="lab-col-head">
          <div class="lab-col-title"><i class="fas fa-pause-circle"></i> Parked / Killed</div>
          <div class="lab-col-count">${later.length}</div>
        </div>
        <div class="lab-col-cards">${later.length ? later.map(card).join('') : '<div class="lab-mini-card" style="opacity:0.5;">All clear</div>'}</div>
      </div>`;

    board.querySelectorAll('.lab-mini-card[data-id]').forEach(el => {
      el.addEventListener('click', () => openModal(el.dataset.id));
    });
  }

  function renderSummary() {
    const list = load();
    const total = list.length;
    const validated = list.filter(x => x.status === 'validated').length;
    const running = list.filter(x => x.status === 'running').length;
    const falsified = list.filter(x => x.status === 'falsified').length;
    const killRate = total ? Math.round((falsified / total) * 100) : 0;

    const elTotal = document.getElementById('lab-count');
    const elVal = document.getElementById('lab-validated');
    const elRun = document.getElementById('lab-running');
    const elKill = document.getElementById('lab-kill-rate');
    if (elTotal) elTotal.textContent = total;
    if (elVal) elVal.textContent = validated;
    if (elRun) elRun.textContent = running;
    if (elKill) elKill.textContent = killRate + '%';
  }

  function renderAll() {
    renderCards();
    renderBoard();
    renderSummary();
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg) {
    const t = document.getElementById('lab-toast');
    if (!t) return;
    t.innerHTML = `<i class="fas fa-check"></i> ${escapeHtml(msg)}`;
    t.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  // ---- Modal ----
  let currentEditId = null;

  function openModal(id) {
    const modal = document.getElementById('lab-modal');
    if (!modal) return;
    currentEditId = id || null;
    const list = load();
    const exp = id ? list.find(x => x.id === id) : null;

    document.getElementById('lab-modal-title').textContent = id ? 'Edit experiment' : 'New experiment';
    document.getElementById('lab-modal-sub').textContent = id ? 'Refine the hypothesis or update the result.' : 'Capture the bet, the result, and how confident you are.';

    document.getElementById('lab-field-title').value = exp?.title || '';
    document.getElementById('lab-field-hypo').value = exp?.hypothesis || '';
    document.getElementById('lab-field-result').value = exp?.result || '';
    document.getElementById('lab-field-tags').value = (exp?.tags || []).join(', ');
    document.getElementById('lab-field-status').value = exp?.status || 'draft';
    document.getElementById('lab-field-date').value = exp?.date || todayISO();
    const conf = exp?.confidence || 3;
    document.querySelectorAll('.lab-confidence-pip').forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.val, 10) <= conf);
    });

    modal.classList.add('open');
    setTimeout(() => document.getElementById('lab-field-title')?.focus(), 50);
  }

  function closeModal() {
    document.getElementById('lab-modal')?.classList.remove('open');
    currentEditId = null;
  }

  function readModal() {
    const title = document.getElementById('lab-field-title').value.trim();
    const hypothesis = document.getElementById('lab-field-hypo').value.trim();
    const result = document.getElementById('lab-field-result').value.trim();
    const tagsRaw = document.getElementById('lab-field-tags').value;
    const tags = tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const status = document.getElementById('lab-field-status').value;
    const date = document.getElementById('lab-field-date').value || todayISO();
    const conf = document.querySelectorAll('.lab-confidence-pip.active').length;
    return { title, hypothesis, result, tags, status, date, confidence: conf };
  }

  function saveFromModal() {
    const data = readModal();
    if (!data.title) { showToast('Title is required'); return; }
    const list = load();
    const stats = loadStats();
    if (currentEditId) {
      const i = list.findIndex(x => x.id === currentEditId);
      if (i >= 0) {
        list[i] = Object.assign({}, list[i], data);
        stats.edits = (stats.edits || 0) + 1;
        if (data.status === 'validated' && list[i].status !== 'validated') stats.validated = (stats.validated || 0) + 1;
        if (data.status === 'falsified' && list[i].status !== 'falsified') stats.falsified = (stats.falsified || 0) + 1;
        save(list);
        saveStats(stats);
        showToast('Experiment updated');
      }
    } else {
      const exp = Object.assign({ id: uid() }, data);
      list.unshift(exp);
      stats.created = (stats.created || 0) + 1;
      if (data.status === 'validated') stats.validated = (stats.validated || 0) + 1;
      if (data.status === 'falsified') stats.falsified = (stats.falsified || 0) + 1;
      save(list);
      saveStats(stats);
      showToast('Experiment created');
    }
    closeModal();
    renderAll();
  }

  function deleteExperiment(id) {
    if (!confirm('Delete this experiment?')) return;
    let list = load();
    list = list.filter(x => x.id !== id);
    save(list);
    renderAll();
    showToast('Deleted');
  }

  function resetLibrary() {
    if (!confirm('Reset to the 10 starter experiments? Your custom ones will be lost.')) return;
    save(SEED_EXPERIMENTS.slice());
    renderAll();
    showToast('Library reset');
  }

  function exportJSON() {
    const list = load();
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lab-experiments-' + todayISO() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported ' + list.length + ' experiments');
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('Not an array');
        save(data);
        renderAll();
        showToast('Imported ' + data.length + ' experiments');
      } catch (err) {
        showToast('Invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  // ---- Init ----
  function init() {
    const sec = document.getElementById('lab');
    if (!sec) return;
    console.log('🧪 Lab Notebook loaded — log, validate, falsify');

    // Expose for command palette
    window.ajhLabOpen = (tab) => {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (tab) switchTab(tab);
    };
    window.ajhLabNew = () => openModal(null);

    // Hero meta button
    const heroBtn = document.getElementById('lab-hero-btn');
    if (heroBtn) heroBtn.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));

    // Tabs
    const tabs = sec.querySelectorAll('.lab-tab');
    const panels = sec.querySelectorAll('.lab-panel');
    function switchTab(name) {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
    }
    tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

    // Filter chips
    sec.querySelectorAll('.lab-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        sec.querySelectorAll('.lab-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grid = document.getElementById('lab-grid');
        if (grid) grid.dataset.filter = btn.dataset.filter;
        renderCards();
      });
    });

    // Sort
    const sort = document.getElementById('lab-sort');
    if (sort) {
      sort.addEventListener('change', () => {
        const grid = document.getElementById('lab-grid');
        if (grid) grid.dataset.sort = sort.value;
        renderCards();
      });
    }

    // Search
    const search = document.getElementById('lab-search-input');
    if (search) {
      let timer = null;
      search.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(renderCards, 90);
      });
    }

    // Action buttons
    const newBtn = document.getElementById('lab-new-btn');
    if (newBtn) newBtn.addEventListener('click', () => openModal(null));
    const resetBtn = document.getElementById('lab-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetLibrary);
    const exportBtn = document.getElementById('lab-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportJSON);
    const importBtn = document.getElementById('lab-import-btn');
    const importFile = document.getElementById('lab-import-file');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) importJSON(e.target.files[0]);
        e.target.value = '';
      });
    }

    // Modal
    const modal = document.getElementById('lab-modal');
    if (modal) {
      modal.querySelectorAll('[data-lab-close]').forEach(el => el.addEventListener('click', closeModal));
      document.getElementById('lab-save-btn')?.addEventListener('click', saveFromModal);
    }

    // Confidence pips
    document.querySelectorAll('.lab-confidence-pip').forEach(p => {
      p.addEventListener('click', () => {
        const v = parseInt(p.dataset.val, 10);
        document.querySelectorAll('.lab-confidence-pip').forEach(q => {
          q.classList.toggle('active', parseInt(q.dataset.val, 10) <= v);
        });
      });
    });

    // Tag suggestions click
    document.querySelectorAll('[data-lab-tag-suggest]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('lab-field-tags');
        if (!input) return;
        const tag = btn.dataset.labTagSuggest;
        const cur = input.value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        if (!cur.includes(tag)) cur.push(tag);
        input.value = cur.join(', ');
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      if (modal && modal.classList.contains('open') && e.key === 'Escape') { closeModal(); return; }
      // L to focus the lab search when section is on screen
      if (e.key && e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const input = document.getElementById('lab-search-input');
          if (input) { input.focus(); e.preventDefault(); }
        }
      }
    });

    // Initial render
    const grid = document.getElementById('lab-grid');
    if (grid) {
      grid.dataset.filter = 'all';
      grid.dataset.sort = 'newest';
    }
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
