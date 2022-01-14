import { createTestScheduler } from 'jest';
import Gameboard from '../src/modules/gameboard';

describe('Gameboard', () => {
  test('Creating a gameboard, returns 2D array 10x10. 100 squares', () => {
    const gameboard = Gameboard();
    expect(gameboard.board.length * gameboard.board[0].length).toEqual(100);
  });

  describe('placeShip() on empty board without collisions', () => {
    let testBoard = Gameboard();

    beforeEach(() => {
      testBoard = Gameboard();
    });

    it('should place the carrier (5 squares) horizontally at (2, 1)', () => {
      testBoard.placeShip(2, 1, 'horizontal', 0);
      expect(testBoard.board[1][6]).toMatchObject({
        shipType: 0,
        index: 4,
      });
    });

    test('should place the carrier (5 squares) vartically at (2, 1)', () => {
      testBoard.placeShip(2, 1, 'vertical', 0);
      expect(testBoard.board[5][2]).toMatchObject({
        shipType: 0,
        index: 4,
      });
    });
  });

  describe('placeShip() with collisions', () => {
    let testBoard = Gameboard();

    beforeEach(() => {
      testBoard = Gameboard();
    });

    it('should not place the carrier (5 squares) horizontally at (6, 1) because of border collision', () => {
      testBoard.placeShip(6, 1, 'horizontal', 0);
      expect(testBoard.board[1][6]).toMatchObject({
        shipType: undefined,
        index: undefined,
      });
    });

    it('should not place the carrier (5 squares) vertically at (6, 1) because of border collision', () => {
      testBoard.placeShip(7, 6, 'vertical', 0);
      expect(testBoard.board[6][7]).toMatchObject({
        shipType: undefined,
        index: undefined,
      });
    });

    // Horizontal ship (carrier 5 squares) at (2, 1), placing destroyer (2 squares) vertically at (2, 1), ship is not placed

    it('should not place the destroyer (2 squares) vertically at (2, 1) because of collision with carrier', () => {
      testBoard.placeShip(2, 1, 'horizontal', 0);
      testBoard.placeShip(2, 1, 'vertical', 4);
      expect(testBoard.board[2][2]).toMatchObject({
        shipType: undefined,
        index: undefined,
      });
    });

    test('should not place the destroyer (2 squares) horizontally at (2, 1) because of collision with carrier', () => {
      testBoard.placeShip(2, 1, 'horizontal', 0);
      testBoard.placeShip(2, 1, 'horizontal', 4);
      expect(testBoard.board[1][2]).toMatchObject({
        shipType: 0,
        index: 0,
      });
    });
  });

  describe('recieveAttack() test', () => {
    let testBoard = Gameboard();

    beforeEach(() => {
      testBoard = Gameboard();
    });

    it('should record a miss when hitting (1, 1) since it misses the horizontal carrier (5 squares) at (2, 1)', () => {
      testBoard.placeShip(2, 1, 'horizontal', 0);
      testBoard.recieveAttack(1, 1);
      expect(testBoard.missedShots).toEqual(
        expect.arrayContaining([{ x: 1, y: 1 }]),
      );
    });

    it('should record a miss one time only when hitting (1, 1) since it misses the horizontal carrier (5 squares) at (2, 1)', () => {
      testBoard.placeShip(2, 1, 'horizontal', 0);
      testBoard.recieveAttack(1, 1);
      testBoard.recieveAttack(1, 1);
      testBoard.recieveAttack(1, 1);
      expect(testBoard.missedShots.length).toEqual(1);
      expect(testBoard.missedShots).toEqual(
        expect.arrayContaining([{ x: 1, y: 1 }]),
      );
    });

    test('should register a hit when hitting (5, 1) to the carrier (5 squares) at (2, 1)', () => {
      testBoard.placeShip(2, 1, 'horizontal', 0);
      testBoard.recieveAttack(5, 1);
      expect(testBoard.fleet[0].isHit()).toEqual(true);
    });
  });

  describe('All five ships placed, testing isFleetSunk().', () => {
    let board = Gameboard();

    beforeEach(() => {
      board = Gameboard();
      board.placeShip(0, 0, 'vertical', 0);
      board.placeShip(1, 0, 'vertical', 1);
      board.placeShip(2, 0, 'vertical', 2);
      board.placeShip(3, 0, 'vertical', 3);
      board.placeShip(4, 0, 'vertical', 4);

      //sink the carrier
      board.recieveAttack(0, 0);
      board.recieveAttack(0, 1);
      board.recieveAttack(0, 2);
      board.recieveAttack(0, 3);
      board.recieveAttack(0, 4);

      //sink the battleship
      board.recieveAttack(1, 0);
      board.recieveAttack(1, 1);
      board.recieveAttack(1, 2);
      board.recieveAttack(1, 3);

      //sink the cruiser
      board.recieveAttack(2, 0);
      board.recieveAttack(2, 1);
      board.recieveAttack(2, 2);

      //sink the submarine
      board.recieveAttack(3, 0);
      board.recieveAttack(3, 1);
      board.recieveAttack(3, 2);

      //hit the destroyer
      board.recieveAttack(4, 0);
    });

    it('should return false if there is still one ship left alive', () => {
      expect(board.isFleetSunk()).toEqual(false);
    });

    it('should return true if all the ships are hit and sunk', () => {
      board.recieveAttack(4, 1);
      expect(board.isFleetSunk()).toEqual(true);
    });
  });
});