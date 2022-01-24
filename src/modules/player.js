import * as util from './util';

class Player {
  constructor(name, type = '') {
    this._name = name;
    this._type = type;
    this._isPreviousHit = false;
    this._nextAttack = null;
  }

  set name(name) {
    this._name = name;
  }

  set type(type) {
    this._type = type;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  isAi() {
    return this._type === 'ai';
  }

  #isCellAlreadyHit(cell, enemyBoard) {
    if (cell.shipType !== undefined) {
      const hitIndex = cell.index;
      const ship = enemyBoard.getShip(cell.shipType);
      return ship.isPositionHit(hitIndex) === true;
    }
    return false;
  }

  #advancedAiAttack(x, y, enemyBoard) {
    const possibleMoves = enemyBoard.getPossibleAttacks(x, y);
    return function getNextMove() {
      if (possibleMoves.length !== 0) {
        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const x = possibleMoves[randomIndex][0];
        const y = possibleMoves[randomIndex][1];
        possibleMoves.splice(randomIndex, 1);
        return { x, y };
      }
    };
  }

  #cpuAttack(enemyBoard) {
    if (this._isPreviousHit) {
      //previous move was a hit try nearby cell
      const cpuMove = this._nextAttack();
      if (cpuMove === undefined) {
        this._isPreviousHit = false;
        this.#cpuAttack(enemyBoard);
      } else {
        const cell = enemyBoard.getCell(cpuMove.x, cpuMove.y);
        enemyBoard.recieveAttack(cpuMove.x, cpuMove.y);
        if (this.#isCellAlreadyHit(cell, enemyBoard)) {
          this._nextAttack = this.#advancedAiAttack(
            cpuMove.x,
            cpuMove.y,
            enemyBoard,
          );
          this._isPreviousHit = true;
        }
      }
    } else {
      //previous move was not a hit, try random cell
      const cpuMove = util.getRandomBoardCoordinates();
      const isMissed = enemyBoard.isAlreadyMissed(cpuMove.x, cpuMove.y);
      const cell = enemyBoard.getCell(cpuMove.x, cpuMove.y);

      if (isMissed || this.#isCellAlreadyHit(cell, enemyBoard)) {
        this.#cpuAttack(enemyBoard);
      } else {
        enemyBoard.recieveAttack(cpuMove.x, cpuMove.y);
        if (this.#isCellAlreadyHit(cell, enemyBoard)) {
          this._nextAttack = this.#advancedAiAttack(
            cpuMove.x,
            cpuMove.y,
            enemyBoard,
          );
          this._isPreviousHit = true;
        } else {
          this._isPreviousHit = false;
        }
      }
    }
  }

  attack(x, y, enemyBoard) {
    if (this._type === 'ai') {
      this.#cpuAttack(enemyBoard);
    } else {
      enemyBoard.recieveAttack(x, y);
    }
  }
}

export default Player;
