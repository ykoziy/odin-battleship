const Game = (gameElementName, playerOne, playerTwo) => {
  const gameBoard = document.querySelector(gameElementName);

  function init() {
    const nameElements = gameBoard.querySelectorAll(
      '#player-one-name, #player-two-name',
    );
    nameElements[0].innerText = playerOne.playerName;
    nameElements[1].innerText = playerTwo.playerName;
  }

  return { init };
};

export default Game;
