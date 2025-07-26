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
  attack: false,
};

// 슬라임
let slime = {
  x: 500,
  y: 300,
  width: 30,
  height: 30,
  color: 'green',
  hp: 3,
};

// 키 입력 처리
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'a') {
    player.attack = true;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (e.key === 'a') {
    player.attack = false;
  }
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
  slime.hp = 3;
  slime.x = 500;
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

  // 공격 처리
  if (player.attack && isColliding(player, slime)) {
    slime.hp--;
    player.attack = false;
    if (slime.hp <= 0) {
      slimeKillCount++;
      slime.hp = 3;
      slime.x = Math.random() * 700 + 50;
    }
  }

  // 슬라임과 접촉 시 플레이어 피해
  if (isColliding(player, slime) && !player.attack) {
    player.hp--;
    slime.x = Math.random() * 700 + 50;
    if (player.hp <= 0) {
      alert(`Game Over! 슬라임 처치 수: ${slimeKillCount}`);
      resetGame();
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
