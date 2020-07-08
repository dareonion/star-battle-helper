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
