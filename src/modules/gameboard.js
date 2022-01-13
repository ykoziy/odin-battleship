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
    if (!isMoveValid(x, y, direction, fleet[shipType].length)) {
      return;
    }
    if (direction === 'horizontal') {
      for (let i = 0; i < fleet[shipType].length; i++) {
        board[y][x + i].shipType = shipType;
        board[y][x + i].index = i;
      }
    } else if (direction === 'vertical') {
      for (let i = 0; i < fleet[shipType].length; i++) {
        board[y + i][x].shipType = shipType;
        board[y + i][x].index = i;
      }
    }
  }

  function recieveAttack(x, y) {
    if (board[y][x].shipType === undefined) {
      missedShots.push({ x: x, y: y });
    } else {
      const shipAttacked = fleet[board[y][x].shipType];
      shipAttacked.hit(board[y][x].index);
    }
  }

  function isFleetSunk() {
    return fleet.every((ship, index, array) => {
      return ship.isSunk();
    });
  }

  return { placeShip, board, recieveAttack, missedShots, fleet, isFleetSunk };
};

export default Gameboard;
