import fs from 'fs'
import chai from 'chai';
import console from 'console';

import { DrugsFormController } from '../../src/controllers/drugs-form-controller.js'

const expect = chai.expect;

describe('drug form controller tests:', function () {

    describe('drug form:', function () {
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

    })

})