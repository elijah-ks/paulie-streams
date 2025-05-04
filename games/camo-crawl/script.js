// Camo Crawl - Level-based stealth game with 5 levels, bush hiding, rotating cameras, timers, and quotes

const PAULIE_IMG = '/paulie-streams/assets/transparent.png';
const PAULIE_QUOTES = [
  "Vinnie needs better security...",
  "You didn't see anything!",
  "I'm a shadow in the night.",
  "One more level to freedom!",
  "Cameras? Please."
];

const levels = [
  {
    grid: [
      ['P', '', '', '', 'C', '', '', 'E'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
    ],
    cameras: [{ x: 4, y: 0, direction: 'down', rotate: true }]
  },
  {
    grid: [
      ['', '', '', '', 'C', '', '', 'E'],
      ['', 'B', '', 'C', '', '', '', ''],
      ['P', '', '', '', '', '', '', ''],
    ],
    cameras: [
      { x: 4, y: 0, direction: 'down', rotate: true },
      { x: 3, y: 1, direction: 'left', rotate: false }
    ]
  },
  {
    grid: [
      ['P', '', 'B', '', '', '', 'C', ''],
      ['', 'C', '', 'B', '', '', '', ''],
      ['', '', '', '', '', 'B', '', 'E']
    ],
    cameras: [
      { x: 1, y: 1, direction: 'down', rotate: true },
      { x: 6, y: 0, direction: 'down', rotate: false }
    ]
  },
  {
    grid: [
      ['P', '', 'C', '', '', 'B', '', 'E'],
      ['', 'B', '', '', 'C', '', '', ''],
      ['', '', '', '', '', '', '', '']
    ],
    cameras: [
      { x: 2, y: 0, direction: 'down', rotate: true },
      { x: 4, y: 1, direction: 'left', rotate: true }
    ]
  },
  {
    grid: [
      ['P', '', 'C', '', '', '', 'B', ''],
      ['', 'B', '', 'C', '', 'B', '', ''],
      ['', '', '', '', '', '', '', 'E']
    ],
    cameras: [
      { x: 2, y: 0, direction: 'down', rotate: true },
      { x: 3, y: 1, direction: 'left', rotate: true },
      { x: 6, y: 0, direction: 'down', rotate: true }
    ]
  }
];

let currentLevel = 0;
let playerPosition = { x: 0, y: 0 };
let cameraTimer;

function loadLevel(index) {
  clearInterval(cameraTimer);
  const container = document.getElementById('game-board');
  container.innerHTML = '';

  const level = levels[index];
  level.grid.forEach((row, y) => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.forEach((cell, x) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');

      if (cell === 'P') {
        playerPosition = { x, y };
        const img = document.createElement('img');
        img.src = PAULIE_IMG;
        cellDiv.appendChild(img);
      } else if (cell === 'E') {
        cellDiv.classList.add('exit');
      } else if (cell === 'C') {
        cellDiv.classList.add('camera');
      } else if (cell === 'B') {
        cellDiv.classList.add('bush');
      }

      cellDiv.setAttribute('data-x', x);
      cellDiv.setAttribute('data-y', y);
      rowDiv.appendChild(cellDiv);
    });
    container.appendChild(rowDiv);
  });

  updateStatus(`Level ${index + 1}`);
  startCameraRotation();
}

function updateStatus(msg) {
  document.getElementById('status').textContent = msg;
}

function rotateDirection(dir) {
    return dir === 'down' ? 'left' : 'down';
  }  

function startCameraRotation() {
    cameraTimer = setInterval(() => {
      const cams = levels[currentLevel].cameras;
      cams.forEach(cam => {
        if (cam.rotate) {
          cam.direction = rotateDirection(cam.direction);
        }
      });
      loadLevel(currentLevel); // ← refresh vision zones after rotation
    }, 2000);
  }
  
  
  function updateCameraVision() {
    // Clear previous vision
    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('vision');
    });
  
    const level = levels[currentLevel];
    const visionMap = getCameraVision(level);
  
    visionMap.forEach((row, y) => {
      row.forEach((hasVision, x) => {
        if (hasVision) {
          const selector = `.cell[data-x="${x}"][data-y="${y}"]`;
          const cell = document.querySelector(selector);
          if (cell) {
            cell.classList.add('vision');
          }
        }
      });
    });
  }
  
  

function isCaught(newX, newY, level) {
  for (const cam of level.cameras) {
    if (cam.direction === 'down' && newX === cam.x && newY > cam.y) {
      for (let y = cam.y + 1; y <= newY; y++) {
        if (level.grid[y][newX] === 'B') return false;
      }
      return true;
    }
    if (cam.direction === 'left' && newY === cam.y && newX < cam.x) {
      for (let x = newX + 1; x < cam.x; x++) {
        if (level.grid[newY][x] === 'B') return false;
      }
      return true;
    }
  }
  return false;
}

function movePlayer(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  const level = levels[currentLevel];
  const grid = level.grid;

  if (
    newY < 0 ||
    newY >= grid.length ||
    newX < 0 ||
    newX >= grid[0].length
  ) return;

  if (grid[newY][newX] === 'E') {
    const quote = PAULIE_QUOTES[currentLevel % PAULIE_QUOTES.length];
    updateStatus(`✅ Level Complete: ${quote}`);
    currentLevel++;
    if (currentLevel >= levels.length) {
      updateStatus('🎉 You completed all levels!');
      return;
    }
    setTimeout(() => loadLevel(currentLevel), 1500);
    return;
  }

  if (isCaught(newX, newY, level)) {
    updateStatus('❌ Caught by a camera!');
    return;
  }

  grid[playerPosition.y][playerPosition.x] = '';
  grid[newY][newX] = 'P';
  loadLevel(currentLevel);
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  else if (e.key === 'ArrowDown') movePlayer(0, 1);
  else if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  else if (e.key === 'ArrowRight') movePlayer(1, 0);
});

window.onload = () => loadLevel(currentLevel);
