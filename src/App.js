import React from 'react';
import logo from './logo.svg';
import './App.css';

const SIDE_LENGTH = 3;

// we can represent state in a number of ways. A relatively sparse representation is just as a sequence of moves and a side length.
const moves = [
  ["X", 0, 0],
  ["O", 1, 1],
  ["X", 0, 1],
];

function tokey(row, col) {
  return row*SIDE_LENGTH+col;
}

function fromkey(k) {
  const col = k % SIDE_LENGTH;
  return [(k-col) / SIDE_LENGTH, col];
}


function App() {
  const m = new Map();
  for (const [symb, row, col] of moves) {
    m.set(tokey(row, col), symb);
  }
  const lookup = [["A", "B", "B"], ["A", "C", "B"], ["B", "B", "B"]];

  const table_rows = Array.of(
    <tr>
      <td />
      {Array.from(Array(SIDE_LENGTH), (_v, col) => {
        return <th key={col}>{col+1}</th>
      })}
    </tr>
  ).concat(Array.from(Array(SIDE_LENGTH), (_v, row) => {
    return (
      <tr key={row}>
        <th key="-1">{row+1}</th>
        {Array.from(Array(SIDE_LENGTH), (_v, col) => {
          const classes = [];
          if (row === 0 || (row !== 0 && lookup[row][col] !== lookup[row-1][col]))
            classes.push("bt");
          if (row === SIDE_LENGTH-1 || (row !== SIDE_LENGTH-1 && lookup[row][col] !== lookup[row+1][col]))
            classes.push("bb");
          if (col === 0 || (col !== 0 && lookup[row][col] !== lookup[row][col-1]))
            classes.push("bl");
          if (col === SIDE_LENGTH-1 || (col !== SIDE_LENGTH-1 && lookup[row][col] !== lookup[row][col+1]))
            classes.push("br");
          return <td key={col} className={classes.join(' ')}>
                   {m.get(tokey(row, col))}
                 </td>;
        })}
      </tr>
    );
  }));
  return (
    <div className="App">
      <table>
        <tbody>
          {table_rows}
        </tbody>
      </table>
    </div>
  );
}

export default App;

const game = `
+-+-+-+-+-+-+-+-+-+-+
|       |       |   |
+   +-+ +   +-+-+-+ +
|   | | |   |     | |
+ +-+ + +   +-+-+ + +
| |   | |   |   | | |
+-+   + +-+-+ +-+ + +
| |   |       |   | |
+ +   + +-+-+-+ +-+ +
| |   | |       |   |
+ +-+ +-+ +-+-+-+   +
|   |   | |     |   |
+ +-+-+ +-+   +-+ +-+
| |   | |     | | | |
+ + +-+ +-+   + +-+ +
| | | |   |   |     |
+-+ + +-+-+   +     +
|   | |       |     |
+ +-+ +-+-+-+ +-+   +
| |         |   |   |
+-+-+-+-+-+-+-+-+-+-+`.trim()

// we want to be able to track the game state. We want to have some
// sort of partial progress on the game, and show what happens.

// hover over the deduction, shows the contradiction if it were not true.

// button to apply all deductions.

// we'll want to be able to fill a cell in with a guess, and see if it
// leads to a contradiction. should also say how many steps away the
// contradiction is.

// i wonder where to bake in the star adjacency restriction. If I
// abstract it out a bit, this code becomes more general, but also more complex.

function find_contradictions(gameboard, gamestate, guess) {
  const prov_game_state = gamestate+guess;
  // 0th order
  // check for obvious contradictions -- any adjacent stars?
  // for every cell, if it has a star in it, check around it to see if
  // there are any stars, and if there are, add that to the list of
  // errors.

  // 1st order
  // if any row, column, or region is now unable to be legally filled
  // (already has >2 stars, or impossible to legally fit 2 stars).

  // 2nd order
  // if after applying a round of 1st order deductions, we've found a contradiction.
}

/*
function get_game_as_ascii() {
  // char2darray
  const char2darray = []
  const ROWS = 10;
  const COLS = 10;
  for (let i=0;i<ROWS*2+1;++i) {
    char2darray.push(Array(COLS*2+1).fill(' '));
  }
  for (let i=0;i<ROWS*2+1;++i) {
    for (let j=0;j<COLS*2+1;++j) {
      if (i % 2 === 0 && j % 2 === 0) char2darray[i][j] = '+';
      if (i % 2 === 1 && (j === 0 || j === COLS*2)) char2darray[i][j] = '|';
      if ((i === 0 || i === ROWS*2) && j % 2 === 1) char2darray[i][j] = '-';
    }
  }
  const game = document.getElementById("game");
  const cells = game.querySelectorAll("div.cell");
  cells.forEach((val, ind) => {
    const c = ind % COLS;
    const r = (ind-c)/ROWS;
    // 0, 0 => 1, 1
    // 1, 1 => 3, 3
    const adjr = 2*r+1;
    const adjc = 2*c+1;
    if (val.classList.contains("bl")) char2darray[adjr][adjc-1] = '|';
    if (val.classList.contains("br")) char2darray[adjr][adjc+1] = '|';
    if (val.classList.contains("bt")) char2darray[adjr-1][adjc] = '-';
    if (val.classList.contains("bb")) char2darray[adjr+1][adjc] = '-';
  });
  for (let i=2;i<=(ROWS-1)*2;i+=2) {
    for (let j=2;j<=(COLS-1)*2;j+=2) {
      if (char2darray[i-1][j] === ' ' && char2darray[i+1][j] === ' ' &&
          char2darray[i][j-1] === ' ' && char2darray[i][j+1] === ' ') {
        char2darray[i][j] = ' ';
      }
    }
  }
  return char2darray.map((row) => row.join('')).join('\n');
}
get_game_as_ascii()
*/
