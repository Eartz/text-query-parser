var assert = require("assert");
var parser = require("../index.js");
describe('Parser', function(){
    describe('#parse()', function(){
        it("Input 'Roses are red' should return 3 substrings and no flags", function() {
            var expected = {
                "substrings": ["Roses", "are", "red"],
                "flags": {
                    "positives": [],
                    "negatives": []
                }
            };
            var actual = parser('Roses are red');
            assert.deepEqual(expected, actual);
        });
        it("should parse grouped flags as well as individual flags", function() {
            var expected = {
                "substrings": [],
                "flags": {
                    "positives": ["a", "b", "c", "d"],
                    "negatives": []
                }
            };
            var actual = parser('+abc +d');
            assert.deepEqual(expected, actual);
        });
        it("should work with any unicode character in substrings and in flags", function() {
            var expected = {
                "substrings": ["aérosol", "maçon", "Île d'Engeløya", "❆"],
                "flags": {
                    "positives": ["é", "à", "☃"],
                    "negatives": ["ø","œ"]
                }
            };
            var actual = parser('aérosol maçon "Île d\'Engeløya" ❆ +éà☃ -ø -œ');
            assert.deepEqual(expected, actual);
        });
        it("should separate substrings around spaces exept between double quotes", function() {
            var expected = {
                "substrings": ["Longtemps je me suis", "couché de", "bonne", "heure", "l'apostrophe"],
                "flags": {
                    "positives": [],
                    "negatives": []
                }
            };
            var actual = parser('"Longtemps je me suis" "couché de" bonne heure l\'apostrophe');
            assert.deepEqual(expected, actual);
        });
        it("should ignore escaped double quotes", function() {
            var expected = {
                "substrings": ['"Longtemps', 'je', 'me"', "suis"],
                "flags": {
                    "positives": [],
                    "negatives": []
                }
            };
            var actual = parser('\\"Longtemps je me\\" suis');
            assert.deepEqual(expected, actual);
        });
    });
});