import GameboardDOM from './dom/gameboardDom';
import GameDom from './dom/gameDom';
import Player from './player';
import Gameboard from './gameboard';
import Game from './game';

const App = () => {
  function init() {
    const playerBoardElement = '#player-board-container .game-board';
    const enemyBoardElement = '#enemy-board-container .game-board';

    const boardPlayer = GameboardDOM(playerBoardElement);
    boardPlayer.drawEmptyBoard();

    const boardEnemy = GameboardDOM(enemyBoardElement);
    boardEnemy.drawEmptyBoard();

    const playerOne = new Player('Alice', '');
    const playerTwo = new Player('Bob', 'ai');

    const mainGameUI = GameDom('#game', playerOne, playerTwo);

    mainGameUI.init();

    function populateDummyBoards(boardOne, boardTwo) {
      boardOne.placeShip(0, 0, 'vertical', 0);
      boardOne.placeShip(3, 9, 'horizontal', 1);
      boardOne.placeShip(3, 4, 'vertical', 2);
      boardOne.placeShip(6, 5, 'horizontal', 3);
      boardOne.placeShip(8, 0, 'horizontal', 4);
      boardTwo.placeShip(0, 0, 'vertical', 0);
      boardTwo.placeShip(3, 9, 'horizontal', 1);
      boardTwo.placeShip(3, 4, 'vertical', 2);
      boardTwo.placeShip(6, 5, 'horizontal', 3);
      boardTwo.placeShip(8, 0, 'horizontal', 4);
    }

    const playerOneBoard = Gameboard();
    const playerTwoBoard = Gameboard();
    populateDummyBoards(playerOneBoard, playerTwoBoard);

    const game = Game(playerOne, playerOneBoard, playerTwo, playerTwoBoard);
    boardEnemy.addMoveHandler(game.userInput);
    game.start();
  }

  return { init };
};

export default App;
