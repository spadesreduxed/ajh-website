// ============================================================
// Day 83: Build Waveform — 83 days of builds as 83 frequencies.
// Each day is a tone, archetype picks the waveform, impact picks
// the harmonic, day-1 = low left, day-83 = high right. A playhead
// scrolls through history and triggers every day as it passes.
// Click any day to focus it, play the full chord, scrub back, and
// export the spectrum.
// ============================================================
(function () {
  'use strict';

  const STORAGE_KEY = 'ajh_waveform_v1';

  // 83 days of builds. d = day number (1..83), a = archetype,
  // n = name, i = impact 1..5. Day 1 = 2026-04-22.
  const BUILDS = [
    { d: 1,  a: 'craft',     n: 'Animated Gradient Hero', i: 4 },
    { d: 2,  a: 'craft',     n: 'Loading States',         i: 3 },
    { d: 3,  a: 'systems',   n: 'Keyboard Shortcuts',     i: 4 },
    { d: 4,  a: 'visual',    n: 'Particle Background',    i: 3 },
    { d: 5,  a: 'craft',     n: 'Hero Polish',            i: 3 },
    { d: 6,  a: 'craft',     n: '3D Tilt Cards',          i: 4 },
    { d: 7,  a: 'craft',     n: 'Aurora Background',      i: 4 },
    { d: 8,  a: 'craft',     n: 'Easter Eggs',            i: 2 },
    { d: 9,  a: 'craft',     n: 'Sound Effects',          i: 3 },
    { d: 10, a: 'craft',     n: 'Hero Clocks',            i: 2 },
    { d: 11, a: 'visual',    n: 'Glassmorphism',          i: 4 },
    { d: 12, a: 'interactive', n: 'Theme Switcher',        i: 3 },
    { d: 13, a: 'craft',     n: 'Custom Cursor',          i: 3 },
    { d: 14, a: 'craft',     n: 'Scroll Animations',      i: 4 },
    { d: 15, a: 'craft',     n: 'Loading Skeleton',       i: 3 },
    { d: 16, a: 'interactive', n: 'Mini Games',            i: 4 },
    { d: 17, a: 'craft',     n: '3D Hero Scene',          i: 5 },
    { d: 18, a: 'data',      n: 'Project Filters',        i: 3 },
    { d: 19, a: 'meta',      n: 'Build Counter',          i: 3 },
    { d: 20, a: 'craft',     n: 'Animated Logos',         i: 3 },
    { d: 21, a: 'data',      n: 'Daily Counter Bump',     i: 2 },
    { d: 22, a: 'data',      n: 'Blog System',            i: 4 },
    { d: 23, a: 'craft',     n: 'CSS Grid Showcase',      i: 3 },
    { d: 24, a: 'interactive', n: 'Pomodoro Timer',       i: 4 },
    { d: 25, a: 'data',      n: 'Site Search',            i: 4 },
    { d: 26, a: 'interactive', n: 'Konami Code',          i: 3 },
    { d: 27, a: 'visual',    n: 'Parallax Polish',        i: 3 },
    { d: 28, a: 'data',      n: 'Newsletter Signup',      i: 3 },
    { d: 29, a: 'craft',     n: 'Accordion Refactor',     i: 3 },
    { d: 30, a: 'craft',     n: '3D Tilt Polish',         i: 3 },
    { d: 31, a: 'data',      n: 'Blog Cleanup',           i: 2 },
    { d: 32, a: 'craft',     n: 'Notification System',    i: 3 },
    { d: 33, a: 'interactive', n: 'Random Quote',         i: 3 },
    { d: 34, a: 'craft',     n: 'Sticky Notes',           i: 3 },
    { d: 35, a: 'craft',     n: 'Sticky Notes Polish',    i: 3 },
    { d: 36, a: 'craft',     n: 'Hero Refresh',           i: 3 },
    { d: 37, a: 'craft',     n: 'Hero Clocks',            i: 3 },
    { d: 38, a: 'craft',     n: 'Hero Polish',            i: 3 },
    { d: 39, a: 'craft',     n: 'Hero Polish',            i: 3 },
    { d: 40, a: 'craft',     n: 'Cursor Effects',         i: 4 },
    { d: 41, a: 'craft',     n: 'Nav Transitions',        i: 3 },
    { d: 42, a: 'craft',     n: 'Card Hover States',      i: 3 },
    { d: 43, a: 'craft',     n: 'Section Anchors',        i: 3 },
    { d: 44, a: 'craft',     n: 'Loading Spinners',       i: 3 },
    { d: 45, a: 'data',      n: 'Build Tracker',          i: 4 },
    { d: 46, a: 'meta',      n: 'Counter Increments',     i: 1 },
    { d: 47, a: 'interactive', n: 'Hero Game',            i: 5 },
    { d: 48, a: 'data',      n: 'Stats Dashboard',        i: 4 },
    { d: 49, a: 'craft',     n: 'Smooth Scrolling',       i: 3 },
    { d: 50, a: 'data',      n: 'Code Snippets',          i: 4 },
    { d: 51, a: 'craft',     n: 'Hero Polish',            i: 3 },
    { d: 52, a: 'craft',     n: 'Easter Eggs',            i: 3 },
    { d: 53, a: 'craft',     n: 'SVG Icons',              i: 3 },
    { d: 54, a: 'data',      n: 'Build Log',              i: 4 },
    { d: 55, a: 'craft',     n: '404 Page',               i: 3 },
    { d: 56, a: 'data',      n: 'Code Snippets Vault',    i: 5 },
    { d: 57, a: 'craft',     n: 'SVG Glyphs',             i: 4 },
    { d: 58, a: 'craft',     n: 'Marquee Banner',         i: 3 },
    { d: 59, a: 'craft',     n: 'Hero Spotlight',         i: 4 },
    { d: 60, a: 'data',      n: 'Build Index',            i: 4 },
    { d: 61, a: 'craft',     n: 'Hero Polish',            i: 3 },
    { d: 62, a: 'craft',     n: 'Skill Showcase',         i: 4 },
    { d: 63, a: 'data',      n: 'Build Index Expand',     i: 3 },
    { d: 64, a: 'data',      n: 'Build Journal',          i: 5 },
    { d: 65, a: 'interactive', n: 'Whack-a-Bug',          i: 4 },
    { d: 66, a: 'craft',     n: 'Hero Clocks v2',         i: 3 },
    { d: 67, a: 'craft',     n: 'Pixel Art Studio',       i: 5 },
    { d: 68, a: 'interactive', n: 'Daily Pixel Challenge', i: 5 },
    { d: 69, a: 'data',      n: 'Build Receipts',         i: 5 },
    { d: 70, a: 'audio',     n: 'Soundboard',             i: 5 },
    { d: 71, a: 'audio',     n: 'Step Sequencer',         i: 5 },
    { d: 72, a: 'craft',     n: 'Hero Polish',            i: 3 },
    { d: 73, a: 'data',      n: 'Lab Notebook',           i: 5 },
    { d: 74, a: 'data',      n: 'Build DNA',              i: 5 },
    { d: 75, a: 'data',      n: 'Constellation Map',      i: 5 },
    { d: 76, a: 'data',      n: 'Build Trail',            i: 5 },
    { d: 77, a: 'data',      n: 'Build Weather',          i: 5 },
    { d: 78, a: 'data',      n: 'Build Garden',           i: 5 },
    { d: 79, a: 'data',      n: 'Build Tape',             i: 5 },
    { d: 80, a: 'data',      n: 'Build Skyline',          i: 5 },
    { d: 81, a: 'craft',     n: 'Build Aquarium',         i: 5 },
    { d: 82, a: 'data',      n: 'Build Observatory',      i: 5 },
    { d: 83, a: 'audio',     n: 'Build Waveform',         i: 5 },
  ];

  const ARCHETYPES = {
    systems:    { label: 'Systems',     color: '#a78bfa', wave: 'sine',     icon: 'fa-microchip' },
    visual:     { label: 'Visual',      color: '#f472b6', wave: 'triangle', icon: 'fa-eye' },
    audio:      { label: 'Audio',       color: '#60a5fa', wave: 'sawtooth', icon: 'fa-wave-square' },
    interactive:{ label: 'Interactive', color: '#34d399', wave: 'square',   icon: 'fa-hand-pointer' },
    data:       { label: 'Data',        color: '#fbbf24', wave: 'sine',     icon: 'fa-database' },
    meta:       { label: 'Meta',        color: '#c084fc', wave: 'triangle', icon: 'fa-atom' },
    craft:      { label: 'Craft',       color: '#22d3ee', wave: 'square',   icon: 'fa-palette' },
    social:     { label: 'Social',      color: '#fb7185', wave: 'sine',     icon: 'fa-share-nodes' },
  };

  // Each day gets a frequency (low at d=1, high at d=83, pentatonic scale).
  const PENTATONIC = [0, 2, 4, 7, 9]; // semitone offsets within an octave
  function dayFreq(d) {
    const oct = Math.floor((d - 1) / 12);
    const idx = (d - 1) % 12;
    const semitones = oct * 12 + PENTATONIC[idx % 5] + Math.floor(idx / 5) * 12;
    // A2 = 110 Hz root
    return 110 * Math.pow(2, semitones / 12);
  }

  // Deterministic hash for seeding
  function hash(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967295;
    };
  }

  const state = {
    day: 83,
    playing: true,
    speed: 1,
    scope: 'all',
    filter: 'all',
    mode: 'listen',
    audioOn: false,
    masterGain: 0.18,
    lastTriggerDay: 82,
  };

  // === Persistence ===
  function save() {
    try {
      const minimal = { day: state.day, speed: state.speed, filter: state.filter, masterGain: state.masterGain };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
    } catch (e) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (typeof d.day === 'number') state.day = Math.max(1, Math.min(83, d.day));
      if (typeof d.speed === 'number') state.speed = d.speed;
      if (typeof d.filter === 'string') state.filter = d.filter;
      if (typeof d.masterGain === 'number') state.masterGain = d.masterGain;
    } catch (e) {}
  }

  // === Audio ===
  let audioCtx = null;
  let masterGainNode = null;
  const activeVoices = []; // {osc, gain, day, until}

  function ensureAudio() {
    if (audioCtx) return audioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = state.masterGain;
    masterGainNode.connect(audioCtx.destination);
    return audioCtx;
  }

  function triggerDay(day, opts) {
    if (!state.audioOn) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const build = BUILDS[day - 1];
    if (!build) return;
    const arch = ARCHETYPES[build.a] || ARCHETYPES.systems;
    const freq = dayFreq(day);
    const dur = opts && opts.chord ? 1.6 : 0.55;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = arch.wave;
    osc.frequency.value = freq;

    // Impact determines harmonic richness
    const harmGain = ctx.createGain();
    harmGain.gain.value = 1;
    if (build.i >= 3) {
      // 2nd harmonic a fifth up
      const o2 = ctx.createOscillator();
      o2.type = arch.wave;
      o2.frequency.value = freq * 1.5;
      const g2 = ctx.createGain();
      g2.gain.value = 0;
      o2.connect(g2).connect(harmGain);
      g2.gain.setValueAtTime(0, now);
      g2.gain.linearRampToValueAtTime(0.18, now + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o2.start(now);
      o2.stop(now + dur);
    }
    if (build.i >= 5) {
      // 3rd harmonic an octave up
      const o3 = ctx.createOscillator();
      o3.type = arch.wave;
      o3.frequency.value = freq * 2;
      const g3 = ctx.createGain();
      g3.gain.value = 0;
      o3.connect(g3).connect(harmGain);
      g3.gain.setValueAtTime(0, now);
      g3.gain.linearRampToValueAtTime(0.12, now + 0.01);
      g3.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o3.start(now);
      o3.stop(now + dur);
    }

    // Main envelope
    const env = ctx.createGain();
    env.gain.value = 0;
    osc.connect(env).connect(harmGain);
    harmGain.connect(masterGainNode);

    const peak = (opts && opts.peak) || (0.5 + (build.i / 5) * 0.5);
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(peak * 0.5, now + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.start(now);
    osc.stop(now + dur);

    activeVoices.push({ osc, gain: harmGain, day, until: now + dur });
    // Cleanup expired voices
    for (let i = activeVoices.length - 1; i >= 0; i--) {
      if (activeVoices[i].until < now - 1) activeVoices.splice(i, 1);
    }
  }

  function playChord(days) {
    if (!state.audioOn) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    days.forEach(d => triggerDay(d, { chord: true, peak: 0.3 }));
  }

  function setMasterGain(v) {
    state.masterGain = Math.max(0, Math.min(0.6, Number(v) || 0));
    if (masterGainNode) masterGainNode.gain.value = state.masterGain;
    const label = document.getElementById('wf-volume-label');
    if (label) label.textContent = Math.round((state.masterGain / 0.6) * 100) + '%';
    save();
  }

  function setMode(mode) {
    if (!['listen', 'spectrum', 'history'].includes(mode)) return;
    state.mode = mode;
    document.querySelectorAll('.wf-mode-btn').forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    document.getElementById('wf-canvas-wrap')?.classList.toggle('wf-mode-spectrum', mode === 'spectrum');
    document.getElementById('wf-canvas-wrap')?.classList.toggle('wf-mode-history', mode === 'history');
    save();
  }

  // === Drawing ===
  const canvas = () => document.getElementById('wf-canvas');
  const spectrumCanvas = () => document.getElementById('wf-spectrum');

  let rafId = null;
  let lastT = 0;
  let ringBuffer = []; // for analyser (last 2s of spectrum)
  let lastSpectrumDraw = 0;

  function resize() {
    const c = canvas();
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = Math.max(1, Math.floor(rect.width * dpr));
    c.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const s = spectrumCanvas();
    if (!s) return;
    const srect = s.getBoundingClientRect();
    s.width = Math.max(1, Math.floor(srect.width * dpr));
    s.height = Math.max(1, Math.floor(srect.height * dpr));
    const sctx = s.getContext('2d');
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawScope(t) {
    const c = canvas();
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.clientWidth;
    const H = c.clientHeight;
    ctx.clearRect(0, 0, W, H);

    // Center line
    ctx.strokeStyle = 'rgba(124, 196, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Generate two waveforms (channel 1 = low-passed, channel 2 = high-passed)
    const now = t / 1000;
    const visible = visibleBuilds();
    if (visible.length === 0) {
      // Empty
      ctx.fillStyle = 'rgba(124, 196, 255, 0.4)';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('no builds in this filter', W / 2, H / 2);
      return;
    }

    // For each build compute its contribution
    const stepX = W / Math.max(1, (visible.length - 1));
    const playheadIdx = state.day - 1;

    // Helper: amplitude envelope for build at distance (in days) from playhead
    function envelope(buildIdx) {
      const dist = Math.abs(buildIdx - playheadIdx);
      return Math.max(0, 1 - dist / 8); // fade over 8 days
    }

    // === Channel 1: 8 archetypes blended into a Lissajous-like curve
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = 'rgba(124, 240, 255, 0.95)';
    ctx.shadowColor = 'rgba(124, 240, 255, 0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let i = 0; i < visible.length; i++) {
      const x = i * stepX;
      const build = visible[i];
      const idx = BUILDS.indexOf(build);
      const amp = envelope(idx) * (0.25 + (build.i / 5) * 0.6);
      const f = dayFreq(build.d) / 220; // normalize
      const phase = hash('wf-c1-' + build.d) * Math.PI * 2;
      const y = H / 2 + Math.sin(now * 1.5 * f * state.speed + phase) * amp * (H * 0.42);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // === Channel 2: a faster, brighter curve
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(255, 122, 214, 0.85)';
    ctx.shadowColor = 'rgba(255, 122, 214, 0.5)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i < visible.length; i++) {
      const x = i * stepX;
      const build = visible[i];
      const idx = BUILDS.indexOf(build);
      const amp = envelope(idx) * (0.15 + (build.i / 5) * 0.45);
      const f = dayFreq(build.d) / 200;
      const phase = hash('wf-c2-' + build.d) * Math.PI * 2;
      const y = H / 2 + Math.cos(now * 2.3 * f * state.speed + phase) * amp * (H * 0.42) * 0.85;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // === Playhead (vertical line)
    if (state.day >= 1 && state.day <= 83) {
      const px = (state.day - 1) * (W / 82);
      const playhead = document.getElementById('wf-playhead');
      if (playhead) playhead.style.left = ((state.day - 1) / 82 * 100) + '%';
      const grad = ctx.createLinearGradient(px, 0, px, H);
      grad.addColorStop(0, 'rgba(255, 209, 102, 0)');
      grad.addColorStop(0.5, 'rgba(255, 209, 102, 0.5)');
      grad.addColorStop(1, 'rgba(255, 209, 102, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, H);
      ctx.stroke();

      // Pulse dot at center
      const pulse = 0.5 + 0.5 * Math.sin(now * 4);
      ctx.fillStyle = `rgba(255, 209, 102, ${0.6 + pulse * 0.4})`;
      ctx.beginPath();
      ctx.arc(px, H / 2, 4 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // === Markers for every 10th day
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    for (let d = 1; d <= 83; d += 10) {
      const x = (d - 1) * (W / 82);
      ctx.fillStyle = 'rgba(124, 196, 255, 0.4)';
      ctx.fillRect(x, H - 14, 1, 8);
      ctx.fillText(String(d), x, H - 2);
    }
  }

  function drawSpectrum(t) {
    const s = spectrumCanvas();
    if (!s) return;
    const ctx = s.getContext('2d');
    const W = s.clientWidth;
    const H = s.clientHeight;
    ctx.clearRect(0, 0, W, H);

    // 83 bars, one per build
    const barW = W / 83;
    const visible = visibleBuilds();
    const visibleSet = new Set(visible.map(b => b.d));
    const playheadIdx = state.day - 1;

    for (let d = 1; d <= 83; d++) {
      const build = BUILDS[d - 1];
      if (!build) continue;
      const inVisible = state.filter === 'all' ? true : visibleSet.has(d);
      const x = (d - 1) * barW;
      const arch = ARCHETYPES[build.a] || ARCHETYPES.systems;
      const dist = Math.abs((d - 1) - playheadIdx);
      const env = Math.max(0, 1 - dist / 12);
      const h = (build.i / 5) * (H * 0.85) * (inVisible ? 1 : 0.18) * (0.4 + env * 0.6);
      const y = H - h;
      // Hot bar if at playhead
      if (d === state.day) {
        ctx.fillStyle = arch.color;
      } else if (inVisible) {
        ctx.globalAlpha = 0.55 + env * 0.45;
        ctx.fillStyle = arch.color;
      } else {
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = arch.color;
      }
      ctx.fillRect(x + 1, y, Math.max(1, barW - 2), h);
      ctx.globalAlpha = 1;

      // Top cap (tiny pulse on impact)
      if (inVisible && build.i >= 4 && Math.random() < 0.005) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 1, y - 1, Math.max(1, barW - 2), 1);
      }
    }

    // Playhead line over spectrum
    if (state.day >= 1 && state.day <= 83) {
      const px = (state.day - 1) * barW + barW / 2;
      ctx.strokeStyle = 'rgba(255, 209, 102, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, H);
      ctx.stroke();
    }
  }

  function visibleBuilds() {
    if (state.filter === 'all') return BUILDS.slice();
    return BUILDS.filter(b => b.a === state.filter);
  }

  function tick(t) {
    if (!lastT) lastT = t;
    const dt = (t - lastT) / 1000;
    lastT = t;

    // Advance playhead if playing
    if (state.playing && state.audioOn) {
      // ~1 second per day at speed 1
      const dayRate = 1.0 * state.speed; // days per second
      if (dt > 0) {
        // accumulate fractional progress
        state._frac = (state._frac || 0) + dayRate * dt;
        while (state._frac >= 1) {
          state._frac -= 1;
          const next = (state.day % 83) + 1;
          state.day = next;
          // Trigger the new day
          if (state.audioOn) triggerDay(state.day);
        }
      }
    } else if (state.playing && !state.audioOn) {
      // Visual autoplay even without audio (slower, 2.5s per day)
      const dayRate = 0.4 * state.speed;
      if (dt > 0) {
        state._frac = (state._frac || 0) + dayRate * dt;
        while (state._frac >= 1) {
          state._frac -= 1;
          const next = (state.day % 83) + 1;
          state.day = next;
        }
      }
    }

    drawScope(t);
    if (t - lastSpectrumDraw > 50) {
      drawSpectrum(t);
      lastSpectrumDraw = t;
    }
    updateReadout();
    rafId = requestAnimationFrame(tick);
  }

  function updateReadout() {
    const dayEl = document.getElementById('wf-readout-day');
    const nameEl = document.getElementById('wf-readout-name');
    const archEl = document.getElementById('wf-readout-arch');
    const freqEl = document.getElementById('wf-readout-freq');
    const statFreq = document.getElementById('wf-stat-freq');
    if (!dayEl) return;
    const build = BUILDS[state.day - 1];
    const arch = ARCHETYPES[build.a];
    dayEl.textContent = 'Day ' + build.d;
    nameEl.textContent = build.n;
    archEl.textContent = arch.label;
    archEl.style.color = arch.color;
    freqEl.textContent = dayFreq(build.d).toFixed(1) + ' Hz';
    if (statFreq) statFreq.textContent = dayFreq(build.d).toFixed(1) + ' Hz';
    const active = document.getElementById('wf-stat-active');
    if (active) active.textContent = String(activeVoices.filter(v => v.until > (audioCtx?.currentTime || 0)).length);
  }

  // === UI wiring ===
  function setPlaying(v) {
    state.playing = !!v;
    const btn = document.getElementById('wf-play');
    if (btn) {
      btn.classList.toggle('is-active', state.playing);
      const icon = btn.querySelector('i');
      if (icon) icon.className = state.playing ? 'fas fa-pause' : 'fas fa-play';
    }
    document.getElementById('wf-led')?.classList.toggle('is-paused', !state.playing);
  }

  function setFilter(arch) {
    state.filter = arch;
    document.querySelectorAll('.wf-chip').forEach(el => {
      el.classList.toggle('is-active', el.dataset.arch === arch);
      el.setAttribute('aria-selected', el.dataset.arch === arch ? 'true' : 'false');
    });
    const label = document.getElementById('wf-stat-arch');
    if (label) label.textContent = arch === 'all' ? 'All' : (ARCHETYPES[arch]?.label || arch);
    drawSpectrum(performance.now());
    save();
  }

  function focusDay(d) {
    d = Math.max(1, Math.min(83, d));
    state.day = d;
    state.lastTriggerDay = d - 1;
    const build = BUILDS[d - 1];
    const arch = ARCHETYPES[build.a];

    const card = document.getElementById('wf-focus');
    const dayEl = document.getElementById('wf-focus-day');
    const nameEl = document.getElementById('wf-focus-name');
    const archEl = document.getElementById('wf-focus-arch');
    const rowFreq = document.getElementById('wf-focus-freq');
    const rowWave = document.getElementById('wf-focus-wave');
    const rowImpact = document.getElementById('wf-focus-impact');
    const rowDate = document.getElementById('wf-focus-date');

    if (dayEl) dayEl.textContent = 'Day ' + build.d;
    if (nameEl) nameEl.textContent = build.n;
    if (archEl) {
      archEl.textContent = arch.label;
      archEl.style.background = arch.color + '22';
      archEl.style.color = arch.color;
    }
    if (rowFreq) rowFreq.textContent = dayFreq(build.d).toFixed(2) + ' Hz';
    if (rowWave) rowWave.textContent = arch.wave;
    if (rowImpact) rowImpact.textContent = '●'.repeat(build.i) + '○'.repeat(5 - build.i) + '  (' + build.i + '/5)';
    if (rowDate) {
      const dt = new Date(2026, 3, 22 + (build.d - 1));
      rowDate.textContent = dt.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    }

    if (card) card.classList.add('is-open');

    // Play the tone
    if (state.audioOn) triggerDay(d);

    // Sync scrubber
    const scrub = document.getElementById('wf-scrub');
    const meta = document.getElementById('wf-scrub-meta');
    if (scrub) {
      scrub.value = String(d);
      const pct = ((d - 1) / 82) * 100;
      scrub.querySelector('.wf-scrub-fill').style.width = pct + '%';
      scrub.querySelector('.wf-scrub-thumb').style.left = pct + '%';
    }
    const scrubDay = document.getElementById('wf-scrub-day');
    const scrubName = document.getElementById('wf-scrub-name');
    if (scrubDay) scrubDay.textContent = 'Day ' + d;
    if (scrubName) scrubName.textContent = build.n;
    if (meta) meta.textContent = 'Day ' + d + ' / 83';
    const desc = document.getElementById('wf-focus-desc');
    if (desc) desc.textContent = 'Day ' + d + ' turns ' + build.n + ' into a ' + arch.wave + ' tone. Its ' + arch.label.toLowerCase() + ' character is shaped by an impact score of ' + build.i + ' out of 5.';

    save();
  }

  function closeFocus() {
    document.getElementById('wf-focus')?.classList.remove('is-open');
  }

  function toast(msg) {
    const el = document.getElementById('wf-toast');
    if (!el) return;
    el.querySelector('span').textContent = msg;
    el.classList.add('is-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-show'), 2200);
  }

  // === Wire up ===
  function wire() {
    load();
    state.day = Math.max(1, Math.min(83, state.day || 83));
    resize();
    window.addEventListener('resize', resize);

    // Initial readout + scrubber sync
    updateReadout();
    const initPct = ((state.day - 1) / 82) * 100;
    const scrub = document.getElementById('wf-scrub');
    if (scrub) {
      scrub.querySelector('.wf-scrub-fill').style.width = initPct + '%';
      scrub.querySelector('.wf-scrub-thumb').style.left = initPct + '%';
    }
    const meta = document.getElementById('wf-scrub-meta');
    if (meta) meta.textContent = 'Day ' + state.day + ' / 83';
    if (scrub) scrub.value = String(state.day);
    const scrubDay = document.getElementById('wf-scrub-day');
    const scrubName = document.getElementById('wf-scrub-name');
    const initialBuild = BUILDS[state.day - 1];
    if (scrubDay) scrubDay.textContent = 'Day ' + state.day;
    if (scrubName) scrubName.textContent = initialBuild.n;

    // Audio lock: enable on first interaction
    const lock = document.getElementById('wf-audio-locked');
    const enableBtn = document.getElementById('wf-audio-enable');
    if (state.audioOn) {
      lock?.classList.add('is-hidden');
      lock?.setAttribute('hidden', '');
    } else {
      lock?.removeAttribute('hidden');
    }
    enableBtn?.addEventListener('click', () => {
      const ctx = ensureAudio();
      if (!ctx) {
        toast('Web Audio not supported');
        return;
      }
      if (ctx.state === 'suspended') ctx.resume();
      state.audioOn = true;
      state.playing = false;
      lock?.classList.add('is-hidden');
      lock?.setAttribute('hidden', '');
      document.getElementById('wf-scope-hint')?.setAttribute('hidden', '');
      setPlaying(false);
      toast('audio enabled — press Play to hear the spectrum');
    });

    // Play/pause
    const playBtn = document.getElementById('wf-play');
    playBtn?.addEventListener('click', () => {
      setPlaying(!state.playing);
    });

    // Reset
    document.getElementById('wf-reset')?.addEventListener('click', () => {
      state.day = 1;
      state._frac = 0;
      focusDay(1);
    });

    // Play all (chord of 83)
    document.getElementById('wf-playall')?.addEventListener('click', () => {
      if (!state.audioOn) {
        toast('enable audio first');
        return;
      }
      // Stagger: bass sweep up
      let i = 0;
      const interval = setInterval(() => {
        if (i >= BUILDS.length) { clearInterval(interval); return; }
        triggerDay(BUILDS[i].d, { chord: true, peak: 0.18 });
        i++;
      }, 30);
      toast('playing 83-day chord');
    });

    // Stop all
    document.getElementById('wf-stopall')?.addEventListener('click', () => {
      // Hard-cut: ramp master gain to 0 then back
      if (masterGainNode && audioCtx) {
        const now = audioCtx.currentTime;
        masterGainNode.gain.cancelScheduledValues(now);
        masterGainNode.gain.setValueAtTime(masterGainNode.gain.value, now);
        masterGainNode.gain.linearRampToValueAtTime(0, now + 0.08);
        setTimeout(() => {
          masterGainNode.gain.linearRampToValueAtTime(state.masterGain, audioCtx.currentTime + 0.2);
        }, 120);
      }
      toast('all sounds stopped');
    });

    // Speed cycle
    document.getElementById('wf-speed')?.addEventListener('click', () => {
      const speeds = [0.5, 1, 2, 4];
      const idx = speeds.indexOf(state.speed);
      state.speed = speeds[(idx + 1) % speeds.length];
      const lbl = document.getElementById('wf-speed-label');
      if (lbl) lbl.textContent = state.speed + 'x';
      save();
    });
    const lbl = document.getElementById('wf-speed-label');
    if (lbl) lbl.textContent = state.speed + 'x';

    // Volume
    const vol = document.getElementById('wf-volume');
    if (vol) {
      vol.value = String(Math.round((state.masterGain / 0.6) * 100));
      setMasterGain(Number(vol.value) / 100 * 0.6);
      vol.addEventListener('input', (e) => {
        setMasterGain(Number(e.target.value) / 100 * 0.6);
      });
    }

    document.querySelectorAll('.wf-mode-btn').forEach((button) => {
      button.addEventListener('click', () => setMode(button.dataset.mode));
    });
    setMode(state.mode || 'listen');

    // Theme toggle
    const section = document.querySelector('.waveform-section');
    document.getElementById('wf-theme')?.addEventListener('click', () => {
      section?.classList.toggle('wf-light');
      const icon = document.querySelector('#wf-theme i');
      if (icon) icon.className = section?.classList.contains('wf-light') ? 'fas fa-sun' : 'fas fa-moon';
    });

    // Filter chips
    document.querySelectorAll('.wf-chip').forEach(el => {
      el.addEventListener('click', () => setFilter(el.dataset.arch));
    });
    setFilter(state.filter || 'all');

    scrub?.addEventListener('input', () => focusDay(Number(scrub.value)));

    // Scrubber
    function setDayFromX(clientX) {
      const rect = scrub.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const d = Math.round((x / rect.width) * 82) + 1;
      focusDay(d);
    }
    let scrubbing = false;
    scrub?.addEventListener('mousedown', (e) => {
      scrubbing = true;
      setDayFromX(e.clientX);
    });
    window.addEventListener('mousemove', (e) => {
      if (scrubbing) setDayFromX(e.clientX);
    });
    window.addEventListener('mouseup', () => { scrubbing = false; });
    scrub?.addEventListener('touchstart', (e) => {
      scrubbing = true;
      setDayFromX(e.touches[0].clientX);
    }, { passive: true });
    scrub?.addEventListener('touchmove', (e) => {
      if (scrubbing) setDayFromX(e.touches[0].clientX);
    }, { passive: true });
    scrub?.addEventListener('touchend', () => { scrubbing = false; });

    // Spectrum click
    const spectrumEl = spectrumCanvas();
    const tip = document.getElementById('wf-spectrum-tooltip');
    spectrumEl?.addEventListener('mousemove', (e) => {
      const rect = spectrumEl.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const d = Math.round((x / rect.width) * 82) + 1;
      const build = BUILDS[d - 1];
      const arch = ARCHETYPES[build.a];
      if (tip) {
        tip.style.left = x + 'px';
        tip.style.display = 'block';
        tip.innerHTML = '<strong>Day ' + build.d + '</strong> · ' + build.n + '<br><small>' + arch.label + ' · ' + dayFreq(build.d).toFixed(0) + ' Hz</small>';
      }
    });
    spectrumEl?.addEventListener('mouseleave', () => {
      if (tip) tip.style.display = 'none';
    });
    spectrumEl?.addEventListener('click', (e) => {
      const rect = spectrumEl.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const d = Math.round((x / rect.width) * 82) + 1;
      focusDay(d);
    });

    // Focus close
    document.getElementById('wf-focus-close')?.addEventListener('click', closeFocus);
    document.getElementById('wf-focus-play')?.addEventListener('click', () => {
      if (state.audioOn) {
        triggerDay(state.day, { chord: true, peak: 0.5 });
        toast('Day ' + state.day + ' — ' + BUILDS[state.day - 1].n);
      } else {
        toast('enable audio first');
      }
    });
    document.getElementById('wf-focus-jump')?.addEventListener('click', () => {
      const build = BUILDS[state.day - 1];
      const arch = ARCHETYPES[build.a];
      // Scroll the build to top of the section
      const sec = document.querySelector('.waveform-section');
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeFocus();
        // Briefly highlight this day's marker
        setTimeout(() => {
          state._highlight = state.day;
        }, 400);
      }
    });
    document.getElementById('wf-focus-journal')?.addEventListener('click', () => {
      const build = BUILDS[state.day - 1];
      const journal = document.getElementById('journal');
      if (journal) {
        journal.scrollIntoView({ behavior: 'smooth' });
        toast('Day ' + build.d + ' in journal');
      }
    });

    // Backdrop click closes focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFocus();
    });

    // Export
    document.getElementById('wf-export')?.addEventListener('click', exportJSON);

    // Keyboard shortcut: G V opens Waveform
    let gDown = false;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'g' || e.key === 'G') gDown = true;
      if (gDown && (e.key === 'v' || e.key === 'V') && !e.metaKey && !e.ctrlKey) {
        const sec = document.querySelector('.waveform-section');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
          if (!state.audioOn) document.getElementById('wf-audio-enable')?.click();
        }
        gDown = false;
      }
      // Space toggles play when not in input
      if (e.key === ' ' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        const sec = document.querySelector('.waveform-section');
        if (sec && isInViewport(sec)) {
          e.preventDefault();
          setPlaying(!state.playing);
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'g' || e.key === 'G') gDown = false;
    });

    // Start animation
    lastT = 0;
    state._frac = 0;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function exportJSON() {
    const data = {
      title: 'Build Waveform',
      generated: new Date().toISOString(),
      totalDays: 83,
      from: '2026-04-22',
      to: '2026-07-14',
      audio: state.audioOn,
      speed: state.speed,
      filter: state.filter,
      days: BUILDS.map(b => {
        const arch = ARCHETYPES[b.a];
        return {
          day: b.d,
          name: b.n,
          archetype: b.a,
          archetypeLabel: arch.label,
          archetypeColor: arch.color,
          impact: b.i,
          frequency: +dayFreq(b.d).toFixed(2),
          waveform: arch.wave,
        };
      }),
    };
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'build-waveform-day-83.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('exported 83 days as JSON');
    } catch (e) {
      toast('export failed');
    }
  }

  // Public API
  window.ajhWaveform = {
    open(day) {
      const sec = document.querySelector('.waveform-section');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      if (day) setTimeout(() => focusDay(day), 350);
    },
    focus: focusDay,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying(!state.playing),
    cycleMode() {
      const modes = ['listen', 'spectrum', 'history'];
      const current = document.querySelector('.wf-mode-btn.is-active')?.dataset.mode || 'listen';
      const next = modes[(modes.indexOf(current) + 1) % modes.length];
      document.getElementById('wf-mode-' + next)?.click();
    },
    playAll: () => document.getElementById('wf-playall')?.click(),
    stopAll: () => document.getElementById('wf-stopall')?.click(),
    export: exportJSON,
    cycleFilter: () => {
      const keys = ['all', 'systems', 'visual', 'audio', 'interactive', 'data', 'meta', 'craft', 'social'];
      const idx = keys.indexOf(state.filter);
      setFilter(keys[(idx + 1) % keys.length]);
    },
    togglePlay: () => setPlaying(!state.playing),
    chord: () => document.getElementById('wf-playall')?.click(),
    exportJSON: exportJSON,
    state: () => state,
  };
  window.ajhWaveformOpen = () => window.ajhWaveform.open();

  // === Boot ===
  function boot() {
    if (document.getElementById('wf-canvas')) {
      wire();
    } else {
      setTimeout(boot, 60);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
