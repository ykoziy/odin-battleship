/**
 * @jest-environment jsdom
 */
import PassDevice from '../src/modules/dom/passdevice';

describe('Test pass device screen', () => {
  let passdeviceUI;

  beforeEach(() => {
    document.body.innerHTML = `
    <main id ='pass-device' style='display: none;'>
      <h1>Pass the device</h1>
      <p>Next player press continue when ready.</p>
      <button id='pass-btn'>Continue</button>
    </main>  
    `;
    passdeviceUI = PassDevice();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should unhide by calling show()', () => {
    passdeviceUI.show();
    const validateElement = document.querySelector('#pass-device');
    expect(validateElement.style.display).toEqual('flex');
  });

  it('should hide by clicking on Continue', () => {
    passdeviceUI.show();
    const btnElement = document.querySelector('#pass-btn');
    const validateElement = document.querySelector('#pass-device');

    let evt = new Event('click');
    btnElement.dispatchEvent(evt);

    expect(validateElement.style.display).toEqual('none');
  });
});
