import { default as GameboardDOM } from './dom/gameboard';
import PassDevice from './dom/passdevice';

const Game = (
  playerOne,
  playerOneBoard,
  playerTwo,
  playerTwoBoard,
  displayWinnerCallback,
  setTurnCallback,
  showCallback,
  hideCallback,
) => {
  const playerBoardElement = '#player-board-container .game-board';
  const enemyBoardElement = '#enemy-board-container .game-board';

  const playerBoardUI = GameboardDOM(playerBoardElement);
  const enemyBoardUI = GameboardDOM(enemyBoardElement);

  let playerOneTurn = undefined;

  function getWinner() {
    if (playerOneBoard.isFleetSunk()) {
      return 2;
    } else if (playerTwoBoard.isFleetSunk()) {
      return 1;
    }
    return 0;
  }

  function getRandomFirstTurn() {
    return Math.random() < 0.5;
  }

  function start() {
    playerOneTurn = getRandomFirstTurn();
    if (!playerOneTurn && playerTwo.isAi()) {
      aiPlayerMove();
    } else if (!playerOneTurn && !playerTwo.isAi()) {
      setTurnCallback(2);
      passDevice(playerTwo.name);
      flipBoards();
    } else {
      if (playerTwo.isAi()) {
        update();
      } else {
        setTurnCallback(1);
        passDevice(playerOne.name);
        flipBoards();
      }
    }
  }

  function end() {
    playerOneTurn = undefined;
    displayWinnerCallback(getWinner());
    enemyBoardUI.removeAllMoveHandlers(userInput);
  }

  function update() {
    playerBoardUI.updateBoard(playerOneBoard);
    enemyBoardUI.updateBoard(playerTwoBoard, false);
    enemyBoardUI.updateMoveHandlers(playerTwoBoard, userInput);
  }

  function flipBoards() {
    if (playerOneTurn) {
      playerBoardUI.reset();
      enemyBoardUI.reset();
      playerBoardUI.updateBoard(playerOneBoard);
      enemyBoardUI.updateBoard(playerTwoBoard, false);
      enemyBoardUI.updateMoveHandlers(playerTwoBoard, userInput);
    } else {
      playerBoardUI.reset();
      enemyBoardUI.reset();
      playerBoardUI.updateBoard(playerTwoBoard);
      enemyBoardUI.updateBoard(playerOneBoard, false);
      enemyBoardUI.updateMoveHandlers(playerTwoBoard, userInput);
    }
  }

  function nextTurn() {
    playerOneTurn = !playerOneTurn;
  }

  function userInput(event) {
    let x = Number(event.target.dataset.x);
    let y = Number(event.target.dataset.y);
    gameTurn(x, y);
  }

  function aiPlayerMove() {
    if (!playerOneTurn && getWinner() === 0) {
      playerTwo.attack(0, 0, playerOneBoard);
      update();
      nextTurn();
    } else {
      end();
    }
  }

  function passDevice(playerName) {
    hideCallback();
    const pass = PassDevice(playerName, showCallback);
    pass.show();
  }

  function gameTurn(x, y) {
    if (playerOneTurn && getWinner() === 0) {
      playerOne.attack(x, y, playerTwoBoard);
      nextTurn();
      if (playerTwo.isAi()) {
        update();
        gameTurn();
      } else {
        setTurnCallback(2);
        passDevice(playerTwo.name);
        flipBoards();
      }
    } else if (!playerOneTurn && getWinner() === 0) {
      playerTwo.attack(x, y, playerOneBoard);
      nextTurn();
      if (playerTwo.isAi()) {
        update();
      } else {
        setTurnCallback(1);
        passDevice(playerOne.name);
        flipBoards();
      }
    } else {
      end();
    }
  }

  return { start, userInput };
};

export default Game;
