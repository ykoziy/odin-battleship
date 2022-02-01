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

  function setTurnIndicator(playerName) {
    const titleElement = gameBoard.querySelector('#info-panel h2');
    titleElement.style.display = 'flex';
    titleElement.innerHTML = `${playerName}, your turn.`;
  }

  return { init, displayWinner, setTurnIndicator };
};

export default Game;
