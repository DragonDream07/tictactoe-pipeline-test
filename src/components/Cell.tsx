import React from 'react';

type CellValue = 'X' | 'O' | null;

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell?: boolean;
  row: number;
  col: number;
  isDisabled?: boolean;
}

function Cell({
  value,
  onClick,
  isWinningCell = false,
  row,
  col,
  isDisabled = false,
}: CellProps): JSX.Element {
  const label = `Row ${row}, Column ${col}, ${value ?? 'empty'}`;

  const classNames = [
    'board__cell',
    value ? 'board__cell--filled' : '',
    isWinningCell ? 'board__cell--winning' : '',
    value === 'X' ? 'board__cell--x' : '',
    value === 'O' ? 'board__cell--o' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={isDisabled || value !== null}
      aria-label={label}
      role="gridcell"
    >
      {value}
    </button>
  );
}

export default Cell;
