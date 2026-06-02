// ─────────────────────────────────────────────
//  Number Go Up — actions.js
// ─────────────────────────────────────────────

function buy(ticker) {
    const s = run.stocks.find(s => s.ticker === ticker);
    if (!s || run.cash < s.price) { showToast('Not enough cash'); return; }
    run.cash -= s.price;
    run.holdings[ticker] = (run.holdings[ticker] || 0) + 1;
    showToast(`Bought 1 × ${ticker}`);
    render();
  }
  
  function sell(ticker) {
    const qty = run.holdings[ticker];
    if (!qty || qty < 1) return;
    const s = run.stocks.find(s => s.ticker === ticker);
    run.cash += s.price;
    run.holdings[ticker]--;
    if (run.holdings[ticker] === 0) delete run.holdings[ticker];
    showToast(`Sold 1 × ${ticker}`);
    render();
  }