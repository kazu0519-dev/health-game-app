function submitHealthRecord() {
  const weight = document.getElementById("health-weight").value;
  const fat = document.getElementById("health-fat").value;
  const calories = document.getElementById("health-calories").value;
  const water = document.getElementById("health-water").value;
  const meal = document.getElementById("health-meal").value.trim();

  if (!weight && !fat && !calories && !water && !meal) {
    alert("項目に入力してください！");
    return;
  }

  let earned = 0;
  let logText = "";
  if (weight || fat) {
    earned += 5;
    logText += "🧍身体記録 ";
  }
  if (calories || water) {
    earned += 5;
    logText += "🍳栄養・水分 ";
  }
  if (meal) {
    earned += 5;
    logText += `📝食事:[${meal}] `;
  }

  appState.user.points += earned;
  appState.user.totalPoints += earned;
  appState.user.todayPointsEarned += earned;

  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  appState.health.history.unshift({
    time: timestamp,
    content: `${logText} (+${earned} PT)`,
  });

  document.getElementById("health-weight").value = "";
  document.getElementById("health-fat").value = "";
  document.getElementById("health-calories").value = "";
  document.getElementById("health-water").value = "";
  document.getElementById("health-meal").value = "";

  saveAppState();
  renderHealthLog();
}

function renderHealthLog() {
  const list = document.getElementById("health-log-list");
  if (!list) return;
  list.innerHTML =
    appState.health.history
      .map(
        (item) => `
        <li class="log-item"><span>${item.time}</span><strong>${item.content}</strong></li>
    `,
      )
      .join("") || '<li class="log-item">記録はまだありません</li>';
}
