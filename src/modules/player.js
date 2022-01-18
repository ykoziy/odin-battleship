class Player {
  constructor(playerName, playerType = '') {
    this._playerName = playerName;
    this._playerType = playerType;
    this._isPreviousHit = false;
    this._nextAttack = null;
  }

  set playerName(player_name) {
    this._playerName = player_name;
  }

  set playerType(player_type) {
    this._playerType = player_type;
  }

  get playerName() {
    return this._playerName;
  }

  get playerType() {
    return this._playerType;
  }

  isAi() {
    return this._playerType === 'ai';
  }

  //belongs here?
  #getRandomMove() {
    let y = Math.floor(Math.random() * 10);
    let x = Math.floor(Math.random() * 10);
    return { x, y };
  }

  #isCellAlreadyHit(cell, enemyBoard) {
    if (cell.shipType !== undefined) {
      const hitIndex = cell.index;
      const ship = enemyBoard.fleet[cell.shipType];
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
        const cell = enemyBoard.board[cpuMove.y][cpuMove.x];
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
      const cpuMove = this.#getRandomMove();
      const isMissed = enemyBoard.isAlreadyMissed(cpuMove.x, cpuMove.y);
      const cell = enemyBoard.board[cpuMove.y][cpuMove.x];

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
    if (this._playerType === 'ai') {
      this.#cpuAttack(enemyBoard);
    } else {
      enemyBoard.recieveAttack(x, y);
    }
  }
}

export default Player;
