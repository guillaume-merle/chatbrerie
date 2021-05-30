const utils = require('../../src/utils/utils')

// indexOfMax tests:
//
test('indexOfMax: simple array 1', () => {
  expect(utils.indexOfMax([1, 2, 3])).toBe(2);
});

test('indexOfMax: simple array 2', () => {
  expect(utils.indexOfMax([1, 9, -2])).toBe(1);
});

// randomInt tests:
//
test('randomInt: simple test 1', () => {
  expect(utils.randomInt(10)).not.toBe(utils.randomInt(10000));
});

test('randomInt: simple test 2', () => {
  expect(utils.randomInt(10)).toBeDefined();
});

