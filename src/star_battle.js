import { JsonMap, JsonSet } from './json_keyed.js'

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


function get_surrounding_cells(r, c) {
  const result = [];
  for (let dr=-1;dr<=1;++dr) {
    for (let dc=-1;dc<=1;++dc) {
      if (dr == 0 && dc == 0) continue;
      result.push([r+dr, c+dc]);
    }
  }
  return result;
}

function get_star_placement_possibilities(cells, num_stars_to_place) {
  if (num_stars_to_place === 0) {
    return [];
  } else if (num_stars_to_place === 1) {
    return cells.map((cell) => [cell]);
  } else if (num_stars_to_place === 2) {
    const result = [];
    for (let i=0;i<cells.length;++i) {
      const [r1, c1] = cells[i];
      for (let j=i+1;j<cells.length;++j) {
        const [r2, c2] = cells[j];
        if (Math.abs(r1-r2) <= 1 && Math.abs(c1-c2) <= 1) continue;
        result.push([[r1, c1], [r2, c2]]);
      }
    }
    return result;
  }
}

function get_constructive_deductions(cells, num_stars_to_place) {
  // would be nice to be able to specify a set of cells and the logic
  // can actually deduce exactly how many stars there could be among
  // those cells.

  // let's just assume current_state is correct.
  const cell_possibilities_map = new JsonMap();
  const star_placements = get_star_placement_possibilities(cells, num_stars_to_place);
  for (const stars of star_placements) {
    const blanks = new JsonSet();
    blanks.update(...(stars.map(([r, c]) => get_surrounding_cells(r, c))));
    for (const [r, c] of stars) {
      if (!cell_possibilities_map.has([r, c])) {
        cell_possibilities_map.set([r, c], new Set());
      }
      cell_possibilities_map.get([r, c]).add("star");
    }
    for (const [r, c] of blanks) {
      if (!cell_possibilities_map.has([r, c])) {
        cell_possibilities_map.set([r, c], new Set());
      }
      cell_possibilities_map.get([r, c]).add("blank");
    }
  }

  const candidates = new JsonSet();
  for (const [cell, poss_set] of cell_possibilities_map) {
    if (poss_set.size > 1) continue;
    const [r, c] = cell;
    if (r < 0 || r >= 10 || c < 0 || c >= 10) continue;
    candidates.add(cell);
  }

  for (const stars of star_placements) {
    const blanks = new JsonSet();
    blanks.update(...(stars.map(([r, c]) => get_surrounding_cells(r, c))));
    const stars_set = JsonSet.of(stars);
    Array.from(candidates).forEach((cand) => {
      if (!stars_set.has(cand) && !blanks.has(cand)) candidates.delete(cand);
    });
  }
  const result = Array.from(candidates).map((cand) => {
    const [r, c] = cand;
    return [r, c, cell_possibilities_map.get(cand).entries().next().value[0]];
  });
  return result;
}

const ROWS = Array.from(Array(10), (_v, r) => {
  return Array.from(Array(10), (_v2, c) => [r,c]);
});
const COLS = Array.from(Array(10), (_v, c) => {
  return Array.from(Array(10), (_v2, r) => [r,c]);
});


function get_all_constructive_deductions(regions, current_state) {
  const s = new JsonSet();
  const current_state_map = new JsonMap();
  for (const [r, c, mark] of current_state) {
    current_state_map.set([r,c], mark);
    s.add([r, c, mark]);
  }
  for (const region of regions.concat(ROWS).concat(COLS)) {
    const num_stars_marked = region.filter(([r, c]) => {
      return current_state_map.has([r,c]) && current_state_map.get([r, c]) === "star";
    }).length;
    const filtered_region = region.filter(([r, c]) => !current_state_map.has([r,c]));
    const deductions = get_constructive_deductions(filtered_region, 2-num_stars_marked)
          .filter(([r, c, mark]) => !s.has([r,c,mark]));
    s.update(deductions);
  }
  return Array.from(s).filter(([r, c, mark]) => !current_state_map.has([r,c]));
}

export {
  get_regions,
  generate_lookup,
  get_constructive_deductions,
  get_all_constructive_deductions};
