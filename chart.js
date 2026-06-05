// ─────────────────────────────────────────────
//  Number Go Up — chart.js
// ─────────────────────────────────────────────

function drawChart() {
    const canvas = document.getElementById('nw-chart');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const dpr    = window.devicePixelRatio || 1;
    const rect   = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
  
    // Clear
    ctx.clearRect(0, 0, W, H);
  
    if (netWorthHistory.length < 2) return;
  
    const min  = Math.min(...netWorthHistory);
    const max  = Math.max(...netWorthHistory);
    const range = max - min || 1;
  
    const pad  = { top: 10, bottom: 24, left: 8, right: 8 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
  
    const toX = i  => pad.left + (i / (MAX_HISTORY - 1)) * chartW;
    const toY = v  => pad.top  + chartH - ((v - min) / range) * chartH;
  
    // ── Gradient fill ──
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0,   'rgba(34,197,94,0.3)');
    grad.addColorStop(1,   'rgba(34,197,94,0.0)');
  
    // Pad history to MAX_HISTORY so the line always starts from the left
    const padded = Array(MAX_HISTORY - netWorthHistory.length).fill(netWorthHistory[0])
      .concat(netWorthHistory);
  
    ctx.beginPath();
    padded.forEach((v, i) => {
      i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v));
    });
    // Close fill area
    ctx.lineTo(toX(MAX_HISTORY - 1), pad.top + chartH);
    ctx.lineTo(toX(0), pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  
    // ── Line ──
    ctx.beginPath();
    padded.forEach((v, i) => {
      if (i === 0) {
        ctx.moveTo(toX(i), toY(v));
      } else {
        const cpX = (toX(i - 1) + toX(i)) / 2;
        ctx.bezierCurveTo(cpX, toY(padded[i - 1]), cpX, toY(v), toX(i), toY(v));
      }
    });
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  
    // ── Min / max labels ──
    ctx.fillStyle  = '#555';
    ctx.font       = '10px Inter, system-ui, sans-serif';
    ctx.textAlign  = 'right';
    ctx.fillText(fmt(max), W - pad.right, pad.top + 10);
    ctx.fillText(fmt(min), W - pad.right, pad.top + chartH);
  
    // ── Time label ──
    ctx.textAlign = 'left';
    ctx.fillText('60s', pad.left, H - 6);
    ctx.textAlign = 'right';
    ctx.fillText('now', W - pad.right, H - 6);
  }