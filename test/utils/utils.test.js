import chai from 'chai';
import { indexOfMax, randomInt } from '../../src/utils/utils.js'

const expect = chai.expect;

describe('utils tests:', function () {

  describe('indexOfMax:', function () {

    context('simple array 1', function () {
      it('should return 2', function (done) {
        expect(indexOfMax([1, 2, 3])).to.equal(2);
        done();
      })
    })

    context('simple array 2', function () {
      it('should return 1', function (done) {
        expect(indexOfMax([1, 9, -2])).to.equal(1);
        done();
      })
    })

    context('empty array', function () {
      it('should return -1', function (done) {
        expect(indexOfMax([])).to.equal(-1);
        done();
      })
    })

  })

  describe('randomInt:', function () {

    context('simple test 1', function () {
      it('should generate two different numbers', function (done) {
        expect(randomInt(10)).not.to.be.equal(randomInt(10000))
        done();
      })
    })

    context('simple test 2', function () {
      it('should be defined', function (done) {
        expect(randomInt(10)).to.be.a('number');
        done();
      })
    })

  })

})

