const board = document.getElementById('board');

// Bidak Catur
const pieces = {
    'R': '<img src="images/white rook.png" alt="White Rook" width="40" height="40">',
    'N': '<img src="images/white knight.png" alt="White Knight" width="40" height="40">',
    'B': '<img src="images/white bishop.png" alt="White Bishop" width="40" height="40">',
    'Q': '<img src="images/white queen.png" alt="White Queen" width="40" height="40">',
    'K': '<img src="images/white king.png" alt="White King" width="40" height="40">',
    'P': '<img src="images/white pawn.png" alt="White Pawn" width="40" height="40">',
    'r': '<img src="images/black rook.png" alt="Black Rook" width="40" height="40">',
    'n': '<img src="images/black knight.png" alt="Black Knight" width="40" height="40">',
    'b': '<img src="images/black bishop.png" alt="Black Bishop" width="40" height="40">',
    'q': '<img src="images/black queen.png" alt="Black Queen" width="40" height="40">',
    'k': '<img src="images/black king.png" alt="Black King" width="40" height="40">',
    'p': '<img src="images/black pawn.png" alt="Black Pawn" width="40" height="40">'
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


// Fungsi untuk menampilkan langkah yang valid
function highlightValidMoves(fromRow, fromCol, piece) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (getValidSquares(fromRow, fromCol, row, col, piece)) {
                const square = document.querySelector(`.square[data-row='${row}'][data-col='${col}']`);
                if (square) {
                    square.classList.add('valid');
                    if (initialBoard[row][col] && initialBoard[row][col] !== piece) {
                        square.classList.add('capture');
                    }
                }
            }
        }
    }
}


// Fungsi ketika Papan diklik
function handleSquareClick(event) {
    const square = event.target.closest('.square');
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = initialBoard[row][col];

    if (selectedSquare) {
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);

        if (selectedSquare === square) {
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
            clearValidAndCaptureSquares();
            return;
        }

        // Validasi langkah
        if (getValidSquares(fromRow, fromCol, row, col, initialBoard[fromRow][fromCol])) {
            movePiece(selectedSquare, square);
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
            clearValidAndCaptureSquares();
        } else {
            console.log('Invalid move');
        }
    } else {
        // Check if the selected piece belongs to the current player
        if (piece && ((currentPlayer === 'white' && piece === piece.toUpperCase()) ||
            (currentPlayer === 'black' && piece === piece.toLowerCase()))) {
            selectedSquare = square;
            square.classList.add('selected');

            clearValidAndCaptureSquares();
            highlightValidMoves(row, col, piece);
        }
    }
}


// Fungsi untuk membersihkan selected square
function clearValidAndCaptureSquares() {
    const validSquares = document.querySelectorAll('.valid, .capture');
    validSquares.forEach(square => {
        square.classList.remove('valid', 'capture');
    });
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

        // Cek apakah raja lawan dalam kondisi skak atau skakmat
        const enemyKing = currentPlayer === 'white' ? 'K' : 'k';
        if (isKingInCheck(enemyKing)) {
            if (isCheckmate(enemyKing)) {
                setTimeout(() => {
                    alert(`${currentPlayer === 'white' ? 'Black' : 'White'} wins! Checkmate!`);
                    location.reload();
                }, 200)
            } else {
                setTimeout(() => {
                    alert(`${currentPlayer === 'white' ? 'Black' : 'White'} is in check!`);
                }, 200)
            }
        }
    }

    fromSquare.classList.remove('selected');
}