const GameboardDOM = (boardElementName) => {
  const gameBoard = document.querySelector(boardElementName);

  function addMoveHandler(handleMove) {
    gameBoard.querySelectorAll('.board-cell').forEach((element) => {
      element.addEventListener('click', handleMove);
    });
  }

  function drawCell(x, y) {
    let cell = document.createElement('div');
    cell.className = 'board-cell';
    cell.dataset.x = x;
    cell.dataset.y = y;
    gameBoard.appendChild(cell);
  }

  function setCell(x, y, type = '') {
    const parentCell = gameBoard.querySelector(
      `[data-x='${x}'][data-y='${y}']`,
    );
    parentCell.innerHTML = '';
    const innerCell = document.createElement('div');
    if (type === 'hit') {
      innerCell.className = 'hit';
      parentCell.appendChild(innerCell);
    } else if (type === 'miss') {
      innerCell.className = 'miss';
      parentCell.appendChild(innerCell);
    } else if (type === 'ship') {
      innerCell.className = 'ship';
      parentCell.appendChild(innerCell);
    }
  }

  function drawEmptyBoard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        drawCell(j, i);
      }
    }
  }

  function updateBoard(gameBoard) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const gameCell = gameBoard.board[y][x];
        if (gameCell.shipType !== undefined) {
          const ship = gameBoard.fleet[gameCell.shipType];
          const index = gameBoard.board[y][x].index;
          if (ship.isPositionHit(index)) {
            setCell(x, y, 'hit');
          } else {
            setCell(x, y, 'ship');
          }
        } else {
          const isMissed = gameBoard.isAlreadyMissed(x, y);
          if (isMissed) {
            setCell(x, y, 'miss');
          }
        }
      }
    }
  }

  return { drawEmptyBoard, updateBoard, addMoveHandler };
};

export default GameboardDOM;
