/// <reference path="../typings/tsd.d.ts" />
"use strict";
var SymSpell_1 = require('./SymSpell');
var fs = require('fs');
var assert = require("assert");
var s = new SymSpell_1.SymSpell();
s.createDictionary(fs.readFileSync('./small.txt').toString(), '');
assert.deepEqual(s.correct('foo', ''), []);
var suggestions = s.correct('abou', '');
assert.equal(JSON.stringify(suggestions), '[{"term":"about","distance":1,"count":1},{"term":"above","distance":2,"count":1},{"term":"abort","distance":2,"count":1}]');
assert.equal(JSON.stringify(s.correct('above', '')), '[{"term":"above","distance":0,"count":1},{"term":"about","distance":2,"count":1},{"term":"abort","distance":2,"count":1}]');

//# sourceMappingURL=test2.js.map
