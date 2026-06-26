// Day 67: Pixel Art Studio
(function () {
  'use strict';

  const SIZE = 16;
  const PALETTE = [
    { hex: '#1a1815', name: 'Coal' },
    { hex: '#f5f1e8', name: 'Paper' },
    { hex: '#d8a657', name: 'Amber' },
    { hex: '#c0573a', name: 'Brick' },
    { hex: '#7a8b6f', name: 'Moss' },
    { hex: '#5e8aa8', name: 'Sky' },
    { hex: '#8b6cc4', name: 'Plum' },
    { hex: '#c44e7a', name: 'Rose' },
    { hex: '#e8c547', name: 'Gold' },
    { hex: '#3a9d7c', name: 'Pine' },
    { hex: '#4a5568', name: 'Steel' },
    { hex: '#a8927a', name: 'Sand' },
    { hex: '#ff6b6b', name: 'Coral' },
    { hex: '#9be7c4', name: 'Mint' },
    { hex: '#f48fb1', name: 'Blush' },
    { hex: '#795548', name: 'Cocoa' },
  ];

  const STORAGE_KEY = 'ajh_pixelart_v1';
  const STATS_KEY = 'ajh_pixelart_stats_v1';

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  // 5 starter pieces (16x16 arrays, null = empty)
  const STARTERS = {
    'Heart': [
      [null,null,null,null,'#c0573a',null,null,null,null,null,'#c0573a',null,null,null,null,null],
      [null,null,null,'#c0573a','#c0573a','#c0573a',null,null,null,'#c0573a','#c0573a','#c0573a',null,null,null,null],
      [null,null,'#c0573a','#c0573a','#ff6b6b','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#ff6b6b','#c0573a','#c0573a',null,null,null],
      [null,'#c0573a','#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a','#c0573a',null,null],
      [null,'#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a',null,null],
      ['#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a',null],
      ['#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a',null],
      ['#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a',null],
      [null,'#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a',null,null],
      [null,'#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a',null,null],
      [null,'#c0573a','#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a','#c0573a',null,null],
      [null,null,'#c0573a','#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a','#c0573a',null,null,null],
      [null,null,null,'#c0573a','#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a','#c0573a',null,null,null,null],
      [null,null,null,null,'#c0573a','#c0573a','#ff6b6b','#ff6b6b','#ff6b6b','#c0573a','#c0573a',null,null,null,null,null],
      [null,null,null,null,null,'#c0573a','#c0573a','#c0573a','#c0573a','#c0573a',null,null,null,null,null,null],
      [null,null,null,null,null,null,'#c0573a','#c0573a','#c0573a',null,null,null,null,null,null,null],
    ],
    'Star': [
      [null,null,null,null,null,null,null,'#e8c547','#e8c547',null,null,null,null,null,null,null],
      [null,null,null,null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null,null,null],
      [null,null,null,null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null,null,null,null],
      [null,null,null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null,null,null],
      [null,null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null,null],
      ['#e8c547','#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547','#e8c547',null],
      ['#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null],
      [null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null],
      [null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null],
      [null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null],
      [null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null],
      [null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null],
      [null,null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null,null],
      [null,null,null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null,null,null],
      [null,null,null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null,null],
      [null,null,null,null,null,null,null,'#e8c547','#e8c547',null,null,null,null,null,null,null],
    ],
    'Smiley': [
      [null,null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null],
      [null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null],
      [null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null],
      [null,'#e8c547','#e8c547','#1a1815','#1a1815','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#1a1815','#1a1815','#e8c547','#e8c547','#e8c547',null],
      ['#e8c547','#e8c547','#1a1815','#1a1815','#1a1815','#1a1815','#e8c547','#e8c547','#e8c547','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#e8c547','#e8c547'],
      ['#e8c547','#e8c547','#1a1815','#1a1815','#1a1815','#1a1815','#e8c547','#e8c547','#e8c547','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#e8c547','#e8c547'],
      ['#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547'],
      ['#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547'],
      ['#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547'],
      [null,'#e8c547','#e8c547','#e8c547','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#e8c547','#e8c547','#e8c547',null],
      [null,'#e8c547','#e8c547','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#e8c547','#e8c547',null],
      [null,'#e8c547','#e8c547','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#e8c547','#e8c547',null],
      [null,null,'#e8c547','#e8c547','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#c0573a','#e8c547','#e8c547',null,null],
      [null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null],
      [null,null,null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    ],
    'Bolt': [
      [null,null,null,null,null,'#e8c547','#e8c547','#e8c547',null,null,null,null,null,null,null,null],
      [null,null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null,null,null,null],
      [null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null,null,null],
      [null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null,null],
      [null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null],
      [null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null],
      [null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null],
      [null,null,'#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547','#e8c547',null,null],
      [null,null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null],
      [null,null,null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null],
      [null,null,null,null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null],
      [null,null,null,null,null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null,null],
      [null,null,null,null,null,null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null,null],
      [null,null,null,null,null,null,null,'#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null,null],
      [null,null,null,null,null,null,null,'#e8c547','#e8c547','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#e8c547',null,null,null],
      [null,null,null,null,null,null,null,null,'#e8c547','#e8c547','#e8c547','#e8c547','#e8c547',null,null,null,null],
    ],
    'Checker': [
      ['#1a1815',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,'#1a1815',null,null,null,null,null,null,null,null,null,null,'#1a1815',null,null],
      [null,null,null,'#1a1815','#1a1815',null,null,null,null,null,null,'#1a1815','#1a1815',null,null,null],
      [null,null,'#1a1815','#1a1815','#1a1815','#1a1815',null,null,null,null,'#1a1815','#1a1815','#1a1815','#1a1815',null,null],
      [null,'#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815',null,null,'#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815',null],
      ['#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815'],
      ['#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#d8a657','#d8a657','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815'],
      ['#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#d8a657','#d8a657','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815'],
      ['#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815'],
      [null,'#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815',null,null,'#1a1815','#1a1815','#1a1815','#1a1815','#1a1815','#1a1815',null],
      [null,null,'#1a1815','#1a1815','#1a1815','#1a1815',null,null,null,null,'#1a1815','#1a1815','#1a1815','#1a1815',null,null],
      [null,null,null,'#1a1815','#1a1815',null,null,null,null,null,null,'#1a1815','#1a1815',null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    ],
  };

  let state = {
    grid: emptyGrid(),
    currentColor: PALETTE[2].hex, // Amber
    tool: 'paint',
    pieces: [],
    history: [],
    future: [],
    stats: { pixels: 0, strokes: 0, exports: 0 },
    drawing: false,
    lastCell: null,
  };

  // ---- persistence ----
  function loadPieces() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }
  function savePieces(pieces) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pieces));
    } catch (e) {}
  }
  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { pixels: 0, strokes: 0, exports: 0 };
  }
  function saveStats(stats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
  }

  // ---- rendering ----
  function buildGrid() {
    const grid = document.getElementById('pixelart-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${SIZE}, 1fr)`;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const cell = document.createElement('div');
        cell.className = 'pixelart-cell';
        cell.dataset.x = x;
        cell.dataset.y = y;
        grid.appendChild(cell);
      }
    }
  }

  function renderGrid() {
    const cells = document.querySelectorAll('#pixelart-grid .pixelart-cell');
    cells.forEach((cell) => {
      const x = +cell.dataset.x;
      const y = +cell.dataset.y;
      const color = state.grid[y][x];
      if (color) {
        cell.style.background = color;
        cell.classList.add('filled');
      } else {
        cell.style.background = '';
        cell.classList.remove('filled');
      }
    });
  }

  function buildPalette() {
    const pal = document.getElementById('pixelart-palette');
    pal.innerHTML = '';
    PALETTE.forEach((c, i) => {
      const sw = document.createElement('button');
      sw.className = 'pixelart-swatch-btn';
      sw.style.background = c.hex;
      sw.title = c.name;
      sw.dataset.color = c.hex;
      sw.dataset.index = i;
      if (c.hex === state.currentColor) sw.classList.add('active');
      pal.appendChild(sw);
    });
    updateColorInfo();
  }

  function updateColorInfo() {
    const sw = document.getElementById('pixelart-swatch');
    const name = document.getElementById('pixelart-color-name');
    if (!sw) return;
    sw.style.background = state.currentColor;
    const found = PALETTE.find((p) => p.hex === state.currentColor);
    name.textContent = found ? found.name : state.currentColor;
  }

  // ---- tools ----
  function pushHistory() {
    state.history.push(state.grid.map((row) => row.slice()));
    if (state.history.length > 50) state.history.shift();
    state.future = [];
  }

  function applyTool(x, y) {
    const cell = state.grid[y][x];
    if (state.tool === 'paint') {
      if (cell !== state.currentColor) {
        state.grid[y][x] = state.currentColor;
        state.stats.pixels++;
        return true;
      }
    } else if (state.tool === 'erase') {
      if (cell !== null) {
        state.grid[y][x] = null;
        return true;
      }
    } else if (state.tool === 'fill') {
      floodFill(x, y, cell, state.currentColor);
      return true;
    } else if (state.tool === 'eyedrop') {
      if (cell) {
        setCurrentColor(cell);
        state.tool = 'paint';
        updateToolButtons();
      }
    }
    return false;
  }

  function floodFill(x, y, target, replacement) {
    if (target === replacement) return;
    const stack = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= SIZE || cy >= SIZE) continue;
      if (state.grid[cy][cx] !== target) continue;
      state.grid[cy][cx] = replacement;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  function setCurrentColor(color) {
    state.currentColor = color;
    document.querySelectorAll('.pixelart-swatch-btn').forEach((el) => {
      el.classList.toggle('active', el.dataset.color === color);
    });
    updateColorInfo();
  }

  function updateToolButtons() {
    document.querySelectorAll('.pixelart-tool[data-tool]').forEach((b) => {
      b.classList.toggle('active', b.dataset.tool === state.tool);
    });
  }

  function clearCanvas() {
    pushHistory();
    state.grid = emptyGrid();
    renderGrid();
  }

  function undo() {
    if (!state.history.length) return;
    state.future.push(state.grid.map((row) => row.slice()));
    state.grid = state.history.pop();
    renderGrid();
  }

  function redo() {
    if (!state.future.length) return;
    state.history.push(state.grid.map((row) => row.slice()));
    state.grid = state.future.pop();
    renderGrid();
  }

  // ---- export ----
  function exportPNG() {
    const cellSize = 32;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE * cellSize;
    canvas.height = SIZE * cellSize;
    const ctx = canvas.getContext('2d');
    // transparent background — let pixels speak
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const c = state.grid[y][x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ajh-pixelart-' + Date.now() + '.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      state.stats.exports++;
      saveStats(state.stats);
      updateStatsUI();
      showToast('PNG exported ↓');
    });
  }

  function shareLink() {
    const data = state.grid.map((row) => row.map((c) => c || 0));
    const payload = encodeURIComponent(btoa(JSON.stringify(data)));
    const url = window.location.origin + window.location.pathname + '#pixelart=' + payload;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => showToast('Share link copied ✓'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Share link copied ✓');
      } catch (e) {
        showToast('Could not copy — link in console');
        console.log(url);
      }
      document.body.removeChild(ta);
    }
    state.stats.exports++;
    saveStats(state.stats);
    updateStatsUI();
  }

  function decodeHash() {
    if (!window.location.hash.startsWith('#pixelart=')) return null;
    try {
      const payload = window.location.hash.slice('#pixelart='.length);
      const data = JSON.parse(atob(decodeURIComponent(payload)));
      if (Array.isArray(data) && data.length === SIZE) return data;
    } catch (e) {}
    return null;
  }

  // ---- saved pieces gallery ----
  function renderGallery() {
    const wrap = document.getElementById('pixelart-gallery');
    wrap.innerHTML = '';
    if (!state.pieces.length) {
      wrap.innerHTML = '<p class="pixelart-empty">No saved pieces yet. Paint something and click <em>Save</em>.</p>';
      return;
    }
    state.pieces.forEach((p) => {
      wrap.appendChild(makeThumb(p, false));
    });
  }

  function renderStarters() {
    const wrap = document.getElementById('pixelart-starters');
    wrap.innerHTML = '';
    Object.entries(STARTERS).forEach(([name, grid]) => {
      const fakePiece = { name, grid, id: 'starter-' + name, created: 0 };
      wrap.appendChild(makeThumb(fakePiece, true));
    });
  }

  function makeThumb(piece, isStarter) {
    const t = document.createElement('div');
    t.className = 'pixelart-thumb';
    const preview = document.createElement('div');
    preview.className = 'pixelart-thumb-canvas';
    piece.grid.forEach((row) => {
      row.forEach((color) => {
        const cell = document.createElement('span');
        if (color) cell.style.background = color;
        preview.appendChild(cell);
      });
    });
    const label = document.createElement('div');
    label.className = 'pixelart-thumb-label';
    label.textContent = piece.name;
    t.appendChild(preview);
    t.appendChild(label);
    if (!isStarter) {
      const del = document.createElement('button');
      del.className = 'pixelart-thumb-delete';
      del.title = 'Delete';
      del.innerHTML = '<i class="fas fa-times"></i>';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        state.pieces = state.pieces.filter((x) => x.id !== piece.id);
        savePieces(state.pieces);
        renderGallery();
        updateStatsUI();
        showToast('Removed');
      });
      t.appendChild(del);
    }
    t.addEventListener('click', () => {
      pushHistory();
      state.grid = piece.grid.map((row) => row.slice());
      renderGrid();
      showToast(isStarter ? 'Loaded starter' : 'Loaded "' + piece.name + '"');
    });
    return t;
  }

  // ---- save modal ----
  function openSaveModal() {
    const modal = document.getElementById('pixelart-modal');
    const input = document.getElementById('pixelart-modal-input');
    input.value = '';
    modal.hidden = false;
    setTimeout(() => input.focus(), 50);
  }
  function closeSaveModal() {
    document.getElementById('pixelart-modal').hidden = true;
  }
  function saveCurrent() {
    const name = (document.getElementById('pixelart-modal-input').value || '').trim() || 'Untitled ' + (state.pieces.length + 1);
    const piece = {
      id: 'p-' + Date.now(),
      name,
      grid: state.grid.map((row) => row.slice()),
      created: Date.now(),
    };
    state.pieces.unshift(piece);
    if (state.pieces.length > 50) state.pieces = state.pieces.slice(0, 50);
    savePieces(state.pieces);
    renderGallery();
    updateStatsUI();
    closeSaveModal();
    showToast('Saved "' + name + '"');
  }

  // ---- toast ----
  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('pixelart-toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.hidden = true;
    }, 1800);
  }

  // ---- stats ----
  function updateStatsUI() {
    document.getElementById('pixelart-stat-pixels').textContent = state.stats.pixels.toLocaleString();
    document.getElementById('pixelart-stat-pieces').textContent = state.pieces.length.toLocaleString();
    document.getElementById('pixelart-stat-shared').textContent = state.stats.exports.toLocaleString();
    document.getElementById('pixelart-stat-strokes').textContent = state.stats.strokes.toLocaleString();
  }

  // ---- events ----
  function attachEvents() {
    const grid = document.getElementById('pixelart-grid');

    grid.addEventListener('pointerdown', (e) => {
      const cell = e.target.closest('.pixelart-cell');
      if (!cell) return;
      e.preventDefault();
      const x = +cell.dataset.x;
      const y = +cell.dataset.y;
      state.drawing = true;
      state.lastCell = [x, y];
      state.stats.strokes++;
      // For non-fill tools, push history once per stroke
      if (state.tool !== 'eyedrop') pushHistory();
      const changed = applyTool(x, y);
      if (changed) renderGrid();
      updateStatsUI();
      saveStats(state.stats);
    });

    grid.addEventListener('pointermove', (e) => {
      if (!state.drawing) return;
      const cell = e.target.closest('.pixelart-cell');
      if (!cell) return;
      const x = +cell.dataset.x;
      const y = +cell.dataset.y;
      if (state.lastCell && state.lastCell[0] === x && state.lastCell[1] === y) return;
      state.lastCell = [x, y];
      const changed = applyTool(x, y);
      if (changed) renderGrid();
      updateStatsUI();
      saveStats(state.stats);
    });

    document.addEventListener('pointerup', () => {
      state.drawing = false;
      state.lastCell = null;
    });

    // palette
    document.getElementById('pixelart-palette').addEventListener('click', (e) => {
      const t = e.target.closest('.pixelart-swatch-btn');
      if (!t) return;
      setCurrentColor(t.dataset.color);
    });

    // tool buttons
    document.querySelectorAll('.pixelart-tool[data-tool]').forEach((b) => {
      b.addEventListener('click', () => {
        state.tool = b.dataset.tool;
        updateToolButtons();
      });
    });

    document.getElementById('pixelart-undo-btn').addEventListener('click', undo);
    document.getElementById('pixelart-redo-btn').addEventListener('click', redo);
    document.getElementById('pixelart-clear-btn').addEventListener('click', clearCanvas);
    document.getElementById('pixelart-save-btn').addEventListener('click', openSaveModal);
    document.getElementById('pixelart-export-btn').addEventListener('click', exportPNG);
    document.getElementById('pixelart-share-btn').addEventListener('click', shareLink);
    document.getElementById('pixelart-load-btn').addEventListener('click', () => {
      document.getElementById('pixelart').scrollIntoView({ behavior: 'smooth', block: 'start' });
      const gallery = document.getElementById('pixelart-gallery');
      if (gallery.firstElementChild) gallery.firstElementChild.click();
    });

    // modal
    document.getElementById('pixelart-modal-save').addEventListener('click', saveCurrent);
    document.getElementById('pixelart-modal-cancel').addEventListener('click', closeSaveModal);
    document.getElementById('pixelart-modal').addEventListener('click', (e) => {
      if (e.target.dataset.close !== undefined) closeSaveModal();
    });
    document.getElementById('pixelart-modal-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveCurrent();
    });

    // hero meta button
    const heroBtn = document.getElementById('pixelart-hero-btn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        document.getElementById('pixelart').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // global keyboard shortcuts (only when in section)
    document.addEventListener('keydown', (e) => {
      const inField = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (inField) return;
      const sectionVisible = isSectionInViewport('pixelart');
      if (!sectionVisible) return;
      if (e.key === 'p' || e.key === 'P') { state.tool = 'paint'; updateToolButtons(); }
      else if (e.key === 'e' || e.key === 'E') { state.tool = 'erase'; updateToolButtons(); }
      else if (e.key === 'f' || e.key === 'F') { state.tool = 'fill'; updateToolButtons(); }
      else if (e.key === 'i' || e.key === 'I') { state.tool = 'eyedrop'; updateToolButtons(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redo(); }
    });

    // global X shortcut to scroll
    document.addEventListener('keydown', (e) => {
      const inField = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (inField) return;
      if (e.key === 'x' || e.key === 'X') {
        const section = document.getElementById('pixelart');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function isSectionInViewport(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  // ---- init ----
  function init() {
    state.pieces = loadPieces();
    state.stats = loadStats();

    buildGrid();
    buildPalette();

    // Check for shared pixel art in URL hash
    const shared = decodeHash();
    if (shared) {
      state.grid = shared;
      showToast('Loaded shared pixel art');
    }

    renderGrid();
    renderGallery();
    renderStarters();
    updateStatsUI();
    attachEvents();

    // Expose for command palette
    window.ajhPixelArtOpen = () => {
      document.getElementById('pixelart').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();