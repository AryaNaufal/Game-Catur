function getValidSquares(fromRow, fromCol, toRow, toCol, piece) {
    if (!piece) return false; // Mengembalikan false jika bidak tidak ada

    const isPionKecil = piece === 'p';
    const isPionBesar = piece === 'P';
    const isRookKecil = piece === 'r';
    const isRookBesar = piece === 'R';
    const isKnightKecil = piece === 'n';
    const isKnightBesar = piece === 'N';
    const isBishopKecil = piece === 'b';
    const isBishopBesar = piece === 'B';
    const isQueenKecil = piece === 'q';
    const isQueenBesar = piece === 'Q';
    const isKingKecil = piece === 'k';
    const isKingBesar = piece === 'K';

    const direction = isPionKecil ? 1 : isPionBesar ? -1 : 0;

    // Cek gerakan pion (p atau P)
    if (isPionKecil || isPionBesar) {
        // Gerakan satu langkah
        if (toCol === fromCol && toRow === fromRow + direction) {
            return initialBoard[toRow][toCol] === ''; // Hanya bisa maju jika kotak kosong
        }
        // Gerakan dua langkah dari posisi awal
        if ((isPionKecil && fromRow === 1) || (isPionBesar && fromRow === 6)) {
            if (toCol === fromCol && toRow === fromRow + 2 * direction) {
                return initialBoard[toRow][toCol] === '' && initialBoard[fromRow + direction][fromCol] === ''; // Hanya bisa jika kedua kotak kosong
            }
        }
        // Menangkap
        if (toRow === fromRow + direction && (toCol === fromCol - 1 || toCol === fromCol + 1)) {
            const targetPiece = initialBoard[toRow][toCol];
            // Pion kecil (p) dapat menangkap bidak besar (R, N, B, Q, K) dan pion besar (P)
            // Pion besar (P) hanya dapat menangkap pion kecil (p)
            return isPionKecil ? (targetPiece && (targetPiece === targetPiece.toUpperCase() || targetPiece === 'P')) :
                (targetPiece && targetPiece === targetPiece.toLowerCase());
        }
    }


    // Cek gerakan benteng (rook)
    if (isRookKecil || isRookBesar) {
        // Gerakan lurus
        if (fromRow === toRow || fromCol === toCol) {
            // Memeriksa jalur kosong
            if (isPathClear(fromRow, fromCol, toRow, toCol)) {
                const targetPiece = initialBoard[toRow][toCol];
                // Benteng besar (R) tidak dapat menangkap bidak besar (P, R, N, B, Q, K)
                // Benteng kecil (r) tidak dapat menangkap bidak kecil (p, r, n, b, q, k)
                if (isRookBesar) {
                    return targetPiece === '' || targetPiece === targetPiece.toLowerCase(); // Hanya menangkap kosong atau bidak kecil
                }
                if (isRookKecil) {
                    return targetPiece === '' || targetPiece === targetPiece.toUpperCase(); // Hanya menangkap kosong atau bidak besar
                }
            }
        }
    }


    // Cek gerakan kuda (knight)
    if (isKnightKecil || isKnightBesar) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
            const targetPiece = initialBoard[toRow][toCol];
            // Kuda besar (N) tidak dapat menangkap bidak besar (P, R, N, B, Q, K)
            // Kuda kecil (n) tidak dapat menangkap bidak kecil (p, r, n, b, q, k)
            if (isKnightBesar) {
                return targetPiece === '' || targetPiece === targetPiece.toLowerCase(); // Hanya menangkap kosong atau bidak kecil
            }
            if (isKnightKecil) {
                return targetPiece === '' || targetPiece === targetPiece.toUpperCase(); // Hanya menangkap kosong atau bidak besar
            }
        }
    }


    // Cek gerakan gembala (bishop)
    if (isBishopKecil || isBishopBesar) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff === colDiff) { // Gembala bergerak diagonal
            if (isPathClear(fromRow, fromCol, toRow, toCol)) {
                const targetPiece = initialBoard[toRow][toCol];
                if (isBishopBesar) {
                    return targetPiece === '' || targetPiece === targetPiece.toLowerCase(); // Hanya menangkap kosong atau bidak kecil
                }
                if (isBishopKecil) {
                    return targetPiece === '' || targetPiece === targetPiece.toUpperCase(); // Hanya menangkap kosong atau bidak besar
                }
            }
        }
    }


    // Cek gerakan ratu (queen)
    if (isQueenKecil || isQueenBesar) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        // Ratu bergerak lurus atau diagonal
        if (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) {
            if (isPathClear(fromRow, fromCol, toRow, toCol)) {
                const targetPiece = initialBoard[toRow][toCol];
                // Ratu besar (Q) tidak dapat menangkap bidak besar
                // Ratu kecil (q) dapat menangkap bidak kecil
                if (isQueenBesar) {
                    return targetPiece === '' || targetPiece === targetPiece.toLowerCase(); // Hanya menangkap kosong atau bidak kecil
                } else if (isQueenKecil) {
                    return targetPiece === '' || targetPiece === targetPiece.toUpperCase(); // Hanya menangkap kosong atau bidak besar
                }
            }
        }
    }


    // Cek gerakan raja (king)
    if (isKingKecil || isKingBesar) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        // Raja bergerak satu langkah ke segala arah
        if ((rowDiff <= 1 && colDiff <= 1)) {
            const targetPiece = initialBoard[toRow][toCol];
            // Raja besar (K) tidak dapat menangkap bidak besar
            // Raja kecil (k) dapat menangkap bidak kecil
            if (isKingBesar) {
                return targetPiece === '' || targetPiece === targetPiece.toLowerCase(); // Hanya menangkap kosong atau bidak kecil
            } else if (isKingKecil) {
                return targetPiece === '' || targetPiece === targetPiece.toUpperCase(); // Hanya menangkap kosong atau bidak besar
            }
        }
    }


    // Tambahkan logika gerakan untuk bidak lainnya di sini (misalnya: ratu, raja, dll.)

    return false; // Default ke tidak valid
}

// Fungsi pembantu untuk memeriksa apakah jalur kosong untuk benteng
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = (toRow > fromRow) ? 1 : (toRow < fromRow) ? -1 : 0;
    const colStep = (toCol > fromCol) ? 1 : (toCol < fromCol) ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (initialBoard[currentRow][currentCol] !== '') {
            return false; // Jalur terhalang
        }
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true; // Jalur kosong
}
