const gameBoard = (function gameBoardModuleControl() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let column = 0; column < columns; column++) {
            // board[row].push(cell());
        }
    }

    const printBoard = () => {
        // const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSign()));
        console.log(boardWithCellValues);
    }
    
    return {
        printBoard
    }
})();