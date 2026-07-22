import { useState } from 'react';

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  playMove: (index: number) => void;
  reset: () => void;
}

const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function computeWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

function computeCurrentPlayer(board: Board): Player {
  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

const EMPTY_BOARD: Board = Array(9).fill(null);

export function useGame(): GameState {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);

  const winner = computeWinner(board);
  const currentPlayer = computeCurrentPlayer(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  const playMove = (index: number): void => {
    if (board[index] !== null || winner !== null) {
      return;
    }
    const nextBoard = board.slice() as Board;
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
  };

  const reset = (): void => {
    setBoard(Array(9).fill(null));
  };

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    playMove,
    reset,
  };
}

export default useGame;
