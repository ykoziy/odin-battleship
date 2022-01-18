function getRandomBoardCoordinates() {
  let y = Math.floor(Math.random() * 10);
  let x = Math.floor(Math.random() * 10);
  return { x, y };
}

export { getRandomBoardCoordinates };
