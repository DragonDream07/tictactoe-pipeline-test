import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps): JSX.Element {
  return (
    <button
      className="reset-button"
      onClick={onReset}
      type="button"
    >
      New Game
    </button>
  );
}

export default ResetButton;
