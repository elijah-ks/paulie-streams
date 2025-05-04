// Camo Crawl - Level-based stealth game with 5 levels

const PAULIE_IMG = '/paulie-streams/assets/transparent.png';

const levels = [
  {
    grid: [
      ['P', '', '', '', 'C', '', '', 'E'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
    ],
    cameras: [{ x: 4, y: 0, direction: 'down' }]
  },
  {
    grid: [
      ['', '', '', '', 'C', '', '', 'E'],
      ['', 'B', '', 'C', '', '', '', ''],
      ['P', '', '', '', '', '', '', ''],
    ],
    cameras: [
      { x: 4, y: 0, direction: 'down' },
      { x: 3, y: 1, direction: 'left' }
    ]
  },
  {
    grid: [
      ['P', '', 'B', '', '', '', 'C', ''],
      ['', 'C', '', 'B', '', '', '', ''],
      ['', '', '', '', '', 'B', '', 'E']
    ],
    cameras: [
      { x: 1, y: 1, direction: 'down' },
      { x: 6, y: 0, direction: 'down' }
    ]
  },
  {
    grid: [
      ['P', '', 'C', '', '', 'B', '', 'E'],
      ['', 'B', '', '', 'C', '', '', ''],
      ['', '', '', '', '', '', '', '']
    ],
    cameras: [
      { x: 2, y: 0, direction: 'down' },
      { x: 4, y: 1, direction: 'left' }
    ]
  },
  {
    grid: [
      ['P', '', 'C', '', '', '', 'B', ''],
      ['', 'B', '', 'C', '', 'B', '', ''],
      ['', '', '', '', '', '', '', 'E']
    ],
    cameras: [
      { x: 2, y: 0, direction: 'down' },
      { x: 3, y: 1, direction: 'left' },
      { x: 6, y: 0, direction: 'down' }
    ]
  }
];

let currentLevel = 0;
let playerPosition = { x: 0, y: 0 };

function loadLevel(index) {
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
}

function updateStatus(msg) {
  document.getElementById('status').textContent = msg;
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

  if (grid[newY][newX] === 'C') {
    updateStatus('Caught by a camera!');
    return;
  }

  if (grid[newY][newX] === 'E') {
    currentLevel++;
    if (currentLevel >= levels.length) {
      updateStatus('🎉 You completed all levels!');
      return;
    }
    loadLevel(currentLevel);
    return;
  }

  // Move player
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
