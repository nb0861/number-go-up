// ─────────────────────────────────────────────
//  Number Go Up — calc.js
// ─────────────────────────────────────────────

function getPortfolioValue() {
    return Object.entries(run.holdings).reduce((sum, [tk, qty]) => {
      const s = run.stocks.find(s => s.ticker === tk);
      return sum + (s ? s.price * qty : 0);
    }, 0);
  }
  
  function getNetWorth() {
    return run.cash + getPortfolioValue();
  }
  
  function getDividendIncome() {
    const boostMult = 1 + (prestige.perks.dividendBoost * 0.25);
    return Object.entries(run.holdings).reduce((sum, [tk, qty]) => {
      const s = run.stocks.find(s => s.ticker === tk);
      if (!s) return sum;
      const rate = DIV_RATES[s.tag] || 0;
      return sum + (s.price * qty * rate * boostMult);
    }, 0);
  }