// ─────────────────────────────────────────────
//  Number Go Up — news.js
// ─────────────────────────────────────────────

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