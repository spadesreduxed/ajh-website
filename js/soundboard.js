// ============================================================
// Day 70: Soundboard — Web Audio API, no audio files
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'ajh_soundboard_v1';
  const STATS_KEY = 'ajh_soundboard_stats_v1';

  const CATEGORIES = {
    all: 'All',
    ui: 'UI',
    arcade: 'Arcade',
    synth: 'Synth',
    nature: 'Nature',
    retro: 'Retro',
    voice: 'Voice',
  };

  const PADS = [
    { id: 'click', cat: 'ui', icon: '🖱', title: 'Click', color: '#22d3ee', key: '1', synth: { type: 'blip', freq: 880, dur: 0.06 } },
    { id: 'tap', cat: 'ui', icon: '👆', title: 'Tap', color: '#06b6d4', key: '2', synth: { type: 'blip', freq: 1320, dur: 0.05 } },
    { id: 'hover', cat: 'ui', icon: '✨', title: 'Hover', color: '#0ea5e9', key: '3', synth: { type: 'blip', freq: 1568, dur: 0.04 } },
    { id: 'confirm', cat: 'ui', icon: '✅', title: 'Confirm', color: '#10b981', key: '4', synth: { type: 'confirm' } },
    { id: 'error', cat: 'ui', icon: '⚠️', title: 'Error', color: '#ef4444', key: '5', synth: { type: 'error' } },
    { id: 'toggle', cat: 'ui', icon: '🔘', title: 'Toggle', color: '#84cc16', key: '6', synth: { type: 'blip', freq: 660, dur: 0.07 } },

    { id: 'coin', cat: 'arcade', icon: '🪙', title: 'Coin', color: '#f59e0b', key: '7', synth: { type: 'coin' } },
    { id: 'jump', cat: 'arcade', icon: '🦘', title: 'Jump', color: '#fb923c', key: '8', synth: { type: 'jump' } },
    { id: 'laser', cat: 'arcade', icon: '🔫', title: 'Laser', color: '#ef4444', key: '9', synth: { type: 'laser' } },
    { id: 'powerup', cat: 'arcade', icon: '⚡', title: 'Powerup', color: '#fbbf24', key: '0', synth: { type: 'powerup' } },
    { id: 'hit', cat: 'arcade', icon: '💥', title: 'Hit', color: '#dc2626', key: 'q', synth: { type: 'noise', dur: 0.18, freq: 220 } },
    { id: 'gameover', cat: 'arcade', icon: '🎮', title: 'Game Over', color: '#7c3aed', key: 'w', synth: { type: 'sweep', from: 880, to: 110, dur: 0.6 } },

    { id: 'chord', cat: 'synth', icon: '🎹', title: 'Power Chord', color: '#a855f7', key: 'e', synth: { type: 'chord', notes: [261.63, 329.63, 392.0] } },
    { id: 'pad', cat: 'synth', icon: '🌌', title: 'Ambient Pad', color: '#8b5cf6', key: 'r', synth: { type: 'pad', freq: 174.61 } },
    { id: 'arp', cat: 'synth', icon: '🎶', title: 'Arpeggio', color: '#6366f1', key: 't', synth: { type: 'arp', notes: [261.63, 329.63, 392.0, 523.25] } },
    { id: 'bass', cat: 'synth', icon: '🔊', title: 'Sub Bass', color: '#4f46e5', key: 'y', synth: { type: 'blip', freq: 80, dur: 0.4 } },

    { id: 'rain', cat: 'nature', icon: '🌧', title: 'Rain', color: '#0ea5e9', key: 'u', synth: { type: 'noise', dur: 0.6, filter: 1800 } },
    { id: 'wind', cat: 'nature', icon: '🌬', title: 'Wind', color: '#94a3b8', key: 'i', synth: { type: 'noise', dur: 0.8, filter: 600 } },
    { id: 'birds', cat: 'nature', icon: '🐦', title: 'Birds', color: '#16a34a', key: 'o', synth: { type: 'birds' } },
    { id: 'thunder', cat: 'nature', icon: '⛈', title: 'Thunder', color: '#475569', key: 'p', synth: { type: 'thunder' } },

    { id: 'beep', cat: 'retro', icon: '📟', title: 'Retro Beep', color: '#06b6d4', key: 'a', synth: { type: 'square', freq: 880, dur: 0.08 } },
    { id: 'dialup', cat: 'retro', icon: '📞', title: 'Dial-Up', color: '#0891b2', key: 's', synth: { type: 'dialup' } },
    { id: 'typewriter', cat: 'retro', icon: '⌨️', title: 'Typewriter', color: '#64748b', key: 'd', synth: { type: 'typewriter' } },

    { id: 'pop', cat: 'voice', icon: '💬', title: 'Pop', color: '#ec4899', key: 'f', synth: { type: 'blip', freq: 600, dur: 0.08, sweep: 200 } },
    { id: 'chime', cat: 'voice', icon: '🔔', title: 'Chime', color: '#f472b6', key: 'g', synth: { type: 'chime' } },
    { id: 'whoosh', cat: 'voice', icon: '🌀', title: 'Whoosh', color: '#db2777', key: 'h', synth: { type: 'whoosh' } },
  ];

  const KEY_TO_ID = new Map(PADS.map(p => [p.key, p.id]));
  const ID_TO_PAD = new Map(PADS.map(p => [p.id, p]));

  let state = {
    favorites: [],
    filters: { cat: 'all', favOnly: false },
    prefs: { volume: 0.8, reverb: 0.2, rate: 1, wave: 'sine' },
  };
  let stats = { played: 0 };

  let audioCtx = null;
  let activeTimers = new Map();
  let activePads = new Set();
  let animateRaf = 0;
  let lastPad = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
    } catch (e) {}
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) stats = Object.assign(stats, JSON.parse(raw));
    } catch (e) {}
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (e) {}
  }

  function ensureCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function startPadVisual(id) {
    const el = document.querySelector(`[data-pad-id="${id}"]`);
    if (!el) return;
    el.classList.add('is-playing');
    activePads.add(id);
    if (animateRaf) cancelAnimationFrame(animateRaf);
    animateRaf = requestAnimationFrame(() => {
      const bars = el.querySelectorAll('.sb-bar');
      bars.forEach((bar, i) => {
        bar.style.animationDelay = `${i * 40}ms`;
      });
    });
  }

  function stopPadVisual(id) {
    const el = document.querySelector(`[data-pad-id="${id}"]`);
    if (!el) return;
    el.classList.remove('is-playing');
    activePads.delete(id);
  }

  function updateStats() {
    const total = document.getElementById('sb-played');
    const fav = document.getElementById('sb-favs');
    if (total) total.textContent = String(stats.played);
    if (fav) fav.textContent = String(state.favorites.length);
  }

  function renderCategories() {
    const host = document.getElementById('sb-filters');
    if (!host) return;
    host.innerHTML = '';
    Object.entries(CATEGORIES).forEach(([key, label]) => {
      const btn = document.createElement('button');
      btn.className = `sb-chip${state.filters.cat === key ? ' active' : ''}`;
      btn.dataset.cat = key;
      btn.textContent = label;
      host.appendChild(btn);
    });
  }

  function renderGrid() {
    const host = document.getElementById('sb-grid');
    if (!host) return;
    host.innerHTML = '';
    const pads = PADS.filter(p => {
      const matchesCat = state.filters.cat === 'all' || p.cat === state.filters.cat;
      const matchesFav = !state.filters.favOnly || state.favorites.includes(p.id);
      return matchesCat && matchesFav;
    });

    pads.forEach(pad => {
      const card = document.createElement('button');
      card.className = 'sb-pad';
      card.dataset.padId = pad.id;
      if (state.favorites.includes(pad.id)) card.classList.add('is-favorite');
      card.style.setProperty('--pad-color', pad.color);
      card.innerHTML = `
        <div class="sb-pad-top">
          <span class="sb-pad-icon">${pad.icon}</span>
          <span class="sb-pad-key">${pad.key.toUpperCase()}</span>
        </div>
        <div class="sb-pad-body">
          <h3>${pad.title}</h3>
          <p>${CATEGORIES[pad.cat]}</p>
        </div>
        <div class="sb-pad-visual" aria-hidden="true">
          <span class="sb-bar"></span><span class="sb-bar"></span><span class="sb-bar"></span><span class="sb-bar"></span><span class="sb-bar"></span>
        </div>
        <div class="sb-pad-actions">
          <span class="sb-hint">Play</span>
          <span class="sb-fav">${state.favorites.includes(pad.id) ? '★' : '☆'}</span>
        </div>
      `;
      card.addEventListener('click', () => playPad(pad.id));
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFav(pad.id);
      });
      host.appendChild(card);
    });

    if (!pads.length) {
      host.innerHTML = `<div class="sb-empty">No pads match this filter.</div>`;
    }
  }

  function toggleFav(id) {
    const index = state.favorites.indexOf(id);
    if (index >= 0) state.favorites.splice(index, 1);
    else state.favorites.unshift(id);
    save();
    renderGrid();
    updateStats();
  }

  function playPad(id) {
    const pad = ID_TO_PAD.get(id);
    if (!pad) return;
    const ctx = ensureCtx();
    if (!ctx) return;

    lastPad = id;
    stats.played += 1;
    save();
    updateStats();

    const dn = document.getElementById('sb-display-now');
    const msg = document.getElementById('sb-display-msg');
    if (msg) msg.style.display = 'none';
    if (dn) {
      dn.classList.add('is-playing');
      dn.innerHTML = `
        <div class="sb-now-name">${pad.icon} ${pad.title}</div>
        <div class="sb-now-meta">${(CATEGORIES[pad.cat] || 'Unknown') || ''}</div>
      `;
    }

    startPadVisual(id);
    clearTimeout(activeTimers.get(id));
    activeTimers.set(id, setTimeout(() => {
      stopPadVisual(id);
      if (dn) dn.classList.remove('is-playing');
    }, 900));

    const masterVol = state.prefs.volume;
    const wave = state.prefs.wave;
    const synth = pad.synth;

    function outGain() {
      const g = ctx.createGain();
      g.gain.value = masterVol;
      g.connect(ctx.destination);
      return g;
    }

    function simpleOsc(type, freq, dur) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g);
      g.connect(outGain());
      o.start();
      o.stop(ctx.currentTime + dur + 0.05);
    }

    function noise(dur, cutoff = 1200) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      src.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.value = cutoff;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(filter); filter.connect(g); g.connect(outGain());
      src.start(); src.stop(ctx.currentTime + dur + 0.05);
    }

    switch (synth.type) {
      case 'blip': {
        const freq = synth.freq;
        const dur = synth.dur || 0.06;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = wave;
        o.frequency.setValueAtTime(synth.sweep ? freq + synth.sweep : freq, ctx.currentTime);
        if (synth.sweep) o.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + dur);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        o.connect(g); g.connect(outGain());
        o.start(); o.stop(ctx.currentTime + dur + 0.05);
        break;
      }
      case 'confirm': {
        simpleOsc('triangle', 660, 0.06);
        setTimeout(() => simpleOsc('triangle', 990, 0.06), 70);
        break;
      }
      case 'error': {
        simpleOsc('sawtooth', 180, 0.12);
        setTimeout(() => simpleOsc('sawtooth', 140, 0.14), 120);
        break;
      }
      case 'coin': {
        simpleOsc('square', 880, 0.08);
        setTimeout(() => simpleOsc('square', 1320, 0.08), 80);
        break;
      }
      case 'jump': {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(330, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        o.connect(g); g.connect(outGain());
        o.start(); o.stop(ctx.currentTime + 0.18);
        break;
      }
      case 'laser': {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(1200, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        o.connect(g); g.connect(outGain());
        o.start(); o.stop(ctx.currentTime + 0.22);
        break;
      }
      case 'powerup': {
        simpleOsc('triangle', 440, 0.08);
        setTimeout(() => simpleOsc('triangle', 660, 0.08), 60);
        setTimeout(() => simpleOsc('triangle', 880, 0.1), 120);
        break;
      }
      case 'noise': {
        noise(synth.dur || 0.2, synth.filter || 1000);
        break;
      }
      case 'sweep': {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(synth.from, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(Math.max(40, synth.to), ctx.currentTime + synth.dur);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + synth.dur);
        o.connect(g); g.connect(outGain());
        o.start(); o.stop(ctx.currentTime + synth.dur + 0.1);
        break;
      }
      case 'chord': {
        synth.notes.forEach((n, idx) => setTimeout(() => simpleOsc('triangle', n, 0.45), idx * 15));
        break;
      }
      case 'pad': {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(synth.freq, ctx.currentTime);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 4;
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain); lfoGain.connect(o.frequency);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        o.connect(g); g.connect(outGain());
        o.start(); lfo.start();
        o.stop(ctx.currentTime + 0.9); lfo.stop(ctx.currentTime + 0.9);
        break;
      }
      case 'arp': {
        synth.notes.forEach((n, idx) => setTimeout(() => simpleOsc('square', n, 0.12), idx * 90));
        break;
      }
      case 'birds': {
        simpleOsc('triangle', 1200, 0.05);
        setTimeout(() => simpleOsc('triangle', 1450, 0.05), 80);
        setTimeout(() => simpleOsc('triangle', 1750, 0.05), 160);
        break;
      }
      case 'thunder': {
        noise(0.7, 260);
        setTimeout(() => noise(0.25, 150), 130);
        break;
      }
      case 'dialup': {
        const sweep1 = (from, to, dur) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(from, ctx.currentTime);
          o.frequency.exponentialRampToValueAtTime(Math.max(40, to), ctx.currentTime + dur);
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
          o.connect(g); g.connect(outGain());
          o.start(); o.stop(ctx.currentTime + dur + 0.05);
        };
        sweep1(2000, 500, 0.25);
        setTimeout(() => sweep1(500, 1400, 0.22), 240);
        setTimeout(() => sweep1(1400, 900, 0.18), 480);
        break;
      }
      case 'typewriter': {
        simpleOsc('square', 920, 0.03);
        break;
      }
      case 'whoosh': {
        noise(0.3, 900);
        break;
      }
      default: {
        simpleOsc('triangle', 440, 0.1);
      }
    }
  }

  function stopAll() {
    // Clear visuals for any active pad
    PADS.forEach(p => {
      const t = activeTimers.get(p.id);
      if (t) clearTimeout(t);
      activeTimers.delete(p.id);
      stopPadVisual(p.id);
    });
    const dn = document.getElementById('sb-display-now');
    if (dn) {
      dn.classList.remove('is-playing');
      const msg = document.getElementById('sb-display-msg');
      if (msg) msg.style.display = '';
      if (!dn.dataset.persist) dn.innerHTML = '';
    }
  }

  function isPlayingVisual(id) {
    return activePads.has(id);
  }

  function initWaveform(canvas) {
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 80;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx2d.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    let raf;
    function tick() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 80;
      ctx2d.clearRect(0, 0, w, h);
      // Idle: faint baseline
      const t = Date.now() / 600;
      ctx2d.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();

      if (lastPad && isPlayingVisual(lastPad)) {
        const bars = 64;
        const bw = w / bars;
        const grad = ctx2d.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, '#22d3ee');
        grad.addColorStop(0.5, '#a855f7');
        grad.addColorStop(1, '#ec4899');
        ctx2d.fillStyle = grad;
        for (let i = 0; i < bars; i++) {
          const phase = t + i * 0.35;
          const amp = (Math.sin(phase) * 0.5 + Math.sin(phase * 1.7 + i * 0.2) * 0.3 + Math.sin(phase * 2.3) * 0.2) * (h * 0.4);
          const bh = Math.max(2, Math.abs(amp));
          ctx2d.fillRect(i * bw + 1, h / 2 - bh / 2, bw - 2, bh);
        }
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
  }

  function wireUI() {
    const grid = document.getElementById('sb-grid');
    const filters = document.getElementById('sb-cats');
    const favToggle = document.getElementById('sb-favs-only');
    const volume = document.getElementById('sb-vol-input');
    const volNum = document.getElementById('sb-vol');
    const reverb = document.getElementById('sb-reverb-input');
    const rate = document.getElementById('sb-rate-input');
    const wave = document.getElementById('sb-wave-input');
    const shuffleBtn = document.getElementById('sb-shuffle');
    const stopBtn = document.getElementById('sb-stop-all');

    if (filters) {
      filters.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-cat]');
        if (!btn) return;
        state.filters.cat = btn.dataset.cat || 'all';
        save();
        filters.querySelectorAll('button[data-cat]').forEach(b =>
          b.classList.toggle('active', b === btn)
        );
        renderGrid();
      });
    }

    if (favToggle) {
      favToggle.classList.toggle('active', state.filters.favOnly);
      favToggle.addEventListener('click', () => {
        state.filters.favOnly = !state.filters.favOnly;
        save();
        favToggle.classList.toggle('active', state.filters.favOnly);
        renderGrid();
      });
    }

    if (volume) {
      volume.value = String(Math.round(state.prefs.volume * 100));
      volume.addEventListener('input', () => {
        state.prefs.volume = Number(volume.value) / 100;
        save();
        if (volNum) volNum.textContent = state.prefs.volume + '%';
      });
    }
    if (reverb) {
      reverb.value = String(state.prefs.reverb);
      reverb.addEventListener('input', () => {
        state.prefs.reverb = Number(reverb.value);
        save();
      });
    }
    if (rate) {
      rate.value = String(state.prefs.rate);
      rate.addEventListener('input', () => {
        state.prefs.rate = Number(rate.value);
        save();
      });
    }
    if (wave) {
      wave.value = state.prefs.wave;
      wave.addEventListener('change', () => {
        state.prefs.wave = wave.value;
        save();
      });
    }

    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        const ids = PADS.map(p => p.id);
        const pick = ids[Math.floor(Math.random() * ids.length)];
        playPad(pick);
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', stopAll);
    }

    document.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
      const key = e.key.toLowerCase();
      if (key === ' ' || key === 'escape') {
        e.preventDefault();
        stopAll();
        return;
      }
      if (key === 'f') {
        state.filters.favOnly = !state.filters.favOnly;
        if (favToggle) favToggle.classList.toggle('active', state.filters.favOnly);
        save();
        renderGrid();
        return;
      }
      if (key === 's') {
        e.preventDefault();
        const ids = PADS.map(p => p.id);
        playPad(ids[Math.floor(Math.random() * ids.length)]);
        return;
      }
      if (KEY_TO_ID.has(key)) {
        playPad(KEY_TO_ID.get(key));
      }
    });

    if (grid) {
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-pad-id]');
        if (!btn) return;
        const id = btn.dataset.padId;
        if (e.target.closest('.sb-pad-fav')) {
          toggleFavorite(id);
        } else {
          playPad(id);
        }
      });
      grid.addEventListener('contextmenu', (e) => {
        const btn = e.target.closest('[data-pad-id]');
        if (!btn) return;
        e.preventDefault();
        toggleFavorite(btn.dataset.padId);
      });
    }
  }

  function toggleFavorite(id) {
    const ix = state.favorites.indexOf(id);
    if (ix >= 0) state.favorites.splice(ix, 1);
    else state.favorites.unshift(id);
    save();
    renderGrid();
    updateStats();
  }

  function openSection() {
    const section = document.getElementById('soundboard');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    load();
    renderCategories();
    renderGrid();
    updateStats();
    wireUI();

    const openBtn = document.getElementById('soundboard-hero-btn');
    if (openBtn) openBtn.addEventListener('click', openSection);

    const waveCanvas = document.getElementById('sb-waveform-canvas');
    if (waveCanvas) initWaveform(waveCanvas);

    window.ajhSoundboardOpen = openSection;
    window.ajhSoundboardPlay = playPad;
    window.ajhSoundboardStop = stopAll;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
