import chai from 'chai';
import { indexOfMax, randomInt } from '../../src/utils/utils.js'

const expect = chai.expect;

// indexOfMax tests:
//
/*test('indexOfMax: simple array 1', () => {
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
});*/

describe('utils tests:', function() {

  context('indexOfMax: simple array 1', function() {
    it('should return 2', function(done) {
      expect(indexOfMax([1, 2, 3])).to.equal(2);
      done();
    })
  })

  context('indexOfMax: simple array 2', function() {
    it('should return 2', function(done) {
      expect(indexOfMax([1, 9, -2])).to.equal(1);
      done();
    })
  })

})

