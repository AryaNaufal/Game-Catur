function isKingInCheck(kingPiece) {
    let kingPosition = findKingPosition(kingPiece);

    if (kingPosition) {
        const [kingRow, kingCol] = kingPosition;

        // Cek setiap bidak lawan, apakah ada yang bisa menyerang raja
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = initialBoard[row][col];
                if (piece && (kingPiece === 'K' ? piece === piece.toLowerCase() : piece === piece.toUpperCase())) {
                    if (getValidSquares(row, col, kingRow, kingCol, piece)) {
                        // console.log(`King ${kingPiece} skak di (${row}, ${col})`);
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function isCheckmate(kingPiece) {
    let kingPosition = findKingPosition(kingPiece);

    if (kingPosition) {
        const [kingRow, kingCol] = kingPosition;

        // Coba setiap langkah yang bisa dilakukan raja
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const newRow = kingRow + rowOffset;
                const newCol = kingCol + colOffset;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    if (getValidSquares(kingRow, kingCol, newRow, newCol, kingPiece)) {
                        // Simulasikan perpindahan untuk melihat apakah raja masih bisa diserang
                        const tempBoard = JSON.parse(JSON.stringify(initialBoard));
                        tempBoard[newRow][newCol] = kingPiece;
                        tempBoard[kingRow][kingCol] = '';

                        if (!isKingInCheckAfterMove(tempBoard, kingPiece)) {
                            return false;
                        }
                    }
                }
            }
        }

        // Jika tidak ada langkah valid, maka skakmat
        // console.log(`King ${kingPiece} skakmat`);
        return true;
    }

    return false;
}


// Fungsi pembantu untuk mencari posisi raja
function findKingPosition(kingPiece) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (initialBoard[row][col] === kingPiece) {
                return [row, col];
            }
        }
    }
    return null;
}

// Fungsi pembantu untuk cek apakah raja dalam skak setelah langkah
function isKingInCheckAfterMove(tempBoard, kingPiece) {
    let kingPosition = findKingPosition(kingPiece, tempBoard);

    if (kingPosition) {
        const [kingRow, kingCol] = kingPosition;

        // Cek apakah ada bidak lawan yang bisa menyerang raja
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = tempBoard[row][col];
                if (piece && (kingPiece === 'K' ? piece === piece.toLowerCase() : piece === piece.toUpperCase())) {
                    if (getValidSquares(row, col, kingRow, kingCol, piece, tempBoard)) {
                        return true; // Raja dalam posisi skak
                    }
                }
            }
        }
    }
    return false;
}
