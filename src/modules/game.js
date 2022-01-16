import GameboardDOM from './dom/gameboardDom';

const Game = (playerOne, playerOneBoard, playerTwo, playerTwoBoard) => {
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
    if (!playerOneTurn) {
      aiPlayerMove();
    } else {
      update();
    }
  }

  function end() {
    playerOneTurn = undefined;
    console.log(`Winner is ${getWinner()}`);
    enemyBoardUI.removeAllMoveHandlers(userInput);
  }

  function update() {
    playerBoardUI.updateBoard(playerOneBoard);
    enemyBoardUI.updateBoard(playerTwoBoard);
  }

  function nextTurn() {
    playerOneTurn = !playerOneTurn;
  }

  function userInput(event) {
    let x = Number(event.target.dataset.x);
    let y = Number(event.target.dataset.y);
    event.target.removeEventListener('click', userInput);
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

  function gameTurn(x, y) {
    if (playerOneTurn && getWinner() === 0) {
      playerOne.attack(x, y, playerTwoBoard);
      update();
      nextTurn();
      gameTurn();
    } else if (!playerOneTurn && getWinner() === 0) {
      playerTwo.attack(0, 0, playerOneBoard);
      update();
      nextTurn();
    } else {
      end();
    }
  }

  return { getWinner, start, userInput };
};

export default Game;
