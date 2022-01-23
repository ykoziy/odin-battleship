const Game = (gameElementName, playerOne, playerTwo, restartCallback) => {
  const gameBoard = document.querySelector(gameElementName);
  const gameOverElement = document.querySelector('#game-over');
  const gameOverText = gameOverElement.querySelector('#won-text');
  const gameOverRestartBtn = gameOverElement.querySelector('#restart-btn');

  function init() {
    const nameElements = gameBoard.querySelectorAll(
      '#player-one-name, #player-two-name',
    );

    gameOverRestartBtn.addEventListener('click', restartBtnHandler);

    nameElements[0].innerText = playerOne.playerName;
    nameElements[1].innerText = playerTwo.playerName;
  }

  function displayWinner(winner) {
    gameOverElement.style.display = 'flex';
    if (winner === 1) {
      gameOverText.innerText = `Player ${playerOne.playerName} wins the game.`;
    } else if (winner === 2) {
      gameOverText.innerText = `Player ${playerTwo.playerName} wins the game.`;
    }
  }

  function restartBtnHandler() {
    gameOverElement.style.display = 'none';
    restartCallback();
  }

  return { init, displayWinner };
};

export default Game;
