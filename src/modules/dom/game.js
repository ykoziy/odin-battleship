const Game = (gameElementName, playerOne, playerTwo, restartCallback) => {
  const gameBoard = document.querySelector(gameElementName);
  const gameOverElement = document.querySelector('#game-over');
  const gameOverText = gameOverElement.querySelector('#won-text');
  const gameOverRestartBtn = gameOverElement.querySelector('#restart-btn');
  const nameElements = gameBoard.querySelectorAll(
    '#player-one-name, #player-two-name',
  );

  function init() {
    gameOverRestartBtn.addEventListener('click', restartBtnHandler);

    nameElements[0].innerText = playerOne.name;
    nameElements[1].innerText = playerTwo.name;
  }

  function displayWinner(winner) {
    gameOverElement.style.display = 'flex';
    if (winner === 1) {
      gameOverText.innerText = `Player ${playerOne.name} wins the game.`;
    } else if (winner === 2) {
      gameOverText.innerText = `Player ${playerTwo.name} wins the game.`;
    }
  }

  function restartBtnHandler() {
    gameOverElement.style.display = 'none';
    restartCallback();
  }

  function setBoardNames(turn) {
    if (turn === 1) {
      nameElements[0].innerText = playerOne.name;
      nameElements[1].innerText = playerTwo.name;
    } else if (turn === 2) {
      nameElements[0].innerText = playerTwo.name;
      nameElements[1].innerText = playerOne.name;
    }
  }

  function setTurnIndicator(turn) {
    const titleElement = gameBoard.querySelector('#info-panel h2');
    titleElement.style.display = 'flex';
    setBoardNames(turn);
    if (turn === 1) {
      titleElement.innerHTML = `${playerOne.name}, your turn.`;
    } else if (turn === 2) {
      titleElement.innerHTML = `${playerTwo.name}, your turn.`;
    }
  }

  function hide() {
    gameBoard.style.display = 'none';
  }

  function show() {
    gameBoard.style.display = 'flex';
  }

  return { init, displayWinner, setTurnIndicator, hide, show };
};

export default Game;
