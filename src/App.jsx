import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import { useState } from "react";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

//CONSTANTS
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

//HELPER FUNCTIONS
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  //See handleSquareSelection below for structure of gameTurns
  for (const t of gameTurns) {
    const { square, player } = t;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  return gameBoard;
}

//DETERMINE WINNER
function deriveWinner(gameBoard, players) {
  let winner;

  for (const combo of WINNING_COMBINATIONS) {
    //Lookup the symbol that is placed on the game board in a position derived from the winning combinations.
    const firstSquareSymbol = gameBoard[combo[0].row][combo[0].column];
    const secondSquareSymbol = gameBoard[combo[1].row][combo[1].column];
    const thirdSquareSymbol = gameBoard[combo[2].row][combo[2].column];

    //Compare the symbols to check for a winning combination.
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      //we have a winner!
      winner = [players[firstSquareSymbol]];
    }
  }

  return winner;
}

//APP
function App() {
  //STATE
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  //DERIVED STATE
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);

  const isDraw = gameTurns.length === 9 && !winner;

  //EVENT HANDLERS
  function handleSquareSelection(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  // RENDER
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || isDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard
          onSquareSelection={handleSquareSelection}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
