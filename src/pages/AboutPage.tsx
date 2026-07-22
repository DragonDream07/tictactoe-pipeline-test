import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about-page.css';

function AboutPage(): React.ReactElement {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">About Tic-Tac-Toe</h1>
        <p className="about__subtitle">Two-player · pass and play</p>
      </header>

      <main className="about__main">
        <section className="about__section">
          <h2 className="about__section-title">What is Tic-Tac-Toe?</h2>
          <p className="about__text">
            Tic-Tac-Toe is a classic two-player strategy game played on a
            3&times;3 grid. Players take turns marking a cell with their
            symbol — <span className="about__marker about__marker--x">X</span> or{' '}
            <span className="about__marker about__marker--o">O</span> — and
            the first player to place three of their markers in a horizontal,
            vertical, or diagonal row wins the game.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Rules</h2>
          <ol className="about__list">
            <li className="about__list-item">
              <strong>Player X always goes first.</strong> After a reset or on
              initial load, X takes the opening move.
            </li>
            <li className="about__list-item">
              <strong>Players alternate turns.</strong> After a valid X move it
              becomes O&apos;s turn, and vice versa.
            </li>
            <li className="about__list-item">
              <strong>Claim a cell.</strong> Click any empty cell to place your
              marker. Occupied cells cannot be overwritten.
            </li>
            <li className="about__list-item">
              <strong>Win condition.</strong> The first player to fill an entire
              row, column, or diagonal with their marker wins.
            </li>
            <li className="about__list-item">
              <strong>Draw condition.</strong> If all 9 cells are filled and no
              player has won, the game ends in a draw.
            </li>
            <li className="about__list-item">
              <strong>Reset.</strong> Press the Reset button at any time to
              clear the board and start a fresh game with X moving first.
            </li>
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Winning Combinations</h2>
          <p className="about__text">
            There are 8 ways to win — three rows, three columns, and two
            diagonals:
          </p>
          <ul className="about__list about__list--unstyled">
            <li className="about__list-item">Rows: top, middle, bottom</li>
            <li className="about__list-item">Columns: left, centre, right</li>
            <li className="about__list-item">Diagonals: top-left to bottom-right, top-right to bottom-left</li>
          </ul>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Credits</h2>
          <p className="about__text">
            Built as a demonstration project showcasing React, TypeScript, and
            accessible UI design. No external game libraries were used — all
            logic is implemented from scratch.
          </p>
        </section>

        <div className="about__nav">
          <Link to="/" className="about__back-link">
            ← Back to Game
          </Link>
        </div>
      </main>

      <footer className="about__footer">
        <p>Tic-Tac-Toe &mdash; Two-player pass-and-play</p>
      </footer>
    </div>
  );
}

export default AboutPage;
