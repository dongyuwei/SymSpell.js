var express = require('express');
var Triejs = require('triejs');
var googleDict = require('./dict/google_227800_words.json');

var trie = null;
function buildTrie (){
    trie = new Triejs();
    for (let word in googleDict) {
        trie.add(word);
    }
}

buildTrie();

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
var wss = new WebSocketServer({ port: 3001 });

function onMessage(message, ws) {
    console.log('received: ' + message);

    var result = trie.find(message).sort(function(w1, w2){
        return googleDict[w2] - googleDict[w1];
    });
    console.log(result);
    ws.send(JSON.stringify(result));
}

wss.on('connection', function(ws) {
    ws.on('message', function(message){
        onMessage(message, ws);
    });
});