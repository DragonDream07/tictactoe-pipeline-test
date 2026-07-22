import React from 'react';

interface StatusProps {
  status: string;
}

function Status({ status }: StatusProps): JSX.Element {
  return (
    <p
      className="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {status}
    </p>
  );
}

export default Status;
