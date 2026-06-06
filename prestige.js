const PRESTIGE_MIN_WORTH = 100000;  // $100K net worth required
const PRESTIGE_MIN_DAYS  = 10;      // 10 game days required

function getGameDay() {
    return Math.floor(gameTime / 86400) + 1;
  }

  function canPrestige() {
    return getNetWorth() >= PRESTIGE_MIN_WORTH && getGameDay() >= PRESTIGE_MIN_DAYS;
  }

  function calcPrestigePoints() {
    return Math.floor(getNetWorth() / 10000);
  }

  function doPrestige() {
    prestige.points        += calcPrestigePoints();
    prestige.totalPrestiges++;
    gameTime = 0;
    run      = newRunState();
  }

  function updatePrestigeButton() {
    const btn = document.getElementById('prestige-btn');
    if (canPrestige()) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }
  
  function onPrestigeClick() {
    console.log('Prestige clicked! Points to earn:', calcPrestigePoints());
  }