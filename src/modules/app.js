import GameboardDOM from './dom/gameboardDom';
import ShipPlacementDom from './dom/shipPlacementDom';
import GameDom from './dom/gameDom';
import Player from './player';
import Gameboard from './gameboard';
import Game from './game';

const App = (state, board = null) => {
  function initPlaceShips() {
    document.querySelector('#ship-placement').style.display = 'flex';
    const shipPlacementElement = '#ship-board-container .ship-board';
    const shipSelectionElement = '#ship-selection';
    const board = Gameboard();

    const shipPlacementUI = ShipPlacementDom(
      shipSelectionElement,
      shipPlacementElement,
      board,
    );

    shipPlacementUI.drawShipPlacementBoard();
    shipPlacementUI.setDragListeners();
  }

  function initGame() {
    document.querySelector('#game').style.display = 'flex';
    const playerBoardElement = '#player-board-container .game-board';
    const enemyBoardElement = '#enemy-board-container .game-board';

    const boardPlayer = GameboardDOM(playerBoardElement);
    boardPlayer.drawEmptyBoard();

    const boardEnemy = GameboardDOM(enemyBoardElement);
    boardEnemy.drawEmptyBoard();

    const playerOne = new Player('Alice', '');
    const playerTwo = new Player('Bob', 'ai');

    const mainGameUI = GameDom('#game', playerOne, playerTwo);

    mainGameUI.init();

    function populateDummyBoards(boardTwo) {
      boardTwo.placeShip(0, 0, 'vertical', 0);
      boardTwo.placeShip(3, 9, 'horizontal', 1);
      boardTwo.placeShip(3, 4, 'vertical', 2);
      boardTwo.placeShip(6, 5, 'horizontal', 3);
      boardTwo.placeShip(8, 0, 'horizontal', 4);
    }

    const playerOneBoard = Gameboard();
    playerOneBoard.setBoard(board.getBoard());
    const playerTwoBoard = Gameboard();
    populateDummyBoards(playerTwoBoard);

    const game = Game(playerOne, playerOneBoard, playerTwo, playerTwoBoard);
    boardEnemy.addMoveHandler(game.userInput);
    game.start();
  }

  function init() {
    if (state == 'START') {
      console.log('start');
    } else if (state == 'PLACE') {
      initPlaceShips();
    } else if (state == 'RUN') {
      initGame();
    }
  }

  return { init };
};

export default App;
