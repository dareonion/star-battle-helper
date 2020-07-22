import React from 'react';
import logo from './logo.svg';
import './App.css';
import { JsonMap, JsonSet } from './json_keyed.js'

// we can represent state in a number of ways. A relatively sparse representation is just as a sequence of moves and a side length.
const moves = [
  ["X", 0, 0],
  ["O", 1, 1],
  ["X", 0, 1],
];


class App extends React.Component {
  constructor(props) {
    super(props);
    this.side_length = 10;
    this.state = {
      cells: Array(this.side_length*this.side_length).fill(''),
      lookup_array: ["A", "B", "B", "A", "C", "B", "B", "B", "B"],
      move_history: [],
      current_move: 0,
    };
    this.isMouseDown = false;
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    window.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }

  tokey(row, col) {
    return row*this.side_length+col;
  }

  fromkey(k) {
    const col = k % this.side_length;
    return [(k-col) / this.side_length, col];
  }

  makeMove(move) {
  }

  // TODO(2020/07/08): this is a mess.
  handleOnMouseDown(event) {
    if (this.isMouseDown) {
      return;
    }
    this.isMouseDown = true;
    const symbol = (
      (event.buttons === 1) ? "*" :
        ((event.buttons === 2) ? "." : ""));
    const clientx = event.clientX;
    const clienty = event.clientY;
    const elt = document.elementFromPoint(clientx, clienty);
    const current_move_set = new JsonSet();
    if (elt.tagName === 'TD') {
      const row = parseInt(elt.getAttribute('data-row'));
      const col = parseInt(elt.getAttribute('data-col'));
      const cells = this.state.cells.slice();

      if (cells[this.tokey(row, col)] !== symbol) {
        // mark row col with the proper symbol
        current_move_set.add([row, col, cells[this.tokey(row, col)], symbol]);
        cells[this.tokey(row, col)] = symbol;
        this.setState({cells: cells});
      }
    }

    // event.button === 0 -> left click
    // event.button === 1 -> middle click
    // event.button === 2 -> right click

    // event.buttons === 1 -> left click
    // event.buttons === 2 -> right click
    // event.buttons === 4 -> middle click

    // TODO(2020/07/08): Consider using mouseenter
    const onMouseMove = (event) => {
      const clientx = event.clientX;
      const clienty = event.clientY;
      const elt = document.elementFromPoint(clientx, clienty);
      if (elt.tagName === 'TD') {
        const row = parseInt(elt.getAttribute('data-row'));
        const col = parseInt(elt.getAttribute('data-col'));
        const cells = this.state.cells.slice();

        if (cells[this.tokey(row, col)] !== symbol) {
          // mark row col with the proper symbol
          current_move_set.add([row, col, cells[this.tokey(row, col)], symbol]);
          cells[this.tokey(row, col)] = symbol;
          this.setState({cells: cells});
        }
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener(
      'mouseup',
      () => {
        if (current_move_set.size > 0) {
          const current_move = this.state.current_move;
          const move_history = this.state.move_history.slice(0, current_move);
          move_history.push(Array.from(current_move_set));
          this.setState({
            move_history: move_history,
            current_move: current_move+1,
          });
        }
        document.removeEventListener('mousemove', onMouseMove);
        this.isMouseDown = false;
      },
      {once: true},
    );
  }

  undo() {
    const move_history = this.state.move_history.slice();
    const current_move = this.state.current_move;
    if (current_move === 0) return;
    const cells = this.state.cells.slice();
    const last_move = move_history[current_move-1];
    for (let [row, col, oldsym, newsym] of last_move) {
      cells[this.tokey(row, col)] = oldsym;
    }
    this.setState({
      current_move: current_move-1,
      cells: cells,
    });
  }

  redo() {
    const move_history = this.state.move_history.slice();
    const current_move = this.state.current_move;
    if (move_history.length <= current_move) return;

    const cells = this.state.cells.slice();
    for (let [row, col, oldsym, newsym] of move_history[current_move]) {
      cells[this.tokey(row, col)] = newsym;
    }
    this.setState({
      current_move: current_move+1,
      cells: cells,
    });
  }

  render() {
    const cells = this.state.cells.slice();
    const lookup = Array.from(Array(this.side_length), (_v, row) => this.state.lookup_array.slice(row*this.side_length, (row+1)*this.side_length));
    const table_rows = Array.of(
      <tr key="-1">
        <td key="-2" />
        {Array.from(Array(this.side_length), (_v, col) => {
          return <th key={col}>{col+1}</th>
        })}
      </tr>
    ).concat(Array.from(Array(this.side_length), (_v, row) => {
      return (
        <tr key={row}>
          <th key="-1">{row+1}</th>
          {Array.from(Array(this.side_length), (_v, col) => {
            const classes = [];
            if (row === 0 || (row !== 0 && lookup[row][col] !== lookup[row-1][col]))
              classes.push("bt");
            if (row === this.side_length-1 || (row !== this.side_length-1 && lookup[row][col] !== lookup[row+1][col]))
              classes.push("bb");
            if (col === 0 || (col !== 0 && lookup[row][col] !== lookup[row][col-1]))
              classes.push("bl");
            if (col === this.side_length-1 || (col !== this.side_length-1 && lookup[row][col] !== lookup[row][col+1]))
              classes.push("br");
            return <td data-row={row} data-col={col} data-region={lookup[row][col]} key={col} className={classes.join(' ')}
                       onMouseDown={this.handleOnMouseDown}>
                     {cells[this.tokey(row, col)]}
                   </td>;
          })}
        </tr>
      );
    }));
    return (
      <div className="App">
        <button onClick={() => this.undo()}>undo</button>
        <button onClick={() => this.redo()}>redo</button>
        <table>
          <tbody>
            {table_rows}
          </tbody>
        </table>
      </div>
    );
  }
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
