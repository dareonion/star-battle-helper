

test('properly handles initial simple deductions', () => {
  // https://www.puzzle-star-battle.com/?pl=0d631430bd70519621dd125fb3110fcd5f0568e61168f
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
+-+-+-+-+-+-+-+-+-+-+`
  const expected_clear_simple_deductions = [
    [1, 6], [1, 8],
    [2, 0], [2, 2],
    [3, 0], [3, 2],
    [5, 1],
    [6, 6],
    [9, 1],
  ];
  const game = new StarBattleGame(game_str);
  expect(game.find_contradictions()).toHaveLength(0);

  // We want to say, these are known:
  const simple_deductions = game.get_simple_deduction_results();
  // for (let [r, c] of expected_clear_simple_deductions) {
  //   expect(simple_deductions?.get(r)?.get(c)).
  // }
});


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
