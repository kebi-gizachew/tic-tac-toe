      
    

   
        // Game state variables
        let currentPlayer = 'X';
        let gameBoard = ['', '', '', '', '', '', '', '', ''];
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

        // Winning combinations
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        // Initialize the game
        function initGame() {
            choiceDialog.showModal();
            
            // Event listeners for choice dialog
            document.getElementById('computer').addEventListener('click', () => {
                vsComputer = true;
                choiceDialog.close();
                xoroDialog.showModal();
            });
            
            document.getElementById('other').addEventListener('click', () => {
                vsComputer = false;
                choiceDialog.close();
                enterDialog.showModal();
            });
            
            // Event listeners for X or O selection
            document.getElementById('x').addEventListener('click', () => {
                playerSymbol = 'X';
                xoroDialog.close();
                playerNames.X = "You";
                playerNames.O = "Computer";
                startGame();
            });
            
            document.getElementById('o').addEventListener('click', () => {
                playerSymbol = 'O';
                xoroDialog.close();
                playerNames.X = "Computer";
                playerNames.O = "You";
                startGame();
            });
            
            // Event listener for player form submission
            playerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                playerNames.X = document.getElementById('player1').value || 'Player 1';
                playerNames.O = document.getElementById('player2').value || 'Player 2';
                enterDialog.close();
                startGame();
            });
            
            // Event listener for reset button
            document.getElementById('sure').addEventListener('click', () => {
                resetDialog.close();
                resetGame();
            });
            
            // Add event listeners to board cells
            const cells = document.querySelectorAll('#board > div');
            cells.forEach(cell => {
                cell.addEventListener('click', () => {
                    const index = parseInt(cell.getAttribute('data-index'));
                    if (gameBoard[index] === '' && gameActive && 
                        (!vsComputer || currentPlayer === playerSymbol)) {
                        makeMove(index);
                    }
                });
            });
        }

        // Start the game
        function startGame() {
            gameActive = true;
            updateStatus();
            
            // If playing against computer and computer goes first
            if (vsComputer && currentPlayer !== playerSymbol) {
                setTimeout(computerMove, 500);
            }
        }

        // Make a move
        function makeMove(index) {
            gameBoard[index] = currentPlayer;
            renderBoard();
            
            if (checkWinner()) {
                endGame(`${playerNames[currentPlayer]} wins!`);
                highlightWinningCells();
            } else if (isBoardFull()) {
                endGame("It's a draw!");
            } else {
                switchPlayer();
                updateStatus();
                
                // Computer's turn
                if (vsComputer && gameActive && currentPlayer !== playerSymbol) {
                    setTimeout(computerMove, 500);
                }
            }
        }

        // Computer's move (minimax algorithm for smart moves)
        function computerMove() {
            if (!gameActive) return;
            
            // Try to win
            for (let i = 0; i < 9; i++) {
                if (gameBoard[i] === '') {
                    gameBoard[i] = currentPlayer;
                    if (checkWinner()) {
                        makeMove(i);
                        return;
                    }
                    gameBoard[i] = '';
                }
            }
            
            // Block player from winning
            const opponent = currentPlayer === 'X' ? 'O' : 'X';
            for (let i = 0; i < 9; i++) {
                if (gameBoard[i] === '') {
                    gameBoard[i] = opponent;
                    if (checkWinner()) {
                        gameBoard[i] = currentPlayer;
                        makeMove(i);
                        return;
                    }
                    gameBoard[i] = '';
                }
            }
            
            // Take center if available
            if (gameBoard[4] === '') {
                makeMove(4);
                return;
            }
            
            // Take a corner if available
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(index => gameBoard[index] === '');
            if (availableCorners.length > 0) {
                const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
                makeMove(randomCorner);
                return;
            }
            
            // Take any available cell
            const availableCells = [];
            for (let i = 0; i < 9; i++) {
                if (gameBoard[i] === '') {
                    availableCells.push(i);
                }
            }
            
            if (availableCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableCells.length);
                makeMove(availableCells[randomIndex]);
            }
        }

        // Check for a winner
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

        // Check if the board is full
        function isBoardFull() {
            return gameBoard.every(cell => cell !== '');
        }

        // Switch player
        function switchPlayer() {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }

        // Update status message
        function updateStatus() {
            if (gameActive) {
                status.textContent = `${playerNames[currentPlayer]}'s turn (${currentPlayer})`;
            }
        }

        // Render the board
        function renderBoard() {
            const cells = document.querySelectorAll('#board > div');
            cells.forEach((cell, index) => {
                cell.textContent = gameBoard[index];
                if (gameBoard[index] === 'X') {
                    cell.classList.add('x');
                    cell.classList.remove('o');
                } else if (gameBoard[index] === 'O') {
                    cell.classList.add('o');
                    cell.classList.remove('x');
                } else {
                    cell.classList.remove('x', 'o');
                }
                
                // Remove winning cell highlighting
                cell.classList.remove('winning-cell');
            });
        }

        // Highlight winning cells
        function highlightWinningCells() {
            winningCells.forEach(index => {
                const cell = document.querySelector(`#board > div[data-index="${index}"]`);
                cell.classList.add('winning-cell');
            });
        }

        // End the game
        function endGame(message) {
            gameActive = false;
            resultMessage.textContent = message;
            status.textContent = message;
            setTimeout(() => resetDialog.showModal(), 1000);
        }

        // Reset the game
        function resetGame() {
            gameBoard = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            winningCells = [];
            renderBoard();
            
            if (vsComputer) {
                playerNames.X = playerSymbol === 'X' ? "You" : "Computer";
                playerNames.O = playerSymbol === 'O' ? "You" : "Computer";
                
                // If computer goes first
                if (currentPlayer !== playerSymbol) {
                    setTimeout(computerMove, 500);
                }
            }
            
            gameActive = true;
            updateStatus();
        }

        // Initialize the game when the DOM is loaded
        document.addEventListener('DOMContentLoaded', initGame);
    
