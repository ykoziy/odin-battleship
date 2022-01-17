import App from '../app';

const ShipPlacementDom = (
  shipsElementName,
  boardElementName,
  gameBoard,
  doneCallback,
) => {
  const board = document.querySelector(boardElementName);
  const ships = document.querySelector(`${shipsElementName} #ships`);
  const placementMenu = document.querySelector(
    `${shipsElementName} #placement-menu`,
  );
  let placementCount = 5;
  let dragged;

  function drawCell(x, y) {
    let cell = document.createElement('div');
    cell.className = 'board-cell';
    cell.dataset.x = x;
    cell.dataset.y = y;
    board.appendChild(cell);
  }

  function handleShipClick(event) {
    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);
    const shipType = gameBoard.board[y][x].shipType;
    const ship = gameBoard.fleet[shipType];
    const pos = ship.getPosition();
    const shipDirection = ship.getDirection();
    let isPlaced = false;
    gameBoard.removeShip(shipType);
    if (shipDirection === 'horizontal') {
      isPlaced = gameBoard.placeShip(pos[0], pos[1], 'vertical', shipType);
    } else {
      isPlaced = gameBoard.placeShip(pos[0], pos[1], 'horizontal', shipType);
    }
    if (!isPlaced) {
      gameBoard.placeShip(pos[0], pos[1], shipDirection, shipType);
    }
    updatePlacementBoard();
  }

  function setCell(x, y, type = '') {
    const parentCell = board.querySelector(`[data-x='${x}'][data-y='${y}']`);
    parentCell.innerHTML = '';
    const innerCell = document.createElement('div');
    if (type === 'ship') {
      parentCell.addEventListener('click', handleShipClick, false);
      innerCell.className = 'ship';
      parentCell.appendChild(innerCell);
    } else {
      parentCell.removeEventListener('click', handleShipClick, false);
    }
  }

  function drawShipPlacementBoard() {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        drawCell(x, y);
      }
    }
  }

  function updatePlacementBoard() {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const gameCell = gameBoard.board[y][x];
        if (gameCell.shipType !== undefined) {
          setCell(x, y, 'ship');
        } else {
          setCell(x, y);
        }
      }
    }
  }

  function startDragHandler(event) {
    event.dataTransfer.effectAllowed = 'move';
    if (event.target.id.includes('ship-')) {
      dragged = event.target;
      event.target.style.opacity = 0.5;
    }
  }

  function endDragHandler(event) {
    //event.target.style.opacity = 1;
  }

  function dragOverHandler(event) {
    event.preventDefault();
  }

  function dragEnterHandler(event) {
    event.preventDefault();
    if (event.target.className == 'board-cell' && dragged !== undefined) {
      event.target.style.backgroundColor = 'red';
    }
  }

  function dragLeaveHandler(event) {
    if (event.target.className == 'board-cell') {
      event.target.style.backgroundColor = '';
    }
  }

  function dropHandler(event) {
    event.preventDefault();
    if (event.target.className == 'board-cell' && dragged !== undefined) {
      event.target.style.backgroundColor = '';
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);
      const shipType = Number(dragged.dataset.shipType);
      const isShipPlaced = gameBoard.placeShip(x, y, 'horizontal', shipType);
      if (isShipPlaced) {
        dragged.setAttribute('draggable', false);
        dragged.removeEventListener('dragstart', startDragHandler, false);
        updatePlacementBoard();
        placementCount--;
        dragged = undefined;
      }
      console.log(placementCount);
      if (placementCount === 0) {
        placementMenu.querySelector('#ready-btn').removeAttribute('disabled');
      }
    }
  }

  function setDragListeners() {
    Array(...ships.children).forEach((element) => {
      element.addEventListener('dragstart', startDragHandler, false);
      element.addEventListener('dragend', endDragHandler, false);
    });
    Array(...board.children).forEach((element) => {
      element.addEventListener('dragenter', dragEnterHandler, false);
      element.addEventListener('dragover', dragOverHandler, false);
      element.addEventListener('dragleave', dragLeaveHandler, false);
      element.addEventListener('drop', dropHandler, false);
    });
  }

  function reset() {
    gameBoard.reset();
    updatePlacementBoard();
  }

  function ready() {
    console.log('ready');
    const app = App('RUN', gameBoard);
    app.init();
    document.querySelector('#ship-placement').style.display = 'none';
  }

  placementMenu.querySelector('#reset-btn').addEventListener('click', reset);

  placementMenu.querySelector('#ready-btn').addEventListener('click', ready);

  return { drawShipPlacementBoard, setDragListeners };
};

export default ShipPlacementDom;
