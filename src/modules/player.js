class Player {
  constructor(playerName, playerType = '') {
    this._playerName = playerName;
    this._playerType = playerType;
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

  #cpuAttack(enemyBoard) {
    const cpuMove = this.#getRandomMove();

    const isMissed = enemyBoard.isAlreadyMissed(cpuMove.x, cpuMove.y);

    const cell = enemyBoard.board[cpuMove.y][cpuMove.x];

    if (isMissed || this.#isCellAlreadyHit(cell, enemyBoard)) {
      this.#cpuAttack(enemyBoard);
    } else {
      enemyBoard.recieveAttack(cpuMove.x, cpuMove.y);
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
