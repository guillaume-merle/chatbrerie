import chai from 'chai';

import { Lemmatizer } from '../../src/controllers/lemmatizer.js'

const expect = chai.expect;

describe('lemmatizer tests:', function () {

    describe('lemmatizer:', function () {

        context('init:', function () {
            it('should init a lemmatizer', function (done) {
                var test = new Lemmatizer();
                console.log(typeof(test));
                expect(2).to.be.equal(2);
                done();
            })
        })
    })

})