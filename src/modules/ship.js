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

  return { hit, hitPositions, isHit, isSunk };
};

export default Ship;
