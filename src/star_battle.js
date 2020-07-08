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

/*

Methods we want
For a given cell, look up row, column, and region. (region is the main one that's interesting).
For a given board, give the set of regions, specifying which cells are in which regions.

*/

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0],
]

/**
 * Get regions of the specified board.
 * board is a multiline string.
 */
function get_regions(board_arg) {
  const board = board_arg.trim();
  const rows = board.split('\n');
  const sidelen = (rows[0].length-1)/2;
  const discovered = Array.from(Array(sidelen), () => Array(sidelen).fill(false));
  const regions = [];

  const get_region = (rows, i, j) => {
    const result = [];
    const pending = [[i, j]];
    discovered[i][j] = true;
    while (pending.length > 0) {
      const [curri, currj] = pending.pop();

      const adji = 2*curri+1;
      const adjj = 2*currj+1;
      const neighbors = [];
      for (const [di, dj] of DIRECTIONS) {
        if (rows[adji+di].charAt(adjj+dj) === ' ') {
          neighbors.push([curri+di, currj+dj]);
        }
      }
      result.push([curri, currj]);
      for (const [ni, nj] of neighbors) {
        if (discovered[ni][nj]) continue;
        discovered[ni][nj] = true;
        pending.push([ni,nj]);
      }
    }
    return result;
  }

  for (let i=0;i<sidelen;++i) {
    for (let j=0;j<sidelen;++j) {
      if (discovered[i][j]) continue;

      const region = get_region(rows, i, j);
      regions.push(region);
    }
  }
  return regions;
}

function generate_lookup(regions) {
  let maxr = 0;
  let maxc = 0;
  for (const region of regions) {
    for (const [r, c] of region) {
      if (maxr < r) maxr = r;
      if (maxc < c) maxc = c;
    }
  }
  const sidelen = maxr+1;

  const grid = Array.from(Array(sidelen), () => Array(sidelen).fill(''));
  for (let i=0;i<regions.length;++i) {
    const region = regions[i];
    const name = String.fromCodePoint('A'.codePointAt(0)+i);
    for (const [r,c] of region) {
      grid[r][c] = name;
    }
  }
  return grid;
}

export { get_regions, generate_lookup };
