// ─────────────────────────────────────────────
//  Number Go Up — utils.js
// ─────────────────────────────────────────────

// ── Number formatters ──
function fmt(n) {
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    if (n < 1)    return '$' + n.toFixed(4);
    return '$' + n.toFixed(2);
  }
  
  function fmtPrice(n) {
    if (n >= 1000) return '$' + Math.round(n).toLocaleString();
    if (n < 1)     return '$' + n.toFixed(4);
    return '$' + n.toFixed(2);
  }
  
  function fmtGameTime(secs) {
    const day  = Math.floor(secs / 86400) + 1;
    const hour = Math.floor((secs % 86400) / 3600);
    const min  = Math.floor((secs % 3600) / 60);
    const sec  = Math.floor(secs % 60);
    return `Day ${day} ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  
  // ── Toast ──
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }