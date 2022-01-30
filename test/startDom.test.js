/**
 * @jest-environment jsdom
 */
import Start from '../src/modules/dom/start';

describe('Start UI testing', () => {
  let startUI;

  beforeEach(() => {
    document.body.innerHTML = `
    <main id ='game-start' style='display: none;'>
      <section id='main-menu' style='display: flex;'>
        <button id='start-btn'>START</button>
        <button id='startTwo-btn'>START two player</button>
      </section>
      <section id='player-name-entry' style='display: none;'>
        <h2>Enter player name:</h2>
        <input type="text" id="player-name" name="player-name" required>
        <button id='continue-btn'>CONTINUE</button>
      </section>
    </main>
    `;
    startUI = Start('#game-start');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should unhide by calling show()', () => {
    startUI.show();
    const validateElement = document.querySelector('#game-start');
    expect(validateElement.style.display).toEqual('flex');
  });

  it('should respond on user clicking on START button, display player name entry and hide start menu', () => {
    startUI.show();
    const btnElement = document.querySelector('#start-btn');

    const validateElement = document.querySelector('#player-name-entry');
    const validateHiddenElement = document.querySelector('#main-menu');

    let evt = new Event('click');
    btnElement.dispatchEvent(evt);

    expect(validateHiddenElement.style.display).toEqual('none');
    expect(validateElement.style.display).toEqual('flex');
  });

  it('should not continue to the ship placement if no user name typed in', () => {
    startUI.show();
    const continueBtn = document.querySelector('#continue-btn');
    const startBtn = document.querySelector('#start-btn');

    const validateElement = document.querySelector('#game-start');

    let evt = new Event('click');

    startBtn.dispatchEvent(evt);
    continueBtn.dispatchEvent(evt);

    expect(validateElement.style.display).toEqual('flex');
  });

  it('should continue to the ship placement if user name provided', () => {
    startUI.show();
    const continueBtn = document.querySelector('#continue-btn');
    const startBtn = document.querySelector('#start-btn');

    const validateElement = document.querySelector('#game-start');

    let evt = new Event('click');

    startBtn.dispatchEvent(evt);

    document.getElementById('player-name').value = 'jest-test';
    continueBtn.dispatchEvent(evt);

    expect(validateElement.style.display).toEqual('none');
  });

  describe('two players mode', () => {
    let startUI;

    beforeEach(() => {
      document.body.innerHTML = `
      <main id ='game-start' style='display: none;'>
        <section id='main-menu' style='display: flex;'>
          <button id='start-btn'>START</button>
          <button id='startTwo-btn'>START two player</button>
        </section>
        <section id='player-name-entry' style='display: none;'>
          <h2>Enter player name:</h2>
          <input type="text" id="player-name" name="player-name" required>
          <button id='continue-btn'>CONTINUE</button>
        </section>
      </main>
      `;

      function testCallback() {
        return null;
      }

      startUI = Start('#game-start', testCallback, 2);
    });

    it('should get the name of the first player, then get the name of the second player', () => {
      startUI.show();
      const continueBtn = document.querySelector('#continue-btn');
      const startBtn = document.querySelector('#startTwo-btn');

      const validateElement = document.querySelector('#player-name-entry');

      let evt = new Event('click');

      startBtn.dispatchEvent(evt);

      document.getElementById('player-name').value = 'jest one';
      continueBtn.dispatchEvent(evt);

      expect(validateElement.querySelector('h2').innerText).toEqual(
        'Player two, enter your name:',
      );
    });
  });
});
