import Gameboard from '../gameboard';
import Draggable from './draggable';

const ShipPlacement = (placementElement, setAppStateCallback) => {
  const thisElement = document.querySelector(placementElement);
  const board = document.querySelector(`${placementElement} .ship-board`);
  const ships = document.querySelector(`${placementElement} #ships`);
  const battleshipBoard = Gameboard();
  let draggables = [];

  const placementMenu = document.querySelector(
    `${placementElement} #placement-menu`,
  );

  let placementCount = 5;

  function show() {
    thisElement.style.display = 'flex';
    if (board.querySelector('.board-cell')) {
      reset();
      return;
    }

    drawShipPlacementBoard();
    setDragListeners();

    placementMenu.querySelector('#reset-btn').addEventListener('click', reset);
    placementMenu.querySelector('#ready-btn').addEventListener('click', ready);
    placementMenu
      .querySelector('#random-btn')
      .addEventListener('click', randomPlacement);
  }

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
    const shipType = battleshipBoard.getCell(x, y).shipType;
    const ship = battleshipBoard.getShip(shipType);
    const pos = ship.getPosition();
    const shipDirection = ship.getDirection();
    let isPlaced = false;
    battleshipBoard.removeShip(shipType);
    if (shipDirection === 'horizontal') {
      isPlaced = battleshipBoard.placeShip(
        pos[0],
        pos[1],
        'vertical',
        shipType,
      );
    } else {
      isPlaced = battleshipBoard.placeShip(
        pos[0],
        pos[1],
        'horizontal',
        shipType,
      );
    }
    if (!isPlaced) {
      battleshipBoard.placeShip(pos[0], pos[1], shipDirection, shipType);
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
        const gameCell = battleshipBoard.getCell(x, y);
        if (gameCell.shipType !== undefined) {
          setCell(x, y, 'ship');
        } else {
          setCell(x, y);
        }
      }
    }
  }

  function dropHandler(event) {
    if (event.target.className == 'board-cell') {
      event.target.style.backgroundColor = '';
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);
      const shipType = Number(event.detail.shipType);
      const isShipPlaced = battleshipBoard.placeShip(
        x,
        y,
        'horizontal',
        shipType,
      );
      if (isShipPlaced) {
        draggables[Number(event.detail.shipType)].unset();
        updatePlacementBoard();
        //dragged.removeEventListener('dragstart', startDragHandler, false);
        placementCount--;
      }
      if (placementCount === 0) {
        placementMenu.querySelector('#ready-btn').removeAttribute('disabled');
      }
    }
  }

  function setDragListeners() {
    Array(...ships.children).forEach((element) => {
      draggables.push(Draggable(element));
    });

    Array(...board.children).forEach((element) => {
      element.addEventListener('shipdropped', dropHandler);
    });
  }

  function deleteDragListeners() {
    draggables.forEach((element) => {
      element.unset;
    });
    Array(...board.children).forEach((element) => {
      element.removeEventListener('shipdropped', dropHandler, false);
    });
  }

  function resetShips() {
    Array(...ships.children).forEach((element) => {
      element.setAttribute('draggable', true);
      element.style.opacity = 1;
    });
  }

  function reset() {
    placementMenu.querySelector('#ready-btn').setAttribute('disabled', false);
    battleshipBoard.reset();
    placementCount = 5;
    deleteDragListeners();
    setDragListeners();
    resetShips();
    updatePlacementBoard();
  }

  function ready() {
    thisElement.style.display = 'none';
    setAppStateCallback(battleshipBoard);
  }

  function randomPlacement() {
    deleteDragListeners();
    battleshipBoard.reset();
    resetShips();
    battleshipBoard.placeShipsRandomly();
    updatePlacementBoard();
    placementMenu.querySelector('#ready-btn').removeAttribute('disabled');
  }

  return { show };
};

export default ShipPlacement;
