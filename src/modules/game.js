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
  let isPaused = false;

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
    enemyBoardUI.updateBoard(playerTwoBoard, true);
    enemyBoardUI.updateMoveHandlers(playerTwoBoard, userInput);
  }

  function flipBoards() {
    if (playerOneTurn) {
      playerBoardUI.reset();
      enemyBoardUI.reset();
      playerBoardUI.updateBoard(playerOneBoard);
      enemyBoardUI.updateBoard(playerTwoBoard, true);
      enemyBoardUI.updateMoveHandlers(playerTwoBoard, userInput);
    } else {
      playerBoardUI.reset();
      enemyBoardUI.reset();
      playerBoardUI.updateBoard(playerTwoBoard);
      enemyBoardUI.updateBoard(playerOneBoard, true);
      enemyBoardUI.updateMoveHandlers(playerOneBoard, userInput);
    }
  }

  function nextTurn() {
    playerOneTurn = !playerOneTurn;
  }

  function userInput(event) {
    if (!isPaused) {
      let x = Number(event.target.dataset.x);
      let y = Number(event.target.dataset.y);
      gameTurn(x, y);
    }
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

  function wait(waitTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        isPaused = false;
        resolve(true);
      }, waitTime);
    });
  }

  async function playerTurn(player, playerName) {
    isPaused = true;
    if (player == 1) {
      enemyBoardUI.updateBoard(playerOneBoard, true);
    } else {
      enemyBoardUI.updateBoard(playerTwoBoard, true);
    }
    await wait(1500);
    setTurnCallback(player);
    passDevice(playerName);
    flipBoards();
  }

  function gameTurn(x, y) {
    if (playerOneTurn && getWinner() === 0) {
      playerOne.attack(x, y, playerTwoBoard);
      if (getWinner() !== 0) {
        end();
        return;
      }
      nextTurn();
      if (playerTwo.isAi()) {
        update();
        gameTurn();
      } else {
        playerTurn(2, playerTwo.name);
      }
    } else if (!playerOneTurn && getWinner() === 0) {
      playerTwo.attack(x, y, playerOneBoard);
      if (getWinner() !== 0) {
        end();
        return;
      }
      nextTurn();
      if (playerTwo.isAi()) {
        update();
      } else {
        playerTurn(1, playerOne.name);
      }
    } else {
      end();
    }
  }

  return { start, userInput };
};

export default Game;
