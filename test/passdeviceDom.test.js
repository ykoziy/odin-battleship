/**
 * @jest-environment jsdom
 */
import PassDevice from '../src/modules/dom/passdevice';

describe('Test pass device screen', () => {
  let passdeviceUI;

  beforeEach(() => {
    document.body.innerHTML = `
    <footer></footer>
    `;
    passdeviceUI = PassDevice();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should unhide by calling show()', () => {
    passdeviceUI.show();
    const validateElement = document.querySelector('#pass-device');
    expect(validateElement).toBeTruthy();
  });

  it('should hide by clicking on Continue', () => {
    passdeviceUI.show();
    const btnElement = document.querySelector('#pass-btn');

    let evt = new Event('click');
    btnElement.dispatchEvent(evt);
    const validateElement = document.querySelector('#pass-device');

    expect(validateElement).toBeFalsy();
  });

  it('should display "Player one, press continue when ready." when calling PassDevice("Player one", null)', () => {
    passdeviceUI = PassDevice('Player one', null);
    passdeviceUI.show();

    const validateElement = document.querySelector('#pass-device p');

    expect(validateElement.innerHTML).toBe(
      'Player one, press continue when ready.',
    );
  });
});
