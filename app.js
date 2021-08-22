
const Game = (() => {
    let _turn = 0;
    let _players = [];

    function addPlayers(...players) {
        _players.push(...players);
    }

    function getCurrentPlayer() {
        return _players[_turn % _players.length];
    }

    function nextTurn() {
        _turn++;
    }

    function catchMark(evt) {
        // This method may need to be removed later
        const curPlayer = getCurrentPlayer();
        const ind = evt.target.dataset['ind'];
        GameBoard.markTile(ind, curPlayer.symbol);

        if (GameBoard.testBoard(curPlayer.symbol)) {
            winGame(curPlayer);
        } else if (_turn > 8) {
            tieGame();
        }
    }

    function winGame(winner) {
        console.log(`${winner.name} wins!`);
    }

    function tieGame() {
        console.log('TIE');
    }

    return {
        addPlayers, getCurrentPlayer, nextTurn,
        catchMark
    };
})();


const GameBoard = (() => {
    let board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];
    const _sideLen = 3;
    const _totalLen = board.length;


    function markTile(ind, symbol) {
        if (!_isFilledTile(ind)) {
            board[ind] = symbol;

            DisplayController.renderBoard(board);
            Game.nextTurn();
        }
    }

    function _isFilledTile(tileInd) {
        return board[tileInd] !== '';
    }

    function testBoard(symbol) {
        // Checks were not hard-coded to allow for the sake of board-size flexibility
        return (_testRows(symbol) || _testColumns(symbol) || _testDiagonals(symbol));
    }

    function _testRows(testSymbol) {
        for (let y = 0; y < _sideLen; y++) {
            let row = board.slice((y * _sideLen), ((y + 1) * _sideLen))
            if (row.every((symbol) => (symbol === testSymbol))){
                return true;
            }
        }
        return false;
    }

    function _testColumns(testSymbol) {
        for (let x = 0; x < _sideLen; x++) {
            // While ".filter()" is a more common approach,
            // using a "for..."" loop to get the columns is more (time + space) efficient
            // Notice: O(n^2) vs O(mn); where m >> n

            let col = [];
            for (let i = x; i < _totalLen; i += _sideLen) {
                col.push(board[i]);
            }
            if (col.every((symbol) => (symbol === testSymbol))){
                return true;
            }
        }
        return false;
    }

    function _testDiagonals(testSymbol) {
        let diagonal1 = [];
        for (let i = 0; i < _totalLen; i += (_sideLen + 1)) {
            diagonal1.push(board[i])
        }
        if (diagonal1.every((symbol) => (symbol === testSymbol))){
            return true;
        }

        let diagonal2 = [];
        for (let i = (_sideLen - 1); i < _totalLen - 1; i += (_sideLen - 1)) {
            diagonal2.push(board[i])
        }
        if (diagonal2.every((symbol) => (symbol === testSymbol))){
            return true;
        }

        return false;
    }

    return {
        board, markTile, testBoard
    };
})();


const PlayerFactory = (name, symbol) => {
    return {
        name, symbol
    };
};


const DisplayController = (() => {
    function renderBoard(board) {
        for(let i = 0; i < board.length; i++){
            displayTiles[i].textContent = board[i];
        }
    }

    return {
        renderBoard
    };
})();


const player1 = PlayerFactory('P1', 'X');
const player2 = PlayerFactory('P2', 'O');

Game.addPlayers(player1, player2);

const displayBoard = document.querySelector('#board');
const displayTiles = displayBoard.querySelectorAll('.board-tile');

displayBoard.addEventListener('click', Game.catchMark, true)

DisplayController.renderBoard(GameBoard.board);
