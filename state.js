// ─────────────────────────────────────────────
//  Number Go Up — state.js
// ─────────────────────────────────────────────

// ── Prestige state (persists across resets) ──
const prestige = {
    points: 0,
    totalPrestiges: 0,
    perks: {
      dividendBoost:  0,      // 0-3 stacks, +25% dividends each
      headStart:      false,
      crashInsurance: false,
      // more perks added later
    },
  };
  
  // ── Game time ──
  let gameTime = 0;

  // ── Net worth history (last 1 min = 60 ticks at 1/sec) ──
  const MAX_HISTORY = 60;
  const netWorthHistory = [];
  
  // ── Run state (wiped on prestige) ──
  let run = newRunState();
  
  function newRunState() {
    const startCash = prestige.perks.headStart ? 25000 : 10000;
    return {
      cash:         startCash,
      holdings:     {},         // { ticker: qty }
      stocks:       STOCK_DEFS.map(s => ({ ...s, price: s.basePrice, prevPrice: s.basePrice })),
      divTimer:     0,
      divInterval:  10,         // seconds between payouts
      divTotal:     0,
      peakNetWorth: startCash,
      tick:         0,
    };
  }