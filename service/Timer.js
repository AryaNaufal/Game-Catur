let currentPlayer = 'white';
let currentPlayerTime;
let timerInterval;

// Fungsi untuk memulai timer
function startTimer() {
    clearInterval(timerInterval);
    currentPlayerTime = 60;

    timerInterval = setInterval(() => {
        currentPlayerTime--;
        updateTimerDisplay();

        if (currentPlayerTime <= 0) {
            clearInterval(timerInterval);
            alert(`${currentPlayer === 'white' ? 'White' : 'Black'}'s time is up! Switching turns.`);
            if (selectedSquare) {
                selectedSquare.classList.remove('selected');
                selectedSquare = null;
                clearValidAndCaptureSquares();
            }
            switchTurn();
        }
    }, 1000);
}

// Fungsi untuk memperbarui display timer
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = `Time Left: ${currentPlayerTime}s`;
}

// Fungsi untuk jalan bergantian
function switchTurn() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateCurrentPlayerDisplay();
    startTimer();
}

// Fungsi untuk menampilkan player yang sedang berjalan
function updateCurrentPlayerDisplay() {
    const playerDisplay = document.getElementById('currentPlayer');
    playerDisplay.innerText = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
}

// Fungsi untuk memulai permainan
function startGame() {
    createBoard();
    updateCurrentPlayerDisplay();
    startTimer();
}

startGame();
