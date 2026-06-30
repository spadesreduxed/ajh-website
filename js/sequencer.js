// ============================================================
// Day 71: Step Sequencer — Web Audio API beat machine
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'ajh_sequencer_v1';
  const STATS_KEY = 'ajh_sequencer_stats_v1';
  const SHARE_PARAM = 'seq';

  const STEPS = 16;
  const TRACKS = [
    { id: 'kick',   name: 'Kick',    icon: '🥁', color: '#ec4899', wave: 'sine',     freq: 60,  dur: 0.18, decay: 0.5 },
    { id: 'snare',  name: 'Snare',   icon: '🥁', color: '#f59e0b', wave: 'noise',    dur: 0.18, freq: 200 },
    { id: 'hihat',  name: 'Hi-Hat',  icon: '🎩', color: '#22d3ee', wave: 'square',   freq: 8000, dur: 0.04 },
    { id: 'openhat',name: 'Open Hat',icon: '🪖', color: '#06b6d4', wave: 'square',   freq: 6000, dur: 0.18 },
    { id: 'tom',    name: 'Tom',     icon: '🪘', color: '#8b5cf6', wave: 'sine',     freq: 120, dur: 0.18 },
    { id: 'clap',   name: 'Clap',    icon: '👏', color: '#ef4444', wave: 'noise',    dur: 0.10, freq: 1200 },
    { id: 'rim',    name: 'Rim',     icon: '🛎', color: '#10b981', wave: 'square',   freq: 1800, dur: 0.04 },
    { id: 'cowbell',name: 'Cowbell', icon: '🔔', color: '#a78bfa', wave: 'square',   freq: 800, dur: 0.10 },
  ];

  const DEFAULT_PATTERN = [
    // Kick
    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    // Snare
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    // Hi-hat
    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    // Open hat
    [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
    // Tom
    [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    // Clap
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    // Rim
    [0,1,0,0, 0,0,1,0, 0,1,0,0, 0,0,1,0],
    // Cowbell
    [0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1],
  ];

  const state = {
    bpm: 120,
    swing: 0,
    pattern: TRACKS.map((_, ti) => DEFAULT_PATTERN[ti].slice()),
    bank: [
      { name: 'A', pattern: TRACKS.map((_, ti) => DEFAULT_PATTERN[ti].slice()) },
      { name: 'B', pattern: TRACKS.map(() => Array(STEPS).fill(0)) },
      { name: 'C', pattern: TRACKS.map(() => Array(STEPS).fill(0)) },
      { name: 'D', pattern: TRACKS.map(() => Array(STEPS).fill(0)) },
    ],
    activeBank: 0,
    isPlaying: false,
    currentStep: 0,
    muted: TRACKS.map(() => false),
    soloed: TRACKS.map(() => false),
    volumes: TRACKS.map(() => 0.8),
    scheduleAhead: 0.1,
    lookahead: 25,
    nextNoteTime: 0,
    timer: null,
    stats: { plays: 0, patterns: 0, shares: 0, exports: 0 },
  };

  let audioCtx = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.bpm === 'number') state.bpm = saved.bpm;
        if (typeof saved.swing === 'number') state.swing = saved.swing;
        if (Array.isArray(saved.pattern)) state.pattern = saved.pattern;
        if (Array.isArray(saved.bank)) state.bank = saved.bank;
        if (typeof saved.activeBank === 'number') state.activeBank = saved.activeBank;
        if (Array.isArray(saved.muted)) state.muted = saved.muted;
        if (Array.isArray(saved.soloed)) state.soloed = saved.soloed;
      }
      const rawStats = localStorage.getItem(STATS_KEY);
      if (rawStats) {
        const stats = JSON.parse(rawStats);
        Object.assign(state.stats, stats);
      }
      // Shareable URL takes precedence
      const url = new URL(window.location.href);
      const shared = url.searchParams.get(SHARE_PARAM);
      if (shared) {
        try {
          const decoded = JSON.parse(atob(decodeURIComponent(shared)));
          if (Array.isArray(decoded.pattern) && decoded.pattern.length === TRACKS.length) {
            state.pattern = decoded.pattern;
            if (decoded.bpm) state.bpm = decoded.bpm;
            if (decoded.swing != null) state.swing = decoded.swing;
            if (decoded.name) state.patternName = decoded.name;
            toast('Loaded shared pattern');
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        bpm: state.bpm,
        swing: state.swing,
        pattern: state.pattern,
        bank: state.bank,
        activeBank: state.activeBank,
        muted: state.muted,
        soloed: state.soloed,
      }));
      localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
    } catch (e) {
      // ignore
    }
  }

  function ensureAudio() {
    if (audioCtx) return audioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    return audioCtx;
  }

  function getMaster() {
    // Tie into soundboard's master if available
    if (window.ajhSoundboard && typeof window.ajhSoundboard.masterGain === 'function') {
      const g = window.ajhSoundboard.masterGain();
      if (g) return g;
    }
    return null;
  }

  function triggerVoice(track, time, accent) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const dest = getMaster() || ctx.destination;
    const vol = state.volumes[track.id] * (accent ? 1.15 : 1);

    if (track.wave === 'noise') {
      const buffer = createNoiseBuffer(ctx, 0.3);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = track.freq || 1000;
      bp.Q.value = 1.0;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, time + track.dur);
      src.connect(bp);
      bp.connect(gain);
      gain.connect(dest);
      src.start(time);
      src.stop(time + track.dur + 0.05);
    } else {
      const osc = ctx.createOscillator();
      osc.type = track.wave;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      if (track.id === 'kick') {
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
        gain.gain.linearRampToValueAtTime(vol, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, time + track.dur);
      } else if (track.id === 'tom') {
        osc.frequency.setValueAtTime(track.freq * 1.5, time);
        osc.frequency.exponentialRampToValueAtTime(track.freq, time + 0.10);
        gain.gain.linearRampToValueAtTime(vol * 0.8, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, time + track.dur);
      } else if (track.id === 'cowbell') {
        const o2 = ctx.createOscillator();
        o2.type = 'square';
        o2.frequency.value = track.freq * 1.5;
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0, time);
        g2.gain.linearRampToValueAtTime(vol * 0.5, time + 0.005);
        g2.gain.exponentialRampToValueAtTime(0.001, time + track.dur);
        o2.connect(g2);
        g2.connect(dest);
        o2.start(time);
        o2.stop(time + track.dur + 0.05);
        gain.gain.linearRampToValueAtTime(vol * 0.7, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, time + track.dur);
      } else {
        osc.frequency.value = track.freq;
        gain.gain.linearRampToValueAtTime(vol, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, time + track.dur);
      }
      osc.connect(gain);
      gain.connect(dest);
      osc.start(time);
      osc.stop(time + track.dur + 0.05);
    }
  }

  function createNoiseBuffer(ctx, duration) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function stepDuration() {
    // 16th note
    return 60.0 / state.bpm / 4;
  }

  function scheduleStep(step, time) {
    const soloActive = state.soloed.some(Boolean);
    TRACKS.forEach((track, ti) => {
      if (state.muted[ti]) return;
      if (soloActive && !state.soloed[ti]) return;
      if (state.pattern[ti][step]) {
        const accent = step % 4 === 0;
        triggerVoice(track, time, accent);
      }
    });
  }

  function advance() {
    state.nextNoteTime += stepDuration() * (state.currentStep % 2 === 1 ? (1 + state.swing / 100) : 1);
    state.currentStep = (state.currentStep + 1) % STEPS;
  }

  function scheduler() {
    const ctx = ensureAudio();
    if (!ctx) return;
    while (state.nextNoteTime < ctx.currentTime + state.scheduleAhead) {
      scheduleStep(state.currentStep, state.nextNoteTime);
      const stepForUI = state.currentStep;
      const fireAt = (state.nextNoteTime - ctx.currentTime) * 1000;
      setTimeout(() => {
        if (state.isPlaying) {
          updatePlayhead(stepForUI);
        }
      }, Math.max(0, fireAt));
      advance();
    }
    state.timer = setTimeout(scheduler, state.lookahead);
  }

  function startPlayback() {
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    state.isPlaying = true;
    state.currentStep = 0;
    state.nextNoteTime = ctx.currentTime + 0.05;
    scheduler();
    state.stats.plays = (state.stats.plays || 0) + 1;
    save();
    updatePlayButton();
  }

  function stopPlayback() {
    state.isPlaying = false;
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
    state.currentStep = 0;
    updatePlayhead(-1);
    updatePlayButton();
  }

  function updatePlayhead(step) {
    const cells = document.querySelectorAll('.seq-cell');
    cells.forEach((c) => {
      c.classList.remove('playhead', 'playhead-col');
    });
    if (step < 0) {
      const stepEl = document.getElementById('seq-step');
      if (stepEl) stepEl.textContent = '0';
      return;
    }
    const stepEl = document.getElementById('seq-step');
    if (stepEl) stepEl.textContent = String(step + 1).padStart(2, '0');
    document.querySelectorAll(`.seq-cell[data-step="${step}"]`).forEach((c) => {
      c.classList.add('playhead');
    });
    document.querySelectorAll('.seq-cell').forEach((c) => {
      const cStep = parseInt(c.getAttribute('data-step'), 10);
      if (Math.floor(cStep / 4) === Math.floor(step / 4)) {
        c.classList.add('playhead-col');
      }
    });
  }

  function updatePlayButton() {
    const label = document.getElementById('seq-play-label');
    const icon = document.getElementById('seq-play-icon');
    if (label) label.textContent = state.isPlaying ? 'Pause' : 'Play';
    if (icon) {
      icon.className = state.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
  }

  function renderGrid() {
    const grid = document.getElementById('seq-grid');
    if (!grid) return;
    grid.innerHTML = '';
    TRACKS.forEach((track, ti) => {
      // Row label
      const label = document.createElement('div');
      label.className = 'seq-row-label';
      label.style.setProperty('--track-color', track.color);
      label.innerHTML = `
        <span class="seq-row-icon" style="color:${track.color}">${track.icon}</span>
        <span>${track.name}</span>
        <div class="seq-row-controls">
          <button class="seq-row-btn seq-row-mute ${state.muted[ti] ? 'muted' : ''}" data-track="${ti}" title="Mute this track">M</button>
          <button class="seq-row-btn seq-row-solo ${state.soloed[ti] ? 'soloed' : ''}" data-track="${ti}" title="Solo this track">S</button>
        </div>
      `;
      grid.appendChild(label);
      // 16 step cells
      for (let s = 0; s < STEPS; s++) {
        const cell = document.createElement('div');
        cell.className = 'seq-cell' + (s % 4 === 0 ? ' beat' : '');
        cell.setAttribute('data-track', String(ti));
        cell.setAttribute('data-step', String(s));
        cell.style.setProperty('--track-color', track.color);
        if (state.pattern[ti][s]) cell.classList.add('active');
        grid.appendChild(cell);
      }
    });

    grid.querySelectorAll('.seq-cell').forEach((cell) => {
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const ti = parseInt(cell.getAttribute('data-track'), 10);
        const step = parseInt(cell.getAttribute('data-step'), 10);
        toggleCell(ti, step, cell);
        window._seqDrag = { ti, value: !state.pattern[ti][step] };
      });
      cell.addEventListener('mouseenter', () => {
        if (window._seqDrag) {
          const ti = parseInt(cell.getAttribute('data-track'), 10);
          const step = parseInt(cell.getAttribute('data-step'), 10);
          setCell(ti, step, window._seqDrag.value);
        }
      });
    });

    document.addEventListener('mouseup', () => {
      if (window._seqDrag) {
        window._seqDrag = null;
        save();
      }
    });

    grid.querySelectorAll('.seq-row-mute').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const ti = parseInt(btn.getAttribute('data-track'), 10);
        state.muted[ti] = !state.muted[ti];
        btn.classList.toggle('muted', state.muted[ti]);
        save();
      });
    });
    grid.querySelectorAll('.seq-row-solo').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const ti = parseInt(btn.getAttribute('data-track'), 10);
        state.soloed[ti] = !state.soloed[ti];
        btn.classList.toggle('soloed', state.soloed[ti]);
        save();
      });
    });
  }

  function toggleCell(ti, step, cell) {
    state.pattern[ti][step] = state.pattern[ti][step] ? 0 : 1;
    if (cell) cell.classList.toggle('active', !!state.pattern[ti][step]);
    if (state.isPlaying) {
      const ctx = ensureAudio();
      if (ctx && state.pattern[ti][step]) {
        triggerVoice(TRACKS[ti], ctx.currentTime, step % 4 === 0);
      }
    }
  }

  function setCell(ti, step, value) {
    if (state.pattern[ti][step] === value) return;
    state.pattern[ti][step] = value;
    const cells = document.querySelectorAll(`.seq-cell[data-track="${ti}"][data-step="${step}"]`);
    cells.forEach((c) => c.classList.toggle('active', !!value));
  }

  function clearPattern() {
    TRACKS.forEach((_, ti) => {
      state.pattern[ti] = Array(STEPS).fill(0);
    });
    renderGrid();
    save();
    toast('Pattern cleared');
  }

  function randomizePattern() {
    // Different densities per track for musicality
    const densities = [0.25, 0.12, 0.5, 0.10, 0.08, 0.10, 0.18, 0.12];
    TRACKS.forEach((_, ti) => {
      const d = densities[ti] || 0.2;
      state.pattern[ti] = Array.from({ length: STEPS }, () => (Math.random() < d ? 1 : 0));
    });
    renderGrid();
    save();
    toast('Randomized');
  }

  function setBpm(value) {
    state.bpm = Math.max(60, Math.min(200, value));
    const bpmEl = document.getElementById('seq-bpm');
    const numEl = document.getElementById('seq-bpm-num');
    const readEl = document.getElementById('seq-bpm-readout');
    if (bpmEl) bpmEl.value = state.bpm;
    if (numEl) numEl.textContent = state.bpm;
    if (readEl) readEl.textContent = state.bpm;
    save();
  }

  function setSwing(value) {
    state.swing = Math.max(0, Math.min(60, value));
    const el = document.getElementById('seq-swing');
    const readEl = document.getElementById('seq-swing-readout');
    if (el) el.value = state.swing;
    if (readEl) readEl.textContent = state.swing + '%';
    save();
  }

  function selectBank(i) {
    if (i < 0 || i >= state.bank.length) return;
    state.activeBank = i;
    document.querySelectorAll('.seq-pad').forEach((p, ix) => {
      p.classList.toggle('active', ix === i);
    });
    const nameInput = document.getElementById('seq-pattern-name');
    if (nameInput && state.bank[i].name) nameInput.value = state.bank[i].name;
    save();
  }

  function saveBank() {
    const i = state.activeBank;
    state.bank[i] = {
      name: document.getElementById('seq-pattern-name')?.value || state.bank[i].name,
      pattern: state.pattern.map((row) => row.slice()),
    };
    state.stats.patterns = (state.stats.patterns || 0) + 1;
    save();
    toast(`Saved to bank ${state.bank[i].name}`);
  }

  function loadBank() {
    const i = state.activeBank;
    const bank = state.bank[i];
    if (!bank) return;
    state.pattern = bank.pattern.map((row) => row.slice());
    const nameInput = document.getElementById('seq-pattern-name');
    if (nameInput) nameInput.value = bank.name || '';
    renderGrid();
    toast(`Loaded bank ${bank.name || i + 1}`);
  }

  function shareUrl() {
    const data = {
      bpm: state.bpm,
      swing: state.swing,
      pattern: state.pattern,
      name: document.getElementById('seq-pattern-name')?.value || '',
    };
    const encoded = btoa(JSON.stringify(data));
    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_PARAM, encoded);
    url.hash = 'sequencer';
    const link = url.toString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(
        () => { state.stats.shares = (state.stats.shares || 0) + 1; save(); toast('Share URL copied to clipboard'); },
        () => { prompt('Copy this URL', link); }
      );
    } else {
      prompt('Copy this URL', link);
    }
  }

  function exportJson() {
    const data = {
      name: document.getElementById('seq-pattern-name')?.value || `Pattern ${new Date().toISOString().slice(0, 10)}`,
      bpm: state.bpm,
      swing: state.swing,
      pattern: state.pattern,
      tracks: TRACKS.map((t) => ({ id: t.id, name: t.name })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/[^a-z0-9_-]/gi, '_')}.seq.json`;
    a.click();
    URL.revokeObjectURL(url);
    state.stats.exports = (state.stats.exports || 0) + 1;
    save();
    toast('Exported pattern');
  }

  function importJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (Array.isArray(data.pattern) && data.pattern.length === TRACKS.length) {
            state.pattern = data.pattern.map((row) => row.slice());
            if (data.bpm) setBpm(data.bpm);
            if (data.swing != null) setSwing(data.swing);
            const nameInput = document.getElementById('seq-pattern-name');
            if (nameInput && data.name) nameInput.value = data.name;
            renderGrid();
            save();
            toast('Imported pattern');
          } else {
            toast('Invalid pattern file');
          }
        } catch (e) {
          toast('Could not parse file');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function toast(message) {
    let el = document.getElementById('seq-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'seq-toast';
      el.className = 'seq-toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => {
      el.classList.remove('show');
    }, 1800);
  }

  function openSection() {
    const section = document.getElementById('sequencer');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function wireUI() {
    document.getElementById('seq-play')?.addEventListener('click', () => {
      if (state.isPlaying) {
        state.isPlaying = false;
        if (state.timer) clearTimeout(state.timer);
        state.timer = null;
        updatePlayhead(-1);
        updatePlayButton();
      } else {
        startPlayback();
      }
    });
    document.getElementById('seq-stop')?.addEventListener('click', () => {
      stopPlayback();
    });
    document.getElementById('seq-clear')?.addEventListener('click', clearPattern);
    document.getElementById('seq-randomize')?.addEventListener('click', randomizePattern);

    const bpmEl = document.getElementById('seq-bpm');
    if (bpmEl) {
      bpmEl.addEventListener('input', (e) => setBpm(parseInt(e.target.value, 10)));
    }
    const swingEl = document.getElementById('seq-swing');
    if (swingEl) {
      swingEl.addEventListener('input', (e) => setSwing(parseInt(e.target.value, 10)));
    }

    document.querySelectorAll('.seq-pad').forEach((p) => {
      p.addEventListener('click', () => {
        const i = parseInt(p.getAttribute('data-pattern'), 10);
        selectBank(i);
      });
    });
    document.getElementById('seq-pattern-save')?.addEventListener('click', saveBank);
    document.getElementById('seq-pattern-load')?.addEventListener('click', loadBank);
    document.getElementById('seq-name-btn')?.addEventListener('click', () => {
      const nameInput = document.getElementById('seq-pattern-name');
      nameInput?.focus();
      nameInput?.select();
    });
    document.getElementById('seq-pattern-name')?.addEventListener('change', () => {
      state.bank[state.activeBank].name = document.getElementById('seq-pattern-name').value;
      save();
    });
    document.getElementById('seq-share')?.addEventListener('click', shareUrl);
    document.getElementById('seq-export')?.addEventListener('click', exportJson);
    document.getElementById('seq-import')?.addEventListener('click', importJson);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ignore when typing in inputs
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (state.isPlaying) {
          state.isPlaying = false;
          if (state.timer) clearTimeout(state.timer);
          state.timer = null;
          updatePlayhead(-1);
          updatePlayButton();
        } else {
          startPlayback();
        }
      } else if (e.key && e.key.toLowerCase() === 'r') {
        randomizePattern();
      } else if (e.key && e.key.toLowerCase() === 'n') {
        clearPattern();
      } else if (e.key && /^[1-4]$/.test(e.key)) {
        selectBank(parseInt(e.key, 10) - 1);
      }
    });
  }

  function init() {
    load();
    renderGrid();
    setBpm(state.bpm);
    setSwing(state.swing);
    selectBank(state.activeBank);
    updatePlayButton();
    wireUI();

    const openBtn = document.getElementById('sequencer-hero-btn');
    if (openBtn) openBtn.addEventListener('click', openSection);

    // If shared pattern URL had a name, fill the name input
    if (state.patternName) {
      const nameInput = document.getElementById('seq-pattern-name');
      if (nameInput) nameInput.value = state.patternName;
    }

    window.ajhSequencerOpen = openSection;
    window.ajhSequencerPlay = () => state.isPlaying ? null : startPlayback();
    window.ajhSequencerStop = stopPlayback;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
