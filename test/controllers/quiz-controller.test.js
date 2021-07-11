import fs from 'fs'
import chai from 'chai';
import console from 'console';

import { QuizController } from '../../src/controllers/quiz-controller.js'

const expect = chai.expect;

describe('quiz controller tests:', function () {

    describe('quiz:', function () {
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
                    resolve(data);
                });
                return promise
            }
        })

        context('init:', function () {
            it('should init a quiz', function (done) {
                var quiz = new QuizController();
                expect(quiz).to.be.a('object');
                done();
            })
        })

    })

})