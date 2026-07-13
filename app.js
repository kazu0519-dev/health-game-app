let appState = {
    user: { points: 50, totalPoints: 50, stepsToday: 0, todayPointsEarned: 0, distanceTraveled: 0.0 },
    health: { history: [] }
};

function loadAppState() {
    const savedData = localStorage.getItem('health_game_app_state');
    if (savedData) {
        try { 
            appState = JSON.parse(savedData); 
        } catch (e) { 
            console.error("データ復元エラー"); 
        }
    } else {
        appState.user.points = 50;
        appState.user.totalPoints = 50;
    }
    updateGlobalUI();
}

function saveAppState() {
    localStorage.setItem('health_game_app_state', JSON.stringify(appState));
    updateGlobalUI();
}

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.bottom-nav .nav-item').forEach(t => t.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    document.getElementById(`nav-${viewId}`).classList.add('active');
    if (viewId === 'ranking' && typeof renderLeaderboard === 'function') renderLeaderboard();
}

function updateGlobalUI() {
    // 右上と中央の数値を同時に確実に更新
    const globalPts = document.getElementById('global-points');
    const homeTotalPts = document.getElementById('home-total-points');
    const stepDisp = document.getElementById('step-display');
    const todayEarned = document.getElementById('today-earned-points');

    if (globalPts) globalPts.textContent = appState.user.points.toLocaleString();
    if (homeTotalPts) homeTotalPts.textContent = appState.user.totalPoints.toLocaleString();
    if (stepDisp) stepDisp.textContent = appState.user.stepsToday.toLocaleString();
    if (todayEarned) todayEarned.textContent = appState.user.todayPointsEarned.toLocaleString();

    const mazeBtn = document.getElementById('maze-start-btn');
    if (mazeBtn) {
        if (appState.user.points >= 20) {
            mazeBtn.disabled = false; mazeBtn.textContent = "アンロックしてプレイ"; mazeBtn.style.background = "#10b981";
        } else {
            mazeBtn.disabled = true; mazeBtn.textContent = `${appState.user.points} / 20 PT`; mazeBtn.style.background = "#475569";
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAppState();
    if (typeof initRankingData === 'function') initRankingData();
});