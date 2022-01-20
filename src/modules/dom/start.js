const Start = (startMenuElement, setAppStateCallback) => {
  const startMenu = document.querySelector(startMenuElement);
  const startMain = startMenu.querySelector('#main-menu');
  const startEntry = startMenu.querySelector('#player-name-entry');
  const startBtn = startMenu.querySelector('#start-btn');
  const continueBtn = startMenu.querySelector('#continue-btn');

  let currentPage = '';

  function show() {
    currentPage = 'main-menu';
    startMenu.style.display = 'flex';
    startBtn.addEventListener('click', handleStartClick);
  }

  function showPlayerNameEntry() {
    currentPage = 'name-entry';
    startMain.style.display = 'none';
    startEntry.style.display = 'flex';
    continueBtn.addEventListener('click', handleContinueClick);
  }

  function getPlayerName() {
    const nameInput = startMenu.querySelector('#player-name');
    if (nameInput.value.length != 0) {
      startGame(nameInput.value);
    }
  }

  function startGame(playerName) {
    startEntry.style.display = 'none';
    setAppStateCallback(playerName);
  }

  function handleStartClick() {
    showPlayerNameEntry();
  }

  function handleContinueClick() {
    getPlayerName();
  }

  return { show };
};
export default Start;
