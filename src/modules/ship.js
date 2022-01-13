const Ship = (length) => {
  let hitPositions = new Array(length).fill(false);

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

  return { hit, hitPositions, isHit, isSunk, length, isPositionHit };
};

export default Ship;
