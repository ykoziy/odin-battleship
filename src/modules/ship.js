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

  function getHits() {
    return hitPositions;
  }

  return { hit, isHit, isSunk, length, isPositionHit, getHits };
};

export default Ship;
