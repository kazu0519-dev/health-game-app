// グローバル状態管理
// app.js (初期値を50PTにして即テスト可能に)
let appState = {
  user: {
    points: 50, // 👈 最初から50PT持っている状態にします！
    totalPoints: 50, // 👈 ここも50に
    stepsToday: 0,
    todayPointsEarned: 0,
    distanceTraveled: 0.0,
  },
  health: { history: [] },
};

function loadAppState() {
  const savedData = localStorage.getItem("health_game_app_state");
  if (savedData) {
    try {
      appState = JSON.parse(savedData);
    } catch (e) {
      console.error("データ復元エラー");
    }
  } else {
    // 💡 初めて起動したときだけ50PTを確実に持たせる
    appState.user.points = 50;
    appState.user.totalPoints = 50;
  }
  updateGlobalUI();
}

function saveAppState() {
  localStorage.setItem("health_game_app_state", JSON.stringify(appState));
  updateGlobalUI();
}

function switchView(viewId) {
  document
    .querySelectorAll(".view-section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".bottom-nav .nav-item")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById(`view-${viewId}`).classList.add("active");
  document.getElementById(`nav-${viewId}`).classList.add("active");
  if (viewId === "ranking" && typeof renderLeaderboard === "function")
    renderLeaderboard();
}

function updateGlobalUI() {
  document.getElementById("global-points").textContent =
    appState.user.points.toLocaleString();
  document.getElementById("home-total-points").textContent =
    appState.user.totalPoints.toLocaleString();
  document.getElementById("step-display").textContent =
    appState.user.stepsToday.toLocaleString();
  document.getElementById("today-earned-points").textContent =
    appState.user.todayPointsEarned.toLocaleString();

  const mazeBtn = document.getElementById("maze-start-btn");
  if (mazeBtn) {
    if (appState.user.points >= 20) {
      mazeBtn.disabled = false;
      mazeBtn.textContent = "Unlock & Play";
      mazeBtn.style.background = "#10b981";
    } else {
      mazeBtn.disabled = true;
      mazeBtn.textContent = `20 PT 必要`;
      mazeBtn.style.background = "#475569";
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  if (typeof initRankingData === "function") initRankingData();
});
