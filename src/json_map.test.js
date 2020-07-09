import { JsonMap } from './json_map.js'

test('json map', () => {
  const m = new JsonMap();
  m.set([1, 1], 1);
  m.set("[1, 1]", 2);
  expect(m.has([1, 1])).toBeTruthy();
  expect(m.get([1, 1])).toBe(1);
  expect(m.has("[1, 1]")).toBeTruthy();
  expect(m.get("[1, 1]")).toBe(2);
});
