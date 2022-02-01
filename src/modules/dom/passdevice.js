import * as domutil from './util';

const PassDevice = (playerName, callback) => {
  function createHTML() {
    const passElement = document.createElement('main');
    passElement.id = 'pass-device';

    const html = `
      <h1>Pass the device</h1>
      <p>Next player press continue when ready.</p>
      <button id='pass-btn'>Continue</button>
    `;

    passElement.innerHTML = html;
    domutil.insert(passElement);
  }

  function show() {
    createHTML();
    passTo(playerName);
    document
      .querySelector('#pass-device #pass-btn')
      .addEventListener('click', handleContinueClick);
  }

  function passTo(playerName) {
    const p = document.querySelector('#pass-device p');
    p.innerHTML = `${playerName}, press continue when ready.`;
  }

  function handleContinueClick() {
    document.querySelector('#pass-device').remove();
    if (typeof callback === 'function') {
      callback();
    }
  }

  return { show };
};

export default PassDevice;
