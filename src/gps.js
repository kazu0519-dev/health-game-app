let map = null,
  marker = null,
  pathLine = null,
  pathCoordinates = [],
  lastPosition = null;

function startTracking() {
  const btn = document.getElementById("sensor-start-btn");
  btn.disabled = true;
  btn.textContent = "🐾 トラッキング中...";
  btn.style.background = "#475569";

  // 歩数カウント＆シミュレータ
  setInterval(() => {
    appState.user.stepsToday += Math.floor(Math.random() * 3) + 1;
    if (appState.user.stepsToday % 10 === 0) {
      appState.user.points += 1;
      appState.user.totalPoints += 1;
      appState.user.todayPointsEarned += 1;
    }
    saveAppState();
  }, 2500);

  // GPSマップ初期化
  map = L.map("map").setView([35.681236, 139.767125], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  pathLine = L.polyline([], { color: "#6366f1", weight: 6 }).addTo(map);

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const currentPos = [lat, lng];
        map.setView(currentPos);
        if (marker) marker.setLatLng(currentPos);
        else marker = L.marker(currentPos).addTo(map);

        if (lastPosition) {
          const dist = calculateDistance(
            lastPosition[0],
            lastPosition[1],
            lat,
            lng,
          );
          appState.user.distanceTraveled += dist;
        }
        lastPosition = currentPos;
        pathCoordinates.push(currentPos);
        pathLine.setLatLngs(pathCoordinates);
        saveAppState();
      },
      null,
      { enableHighAccuracy: true },
    );
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
