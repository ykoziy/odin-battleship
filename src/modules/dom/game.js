import * as domutil from './util';

const Game = (gameElementName, playerOne, playerTwo, restartCallback) => {
  const gameBoard = document.querySelector(gameElementName);
  const nameElements = gameBoard.querySelectorAll(
    '#player-one-name, #player-two-name',
  );

  function init() {
    nameElements[0].innerText = playerOne.name;
    nameElements[1].innerText = playerTwo.name;
  }

  function displayWinner(winner) {
    const html = `
        <div id='game-over-box'>
          <h1>Game Over!</h1>
          <h2 id='won-text'>Player Wins</h2>
          <button id='restart-btn'>Restart</button>
        </div>
    `;

    const gameOverElement = document.createElement('div');

    gameOverElement.id = 'game-over';
    gameOverElement.innerHTML = html;
    domutil.insert(gameOverElement);

    const gameOverText = gameOverElement.querySelector('#won-text');

    if (winner === 1) {
      gameOverText.innerText = `Player ${playerOne.name} wins the game.`;
    } else if (winner === 2) {
      gameOverText.innerText = `Player ${playerTwo.name} wins the game.`;
    }

    gameOverElement
      .querySelector('#restart-btn')
      .addEventListener('click', restartBtnHandler);
  }

  function restartBtnHandler() {
    document.querySelector('#game-over').remove();
    if (typeof restartCallback === 'function') {
      restartCallback();
      restartCallback = null;
    }
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
