const PassDevice = () => {
  const thisElement = document.querySelector('#pass-device');
  const passBtn = thisElement.querySelector('#pass-btn');

  function show() {
    thisElement.style.display = 'flex';
    passBtn.addEventListener('click', handleContinueClick);
  }

  function handleContinueClick() {
    thisElement.style.display = 'none';
  }

  return { show };
};

export default PassDevice;
