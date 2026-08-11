(function () {
  'use strict';
  const KEY = 'ajh_verify_v1';
  const $ = (id) => document.getElementById(id);
  const state = { views: 0, refreshes: 0, last: null };
  const safe = (fn, fallback) => { try { return fn(); } catch (_) { return fallback; } };

  function load() {
    Object.assign(state, safe(() => JSON.parse(localStorage.getItem(KEY) || '{}'), {}));
    state.views ||= 0;
    state.refreshes ||= 0;
  }

  function save() {
    safe(() => localStorage.setItem(KEY, JSON.stringify(state)), null);
  }

  function sourceRepair() {
    return window.ajhRepair?.state?.() || {};
  }

  function sourceProof() {
    return window.ajhProof?.state?.() || {};
  }

  function sourceLighthouse() {
    return window.ajhLighthouse?.state?.() || {};
  }

  function latestRepair() {
    const data = sourceRepair();
    return data.history?.[0] || data.draft || null;
  }

  function latestProof() {
    const data = sourceProof();
    return data.history?.[0] || data;
  }

  function qualitySignal() {
    const data = sourceLighthouse();
    if (!data.report?.length) return null;
    const passed = data.report.filter((item) => item.passed).length;
    return { score: Number(data.score) || 0, passed, warnings: data.report.length - passed, ranAt: data.ranAt || null };
  }

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  }

  function packet() {
    const repair = latestRepair();
    const proof = latestProof();
    const lighthouse = qualitySignal();
    return {
      checkedAt: new Date().toISOString(),
      repair: repair ? { title: repair.title || 'Untitled repair', patch: repair.repair || '', expected: repair.expected || '', notes: repair.notes || '' } : null,
      proof: proof?.title ? { title: proof.title, behavior: proof.behavior || '', quality: proof.quality || '', record: proof.record || '' } : null,
      lighthouse,
      signals: {
        patch: Boolean(repair?.repair),
        result: Boolean(proof?.behavior || proof?.record),
        quality: Boolean(lighthouse),
      },
    };
  }

  function renderLanes(snapshot) {
    const target = $('verify-lanes');
    if (!target) return;
    const lanes = [
      ['patch', 'Patch', snapshot.signals.patch, snapshot.repair ? `Latest: ${snapshot.repair.title}` : 'No Repair record or draft found'],
      ['result', 'Result', snapshot.signals.result, snapshot.proof ? `Latest: ${snapshot.proof.title}` : 'No Proof record or draft found'],
      ['quality', 'Quality', snapshot.signals.quality, snapshot.lighthouse ? `${snapshot.lighthouse.score}/100 · ${snapshot.lighthouse.warnings} warning${snapshot.lighthouse.warnings === 1 ? '' : 's'}` : 'Run a fresh Lighthouse signal'],
    ];
    target.innerHTML = lanes.map(([key, label, present, detail]) => `<div class="verify-lane ${present ? 'is-pass' : ''}"><span class="verify-lane-icon"><i class="fas ${present ? 'fa-check' : 'fa-minus'}"></i></span><div><strong>${label}</strong><span>${escapeHTML(detail)}</span></div><b>${present ? 'Present' : 'Missing'}</b></div>`).join('');
  }

  function render(snapshot = state.last || packet()) {
    state.last = snapshot;
    const count = Object.values(snapshot.signals).filter(Boolean).length;
    const ready = count === 3;
    $('verify-progress').textContent = `${count}/3`;
    $('verify-count').textContent = `${count} of 3 signals present`;
    $('verify-progress-bar').style.width = `${count / 3 * 100}%`;
    $('verify-status').textContent = ready ? 'Verification trail is complete' : count ? 'Verification trail is forming' : 'Awaiting a verification trail';
    $('verify-message').textContent = ready ? 'Repair, Proof, and a quality signal agree on a portable result.' : `${3 - count} signal${3 - count === 1 ? '' : 's'} still missing before this slice has a complete verification packet.`;
    $('verify-status-pill').textContent = ready ? 'Ready to carry forward' : 'Local snapshot';
    $('verify-status-card').classList.toggle('is-complete', ready);
    $('verify-score').textContent = snapshot.lighthouse ? snapshot.lighthouse.score : '—';
    $('verify-audit-date').textContent = snapshot.lighthouse?.ranAt ? `Checked ${new Date(snapshot.lighthouse.ranAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : 'Not checked';
    $('verify-checked-at').textContent = `Last refreshed ${new Date(snapshot.checkedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`;
    $('verify-views').textContent = `${state.views} opened · ${state.refreshes} refreshed`;
    renderLanes(snapshot);
    save();
  }

  function refresh() {
    state.refreshes += 1;
    render(packet());
  }

  function runQuality() {
    if (window.ajhLighthouse?.run) {
      window.ajhLighthouse.run();
      setTimeout(refresh, 180);
      return;
    }
    refresh();
  }

  function copy() {
    const text = JSON.stringify(state.last || packet(), null, 2);
    const done = () => {
      const button = $('verify-copy');
      button.innerHTML = '<i class="fas fa-check"></i> Copied packet';
      setTimeout(() => { button.innerHTML = '<i class="fas fa-share-nodes"></i> Copy packet'; }, 1600);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    else fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    safe(() => document.execCommand('copy'), null);
    area.remove();
    done();
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state.last || packet(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ajh-build-verify-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function open() {
    $('verify')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.views += 1;
    save();
    render();
  }

  function boot() {
    if (!$('verify')) return;
    load();
    state.views += 1;
    $('verify-refresh')?.addEventListener('click', refresh);
    $('verify-quality')?.addEventListener('click', runQuality);
    $('verify-copy')?.addEventListener('click', copy);
    $('verify-export')?.addEventListener('click', exportJSON);
    $('verify-hero-btn')?.addEventListener('click', open);
    document.addEventListener('keydown', (event) => {
      if (event.target.matches('input, textarea, select, button, a')) return;
      if (event.shiftKey && event.key.toLowerCase() === 'z') open();
    });
    window.ajhVerify = { open, refresh, runQuality, copy, exportJSON, state: () => ({ ...state, last: state.last ? JSON.parse(JSON.stringify(state.last)) : null }) };
    refresh();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
