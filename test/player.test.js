import Player from '../src/modules/player';
import Gameboard from '../src/modules/gameboard';

describe('Player class', () => {
  describe('testing player vs. player game', () => {
    let playerAlice, boardAlice, playerBob, boardBob;

    beforeEach(() => {
      playerAlice = new Player('Alice');
      boardAlice = Gameboard();
      playerBob = new Player('Bob');
      boardBob = Gameboard();

      boardAlice.placeShip(0, 0, 'vertical', 0);
      boardBob.placeShip(0, 0, 'vertical', 0);
    });

    it('should allow player to attack opponents board, enemy ship hit should be recorded', () => {
      playerAlice.attack(0, 1, boardBob);
      expect(boardBob.getShip(0).getHits()).toEqual(
        expect.arrayContaining([false, true, false, false, false]),
      );
    });
  });

  describe('testing player vs. computer game', () => {
    let playerAlice, boardAlice, playerBob, boardBob;

    beforeEach(() => {
      playerAlice = new Player('Alice');
      boardAlice = Gameboard();
      playerBob = new Player('Bob', 'ai');
      boardBob = Gameboard();
    });

    it('should allow computer to make a random legal move (empty board)', () => {
      playerBob.attack(null, null, boardAlice);
      expect(boardAlice.missedShots.length).toEqual(1);
    });

    it('should allow computer to make a random legal move (every cells is a miss except 0,0)', () => {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i == 0 && j == 0) {
            continue;
          }
          boardAlice.recieveAttack(i, j);
        }
      }
      playerBob.attack(null, null, boardAlice);
      expect(boardAlice.missedShots.pop()).toMatchObject({ x: 0, y: 0 });
    });

    it('should allow computer to make a random legal move, the only valid move should be 0,0', () => {
      boardAlice.placeShip(0, 0, 'vertical', 0);
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (i == 0 && j == 1) {
            continue;
          }
          boardAlice.recieveAttack(i, j);
        }
      }

      playerBob.attack(null, null, boardAlice);
      let cell = boardAlice.getCell(0, 1);
      expect(boardAlice.getShip(cell.shipType).isPositionHit(1)).toEqual(true);
    });
  });
});
