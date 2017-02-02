var express = require('express');
var Triejs = require('triejs');
var googleDict = require('./dict/google_227800_words.json');

function buildTrie (){
    var trie = new Triejs();
    for (let word in googleDict) {
        trie.add(word);
    }
    var result = trie.find('test').sort(function(w1, w2){
        return googleDict[w2] - googleDict[w1];
    });
    console.log(result);
}


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