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

    const boardReset = () => {
        for (let row = 0; row < rows; row++) {
            board[row] = [];
            for (let column = 0; column < columns; column++) {
                board[row].push(cell());
            }
        }
    };

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
        boardReset,
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

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => activePlayer = (activePlayer === players[0]) ? players[1] : players[0];

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn!`);
    };

    const gameRestart = () => {
        for (const key in boardStatuses) {
            if (key !== 'isPlacedRight') {
                boardStatuses[key] = false;
            };
        }

        activePlayer = players[0];

        board.boardReset();
    };

    const playRound = (row, column) => {
        board.writeSign(row, column, activePlayer.sign);

        const playerWinner = board.checkBoardResult(activePlayer);
        if (boardStatuses.isPlayerWon) {
            board.printBoard();
            return { playerWinner: `${playerWinner.name} is win!` };
        } else if (boardStatuses.isGameTie) {
            board.printBoard();
            return { isGameTie: 'The game is tie' };
        }
        else {
            // console.log(`${activePlayer.name} play his turn in [${row}][${column}]`);
            if (boardStatuses.isPlacedRight) switchPlayers();
            printNewRound();
            return { nothing: null };
        }
    }

    return {
        playRound,
        gameRestart,
        getActivePlayer,
        getBoard: board.getBoard
    }

})();

const screenController = function screenControllerToViewTheGame() {
    const boardScreen = document.querySelector('.board');
    const playerTurnScreen = document.querySelector('.playerTurn');

    const game = gameController;

    const screenRender = () => {
        boardScreen.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer(); 

        playerTurnScreen.textContent = `${activePlayer.name} turn now...`
        
        board.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                const cellDiv = document.createElement('div');
                let activePlayerSign = board[rowIndex][columnIndex].getSign();
                
                cellDiv.dataset.row = rowIndex;
                cellDiv.dataset.column = columnIndex;

                cellDiv.classList.add('cell');
                cellDiv.textContent = activePlayerSign;
                cellDiv.dataset.sign = activePlayerSign;
                boardScreen.appendChild(cellDiv);
            });
        });
    };

    const playEventHandler = function playEventHandlerForPlayers(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow) return;
        if (!selectedColumn) return;


        game.playRound(selectedRow, selectedColumn);
        screenRender();
    };
    boardScreen.addEventListener('click', playEventHandler);

    screenRender();

};

screenController();