import Ship from './ship';

const Gameboard = () => {
  // keep track of missed attacks
  // report whether all of their ships have been sunk
  const board = createBoard();
  const missedShots = [];
  const fleet = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2)];

  function createBoard() {
    let boardArray = new Array(10);
    for (let i = 0; i < 10; i++) {
      boardArray[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
        boardArray[i][j] = {
          shipType: undefined,
          index: undefined,
        };
      }
    }
    return boardArray;
  }

  function isColliding(x, y, direction, shipLength) {
    if (direction === 'horizontal') {
      for (let i = 0; i < shipLength; i++) {
        if (typeof board[y][x + i] !== 'undefined') {
          if (board[y][x + i].shipType !== undefined) {
            return true;
          }
        }
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < shipLength; i++) {
        if (typeof board[y + i][x] !== 'undefined') {
          if (board[y + i][x].shipType !== undefined) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isWithinBounds(x, y, direction, shipLength) {
    if (direction === 'horizontal') {
      return x + shipLength <= 10;
    } else if (direction === 'vertical') {
      return y + shipLength <= 10;
    }
  }

  function isMoveValid(x, y, direction, shipLength) {
    return (
      isWithinBounds(x, y, direction, shipLength) &&
      !isColliding(x, y, direction, shipLength)
    );
  }

  function placeShip(x, y, direction, shipType) {
    const ship = fleet[shipType];
    const shipLength = fleet[shipType].length;
    if (!isMoveValid(x, y, direction, shipLength)) {
      return false;
    }
    if (direction === 'horizontal') {
      ship.setDirection('horizontal');
      ship.setPosition(x, y);
      for (let i = 0; i < shipLength; i++) {
        board[y][x + i].shipType = shipType;
        board[y][x + i].index = i;
      }
    } else if (direction === 'vertical') {
      ship.setDirection('vertical');
      ship.setPosition(x, y);
      for (let i = 0; i < shipLength; i++) {
        board[y + i][x].shipType = shipType;
        board[y + i][x].index = i;
      }
    }
    return true;
  }

  function removeShip(shipType) {
    const ship = fleet[shipType];
    const shipLength = fleet[shipType].length;
    const pos = ship.getPosition();
    const x = pos[0];
    const y = pos[1];
    if (ship.getDirection() === 'horizontal') {
      for (let i = 0; i < shipLength; i++) {
        board[y][x + i].shipType = undefined;
        board[y][x + i].index = undefined;
      }
    } else if (ship.getDirection() === 'vertical') {
      for (let i = 0; i < shipLength; i++) {
        board[y + i][x].shipType = undefined;
        board[y + i][x].index = undefined;
      }
    }
  }

  function isAlreadyMissed(x, y) {
    return missedShots.some((coord) => {
      if (coord.x === x && coord.y === y) {
        return true;
      }
    });
  }

  function isAlreadyHit(x, y) {
    const cell = board[y][x];
    if (cell.shipType !== undefined) {
      const ship = fleet[cell.shipType];
      return ship.isPositionHit(cell.index);
    }
    return false;
  }

  function recieveAttack(x, y) {
    const cell = board[y][x];
    if (cell.shipType === undefined) {
      if (!isAlreadyMissed(x, y)) {
        missedShots.push({ x: x, y: y });
      }
    } else {
      const shipAttacked = fleet[cell.shipType];
      shipAttacked.hit(cell.index);
    }
  }

  function getPossibleAttacks(x, y) {
    const movesArray = [];

    const up = [x, y + 1];
    movesArray.push(up);
    const down = [x, y - 1];
    movesArray.push(down);
    const left = [x - 1, y];
    movesArray.push(left);
    const right = [x + 1, y];
    movesArray.push(right);

    const result = movesArray.filter((coord) => {
      const inRange =
        (coord[0] <= 9 && coord[0] >= 0 && coord[1] <= 9 && coord[1] >= 0) ===
        true;
      if (inRange) {
        if (
          !isAlreadyMissed(coord[0], coord[1]) &&
          !isAlreadyHit(coord[0], coord[1])
        ) {
          return true;
        }
      }
    });
    return result;
  }

  function isFleetSunk() {
    return fleet.every((ship, index, array) => {
      return ship.isSunk();
    });
  }

  function reset() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        board[i][j] = {
          shipType: undefined,
          index: undefined,
        };
      }
    }

    while (missedShots.length > 0) {
      missedShots.pop();
    }

    const fleetLength = fleet.length;
    for (let i = 0; i < fleetLength; i++) {
      fleet.shift();
      fleet.unshift(Ship(i + 1));
    }
  }

  function setBoard(newBoard) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        board[i][j] = newBoard[i][j];
      }
    }
  }

  function getCell(x, y) {
    return board[y][x];
  }

  return {
    placeShip,
    board,
    recieveAttack,
    missedShots,
    fleet,
    isFleetSunk,
    isAlreadyMissed,
    getPossibleAttacks,
    removeShip,
    reset,
    setBoard,
    getCell,
  };
};

export default Gameboard;
