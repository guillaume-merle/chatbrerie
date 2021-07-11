import fs from 'fs'
import chai from 'chai';
import console from 'console';

import { Lemmatizer } from '../../src/controllers/lemmatizer.js'

const expect = chai.expect;

describe('lemmatizer tests:', function () {

    describe('lemmatizer:', function () {
        beforeEach(function() {
            global.chrome = { 
                runtime: { 
                    getURL: function(path) { 
                        return "src/" + path;
                    }
                }
            }
            global.fetch = function(path) {
                var promise = new Promise((resolve, reject) => {
                    var data = fs.readFileSync(path, function(err,data) { return data });
                    data.text = data.toString;
                    console.log(data);
                    resolve(data);
                });
                console.log('test');
                return promise
            }
        })

        context('init:', function () {
            it('should init a lemmatizer', function (done) {
                var lemmatizer = new Lemmatizer();
                expect(lemmatizer).to.be.a('object');
                done();
            })
        })

        context('lemmatizeInput:', function () {
            it('should prepare input string', async function () {
                var lemmatizer = new Lemmatizer();
                var nbclass = await lemmatizer.prepareInput("Comment se faire vacciner ?")
                console.log(nbclass)
                expect(nbclass).to.have.all.members([
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0
                ]);
            })
        })
    })

})