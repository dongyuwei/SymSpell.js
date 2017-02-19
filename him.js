var express = require('express');
var level = require('level');
var googleDict = require('./dict/google_227800_words.json');

var db = level(__dirname + '/level_db');

function storeWords() {
    var ops = [];
    for (let word in googleDict) {
        ops.push({
            type: 'put',
            key: word,
            value: ''
        });
    }

    db.batch(ops, function(err) {
        if (err) return console.log('Ooops!', err)
        console.log('all words stored!');
    });
}
storeWords();

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ', err);
});

var app = express();

app.get('/favicon.ico', function(req, res) {
    res.end('');
});

app.use(express['static']('./static'));
app.use(express.directory('./static'));

app.listen(3000);

console.log('################################################');
console.log('server (pid: ' + process.pid + ') started! please visit http://127.0.0.1:3000');
console.log('################################################');


var WebSocketServer = require('uws').Server;
var wss = new WebSocketServer({
    port: 3001
});

function findPrefixOf(word, callback) {
    var list = [];
    db.createReadStream({
            start: word, // jump to first key with the word
            end: word + "\xFF" // stop at the last key with the word
        })
        .on('data', function(data) {
            list.push(data.key);
        })
        .on('error', function() {
            console.log('error', arguments);
            callback(list);
        })
        .on('close', function() {
            callback(list);
        });
}

var SymSpell = require('./dist/SymSpell');
var symSpell = new SymSpell.SymSpell();
symSpell.createDictionary('');

function onMessage(word, ws) {
    findPrefixOf(word, function (list) {
        if (list.length > 0) {
            list = list.sort(function(w1, w2) {
                return googleDict[w2] - googleDict[w1];
            });
        } else {
            var suggestions = symSpell.correct(word.trim(), '');
            list = suggestions.map(function(item){
                return item.term
            });
        }
        ws.send(JSON.stringify(list));
    });
}

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        onMessage(message, ws);
    });
});