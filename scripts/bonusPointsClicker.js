const autoBonusClicker = setInterval(() => {
  claimBonusPoints();
}, 300000);

function claimBonusPoints() {
  const pointsButton = document.querySelector(`[aria-label = "Claim Bonus"]`);
  if (pointsButton) {
    pointsButton.click();
  }
}
