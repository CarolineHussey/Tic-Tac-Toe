export default function GameOver({ winner, onRestart }) {
  return (
    <div id="game-over">
      <h2>Game Over!</h2>
      {winner && <p>{winner} wins!</p>}
      {!winner && <p>We have a draw! Well played both players!</p>}
      <button onClick={onRestart}>Rematch</button>
    </div>
  );
}
