import { get_regions, generate_lookup } from './star_battle.js'
import { JsonMap } from './json_keyed.js'

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

function foo(regions) {
  const regionD = regions[3];
  for (let i=0;i<regionD.length;++i) {
    const [r1, c1] = regionD[i];
    for (let j=i+1;j<regionD.length;++j) {
      const [r2, c2] = regionD[j];
      if (Math.abs(r1-r2) <= 1 && Math.abs(c1-c2) <= 1) continue;
      const blanks = [];
      const get_surrounding_cells = (r, c) => {
        const result = [];
        for (let dr=-1;dr<=1;++dr) {
          for (let dc=-1;dc<=1;++dc) {
            if (dr == 0 && dc == 0) continue;
            result.push([r+dr, c+dc]);
          }
        }
        return result;
      };
      const blanks1 = get_surrounding_cells(r1, c1);
      const blanks2 = get_surrounding_cells(r2, c2);
      
    }
  }
}


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
