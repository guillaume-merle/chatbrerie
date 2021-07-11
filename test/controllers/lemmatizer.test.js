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
                    resolve(data);
                });
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

        context('prepareInput 1:', function () {
            it('should prepare input string', async function () {
                var lemmatizer = new Lemmatizer();
                var bagword = await lemmatizer.prepareInput("Comment se faire vacciner ?")
                expect(bagword).to.eql([
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

        context('prepareInput 2:', function () {
            it('should prepare input string', async function () {
                var lemmatizer = new Lemmatizer();
                var bagword = await lemmatizer.prepareInput("J'ai oublier mon mot de passe.")
                expect(bagword).to.eql([
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ]);
            })
        })

        context('prepareInput 3:', function () {
            it('should prepare input string', async function () {
                var lemmatizer = new Lemmatizer();
                var bagword = await lemmatizer.prepareInput("Quizz pour la vaccination.")
                expect(bagword).to.eql([
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0
                ]);
            })
        })

        context('lemmatizeInput 1:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("Quizz pour la vaccination.")
                expect(lem).to.eql(["quizz", "pour", "vaccination"]);
            })
        })

        context('lemmatizeInput 2:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("J'ai oublier mon mot de passe.")
                expect(lem).to.eql(["oublier", "mon", "mot", "passé"]);
            })
        })

        context('lemmatizeInput 3:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("J'aimerais en savoir plus sur la teleconsultation.")
                expect(lem).to.eql(["aimer", "savoir", "plus", "sur", "teleconsultation"]);
            })
        })

        context('lemmatizeInput 4:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("Raconte une blague")
                expect(lem).to.eql(["raconter", "une", "blague"]);
            })
        })

        context('lemmatizeInput 5:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("J'aimerais prendre rendez-vous")
                expect(lem).to.eql(["aimer", "prendre", "rendre", "vous"]);
            })
        })

        context('lemmatizeInput 6:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("J'ai des effets secondaires.")
                expect(lem).to.eql(["des", "effet", "secondaire"]);
            })
        })

        context('lemmatizeInput 7:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("Ajouter ma prise de medicament au calendrier.")
                expect(lem).to.eql(["ajouter", "pris", "médicament", "calendrier"]);
            })
        })

        context('lemmatizeInput 8:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("")
                expect(lem).to.eql([]);
            })
        })

        context('lemmatizeInput 9:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("Quel est le prix de la teleconsultation ?")
                expect(lem).to.eql(["quel", "est", "prix", "teleconsultation"]);
            })
        })

        context('lemmatizeInput 10:', function () {
            it('should lemmatize the input string', async function () {
                var lemmatizer = new Lemmatizer();
                var lem = await lemmatizer.lemmatizeInput("Comment puis-je prendre un rendez vous avec mon médecin ?")
                expect(lem).to.eql(["comment", "puis", "prendre", "rendre", "vous", "avec", "mon", "médecin"]);
            })
        })
    })

})