import { default as GameboardDOM } from './dom/gameboard';
import { default as ShipPlacementDom } from './dom/shipPlacement';
import Start from './dom/start';
import { default as GameDom } from './dom/game';
import Player from './player';
import Gameboard from './gameboard';
import Game from './game';
import PassDevice from './dom/passdevice';

const App = (state) => {
  let appState = state;
  let playerCount = 1;
  let gBoard, gBoardTwo, playerOneName, playerTwoName;

  function initGameStart() {
    const gameStartElement = '#game-start';
    const startUI = Start(gameStartElement, placementMenu);
    startUI.show();
  }

  function initPlaceShips() {
    const placementElement = '#ship-placement';
    if (playerCount == 1) {
      const shipPlacementUI = ShipPlacementDom(
        placementElement,
        runGame,
        playerOneName,
      );
      shipPlacementUI.show();
    } else if (playerCount == 2) {
      let shipPlacementUI = ShipPlacementDom(
        placementElement,
        getPlayerOneBoard,
        playerOneName,
      );
      shipPlacementUI.show();
    }
  }

  function initGame() {
    console.log('init game');
    document.querySelector('#game').style.display = 'flex';
    const playerBoardElement = '#player-board-container .game-board';
    const enemyBoardElement = '#enemy-board-container .game-board';

    const playerBoardUI = GameboardDOM(playerBoardElement);
    const enemyBoardUI = GameboardDOM(enemyBoardElement);

    const playerOne = new Player(playerOneName, '');
    const playerTwo =
      playerCount == 2
        ? new Player(playerTwoName, '')
        : new Player('Bob', 'ai');

    const mainGameUI = GameDom('#game', playerOne, playerTwo, startGame);

    mainGameUI.init();

    const playerOneBoard = Gameboard();
    playerOneBoard.setBoard(gBoard.getBoard());
    const playerTwoBoard = Gameboard();
    if (playerCount == 2) {
      playerTwoBoard.setBoard(gBoardTwo.getBoard());
    } else {
      playerTwoBoard.placeShipsRandomly();
    }

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
      mainGameUI.setTurnIndicator,
      mainGameUI.show,
      mainGameUI.hide,
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
    gBoard = gameBoard;
    appState = 'RUN';
    init();
  }

  function getPlayerOneBoard(gameBoard) {
    gBoard = gameBoard;
    const passdeviceDom = PassDevice(playerTwoName, getPlayerTwoBoard);
    passdeviceDom.show();
  }

  function getPlayerTwoBoard() {
    const placementElement = '#ship-placement';
    let shipPlacementUI = ShipPlacementDom(
      placementElement,
      runTwoPlayerGame,
      playerTwoName,
    );
    shipPlacementUI.show();
  }

  function runTwoPlayerGame(gameBoard) {
    gBoardTwo = gameBoard;
    appState = 'RUN';
    init();
  }

  function placementMenu(pOneName, pTwoName) {
    playerOneName = pOneName;
    if (pTwoName) {
      playerTwoName = pTwoName;
      playerCount = 2;
    }
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
