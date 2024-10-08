let currentPlayer = 'white'; // 'white' atau 'black'

function isInCheck(color) {
    const kingPosition = findKing(color);
    const kingRow = kingPosition.row;
    const kingCol = kingPosition.col;

    // Periksa semua bidak lawan apakah bisa menyerang raja
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = initialBoard[row][col];
            // Cek jika ini adalah bidak lawan
            if (piece && (color === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
                // Jika bidak lawan dapat menyerang raja, maka raja dalam keadaan skak
                if (getValidSquares(row, col, kingRow, kingCol, piece)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Fungsi untuk menemukan posisi raja
function findKing(color) {
    const kingChar = color === 'white' ? 'K' : 'k';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (initialBoard[row][col] === kingChar) {
                return { row, col };
            }
        }
    }
    return null; // Jika tidak ditemukan
}

function isCheckmate(color) {
    if (!isInCheck(color)) {
        return false; // Jika tidak dalam skak, tidak mungkin skakmat
    }

    // Periksa semua bidak untuk melihat apakah ada gerakan legal yang dapat dilakukan
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = initialBoard[row][col];
            if (piece && (color === 'white' ? piece === piece.toUpperCase() : piece === piece.toLowerCase())) {
                // Periksa semua gerakan legal untuk bidak ini
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        if (getValidSquares(row, col, r, c, piece)) {
                            // Simulasikan gerakan untuk memeriksa skak
                            const fromSquare = initialBoard[row][col];
                            const toSquare = initialBoard[r][c];
                            initialBoard[r][c] = piece; // Tempatkan bidak di tujuan
                            initialBoard[row][col] = ''; // Kosongkan kotak asal

                            if (!isInCheck(color)) {
                                // Jika setelah gerakan, raja tidak dalam skak, maka bukan skakmat
                                initialBoard[row][col] = piece; // Kembalikan ke posisi asal
                                initialBoard[r][c] = toSquare; // Kembalikan ke posisi asal
                                return false;
                            }

                            // Kembalikan ke posisi asal
                            initialBoard[row][col] = piece;
                            initialBoard[r][c] = toSquare;
                        }
                    }
                }
            }
        }
    }
    return true; // Jika tidak ada gerakan yang mungkin, maka skakmat
}

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

        // Cek untuk promosi pion
        if ((movingPiece === 'P' && toRow === 0) || (movingPiece === 'p' && toRow === 7)) {
            promotePawn(toSquare, movingPiece);
        }

        // Cek skakmat
        if (isCheckmate(currentPlayer)) {
            alert(`${currentPlayer === 'white' ? 'Black' : 'White'} wins by checkmate!`);
            // Reset atau akhiri permainan sesuai kebutuhan
        }

        // Ganti giliran
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    }

    fromSquare.classList.remove('selected');
}
