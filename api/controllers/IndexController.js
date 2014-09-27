/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    words: function(req, res) {
        var word = req.body.word;
        findword(word, req, res);
        res.view();
    }

};

function findword(input, req, res) {
    input = input.split('');
    var http = require('http');

    http.get('http://localhost:1337/dictionary.txt', function(res) {
        res.setEncoding('utf8');
        var dict = '';
        res.on('data', function (chunk) {
            dict += chunk;
        });
        res.on('end', function () {
            var result = process(dict, input);
            sails.get('/data', function(req, res){
                res.send(result);
            });

            //var result = process(dict, input);
            //var socket = req.socket;
            //var io = sails.io;
            //io.sockets.emit('results', {words: result});

            //var app = require('http').createServer();
            //var io = require("socket.io")(app);
            //io.on("connection", function (sock) {
            //    console.log('reached');
            //    sock.emit("results", { words: result });
            //});
            //app.listen(1024);
        });
    });
}

function process(dict, input) {
    dict = dict.split("\n");
    var result = [];
    outer:
    for (var i = 0; i < dict.length; i++) {
        var letters = wordtohash(input);
        var word = dict[i].split('');
        for (var k = 0; k < word.length; k++) {
            if (!letters[word[k]] || letters[word[k]] == 0) {
                continue outer;
            }
            letters[word[k]] -= 1;
        }
        result.push(word.join(''));
    }
    return result;
}

// Convert a char array to a hash mapping chars to integers
function wordtohash(word) {
    var result = {};
    for (var i = 0; i < word.length; i++) {
        if (result[word[i]]) {
            result[word[i]] += 1;
        } else {
            result[word[i]] = 1;
        }
    }
    return result;
}
