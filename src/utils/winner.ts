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

export type Player = 'X' | 'O';
export type Board = (Player | null)[];

export interface WinnerResult {
  winner: Player;
  combination: [number, number, number];
}

export function calculateWinner(board: Board): WinnerResult | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, combination };
    }
  }
  return null;
}
