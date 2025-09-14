let rows, cols;
let maze = [];
let start = null, end = null;
let prevRatCell = null;
function generateMaze() {
  rows = parseInt(document.getElementById('rows').value);
  cols = parseInt(document.getElementById('cols').value);
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));
  start = end = null;

  const mazeContainer = document.getElementById('maze');
  mazeContainer.innerHTML = '';
  mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const div = document.createElement('div');
      div.className = 'cell';
      div.textContent = '1';
      div.dataset.row = r;
      div.dataset.col = c;
      div.onclick = () => handleClick(div);
      mazeContainer.appendChild(div);
    }
  }
}

function handleClick(cell) {
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);

  if (!start) {
    start = [r, c];
    cell.classList.add('rat');
    cell.textContent = '🐀';
  } else if (!end && !(r === start[0] && c === start[1])) {
    end = [r, c];
    cell.classList.add('cheese');
    cell.textContent = '🧀';
//   } else {
//     let currentVal = parseInt(cell.textContent);
//     let newVal = (currentVal + 1) % 5;
//     cell.textContent = newVal;
//     maze[r][c] = newVal;
//     cell.classList.toggle('wall', newVal === 0);
//   }
} else if (!cell.classList.contains('rat') && !cell.classList.contains('cheese')) {
  let currentVal = parseInt(cell.textContent);
  let newVal = (currentVal + 1) % 5;
  cell.textContent = newVal;
  maze[r][c] = newVal;
  cell.classList.toggle('wall', newVal === 0);
}
}

async function solve() {
  if (!start || !end) {
    alert("Set rat and cheese positions first.");
    return;
  }

  let path = Array.from({ length: rows }, () => Array(cols).fill(0));
  let success = await solveJumpMaze(start[0], start[1], path);

  if (!success) {
    document.getElementById("message").textContent = "❌ No path found!";
  } else {
    document.getElementById("message").textContent = "🎉 Rat reached cheese!";
  }
}

async function solveJumpMaze(r, c, path) {
  // Check out-of-bounds or visited or wall
  if (r < 0 || c < 0 || r >= rows || c >= cols || maze[r][c] === 0 || path[r][c] === 1)
    return false;

  // Move rat to this cell
  await moveRatTo(r, c);
  await sleep(200);

  // If destination reached
  if (r === end[0] && c === end[1]) return true;

  path[r][c] = 1;

  let jump = maze[r][c];
  for (let j = 1; j <= jump; j++) {
    if (await solveJumpMaze(r + j, c, path)) return true; // Down
    if (await solveJumpMaze(r, c + j, path)) return true; // Right
  }

  return false;
}
// async function solveJumpMaze(r, c, path) {
//   if (r === end[0] && c === end[1]) {
//     markCell(r, c, true);
//     return true;
//   }

//   if (r < 0 || c < 0 || r >= rows || c >= cols || maze[r][c] === 0 || path[r][c] === 1)
//     return false;

//   path[r][c] = 1;
// //   markCell(r, c, true);
// await moveRatTo(r, c);
//   await sleep(200);

//   let jump = maze[r][c];
//   for (let j = 1; j <= jump; j++) {
//     if (await solveJumpMaze(r + j, c, path)) return true; // Down
//     if (await solveJumpMaze(r, c + j, path)) return true; // Right
//   }

// //   markCell(r, c, false);
// await moveRatTo(r, c);
//   return false;
// }
// async function moveRatTo(r, c) {
//   const index = r * cols + c;
//   const cell = document.querySelectorAll('.cell')[index];

//   // Clear previous rat cell (unless it's cheese)
//   if (prevRatCell && !prevRatCell.classList.contains('cheese'))
//     prevRatCell.classList.remove('rat');

//   // Mark current cell as rat
//   if (!cell.classList.contains('cheese')) {
//     cell.classList.add('rat');
//     cell.classList.add('visited'); // optional trail
//   }

//   prevRatCell = cell;
// }
async function moveRatTo(r, c) {
  const index = r * cols + c;
  const cell = document.querySelectorAll('.cell')[index];

  // 🧽 Clear previous rat emoji
  if (prevRatCell && !prevRatCell.classList.contains('cheese')) {
    prevRatCell.classList.remove('rat');
    // prevRatCell.textContent = maze[parseInt(prevRatCell.dataset.row)][parseInt(prevRatCell.dataset.col)];
        prevRatCell.textContent = '👣';
  }

  // 🐀 Show rat emoji on current cell
  if (!cell.classList.contains('cheese')) {
    cell.classList.add('rat');
    cell.textContent = '🐀';
    cell.classList.add('visited'); // optional trail
  }

  prevRatCell = cell;
}

// function markCell(r, c, visited) {
//   const index = r * cols + c;
//   const cell = document.querySelectorAll('.cell')[index];
//   if (!cell.classList.contains('rat') && !cell.classList.contains('cheese'))
//     cell.classList.toggle('visited', visited);
// }

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}
