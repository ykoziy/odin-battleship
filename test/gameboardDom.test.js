/**
 * @jest-environment jsdom
 */
import { default as GameboardDOM } from '../src/modules/dom/gameboard';
import Gameboard from '../src/modules/gameboard';

describe('Gameboard DOM displays and lets users interact with the game board', () => {
  let gameboardUI;

  beforeEach(() => {
    document.body.innerHTML = `
    <main id='game'>
      <div id='player-board-container'>
        <h2 id='player-one-name'>Player One</h2>
        <div class='game-board'></div>
      </div>
      <div id='enemy-board-container'>
        <h2 id='player-two-name'>Player Two</h2>
        <div class='game-board'></div>
      </div>
    </main>`;

    const playerBoardElement = '#player-board-container .game-board';
    gameboardUI = GameboardDOM(playerBoardElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render empty game board, empty cells with data-x and data-y attributes', () => {
    gameboardUI.drawEmptyBoard();
    const validateElements = document.querySelectorAll('.board-cell');
    expect(validateElements.length).toEqual(100);
    expect(validateElements[10].innerHTML).toBe('');
    expect(validateElements[10].getAttribute('data-x')).toBe('0');
    expect(validateElements[10].getAttribute('data-y')).toBe('1');
  });

  describe('should update the game board DOM with logical board (vertical carrier at 0,0)', () => {
    let logicalBoard = Gameboard();
    logicalBoard.placeShip(0, 0, 'vertical', 0);

    afterEach(() => {
      logicalBoard = Gameboard();
      logicalBoard.placeShip(0, 0, 'vertical', 0);
    });

    it('should display the vertical carrier at 0,0 if not hidden', () => {
      gameboardUI.drawEmptyBoard();
      gameboardUI.updateBoard(logicalBoard, false);
      const validateElement = document.querySelector('.board-cell');
      expect(validateElement.innerHTML).toBe('<div class="ship"></div>');
    });

    it('should not display the vertical carrier at 0,0 if hidden', () => {
      gameboardUI.drawEmptyBoard();
      gameboardUI.updateBoard(logicalBoard, true);
      const validateElement = document.querySelector('.board-cell');
      expect(validateElement.innerHTML).not.toBe('<div class="ship"></div>');
    });

    it('carrier hit at 0,0. Board DOM should show the hit', () => {
      gameboardUI.drawEmptyBoard();
      logicalBoard.recieveAttack(0, 0);
      gameboardUI.updateBoard(logicalBoard, true);
      const validateElement = document.querySelector('.board-cell');
      expect(validateElement.innerHTML).toBe('<div class="hit"></div>');
    });

    it('miss at 1,0. Board DOM should show the miss', () => {
      gameboardUI.drawEmptyBoard();
      logicalBoard.recieveAttack(1, 0);
      gameboardUI.updateBoard(logicalBoard, true);
      const validateElement = document.querySelectorAll('.board-cell');
      expect(validateElement[1].innerHTML).toBe('<div class="miss"></div>');
    });
  });

  it('should add move handlers to the cells, can click on cell', () => {
    function cellClick(e) {
      e.target.innerHTML = 'cell clicked';
    }

    gameboardUI.drawEmptyBoard();
    gameboardUI.addMoveHandler(cellClick);

    const cell = document.querySelector('.board-cell');
    const evt = new Event('click');
    cell.dispatchEvent(evt);

    expect(cell.innerHTML).toBe('cell clicked');
  });

  it('should remove all move handlers from cells, clicking on cell does nothing', () => {
    function cellClick(e) {
      e.target.innerHTML = 'cell clicked';
    }

    gameboardUI.drawEmptyBoard();
    gameboardUI.addMoveHandler(cellClick);
    gameboardUI.removeAllMoveHandlers(cellClick);

    const cell = document.querySelector('.board-cell');
    const evt = new Event('click');
    cell.dispatchEvent(evt);

    expect(cell.innerHTML).not.toBe('cell clicked');
  });

  it('should reset the game board DOM to the empty board', () => {
    let logicalBoard = Gameboard();
    logicalBoard.placeShip(0, 0, 'vertical', 0);
    gameboardUI.drawEmptyBoard();
    gameboardUI.updateBoard(logicalBoard, false);
    gameboardUI.reset();

    const validateElement = document.querySelector('.board-cell');
    expect(validateElement.innerHTML).not.toBe('<div class="ship"></div>');
  });
});
