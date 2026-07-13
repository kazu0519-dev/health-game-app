function launchMazeGame() {
  if (appState.user.points < 20) {
    alert("ポイントが足りません！");
    return;
  }
  appState.user.points -= 20;
  saveAppState();
  document.getElementById("game-selection-area").style.display = "none";
  document.getElementById("maze-game-container").style.display = "block";
  if (typeof initMazeEngine === "function") initMazeEngine();
}

function closeMazeGame() {
  if (typeof stopMazeEngine === "function") stopMazeEngine();
  document.getElementById("maze-game-container").style.display = "none";
  document.getElementById("game-selection-area").style.display = "block";
}
