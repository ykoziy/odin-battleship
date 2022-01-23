import { default as GameboardDOM } from './dom/gameboard';
import { default as ShipPlacementDom } from './dom/shipPlacement';
import Start from './dom/start';
import { default as GameDom } from './dom/game';
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

    const playerBoardUI = GameboardDOM(playerBoardElement);
    const enemyBoardUI = GameboardDOM(enemyBoardElement);

    const playerOne = new Player(playerName, '');
    const playerTwo = new Player('Bob', 'ai');

    const mainGameUI = GameDom('#game', playerOne, playerTwo, startGame);

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
    //populateDummyBoards(playerTwoBoard);
    playerTwoBoard.placeShipsRandomly();

    if (
      !document.querySelector(`${playerBoardElement} .board-cell`) &&
      !document.querySelector(`${enemyBoardElement} .board-cell`)
    ) {
      playerBoardUI.drawEmptyBoard();
      enemyBoardUI.drawEmptyBoard();
    } else {
      playerBoardUI.reset();
      enemyBoardUI.reset();
    }

    const game = Game(
      playerOne,
      playerOneBoard,
      playerTwo,
      playerTwoBoard,
      mainGameUI.displayWinner,
    );
    enemyBoardUI.addMoveHandler(game.userInput);
    game.start();
  }

  function startGame() {
    document.querySelector('#game').style.display = 'none';
    appState = 'START';
    init();
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
