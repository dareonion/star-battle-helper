import { JsonMap, JsonSet } from './json_keyed.js'

test('json map', () => {
  const m = new JsonMap();
  m.set([1, 1], 1);
  m.set("[1, 1]", 2);
  expect(m.has([1, 1])).toBeTruthy();
  expect(m.get([1, 1])).toBe(1);
  expect(m.has("[1, 1]")).toBeTruthy();
  expect(m.get("[1, 1]")).toBe(2);
});

test('json set', () => {
  const s = new JsonSet();
  expect(s.size).toBe(0);
  s.add([1, 1]);
  expect(s.size).toBe(1);
  s.add([1, 1]);
  expect(s.size).toBe(1);
  s.add([1, 2]);
  expect(s.size).toBe(2);
  s.pop();
  expect(s.size).toBe(1);
  s.pop();
  expect(s.size).toBe(0);
});
