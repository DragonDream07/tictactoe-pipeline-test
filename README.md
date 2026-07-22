# tic-tac-toe

Two-player 3x3 Tic-Tac-Toe game — React + TypeScript, client-side only

> React (vite)

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React + TypeScript (bundled with vite) |

## Project structure

### Frontend

```text
index.html - Vite entry; mounts #root and loads /src/main.tsx
vite.config.ts - React plugin; no backend proxy (client-side only)
src/
  main.tsx - bootstrap: create React root, render <App/> into #root, import global styles
  App.tsx - top-level: router + layout (header, Status, Board, ResetButton); owns useGame
  pages/
    GamePage.tsx - route game
    AboutPage.tsx - route about
  components/
    Board.tsx - renders the 3x3 grid by mapping board[] to nine Cell components
    Cell.tsx - single cell as a button showing X / O / empty; presentational
    Status.tsx - shows current status (X's turn / O wins / Draw) via an aria-live region
    ResetButton.tsx - reset control; calls onReset to start a new game
  hooks/
    useGame.ts - single source of game state: board, currentPlayer, winner, isDraw, playMove, reset
  utils/
    winner.ts - pure winner detection: 8 winning combinations + calculateWinner(board)
  styles/
    app.css - CSS custom properties from design-tokens.json; board/cell/status/button styles; responsive
```

## Getting started

### Prerequisites

- Node.js 18+ and npm

### Frontend

```bash
npm install
npm run dev
npm run build
npm run test
```

## Testing


```bash
npm test
```
