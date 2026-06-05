// ─────────────────────────────────────────────
//  Number Go Up — tick.js
// ─────────────────────────────────────────────

function gameTick() {
    // Advance game time
    gameTime += GAME_SPEED * (TICK_MS / 1000);
    document.getElementById('hud-gametime').textContent = fmtGameTime(gameTime);
  
    run.tick++;
  
    // ── Move prices ──
    run.stocks.forEach(s => {
      s.prevPrice = s.price;
      const move  = (Math.random() - 0.49) * s.vol * s.price;
      s.price     = Math.max(s.price + move, 0.0001);
    });
  
    // ── Occasional news ──
    if (run.tick % 32 === 0) {
      const s  = run.stocks[Math.floor(Math.random() * run.stocks.length)];
      const up = s.price >= s.prevPrice;
      const fn = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
      pushNews(fn(s.ticker, up));
    }
  
    // ── Dividend timer ──
    run.divTimer++;
    const divTicks = run.divInterval * TICKS_PER_SEC;
    const pct      = (run.divTimer / divTicks) * 100;
    document.getElementById('div-bar').style.width       = Math.min(pct, 100) + '%';
    const secsLeft = Math.max(0, Math.round((divTicks - run.divTimer) / TICKS_PER_SEC));
    document.getElementById('div-countdown').textContent = secsLeft + 's';
  
    if (run.divTimer >= divTicks) {
      run.divTimer = 0;
      const income = getDividendIncome();
      if (income > 0) {
        run.cash     += income;
        run.divTotal += income;
        showToast(`+${fmt(income)} dividends`);
      }
    }
  
    // ── Track peak net worth ──
    const nw = getNetWorth();
    if (nw > run.peakNetWorth) run.peakNetWorth = nw;

    // ── Update net worth history ──
    netWorthHistory.push(nw);
    if (netWorthHistory.length > MAX_HISTORY) netWorthHistory.shift();
  
    render();
  }
  
  // ── Start ──
  render();
  setInterval(gameTick, TICK_MS);
  setInterval(drawChart, 100);