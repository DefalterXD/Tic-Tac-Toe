const cell = function cellDataForBoard() {
    let sign = '';

    const getSign = () => sign;

    const addSign = (player) => sign = player;

    return {
        getSign,
        addSign
    }
};

const gameBoard = (function gameBoardModuleControl() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let column = 0; column < columns; column++) {
            board[row].push(cell());
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSign()));
        console.log(boardWithCellValues);
    }

     const writeSign = (row, column, player) => {
        
        board[row][column].addSign(player);
    }

    const getBoard = () => board;

    return {
        printBoard,
        getBoard,
        writeSign
    }
})();


const gameController = (function gameControllerForTheGameLogic(playerOneName = 'Player one', playerTwoName = 'Player two') {

    const board = gameBoard;

    const players = [
        {
            player: playerOneName,
            sign: 'X'
        },
        {
            player: playerTwoName,
            sign: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayers = () => (activePlayer === players[0]) ? players[1] : players[0];

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn!`);
    }

    const playRound = (row, column) => {
        console.log(`${activePlayer.name} play his turn in [${row}][${column}]`)
        board.writeSign(row, column, activePlayer.sign);

        switchPlayers();
        printNewRound();
    }

    return {
        playRound,
        activePlayer
    }

})();