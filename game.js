// ─────────────────────────────────────────────
//  Number Go Up — game.js
// ─────────────────────────────────────────────

// -- Game refresh rate
const TICK_MS = 1000;
const TICKS_PER_SEC = 1000 / TICK_MS;

// ── Prestige state (persists across resets) ──
const prestige = {
    points: 0,
    totalPrestiges: 0,
    perks: {
      dividendBoost: 0,   // 0-3 stacks, +25% dividends each
      headStart:     false,
      crashInsurance: false,
      // more perks added later
    },
  };
  
  // ── Stock definitions ──
  const STOCK_DEFS = [
    { ticker: 'AAPL', name: 'Apple Inc.',          tag: 'tech', basePrice: 182,  vol: 0.012 },
    { ticker: 'JPM',  name: 'JPMorgan Chase',       tag: 'blue', basePrice: 198,  vol: 0.010 },
    { ticker: 'TSLA', name: 'Tesla Inc.',            tag: 'tech', basePrice: 247,  vol: 0.028 },
    { ticker: 'XOM',  name: 'ExxonMobil',            tag: 'blue', basePrice: 113,  vol: 0.011 },
    { ticker: 'NVDA', name: 'Nvidia Corp.',           tag: 'tech', basePrice: 875,  vol: 0.018 },
    { ticker: 'GME',  name: 'GameStop (again)',       tag: 'meme', basePrice: 22,   vol: 0.065 },
    { ticker: 'DOGE', name: 'DogeCoin Corp.',         tag: 'meme', basePrice: 0.14, vol: 0.090 },
    { ticker: 'BRRT', name: 'Brainrot Technologies', tag: 'meme', basePrice: 4.20, vol: 0.120 },
  ];
  
  // Dividend rates by tag
  const DIV_RATES = { blue: 0.005, tech: 0.002, meme: 0 };
  
  // ── Run state (wiped on prestige) ──
  let run = newRunState();
  
  function newRunState() {
    const startCash = prestige.perks.headStart ? 25000 : 10000;
    return {
      cash:        startCash,
      holdings:    {},          // { ticker: qty }
      stocks:      STOCK_DEFS.map(s => ({ ...s, price: s.basePrice, prevPrice: s.basePrice })),
      divTimer:    0,
      divInterval: 10,          // seconds between payouts
      divTotal:    0,
      peakNetWorth: startCash,
      tick:        0,
    };
  }
  
  // ── Utility ──
  function fmt(n) {
    if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2)  + 'B';
    if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2)  + 'M';
    if (n >= 1e3)  return '$' + (n / 1e3).toFixed(1)  + 'K';
    if (n < 1)     return '$' + n.toFixed(4);
    return '$' + n.toFixed(2);
  }
  
  function fmtPrice(n) {
    if (n >= 1000) return '$' + Math.round(n).toLocaleString();
    if (n < 1)     return '$' + n.toFixed(4);
    return '$' + n.toFixed(2);
  }
  
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
  }
  
  // ── Calculations ──
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
  
  // ── Actions ──
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
  
  // ── News ──
  const NEWS_TEMPLATES = [
    (t, up) => `<span class="news-ticker">${t}</span> — Analyst upgrades to "strong buy". Stock ${up ? 'surges' : 'slips'}.`,
    (t, up) => `<span class="news-ticker">${t}</span> — CEO posts cryptic tweet. Traders baffled.`,
    (t, up) => `<span class="news-ticker">${t}</span> — Earnings ${up ? 'beat' : 'miss'} expectations.`,
    (t, up) => `<span class="news-ticker">${t}</span> — Reddit discovers ticker. Volume spikes.`,
    (t, up) => `<span class="news-ticker">${t}</span> — Fed comments spook investors. ${up ? 'Holds firm.' : 'Sells off.'}`,
    (t, up) => `<span class="news-ticker">${t}</span> — Rumoured acquisition. Speculation runs wild.`,
  ];
  
  function pushNews(html) {
    const feed = document.getElementById('news-feed');
    const div = document.createElement('div');
    div.className = 'news-item news-new';
    div.innerHTML = html;
    feed.prepend(div);
    setTimeout(() => div.classList.remove('news-new'), 3000);
    const items = feed.querySelectorAll('.news-item');
    if (items.length > 5) items[items.length - 1].remove();
  }
  
  // ── Game tick ──
  function gameTick() {
    run.tick++;
  
    // Move prices
    run.stocks.forEach(s => {
      s.prevPrice = s.price;
      const move = (Math.random() - 0.49) * s.vol * s.price;
      s.price = Math.max(s.price + move, 0.0001);
    });
  
    // Occasional news
    if (run.tick % 32 === 0) {
      const s = run.stocks[Math.floor(Math.random() * run.stocks.length)];
      const up = s.price >= s.prevPrice;
      const fn = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
      pushNews(fn(s.ticker, up));
    }
  
    // Dividend timer
    run.divTimer++;
    const divTicks = run.divInterval * TICKS_PER_SEC;
    const pct = (run.divTimer / divTicks) * 100;
    document.getElementById('div-bar').style.width = Math.min(pct, 100) + '%';
    const secsLeft = Math.max(0, Math.round((divTicks - run.divTimer) / TICKS_PER_SEC));
    document.getElementById('div-countdown').textContent = secsLeft + 's';
  
    if (run.divTimer >= divTicks) {
      run.divTimer = 0;
      const income = getDividendIncome();
      if (income > 0) {
        run.cash += income;
        run.divTotal += income;
        showToast(`+${fmt(income)} dividends`);
      }
    }
  
    // Track peak net worth (for prestige calc)
    const nw = getNetWorth();
    if (nw > run.peakNetWorth) run.peakNetWorth = nw;
  
    render();
  }
  
  // ── Render ──
  function render() {
    const portVal = getPortfolioValue();
    const netWorth = run.cash + portVal;
  
    // HUD
    document.getElementById('hud-cash').textContent      = fmt(run.cash);
    document.getElementById('hud-portfolio').textContent = fmt(portVal);
    document.getElementById('hud-net-worth').textContent  = fmt(netWorth);
    document.getElementById('hud-prestige').textContent  = prestige.points;
  
    // Stock table
    const tbody = document.getElementById('stock-body');

    run.stocks.forEach((s, i) => {
      let tr = tbody.rows[i];
      if (!tr) {
        tr = document.createElement('tr');
        tbody.appendChild(tr);
      }

      const diff = s.price - s.prevPrice;
      const pct  = (diff / s.prevPrice) * 100;
      const cls  = diff > 0.0001 ? 'change-pos' : diff < -0.0001 ? 'change-neg' : 'change-neu';
      const arrow = diff > 0.0001 ? '▲' : diff < -0.0001 ? '▼' : '—';
      const owned = run.holdings[s.ticker] || 0;
      const canBuy = run.cash >= s.price;
  
      tr.innerHTML = `
        <td>
          <div class="ticker-name">${s.ticker}<span class="tag tag-${s.tag}">${s.tag}</span></div>
          <div class="ticker-company">${s.name}</div>
        </td>
        <td class="price-cell">${fmtPrice(s.price)}</td>
        <td class="${cls}">${arrow} ${Math.abs(pct).toFixed(2)}%</td>
        <td>${owned}</td>
        <td>
          <div class="action-cell">
            <button class="btn-buy"  onclick="buy('${s.ticker}')"  ${canBuy ? '' : 'disabled'}>Buy</button>
            <button class="btn-sell" onclick="sell('${s.ticker}')" ${owned > 0 ? '' : 'disabled'}>Sell</button>
          </div>
        </td>`;
    });
  
    // Holdings
    const holdEl = document.getElementById('holdings-body');
    const entries = Object.entries(run.holdings);
    if (entries.length === 0) {
      holdEl.innerHTML = '<p class="empty-msg">You don\'t own any shares yet.</p>';
    } else {
      holdEl.innerHTML = '';
      entries.forEach(([tk, qty]) => {
        const s = run.stocks.find(s => s.ticker === tk);
        if (!s) return;
        const val     = s.price * qty;
        const rate    = DIV_RATES[s.tag] || 0;
        const divPer  = val * rate * (1 + prestige.perks.dividendBoost * 0.25);
        const row     = document.createElement('div');
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
  
  // ── Start ──
  render();
  setInterval(gameTick, TICK_MS);