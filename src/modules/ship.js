const Ship = (length) => {
  let hitPositions = new Array(length).fill(false);
  let direction = '',
    position = [];

  function hit(index) {
    hitPositions[index] = true;
  }

  function isHit() {
    return hitPositions.includes(true);
  }

  function isSunk() {
    return hitPositions.every((value) => {
      return value == true;
    });
  }

  function isPositionHit(index) {
    return hitPositions[index] == true;
  }

  function getHits() {
    return hitPositions;
  }

  function setDirection(dir) {
    direction = dir;
  }

  function getDirection() {
    return direction;
  }

  function setPosition(x, y) {
    position = [x, y];
  }

  function getPosition() {
    return position;
  }

  return {
    hit,
    isHit,
    isSunk,
    length,
    isPositionHit,
    getHits,
    setDirection,
    getDirection,
    setPosition,
    getPosition,
  };
};

export default Ship;
