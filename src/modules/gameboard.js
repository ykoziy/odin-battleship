import Ship from './ship';
import * as util from './util';

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

  function isNotColliding(x, y, direction, shipLength) {
    //check along the entire length, not just
    if (direction === 'horizontal') {
      for (let i = 0; i < shipLength; i++) {
        if (typeof board[y][x + i] !== 'undefined') {
          if (board[y][x + i].shipType !== undefined) {
            return false;
          }
        }
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < shipLength; i++) {
        if (typeof board[y + i][x] !== 'undefined') {
          if (board[y + i][x].shipType !== undefined) {
            return false;
          }
        }
      }
    }
    return true;
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
      isNotColliding(x, y, direction, shipLength) &&
      isPlacable(x, y, direction, shipLength)
    );
  }

  function setBoardCell(x, y, shipType, index) {
    board[y][x].shipType = shipType;
    board[y][x].index = index;
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
        setBoardCell(x + i, y, shipType, i);
      }
    } else if (direction === 'vertical') {
      ship.setDirection('vertical');
      ship.setPosition(x, y);
      for (let i = 0; i < shipLength; i++) {
        setBoardCell(x, y + i, shipType, i);
      }
    }
    return true;
  }

  function isPlacable(x, y, direction, shipLength) {
    if (direction === 'horizontal') {
      //check top and bottom
      for (let i = 0; i < shipLength; i++) {
        if (y - 1 >= 0) {
          if (board[y - 1] && board[y - 1][x + i].shipType !== undefined) {
            return false;
          }
        }
        if (y + 1 < 10) {
          if (board[y + 1] && board[y + 1][x + i].shipType !== undefined) {
            return false;
          }
        }
      }

      //check left
      let cells = [
        board[y][x - 1],
        board[y - 1] && board[y - 1][x - 1],
        board[y + 1] && board[y + 1][x - 1],
      ];
      for (let i = 0; i < cells.length; i++) {
        if (typeof cells[i] !== 'undefined') {
          if (cells[i].shipType !== undefined) {
            return false;
          }
        }
      }

      //check right
      cells = [
        board[y][x + shipLength],
        board[y - 1] && board[y - 1][x + shipLength],
        board[y + 1] && board[y + 1][x + shipLength],
      ];

      for (let i = 0; i < cells.length; i++) {
        if (typeof cells[i] !== 'undefined') {
          if (cells[i].shipType !== undefined) {
            return false;
          }
        }
      }
    } else if (direction === 'vertical') {
      //check left and right
      for (let i = 0; i < shipLength; i++) {
        if (x - 1 >= 0) {
          if (board[y + i] && board[y + i][x - 1].shipType !== undefined) {
            return false;
          }
        }
        if (x + 1 < 10) {
          if (board[y + i] && board[y + i][x + 1].shipType !== undefined) {
            return false;
          }
        }
      }

      //check top
      let cells = [
        board[y - 1] && board[y - 1][x],
        board[y - 1] && board[y - 1][x - 1],
        board[y - 1] && board[y - 1][x + 1],
      ];
      for (let i = 0; i < cells.length; i++) {
        if (typeof cells[i] !== 'undefined') {
          if (cells[i].shipType !== undefined) {
            return false;
          }
        }
      }

      //check bottom
      cells = [
        board[y + shipLength] && board[y + shipLength][x],
        board[y + shipLength] && board[y + shipLength][x - 1],
        board[y + shipLength] && board[y + shipLength][x + 1],
      ];
      for (let i = 0; i < cells.length; i++) {
        if (typeof cells[i] !== 'undefined') {
          if (cells[i].shipType !== undefined) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function placeShipsRandomly() {
    let shipType = 0;
    let directions = ['horizontal', 'vertical'];
    while (shipType < 5) {
      let isPlaced = false;
      do {
        let coord = util.getRandomBoardCoordinates();
        let randomDir = directions[Math.floor(Math.random() * 2)];
        isPlaced = placeShip(coord.x, coord.y, randomDir, shipType);
      } while (!isPlaced);
      shipType++;
    }
  }

  function removeShip(shipType) {
    const ship = fleet[shipType];
    const shipLength = fleet[shipType].length;
    const pos = ship.getPosition();
    const x = pos[0];
    const y = pos[1];
    if (ship.getDirection() === 'horizontal') {
      for (let i = 0; i < shipLength; i++) {
        setBoardCell(x + i, y, undefined, undefined);
      }
    } else if (ship.getDirection() === 'vertical') {
      for (let i = 0; i < shipLength; i++) {
        setBoardCell(x, y + i, undefined, undefined);
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

  function getBoard() {
    return board;
  }

  function getCell(x, y) {
    return board[y][x];
  }

  function getShip(type) {
    return fleet[type];
  }

  return {
    placeShip,
    placeShipsRandomly,
    recieveAttack,
    missedShots,
    isFleetSunk,
    isAlreadyMissed,
    getPossibleAttacks,
    removeShip,
    reset,
    setBoard,
    getBoard,
    getCell,
    getShip,
  };
};

export default Gameboard;
