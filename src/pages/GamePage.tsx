import React, { useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Marker = 'X' | 'O';
type Cell = Marker | null;
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
type GameStatus = 'playing' | 'winner' | 'draw';

interface GameState {
  board: Board;
  status: GameStatus;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WINNING_COMBINATIONS: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

// ─── Utilities ────────────────────────────────────────────────────────────────

function detectWinner(board: Board): Marker | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const cell = board[a];
    if (cell !== null && cell === board[b] && cell === board[c]) {
      return cell;
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

function getCurrentPlayer(board: Board): Marker {
  const filled = board.filter((cell) => cell !== null).length;
  return filled % 2 === 0 ? 'X' : 'O';
}

function getWinningCells(board: Board): number[] {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const cell = board[a];
    if (cell !== null && cell === board[b] && cell === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

// ─── useGame hook ─────────────────────────────────────────────────────────────

interface UseGameReturn {
  board: Board;
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
  isDraw: boolean;
  winningCells: number[];
  playMove: (index: number) => void;
  reset: () => void;
}

function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>({
    board: [...EMPTY_BOARD] as Board,
    status: 'playing',
  });

  const { board, status } = gameState;

  const currentPlayer = getCurrentPlayer(board);
  const winner = detectWinner(board);
  const isDraw = status === 'draw';
  const winningCells = winner !== null ? getWinningCells(board) : [];

  const playMove = useCallback(
    (index: number) => {
      setGameState((prev) => {
        // VR-05, VR-06: reject if game is over
        if (prev.status !== 'playing') return prev;

        // VR-01: reject if cell is occupied
        if (prev.board[index] !== null) return prev;

        // VR-02, VR-04: place current player's marker
        const player = getCurrentPlayer(prev.board);
        const newBoard = prev.board.slice() as Board;
        newBoard[index] = player;

        // VR-08: check for winner
        const newWinner = detectWinner(newBoard);
        if (newWinner !== null) {
          return { board: newBoard, status: 'winner' };
        }

        // VR-09: check for draw
        if (isBoardFull(newBoard)) {
          return { board: newBoard, status: 'draw' };
        }

        // Continue playing
        return { board: newBoard, status: 'playing' };
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setGameState({
      board: [...EMPTY_BOARD] as Board,
      status: 'playing',
    });
  }, []);

  return {
    board,
    status,
    currentPlayer,
    winner,
    isDraw,
    winningCells,
    playMove,
    reset,
  };
}

// ─── Cell component ───────────────────────────────────────────────────────────

interface CellProps {
  value: Cell;
  index: number;
  isWinningCell: boolean;
  isDisabled: boolean;
  onCellClick: (index: number) => void;
}

function CellComponent({ value, index, isWinningCell, isDisabled, onCellClick }: CellProps) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const valueLabel = value !== null ? value : 'empty';
  const ariaLabel = `Row ${row}, Column ${col}, ${valueLabel}`;

  const handleClick = () => {
    onCellClick(index);
  };

  const classNames = [
    'board__cell',
    value === 'X' ? 'board__cell--x' : '',
    value === 'O' ? 'board__cell--o' : '',
    value !== null ? 'board__cell--filled' : '',
    isWinningCell ? 'board__cell--winning' : '',
    isDisabled ? 'board__cell--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      aria-label={ariaLabel}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {value}
    </button>
  );
}

// ─── Board component ──────────────────────────────────────────────────────────

interface BoardProps {
  board: Board;
  winningCells: number[];
  isDisabled: boolean;
  onCellClick: (index: number) => void;
}

function Board({ board, winningCells, isDisabled, onCellClick }: BoardProps) {
  return (
    <section
      className="board"
      role="grid"
      aria-label="Tic-Tac-Toe board"
    >
      {board.map((cell, index) => (
        <CellComponent
          key={index}
          value={cell}
          index={index}
          isWinningCell={winningCells.includes(index)}
          isDisabled={isDisabled || cell !== null}
          onCellClick={onCellClick}
        />
      ))}
    </section>
  );
}

// ─── Status component ─────────────────────────────────────────────────────────

interface StatusProps {
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
}

function Status({ status, currentPlayer, winner }: StatusProps) {
  let message: string;

  if (status === 'winner') {
    message = `${winner} wins!`;
  } else if (status === 'draw') {
    message = "It's a draw!";
  } else {
    message = `${currentPlayer}'s turn`;
  }

  const classNames = [
    'status',
    status === 'winner' ? 'status--winner' : '',
    status === 'draw' ? 'status--draw' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <p
      className={classNames}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </p>
  );
}

// ─── ResetButton component ────────────────────────────────────────────────────

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      type="button"
      className="reset-button"
      onClick={onReset}
    >
      Reset
    </button>
  );
}

// ─── Inline styles as a <style> tag driven by design tokens ───────────────────
// Per SKILL.md, no inline styles. We inject a <style> block once with
// CSS custom properties mirroring design-tokens.json.

const CSS = `
  :root {
    --color-bg-app: #0f172a;
    --color-bg-surface: #1e293b;
    --color-bg-board: #111827;
    --color-bg-cell: #1f2937;
    --color-bg-cell-hover: #374151;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
    --color-marker-x: #38bdf8;
    --color-marker-o: #fb7185;
    --color-accent-primary: #6366f1;
    --color-accent-hover: #4f46e5;
    --color-accent-focus-ring: #818cf8;
    --color-border-default: #334155;
    --color-border-strong: #475569;
    --color-state-win: #22c55e;
    --color-state-win-bg: #14532d;
    --color-state-draw: #eab308;
    --color-text-on-accent: #ffffff;

    --radius-board: 1rem;
    --radius-cell: 0.5rem;
    --radius-button: 0.5rem;

    --shadow-board: 0 12px 32px rgba(0, 0, 0, 0.45);
    --shadow-focus: 0 0 0 3px rgba(129, 140, 248, 0.6);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.35);

    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    --font-base: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Courier New', monospace;

    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-2xl: 2rem;
    --font-size-title: 2.5rem;
    --font-size-marker: 3rem;

    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    --transition-base: 180ms ease-out;
    --transition-fast: 120ms ease-out;
    --transition-slow: 300ms ease-in-out;
    --transition-button: background-color 180ms ease-out, box-shadow 180ms ease-out;
    --transition-cell: background-color 120ms ease-out, transform 120ms ease-out;

    --board-size: min(90vw, 420px);
    --board-gap: 0.5rem;
    --board-padding: 0.5rem;
    --cell-size: min(28vw, 128px);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-base);
    background-color: var(--color-bg-app);
    color: var(--color-text-primary);
    min-height: 100vh;
  }

  .game-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-lg);
  }

  .game-page__header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }

  .game-page__title {
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    line-height: 1.1;
  }

  .game-page__subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
  }

  .game-page__main {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .status {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    min-height: 1.75rem;
    text-align: center;
    color: var(--color-text-primary);
    transition: color var(--transition-base);
  }

  .status--winner {
    color: var(--color-state-win);
  }

  .status--draw {
    color: var(--color-state-draw);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--board-gap);
    width: var(--board-size);
    aspect-ratio: 1 / 1;
    background-color: var(--color-bg-board);
    padding: var(--board-padding);
    border-radius: var(--radius-board);
    box-shadow: var(--shadow-board);
  }

  .board__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-cell);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-cell);
    font-family: var(--font-base);
    font-size: var(--font-size-marker);
    font-weight: var(--font-weight-bold);
    aspect-ratio: 1 / 1;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: var(--transition-cell);
    line-height: 1;
  }

  .board__cell:hover:not(:disabled) {
    background-color: var(--color-bg-cell-hover);
    transform: scale(1.03);
  }

  .board__cell:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  .board__cell--x {
    color: var(--color-marker-x);
  }

  .board__cell--o {
    color: var(--color-marker-o);
  }

  .board__cell--filled {
    cursor: default;
  }

  .board__cell--winning {
    background-color: var(--color-state-win-bg);
    border-color: var(--color-state-win);
  }

  .board__cell--disabled {
    cursor: not-allowed;
  }

  .board__cell:disabled {
    opacity: 1;
  }

  .reset-button {
    background-color: var(--color-accent-primary);
    color: var(--color-text-on-accent);
    border: none;
    border-radius: var(--radius-button);
    padding: 0.75rem 1.5rem;
    font-family: var(--font-base);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    transition: var(--transition-button);
  }

  .reset-button:hover {
    background-color: var(--color-accent-hover);
  }

  .reset-button:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  .game-page__footer {
    margin-top: var(--spacing-xl);
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    text-align: center;
  }

  @media (max-width: 480px) {
    .game-page__title {
      font-size: var(--font-size-2xl);
    }

    .board__cell {
      font-size: 2.25rem;
    }
  }
`;

// ─── GamePage ─────────────────────────────────────────────────────────────────

export default function GamePage() {
  const { board, status, currentPlayer, winner, isDraw, winningCells, playMove, reset } = useGame();

  const isBoardDisabled = status !== 'playing';

  return (
    <>
      <style>{CSS}</style>
      <div className="game-page">
        <header className="game-page__header">
          <h1 className="game-page__title">Tic-Tac-Toe</h1>
          <p className="game-page__subtitle">Two-player · pass and play</p>
        </header>

        <main className="game-page__main">
          <Status
            status={status}
            currentPlayer={currentPlayer}
            winner={winner}
          />

          <Board
            board={board}
            winningCells={winningCells}
            isDisabled={isBoardDisabled}
            onCellClick={playMove}
          />

          <ResetButton onReset={reset} />
        </main>

        <footer className="game-page__footer">
          <p>A two-player game · no persistence</p>
        </footer>
      </div>
    </>
  );
}
