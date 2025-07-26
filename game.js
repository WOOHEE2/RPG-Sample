const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상태
let keys = {};
let slimeKillCount = 0;

// 플레이어
const player = {
  x: 100,
  y: 300,
  width: 30,
  height: 40,
  color: 'blue',
  vx: 0,
  vy: 0,
  grounded: false,
  hp: 3,
};

// 슬라임
let slime = {
  x: 500,
  y: 300,
  width: 30,
  height: 30,
  color: 'green',
};

// 키 입력 처리
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// 충돌 판정
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 게임 초기화
function resetGame() {
  player.x = 100;
  player.y = 300;
  player.hp = 3;
  slime.x = 500;
  slime.y = 300;
  slimeKillCount = 0;
}

// 게임 루프
function gameLoop() {
  // 물리
  player.vx = 0;
  if (keys['ArrowLeft']) player.vx = -2;
  if (keys['ArrowRight']) player.vx = 2;
  if (keys[' '] && player.grounded) {
    player.vy = -7;
    player.grounded = false;
  }

  player.vy += 0.3; // 중력
  player.x += player.vx;
  player.y += player.vy;

  if (player.y >= 300) {
    player.y = 300;
    player.vy = 0;
    player.grounded = true;
  }

  // 슬라임 밟기 판정
  if (isColliding(player, slime)) {
    const playerBottom = player.y + player.height;
    const slimeTop = slime.y;

    // 플레이어가 아래로 떨어지는 중이고, 발이 슬라임 위쪽에 위치하면 처치
    if (player.vy > 0 && playerBottom <= slimeTop + 10) {
      slimeKillCount++;
      slime.x = Math.random() * 700 + 50;
      slime.y = 300;
      player.vy = -5; // 튕기는 점프 효과
      player.grounded = false;
    } else {
      // 밟기 실패 - 플레이어 피해
      player.hp--;
      slime.x = Math.random() * 700 + 50;
      slime.y = 300;
      if (player.hp <= 0) {
        alert(`Game Over! 슬라임 처치 수: ${slimeKillCount}`);
        resetGame();
      }
    }
  }

  // 화면 그리기
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 필드
  ctx.fillStyle = '#555';
  ctx.fillRect(0, 340, canvas.width, 60);

  // 플레이어
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 슬라임
  ctx.fillStyle = slime.color;
  ctx.fillRect(slime.x, slime.y, slime.width, slime.height);

  // UI
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`슬라임 처치 수: ${slimeKillCount}`, canvas.width - 160, 30);
  ctx.fillText(`HP: ${player.hp}`, 20, 30);

  requestAnimationFrame(gameLoop);
}

// 시작
resetGame();
gameLoop();
