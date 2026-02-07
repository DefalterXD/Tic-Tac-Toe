const cell = function cellDataForBoard() {
    let sign = '';

    const getSign = () => sign;

    const addSign = (player) => sign = player;

    return {
        getSign,
        addSign
    }
};

const gameBoard = function gameBoardModuleControl() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const status = {
        isPlacedRight: true,
        isPlayerWon: false,
        isGameTie: false,
    };

    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let column = 0; column < columns; column++) {
            board[row].push(cell());
        }
    }

    const checkPlayerWin = (column, playersTurnSign) => {
        const isWin = column.every(element => element.getSign() === playersTurnSign);
        return isWin;
    };

    const checkBoardResult = (playerTurn) => {
        let result = null;

        const boardWinConditions = [
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ];

        boardWinConditions.forEach(row => {
            if (checkPlayerWin(row, playerTurn.sign)) {
                status.isPlayerWon = true;
                result = playerTurn;
            }
        });

        for (let row = 0, counter = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                if (board[row][column].getSign() !== '') {
                    counter++;
                } else {
                    break;
                }
            }
            if (counter === 9) {
                status.isGameTie = true;
                break;
            }
        }
        
        return result;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getSign()));
        console.log(boardWithCellValues);
    }

    const writeSign = (row, column, player) => {

        if (board[row][column].getSign() !== '') {
            status.isPlacedRight = false;
            return;
        } else {
            status.isPlacedRight = true;
        }

        board[row][column].addSign(player);
    }

    const getBoard = () => board;

    const getStatuses = () => status;

    return {
        printBoard,
        getBoard,
        writeSign,
        getStatuses,
        checkBoardResult
    }
};


const gameController = (function gameControllerForTheGameLogic(playerOneName = 'Player one', playerTwoName = 'Player two') {

    const board = gameBoard();

    const players = [
        {
            name: playerOneName,
            sign: 'X'
        },
        {
            name: playerTwoName,
            sign: 'O'
        }
    ];

    const boardStatuses = board.getStatuses();

    let activePlayer = players[0];

    const switchPlayers = () => activePlayer = (activePlayer === players[0]) ? players[1] : players[0];

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn!`);
    }

    const playRound = (row, column) => {
        board.writeSign(row, column, activePlayer.sign);
        
        const playerWinner = board.checkBoardResult(activePlayer);
        if (boardStatuses.isPlayerWon) {
            board.printBoard();
            console.log(`${playerWinner.name} is won!`);
        } else if (boardStatuses.isGameTie) {
            board.printBoard();
            console.log('The game is tie!');
        } 
        else {
            console.log(`${activePlayer.name} play his turn in [${row}][${column}]`);
            if (boardStatuses.isPlacedRight) switchPlayers();
            printNewRound();
        }
    }

    return {
        playRound,
        activePlayer
    }

})();