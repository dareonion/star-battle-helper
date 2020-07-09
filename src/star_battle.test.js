import {
  get_regions,
  generate_lookup,
  get_constructive_deductions,
  get_all_constructive_deductions} from './star_battle.js'

test('retrieve distinct regions', () => {
  const game_str = `
+-+-+-+-+-+-+-+-+-+-+
|       |       |   |
+ +-+-+ + +-+ +-+   +
| |   | | | | | |   |
+ +-+ + + + +-+ +-+ +
| | | | | |       | |
+ + + +-+ +-+-+-+-+ +
| | |       |       |
+ + +-+   +-+       +
| |   |   | |       |
+ +-+ +-+-+ +-+-+   +
|   | |     |   |   |
+ +-+-+-+-+ +-+ +-+-+
| | |     |   | |   |
+-+ +     +-+-+ +-+ +
|   |         |   | |
+   +-+ +-+-+-+   + +
|     | |     |   | |
+ +-+-+ +-+-+ +-+-+ +
| |         |       |
+-+-+-+-+-+-+-+-+-+-+`;

  const regions = get_regions(game_str);
  expect(regions).toHaveLength(10);

  const region_lookup = generate_lookup(regions);
  expect(region_lookup[0][0] === 'A');
const expected_region_lookup = `
AAAABBBBCC
ABBABDBDCC
AEBABDDDDC
AEBBBBCCCC
AEEBBFCCCC
AAEFFFGGCC
AHIIIFFGJJ
HHIIIIIGGJ
HHHIJJJGGJ
HIIIIIJJJJ`;
  expect(region_lookup.map(a => a.join('')).join('\n')).toBe(expected_region_lookup.trim());
});

function get_possible_star_count(game, current_state, cells) {
  // might be impossible. e.g., if the current state has 3 stars in a
  // region, then this is already kind of a weird thing to look for.

  // check based on rows intersected, columns intersected, and regions intersected
}

const EMPTY_STATE_10 = Array(10).fill(' '.repeat(10)).join('\n');

test('constructive deductions', () => {
  const regionD = [ [ 1, 5 ], [ 2, 5 ], [ 2, 6 ], [ 2, 7 ], [ 1, 7 ], [ 2, 8 ] ];
  const deductionsD = get_constructive_deductions(regionD, 2);
  expect(deductionsD.length).toBe(2);
  expect(deductionsD).toContainEqual([1, 6, "blank"]);
  expect(deductionsD).toContainEqual([1, 8, "blank"]);

  const regionF = [ [ 4, 5 ], [ 5, 5 ], [ 6, 5 ], [ 6, 6 ], [ 5, 4 ], [ 5, 3 ] ];
  const deductionsF = get_constructive_deductions(regionF, 2);
  expect(deductionsF.length).toBe(2);
  expect(deductionsF).toContainEqual([4, 4, 'blank']);
  expect(deductionsF).toContainEqual([5, 6, 'blank']);

  const game_str = `
+-+-+-+-+-+-+-+-+-+-+
|       |       |   |
+ +-+-+ + +-+ +-+   +
| |   | | | | | |   |
+ +-+ + + + +-+ +-+ +
| | | | | |       | |
+ + + +-+ +-+-+-+-+ +
| | |       |       |
+ + +-+   +-+       +
| |   |   | |       |
+ +-+ +-+-+ +-+-+   +
|   | |     |   |   |
+ +-+-+-+-+ +-+ +-+-+
| | |     |   | |   |
+-+ +     +-+-+ +-+ +
|   |         |   | |
+   +-+ +-+-+-+   + +
|     | |     |   | |
+ +-+-+ +-+-+ +-+-+ +
| |         |       |
+-+-+-+-+-+-+-+-+-+-+`;

  const regions = get_regions(game_str);

  const all_deductions = get_all_constructive_deductions(regions, []);
  expect(all_deductions).toContainEqual([1, 6, "blank"]);
  expect(all_deductions).toContainEqual([1, 8, "blank"]);
  expect(all_deductions).toContainEqual([4, 4, 'blank']);
  expect(all_deductions).toContainEqual([5, 6, 'blank']);

  const current_state = all_deductions;
  while (true) {
    const next_deductions = get_all_constructive_deductions(regions, current_state);
    if (next_deductions.length === 0) break;
    // console.log(next_deductions);
    current_state.push(...next_deductions);
  }
});

function parse_state(state_str) {
  const rows = state_str.split('\n');
  const result = [];
  for (let r=0;r<10;++r) {
    for (let c=0;c<10;++c) {
      const ch = rows[r].charAt(c);
      if (ch === ' ') {
        continue
      } else if (ch === '.') {
        result.push([r, c, 'blank']);
      } else if (ch === '*') {
        result.push([r, c, 'star']);
      }
    }
  }
  return result;
}

function state_to_str(state) {
  const result_array = Array.from(Array(10), () => Array(10).fill(' '));
  for (const [r, c, mark] of state) {
    if (mark === 'blank')
      result_array[r][c] = '.';
    else if (mark === 'star')
      result_array[r][c] = '*';
  }
  return result_array.map((arr) => arr.join('')).join('\n');
}

