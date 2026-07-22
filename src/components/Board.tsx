import React from 'react';
import Cell from './Cell';

type CellValue = 'X' | 'O' | null;

interface BoardProps {
  board: CellValue[];
  onCellClick: (index: number) => void;
  winningCells?: number[];
}

function Board({ board, onCellClick, winningCells = [] }: BoardProps): JSX.Element {
  return (
    <div className="board" role="grid" aria-label="Tic-Tac-Toe board">
      {board.map((value, index) => {
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        return (
          <Cell
            key={index}
            value={value}
            onClick={() => onCellClick(index)}
            isWinningCell={winningCells.includes(index)}
            row={row}
            col={col}
          />
        );
      })}
    </div>
  );
}

export default Board;
