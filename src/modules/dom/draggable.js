const Draggable = (element) => {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  );

  const scrollWidth = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth,
  );

  let dragged;
  let currentDrop = null;

  addEventListener();

  function addEventListener() {
    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('touchstart', mouseDown);

    element.addEventListener('dragstart', preventDefault);
  }

  function mouseDown(e) {
    let { x, y } = getCoords(e);
    createGhost(x, y);
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('touchend', mouseUp);

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('touchmove', mouseMove);
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
    const rect = dragged.getBoundingClientRect();
    dragged.style.left = `${x - rect.height / 2}px`;
    dragged.style.top = `${y - rect.height / 2}px`;
  }

  function mouseUp(e) {
    let x, y;
    if (e.changedTouches) {
      x = e.changedTouches[e.changedTouches.length - 1].clientX;
      y = e.changedTouches[e.changedTouches.length - 1].clientY;
    } else {
      let coords = getCoords(e);
      x = coords.x;
      y = coords.y;
    }
    dragged.hidden = true;
    let elemBelow = document.elementFromPoint(x, y);
    dragged.hidden = false;
    let fakeDrop = new CustomEvent('shipdropped', {
      detail: {
        shipType: dragged.dataset.shipType,
      },
    });
    if (elemBelow) {
      elemBelow.dispatchEvent(fakeDrop);
    }
    stop();
  }

  function stop() {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('touchmove', mouseMove);

    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('touchend', mouseUp);

    document.body.removeChild(dragged);
  }

  function getCoords(event) {
    if (event.touches) {
      if (event.touches.length != 0) {
        return { x: event.touches[0].pageX, y: event.touches[0].pageY };
      }
    } else {
      return { x: event.clientX, y: event.clientY };
    }
  }

  function mouseMove(e) {
    window.getSelection().removeAllRanges();
    let { x, y } = getCoords(e);
    if (x > 0 && x < scrollWidth && y > 0 && y < scrollHeight) {
      moveGhost(x, y);

      dragged.hidden = true;
      if (e.touches) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }
      let elemBelow = document.elementFromPoint(x, y);
      dragged.hidden = false;
      if (elemBelow && elemBelow.className === 'board-cell') {
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
      if (currentDrop) {
        leaveTarget(currentDrop);
      }
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
    document.removeEventListener('mousedown', mouseDown);
    document.removeEventListener('touchstart', mouseDown);

    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('touchmove', mouseMove);

    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('touchend', mouseUp);
    element.removeEventListener('dragstart', preventDefault);
  }

  return { unset };
};

export default Draggable;
