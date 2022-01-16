import Game from '../src/modules/game';
import Gameboard from '../src/modules/gameboard';
import Player from '../src/modules/player';

describe('Game', () => {
  const playerOne = new Player('Alice', '');
  const playerTwo = new Player('Bob', '');

  let boardOne = null;
  let boardTwo = null;

  let game = null;

  beforeEach(() => {
    boardOne = Gameboard();
    boardOne.placeShip(0, 0, 'vertical', 0);
    boardOne.placeShip(1, 0, 'vertical', 1);
    boardOne.placeShip(2, 0, 'vertical', 2);
    boardOne.placeShip(3, 0, 'vertical', 3);
    boardOne.placeShip(4, 0, 'vertical', 4);

    boardTwo = Gameboard();
    boardTwo.placeShip(0, 0, 'vertical', 0);
    boardTwo.placeShip(1, 0, 'vertical', 1);
    boardTwo.placeShip(2, 0, 'vertical', 2);
    boardTwo.placeShip(3, 0, 'vertical', 3);
    boardTwo.placeShip(4, 0, 'vertical', 4);

    game = Game(playerOne, boardOne, playerTwo, boardTwo);
  });

  test('getWinner() returns 0 if no winner', () => {
    expect(game.getWinner()).toEqual(0);
  });
  test('getWinner() returns 2 if player two wins', () => {
    //sink the carrier
    boardOne.recieveAttack(0, 0);
    boardOne.recieveAttack(0, 1);
    boardOne.recieveAttack(0, 2);
    boardOne.recieveAttack(0, 3);
    boardOne.recieveAttack(0, 4);

    //sink the battleship
    boardOne.recieveAttack(1, 0);
    boardOne.recieveAttack(1, 1);
    boardOne.recieveAttack(1, 2);
    boardOne.recieveAttack(1, 3);

    //sink the cruiser
    boardOne.recieveAttack(2, 0);
    boardOne.recieveAttack(2, 1);
    boardOne.recieveAttack(2, 2);

    //sink the submarine
    boardOne.recieveAttack(3, 0);
    boardOne.recieveAttack(3, 1);
    boardOne.recieveAttack(3, 2);

    //hit the destroyer
    boardOne.recieveAttack(4, 0);
    boardOne.recieveAttack(4, 1);

    expect(game.getWinner()).toEqual(2);
  });
  test('getWinner() returns 1 if player one wins', () => {
    //sink the carrier
    boardTwo.recieveAttack(0, 0);
    boardTwo.recieveAttack(0, 1);
    boardTwo.recieveAttack(0, 2);
    boardTwo.recieveAttack(0, 3);
    boardTwo.recieveAttack(0, 4);

    //sink the battleship
    boardTwo.recieveAttack(1, 0);
    boardTwo.recieveAttack(1, 1);
    boardTwo.recieveAttack(1, 2);
    boardTwo.recieveAttack(1, 3);

    //sink the cruiser
    boardTwo.recieveAttack(2, 0);
    boardTwo.recieveAttack(2, 1);
    boardTwo.recieveAttack(2, 2);

    //sink the submarine
    boardTwo.recieveAttack(3, 0);
    boardTwo.recieveAttack(3, 1);
    boardTwo.recieveAttack(3, 2);

    //hit the destroyer
    boardTwo.recieveAttack(4, 0);
    boardTwo.recieveAttack(4, 1);
    expect(game.getWinner()).toEqual(1);
  });
});
