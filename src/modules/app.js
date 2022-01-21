import GameboardDOM from './dom/gameboardDom';
import ShipPlacementDom from './dom/shipPlacementDom';
import Start from './dom/start';
import GameDom from './dom/game';
import Player from './player';
import Gameboard from './gameboard';
import Game from './game';

const App = (state) => {
  let appState = state;
  let board, playerName;

  function initGameStart() {
    const gameStartElement = '#game-start';
    const startUI = Start(gameStartElement, placementMenu);
    startUI.show();
  }

  function initPlaceShips() {
    const placementElement = '#ship-placement';
    const shipPlacementUI = ShipPlacementDom(placementElement, runGame);
    shipPlacementUI.show();
  }

  function initGame() {
    document.querySelector('#game').style.display = 'flex';
    const playerBoardElement = '#player-board-container .game-board';
    const enemyBoardElement = '#enemy-board-container .game-board';

    const boardPlayer = GameboardDOM(playerBoardElement);
    boardPlayer.drawEmptyBoard();

    const boardEnemy = GameboardDOM(enemyBoardElement);
    boardEnemy.drawEmptyBoard();

    const playerOne = new Player(playerName, '');
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

  function runGame(gameBoard) {
    board = gameBoard;
    appState = 'RUN';
    initGame();
  }

  function placementMenu(name) {
    console.log('placing');
    playerName = name;
    appState = 'PLACE';
    init();
  }

  function init() {
    if (appState == 'START') {
      initGameStart();
    } else if (appState == 'PLACE') {
      initPlaceShips();
    } else if (appState == 'RUN') {
      initGame();
    }
  }

  return { init };
};

export default App;
