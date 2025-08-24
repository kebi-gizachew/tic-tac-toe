let currentPlayer = 'X';
let gameBoard = Array(9).fill('');
let gameActive = false;
let playerNames = { X: '', O: '' };
let vsComputer = false;
let playerSymbol = 'X';
let winningCells = [];

// DOM elements
const board = document.getElementById('board');
const status = document.getElementById('status');
const choiceDialog = document.getElementById('choice');
const enterDialog = document.getElementById('enter');
const resetDialog = document.getElementById('reset');
const xoroDialog = document.getElementById('xoro');
const playerForm = document.getElementById('player-form');
const resultMessage = document.getElementById('result-message');
const startbtn=document.getElementById('start')

// Winning combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// ============= INIT =============
function initGame() {
  choiceDialog.showModal();

  // Choice dialog listeners
  document.getElementById('computer').addEventListener('click', () => {
    vsComputer = true;
    safeClose(choiceDialog);
    xoroDialog.showModal();
  });

  document.getElementById('other').addEventListener('click', () => {
    vsComputer = false;
    safeClose(choiceDialog);
    enterDialog.showModal();
  });

  // X or O selection
  document.getElementById('x').addEventListener('click', () => selectSymbol('X'));
  document.getElementById('o').addEventListener('click', () => selectSymbol('O'));

  // Player form
  playerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playerNames.X = document.getElementById('player1').value || 'Player 1';
    playerNames.O = document.getElementById('player2').value || 'Player 2';
    safeClose(enterDialog);
    startGame();
  });

  // Reset button
  document.getElementById('sure').addEventListener('click', () => {
    safeClose(resetDialog);
    resetGame();
  });

  // Add listeners to board cells once
  const cells = document.querySelectorAll('#board > div');
  cells.forEach(cell => {
    const index = parseInt(cell.getAttribute('data-index'));
    cell.addEventListener('click', () => handleCellClick(index));
  });
}

// Handle player/computer symbol choice
function selectSymbol(symbol) {
  playerSymbol = symbol;
  safeClose(xoroDialog);
  playerNames = symbol === 'X'
    ? { X: "You", O: "Computer" }
    : { X: "Computer", O: "You" };
  startGame();
}

// ============= GAME LOGIC =============
function startGame() {
  gameActive = true;
  gameBoard = Array(9).fill('');
  currentPlayer = 'X';
  winningCells = [];
  renderBoard();
  updateStatus();

  // If computer starts
  if (vsComputer && currentPlayer !== playerSymbol) {
    setTimeout(computerMove, 500);
  }
}

function handleCellClick(index) {
  if (gameBoard[index] || !gameActive) return;
  if (vsComputer && currentPlayer !== playerSymbol) return;

  makeMove(index);
}

function makeMove(index) {
  gameBoard[index] = currentPlayer;
  renderBoard();

  if (checkWinner()) {
    highlightWinningCells();
    endGame(`${playerNames[currentPlayer]} wins!`);
  } else if (isBoardFull()) {
    endGame("It's a draw!");
  } else {
    switchPlayer();
    updateStatus();

    if (vsComputer && gameActive && currentPlayer !== playerSymbol) {
      setTimeout(computerMove, 500);
    }
  }
}

// ============= COMPUTER AI =============
function computerMove() {
  if (!gameActive) return;

  const move = findWinningMove(currentPlayer)
            || findBlockingMove()
            || takeCenter()
            || takeCorner()
            || takeRandom();

  if (move !== null) makeMove(move);
}

function findWinningMove(player) {
  for (const [a, b, c] of winPatterns) {
    const line = [gameBoard[a], gameBoard[b], gameBoard[c]];
    if (line.filter(v => v === player).length === 2 && line.includes('')) {
      return [a, b, c][line.indexOf('')];
    }
  }
  return null;
}

function findBlockingMove() {
  const opponent = currentPlayer === 'X' ? 'O' : 'X';
  return findWinningMove(opponent);
}

function takeCenter() {
  return gameBoard[4] === '' ? 4 : null;
}

function takeCorner() {
  const corners = [0, 2, 6, 8].filter(i => gameBoard[i] === '');
  return corners.length ? corners[Math.floor(Math.random() * corners.length)] : null;
}

function takeRandom() {
  const available = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  return available.length ? available[Math.floor(Math.random() * available.length)] : null;
}

// ============= HELPERS =============
function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      winningCells = pattern;
      return true;
    }
  }
  return false;
}

function isBoardFull() {
  return gameBoard.every(cell => cell !== '');
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateStatus() {
  if (gameActive) {
    status.textContent = `${playerNames[currentPlayer]}'s turn (${currentPlayer})`;
  }
}

function renderBoard() {
  const cells = document.querySelectorAll('#board > div');
  cells.forEach((cell, index) => {
    cell.textContent = gameBoard[index];
    cell.classList.toggle('x', gameBoard[index] === 'X');
    cell.classList.toggle('o', gameBoard[index] === 'O');
    cell.classList.remove('winning-cell');
  });
}

function highlightWinningCells() {
  winningCells.forEach(i => {
    const cell = document.querySelector(`#board > div[data-index="${i}"]`);
    cell.classList.add('winning-cell');
  });
}

function endGame(message) {
  gameActive = false;
  resultMessage.textContent = message;
  status.textContent = message;
  setTimeout(() => resetDialog.showModal(), 1000);
}

function resetGame() {
  startGame();
}

// Safely close a dialog (avoid errors if not open)
function safeClose(dialog) {
  if (dialog.open) dialog.close();
}
startbtn.addEventListener("click",()=>{
    enterDialog.close();
})
// Replace your existing form submission code with this
// ============= START APP =============
document.addEventListener('DOMContentLoaded', initGame);

        