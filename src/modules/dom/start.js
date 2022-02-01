const Start = (startMenuElement, setAppStateCallback) => {
  const startMenu = document.querySelector(startMenuElement);
  const startMain = startMenu.querySelector('#main-menu');
  const startEntry = startMenu.querySelector('#player-name-entry');
  const startBtn = startMenu.querySelector('#start-btn');
  const startTwoBtn = startMenu.querySelector('#startTwo-btn');
  const continueBtn = startMenu.querySelector('#continue-btn');

  let currentPage = '';
  let playerInputNum = 1;
  let numPlayers = 1;
  let playerOneName, playerTwoName;

  function show() {
    currentPage = 'main-menu';
    startMenu.style.display = 'flex';
    startMain.style.display = 'flex';
    startEntry.style.display = 'none';
    startBtn.addEventListener('click', handleStartClick);
    startTwoBtn.addEventListener('click', handleStartTwoClick);
  }

  function showPlayerNameEntry(playerEntry) {
    const nameInput = startMenu.querySelector('#player-name');
    nameInput.value = '';
    currentPage = 'name-entry';
    startMain.style.display = 'none';
    startEntry.style.display = 'flex';
    startEntry.querySelector(
      'h2',
    ).innerText = `${playerEntry}, enter your name:`;
    continueBtn.addEventListener('click', handleContinueClick);
  }

  function getPlayerName() {
    const nameInput = startMenu.querySelector('#player-name');
    if (nameInput.value.length != 0) {
      return nameInput.value;
    }
  }

  function startGame(playerName) {
    destroy();
    if (typeof setAppStateCallback === 'function') {
      setAppStateCallback(playerName);
      setAppStateCallback = null;
    }
  }

  function startTwoPlayerGame(playerOneName, playerTwoName) {
    destroy();
    if (typeof setAppStateCallback === 'function') {
      setAppStateCallback(playerOneName, playerTwoName);
      setAppStateCallback = null;
    }
  }

  function handleStartClick() {
    showPlayerNameEntry('Player one');
  }

  function handleStartTwoClick() {
    numPlayers = 2;
    showPlayerNameEntry('Player one');
  }

  function handleContinueClick() {
    if (numPlayers == 1) {
      let playerName = getPlayerName();
      if (playerName) {
        startGame(playerName);
      }
    } else if (numPlayers == 2) {
      console.log(playerInputNum);
      if (playerInputNum == 1) {
        playerOneName = getPlayerName();
        console.log(`get p1 ${playerOneName}`);
        if (playerOneName) {
          playerInputNum = 2;
          showPlayerNameEntry('Player two');
        }
      } else if (playerInputNum == 2) {
        playerTwoName = getPlayerName();
        console.log(`get p2 ${playerTwoName}`);
        if (playerTwoName) {
          startTwoPlayerGame(playerOneName, playerTwoName);
        }
      }
    }
  }

  function destroy() {
    startMenu.style.display = 'none';
    removehandlers();
  }

  function removehandlers() {
    startBtn.removeEventListener('click', handleStartClick);
    startTwoBtn.removeEventListener('click', handleStartTwoClick);
    continueBtn.removeEventListener('click', handleContinueClick);
  }

  return { show };
};
export default Start;
