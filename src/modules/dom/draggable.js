const Draggable = (element) => {
  let dragged;
  let currentDrop = null;

  addEventListener();

  function addEventListener() {
    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('dragstart', preventDefault);
  }

  function mouseDown(e) {
    let { x, y } = getCoords(e);
    createGhost(x, y);
    dragged.addEventListener('mouseup', mouseUp);
    document.addEventListener('mousemove', mouseMove);
  }

  function createGhost(x, y) {
    dragged = element.cloneNode(true);
    dragged.id = `dragging-${dragged.id.split('-')[1]}`;
    dragged.style.position = 'absolute';
    dragged.style.left = `${x}px`;
    dragged.style.top = `${y}px`;
    dragged.style.zIndex = '1000';
    dragged.style.opacity = '0.5';
    document.body.appendChild(dragged);
  }

  function moveGhost(x, y) {
    dragged.style.left = `${x}px`;
    dragged.style.top = `${y}px`;
  }

  function mouseUp(e) {
    let { x, y } = getCoords(e);
    dragged.hidden = true;
    let elemBelow = document.elementFromPoint(x, y);
    dragged.hidden = false;
    let fakeDrop = new CustomEvent('shipdropped', {
      detail: {
        shipType: dragged.dataset.shipType,
      },
    });
    elemBelow.dispatchEvent(fakeDrop);
    stop();
  }

  function stop() {
    document.removeEventListener('mousemove', mouseMove);
    document.body.removeChild(dragged);
  }

  function getCoords(event) {
    return { x: event.clientX, y: event.clientY };
  }

  function mouseMove(e) {
    window.getSelection().removeAllRanges();
    let { x, y } = getCoords(e);
    if (x > 0 && x < window.innerWidth && y > 0 && y < window.innerHeight) {
      moveGhost(x, y);
      dragged.hidden = true;
      let elemBelow = document.elementFromPoint(x, y);
      dragged.hidden = false;
      if (elemBelow.className === 'board-cell') {
        if (currentDrop != elemBelow) {
          if (currentDrop) {
            leaveTarget(currentDrop);
          }
          currentDrop = elemBelow;
          if (currentDrop) {
            enterTarget(currentDrop);
          }
        }
      } else {
        if (currentDrop) {
          leaveTarget(currentDrop);
          currentDrop = null;
        }
      }
    } else {
      stop();
    }
  }

  function enterTarget(el) {
    el.style.backgroundColor = 'red';
  }

  function leaveTarget(el) {
    el.style.backgroundColor = '';
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  function unset() {
    currentDrop = null;
    document.removeEventListener('mousemove', mouseMove);
    element.removeEventListener('mousedown', mouseDown);
    element.removeEventListener('dragstart', preventDefault);
  }

  return { unset };
};

export default Draggable;
