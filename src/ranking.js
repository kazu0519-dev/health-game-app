let mockCompetitors = [];
let currentRankingTab = "distance";

function initRankingData() {
  mockCompetitors = [
    { name: "アスリートケン", distance: 4.8, points: 150 },
    { name: "歩くインコ", distance: 3.2, points: 90 },
    { name: "GameMaster", distance: 1.5, points: 210 },
    { name: "すこやか太郎", distance: 0.8, points: 45 },
  ];
}

function switchRankingTab(type) {
  currentRankingTab = type;
  document
    .getElementById("rank-tab-dist")
    .classList.toggle("active", type === "distance");
  document
    .getElementById("rank-tab-pts")
    .classList.toggle("active", type === "points");
  renderLeaderboard();
}

function renderLeaderboard() {
  const container = document.getElementById("ranking-list-container");
  if (!container) return;

  const allPlayers = [
    ...mockCompetitors,
    {
      name: "あなた (You)",
      distance: parseFloat(appState.user.distanceTraveled.toFixed(2)),
      points: appState.user.totalPoints,
    },
  ];
  allPlayers.sort((a, b) =>
    currentRankingTab === "distance"
      ? b.distance - a.distance
      : b.points - a.points,
  );

  container.innerHTML = allPlayers
    .map((player, idx) => {
      const rank = idx + 1;
      const valStr =
        currentRankingTab === "distance"
          ? `${player.distance} km`
          : `${player.points} PT`;
      const isYou = player.name.includes("あなた");
      return `
            <div class="rank-row" style="${isYou ? "border: 2px solid #6366f1; background: #1e1b4b;" : ""}">
                <div class="rank-left"><span class="rank-badge rank-${rank}">${rank}</span><span>${player.name}</span></div>
                <div class="rank-val">${valStr}</div>
            </div>
        `;
    })
    .join("");
}
