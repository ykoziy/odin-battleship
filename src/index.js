import './style/style.scss';
import GameboardDOM from './modules/dom/gameboardDom';
import Gameboard from './modules/gameboard';
import Game from './modules/game';
import Player from './modules/player';

const playerBoardElement = '#player-board-container .game-board';
const enemyBoardElement = '#enemy-board-container .game-board';

const boardPlayer = GameboardDOM(playerBoardElement);
boardPlayer.drawEmptyBoard();

const boardEnemy = GameboardDOM(enemyBoardElement);
boardEnemy.drawEmptyBoard();

const playerOne = new Player('Alice', '');
const playerTwo = new Player('Bob', 'ai');

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
