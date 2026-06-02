// ─────────────────────────────────────────────
//  Number Go Up — render.js
// ─────────────────────────────────────────────

function render() {
    const portVal  = getPortfolioValue();
    const netWorth = run.cash + portVal;
  
    // ── HUD ──
    document.getElementById('hud-cash').textContent      = fmt(run.cash);
    document.getElementById('hud-portfolio').textContent = fmt(portVal);
    document.getElementById('hud-net-worth').textContent = fmt(netWorth);
    document.getElementById('hud-prestige').textContent  = prestige.points;
  
    // ── Stock table ──
    const tbody = document.getElementById('stock-body');
  
    run.stocks.forEach((s, i) => {
      let tr = tbody.rows[i];
      if (!tr) {
        const template = document.getElementById('stock-row-template');
        tr = template.content.cloneNode(true).firstElementChild;
        tr.querySelector('.btn-buy').addEventListener('click',  () => buy(s.ticker));
        tr.querySelector('.btn-sell').addEventListener('click', () => sell(s.ticker));
        tbody.appendChild(tr);
      }
  
      const diff  = s.price - s.prevPrice;
      const pct   = (diff / s.prevPrice) * 100;
      const cls   = diff > 0.0001 ? 'change-pos' : diff < -0.0001 ? 'change-neg' : 'change-neu';
      const arrow = diff > 0.0001 ? '▲' : diff < -0.0001 ? '▼' : '—';
      const owned  = run.holdings[s.ticker] || 0;
      const canBuy = run.cash >= s.price;
  
      // Only update cells that change — buttons are never touched
      tr.cells[0].querySelector('.ticker-name').innerHTML      = `${s.ticker}<span class="tag tag-${s.tag}">${s.tag}</span>`;
      tr.cells[0].querySelector('.ticker-company').textContent = s.name;
      tr.cells[1].textContent = fmtPrice(s.price);
      tr.cells[2].className   = cls;
      tr.cells[2].textContent = `${arrow} ${Math.abs(pct).toFixed(2)}%`;
      tr.cells[3].textContent = owned;
      tr.cells[4].querySelector('.btn-buy').disabled  = !canBuy;
      tr.cells[4].querySelector('.btn-sell').disabled = owned < 1;
    });
  
    // ── Holdings ──
    const holdEl  = document.getElementById('holdings-body');
    const entries = Object.entries(run.holdings);
  
    if (entries.length === 0) {
      holdEl.innerHTML = '<p class="empty-msg">You don\'t own any shares yet.</p>';
    } else {
      holdEl.innerHTML = '';
      entries.forEach(([tk, qty]) => {
        const s = run.stocks.find(s => s.ticker === tk);
        if (!s) return;
        const val    = s.price * qty;
        const rate   = DIV_RATES[s.tag] || 0;
        const divPer = val * rate * (1 + prestige.perks.dividendBoost * 0.25);
        const row    = document.createElement('div');
        row.className = 'holding-row';
        row.innerHTML = `
          <span class="holding-ticker">${tk}</span>
          <span class="holding-detail">${qty} share${qty !== 1 ? 's' : ''} @ ${fmtPrice(s.price)}</span>
          <div>
            <div class="holding-value">${fmt(val)}</div>
            <div class="holding-div">${divPer > 0 ? '+' + fmt(divPer) + '/payout' : 'no dividend'}</div>
          </div>`;
        holdEl.appendChild(row);
      });
    }
  }