// ─────────────────────────────────────────────
//  Number Go Up — constants.js
// ─────────────────────────────────────────────

// ── Tick rate ──
const TICK_MS      = 1000;
const TICKS_PER_SEC = 1000 / TICK_MS;
const GAME_SPEED   = 5;       // 1 real second = 5 game seconds

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

// ── Dividend rates by tag ──
const DIV_RATES = { blue: 0.005, tech: 0.002, meme: 0 };