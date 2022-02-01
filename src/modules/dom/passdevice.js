const PassDevice = (callback) => {
  const thisElement = document.querySelector('#pass-device');
  const passBtn = thisElement.querySelector('#pass-btn');

  function show() {
    thisElement.style.display = 'flex';
    passBtn.addEventListener('click', handleContinueClick);
  }

  function passTo(playerName) {
    const p = thisElement.querySelector('p');
    p.innerHTML = `${playerName}, press continue when ready.`;
  }

  function handleContinueClick() {
    thisElement.style.display = 'none';
    if (typeof callback === 'function') {
      callback();
      callback = null;
    }
  }

  return { show, passTo };
};

export default PassDevice;
