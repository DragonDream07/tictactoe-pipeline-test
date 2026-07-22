import React from 'react';
import Board from './components/Board';
import Status from './components/Status';
import ResetButton from './components/ResetButton';
import useGame from './hooks/useGame';

function App(): JSX.Element {
  const { board, status, currentPlayer, winner, isDraw, playMove, reset } =
    useGame();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Tic-Tac-Toe</h1>
      </header>
      <main className="app__main">
        <Status
          status={status}
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
        />
        <Board board={board} onCellClick={playMove} winner={winner} />
        <ResetButton onReset={reset} />
      </main>
    </div>
  );
}

export default App;
