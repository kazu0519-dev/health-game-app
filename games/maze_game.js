let canvas = null,
  ctx = null,
  mazeAnimationId = null,
  mazeStartTime = null;
let ball = { x: 30, y: 30, vx: 0, vy: 0, radius: 10 };
let goal = { x: 280, y: 280, width: 25, height: 25 };
let tiltX = 0,
  tiltY = 0;
const obstacles = [
  { x: 80, y: 0, w: 20, h: 200 },
  { x: 160, y: 100, w: 20, h: 220 },
  { x: 240, y: 0, w: 20, h: 240 },
];

function initMazeEngine() {
  canvas = document.getElementById("mazeCanvas");
  ctx = canvas.getContext("2d");
  ball.x = 30;
  ball.y = 30;
  ball.vx = 0;
  ball.vy = 0;
  mazeStartTime = Date.now();
  if (window.DeviceOrientationEvent)
    window.addEventListener("deviceorientation", handleOrientation);
  window.addEventListener("keydown", handleKeyDown);
  mazeLoop();
}

function stopMazeEngine() {
  cancelAnimationFrame(mazeAnimationId);
  window.removeEventListener("deviceorientation", handleOrientation);
  window.removeEventListener("keydown", handleKeyDown);
}
function handleOrientation(e) {
  tiltX = e.gamma / 45;
  tiltY = e.beta / 45;
}
function handleKeyDown(e) {
  if (e.key === "ArrowRight") tiltX = 0.5;
  if (e.key === "ArrowLeft") tiltX = -0.5;
  if (e.key === "ArrowDown") tiltY = 0.5;
  if (e.key === "ArrowUp") tiltY = -0.5;
}

function mazeLoop() {
  ball.vx += tiltX * 0.2;
  ball.vy += tiltY * 0.2;
  ball.vx *= 0.95;
  ball.vy *= 0.95;
  ball.x += ball.vx;
  ball.y += ball.vy;
  tiltX = 0;
  tiltY = 0; // キーボード用リセット

  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx = 0;
  }
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.vx = 0;
  }
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy = 0;
  }
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy = 0;
  }

  obstacles.forEach((wall) => {
    if (
      ball.x + ball.radius > wall.x &&
      ball.x - ball.radius < wall.x + wall.w &&
      ball.y + ball.radius > wall.y &&
      ball.y - ball.radius < wall.y + wall.h
    ) {
      ball.x -= ball.vx;
      ball.y -= ball.vy;
      ball.vx *= -0.5;
      ball.vy *= -0.5;
    }
  });

  const elapsed = ((Date.now() - mazeStartTime) / 1000).toFixed(1);
  document.getElementById("maze-timer").textContent = `Time: ${elapsed}s`;

  if (
    ball.x > goal.x &&
    ball.x < goal.x + goal.width &&
    ball.y > goal.y &&
    ball.y < goal.y + goal.height
  ) {
    stopMazeEngine();
    alert(`🎉 クリア！ボーナス +10PT！`);
    appState.user.points += 10;
    appState.user.totalPoints += 10;
    saveAppState();
    closeMazeGame();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#374151";
  obstacles.forEach((w) => ctx.fillRect(w.x, w.y, w.w, (wall = w.h)));
  ctx.fillStyle = "#10b981";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#6366f1";
  ctx.fill();
  ctx.closePath();
  mazeAnimationId = requestAnimationFrame(mazeLoop);
}
