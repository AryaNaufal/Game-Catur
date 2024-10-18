const board = document.getElementById('board');

// Bidak Catur
const pieces = {
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟'
};

let selectedSquare = null;

// Inisialisasi awal Papan
const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Fungsi untuk membuat Papan
function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');

            // Add dark class for dark squares
            if ((row + col) % 2 === 1) {
                square.classList.add('dark');
            }

            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', handleSquareClick);
            board.appendChild(square);
            updateSquare(square, row, col);
        }
    }
}


// Fungsi untuk memperbarui Papan
function updateSquare(square, row, col) {
    const piece = initialBoard[row][col];
    square.innerHTML = piece ? pieces[piece] : '';
}


// Fungsi ketika Papan diklik
function handleSquareClick(event) {
    const square = event.target;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = initialBoard[row][col];

    // Allow selecting a piece only if it belongs to the current player
    if (selectedSquare) {
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);

        // If clicking the same square, deselect it
        if (selectedSquare === square) {
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
            clearValidSquares();
            return;
        }

        // Validasi langkah
        if (getValidSquares(fromRow, fromCol, row, col, initialBoard[fromRow][fromCol])) {
            movePiece(selectedSquare, square);
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
        } else {
            console.log('Invalid move');
        }
    } else {
        // Memeriksa bidak yang dipilih
        if (piece && ((currentPlayer === 'white' && piece === piece.toUpperCase()) ||
            (currentPlayer === 'black' && piece === piece.toLowerCase()))) {
            selectedSquare = square;
            square.classList.add('selected');

            clearValidSquares();
        }
    }
}


// Fungsi untuk membersihkan selected square
function clearValidSquares() {
    const validSquares = document.querySelectorAll('.valid');
    validSquares.forEach(square => square.classList.remove('valid'));
}

// Fungsi untuk meletakan pion yang diinginkan
function movePiece(fromSquare, toSquare) {
    const fromRow = fromSquare.dataset.row;
    const fromCol = fromSquare.dataset.col;
    const toRow = toSquare.dataset.row;
    const toCol = toSquare.dataset.col;

    const movingPiece = initialBoard[fromRow][fromCol];

    if (movingPiece) {
        initialBoard[toRow][toCol] = movingPiece;
        initialBoard[fromRow][fromCol] = '';
        updateSquare(fromSquare, fromRow, fromCol);
        updateSquare(toSquare, toRow, toCol);

        switchTurn();
    }

    fromSquare.classList.remove('selected');
}