test('constructive deductions 2', () => {
  const game_str = `
+-+-+-+-+-+-+-+-+-+-+
| |             |   |
+ +       +-+-+-+   +
| |       |     |   |
+ +-+-+   + +-+-+   +
| |   |   | | |     |
+ +   +   + + +     +
| |   |   | | |     |
+ +-+ +-+-+ + +     +
|   | |   | | |     |
+   +-+ +-+ + +-+-+-+
|   |   |   |   |   |
+   +   +   +   +   +
|   |   |   |   |   |
+-+ +   +-+-+   +-+ +
| | |   |   |     | |
+ + +-+ +   +     + +
| |   | |   |     | |
+ +-+-+-+   +-+   +-+
|       |     |     |
+-+-+-+-+-+-+-+-+-+-+`
  const regions = get_regions(game_str);
  const current_state = [];
  while (true) {
    const next_deductions = get_all_constructive_deductions(regions, current_state);
    if (next_deductions.length === 0) break;
    // console.log(next_deductions);
    current_state.push(...next_deductions);
  }
  current_state.sort();

  const state = parse_state(`
          
...       
      ..  
 ..... .  
..*.*.....
......    
.*. . ....
... .   . 
*... .... 
..  ..*...`.slice(1));

  while (true) {
    const next_deductions = get_all_constructive_deductions(regions, state);
    if (next_deductions.length === 0) break;
    state.push(...next_deductions);
  }
});

test('constructive deductions 3', () => {
  const game_str = `
+-+-+-+-+-+-+-+-+-+-+
|       |           |
+-+-+-+ +-+-+     +-+
|   | |     |     | |
+   + +-+-+ + +-+-+ +
|   |     | | |   | |
+-+ + +-+ + +-+ +-+ +
| | | | | |   | |   |
+ + +-+ +-+ +-+ +-+ +
| | | |     |   | | |
+ +-+ +   +-+-+-+ + +
|     |   | |     | |
+   +-+-+-+ +-+-+ + +
|   |   |       | | |
+   +   + +-+ +-+ + +
|   |   | | | |   | |
+   +-+ +-+ + +-+ +-+
|     |     |   |   |
+-+-+-+     +-+-+   +
|               |   |
+-+-+-+-+-+-+-+-+-+-+`
  const regions = get_regions(game_str);
  const current_state = [];
  while (true) {
    const next_deductions = get_all_constructive_deductions(regions, current_state);
    if (next_deductions.length === 0) break;
    current_state.push(...next_deductions);
  }
});

/*
Can I get it to recognize when stars are all accounted for in a
region, so all the other cells must be clear? E.g., rows 1 through 4
cover 4 different regions plus some others. Then the other cells all must be clear outside of those 4 regions.

clear vs star. try both, see if they both force some other cell to be something. this should also mean that setting that other cell to be the opposite should immediately contradict.

deconstructing a region into two regions. there are 2 stars in this set of cells. => there is one star in this set of cells, and one star in this other set of cells
*/

// hard puzzle: https://www.puzzle-star-battle.com/?pl=80482e31a36857cc9238ded65b15f1685f0656d096e09

// test('properly handles initial simple deductions', () => {
//   // https://www.puzzle-star-battle.com/?pl=0d631430bd70519621dd125fb3110fcd5f0568e61168f
//   const game_str = `
// +-+-+-+-+-+-+-+-+-+-+
// |       |       |   |
// + +-+-+ + +-+ +-+   +
// | |   | | | | | |   |
// + +-+ + + + +-+ +-+ +
// | | | | | |       | |
// + + + +-+ +-+-+-+-+ +
// | | |       |       |
// + + +-+   +-+       +
// | |   |   | |       |
// + +-+ +-+-+ +-+-+   +
// |   | |     |   |   |
// + +-+-+-+-+ +-+ +-+-+
// | | |     |   | |   |
// +-+ +     +-+-+ +-+ +
// |   |         |   | |
// +   +-+ +-+-+-+   + +
// |     | |     |   | |
// + +-+-+ +-+-+ +-+-+ +
// | |         |       |
// +-+-+-+-+-+-+-+-+-+-+`
//   const expected_clear_simple_deductions = [
//     [1, 6], [1, 8],
//     [2, 0], [2, 2],
//     [3, 0], [3, 2],
//     [5, 1],
//     [6, 6],
//     [9, 1],
//   ];
//   const game = new StarBattleGame(game_str);
//   expect(game.find_contradictions()).toHaveLength(0);

//   // We want to say, these are known:
//   const simple_deductions = game.get_simple_deduction_results();
//   // for (let [r, c] of expected_clear_simple_deductions) {
//   //   expect(simple_deductions?.get(r)?.get(c)).
//   // }
// });


/*

Simple deductions
(1, 6) must be empty. Reason: Otherwise, region (B) would be impossible to fill.
(1, 8) must be empty. Reason: Otherwise, region (B) would be impossible to fill.




(r, c) must be a star, Reason: every possible remaining way to place stars in region (C) has a star here.

(r2, c2) must be empty. Reason: every possible way to place stars across row 2 and row 3 has a star here.
            could be the sequence of reasoning before the contradiction
[1, 6, false, [], ["region", "B", "impossible to place two stars"]]


(3, 5) must be empty, because if it had a star, then there must necessarily be a star in either (5, 5) or (6, 5), which means the rest of the column would be empty, as well as (2, 6). That would leave that top right-ish region impossible to fill with stars.

Assume it had a star.
pic
Then the cells immediately around it must all be blank.
pic
Also,
the other star in that column has to be from region X, so the rest of the column must be clear.
*/

/*

what should the function look like?
Given a board, and a set of which cells are clear / have stars, come up with a list of logical deductions, plus the associated reasoning with each deduction.

do_deduction

Immediate deduction is looking at possible ways of filling rows, columns, and regions, and what's determined from that. Also, looking at groups of rows, columns, or regions, and looking at possible ways of filling them. No proof by contradiction.

This can be repeated until there are no further obvious deductions.



Can go from both directions! You can go by contradiction, or you can look at all the possible ways to fill with stars, look at what's clear around them, and then find what deductions stay consistent across all possibilities. I should also do this. This feels "second order", but isn't too bad I think.


for each row, column, and region
get undetermined cells, and how many stars remaining to place.
get possible placements






*/
