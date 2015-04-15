/*
 *This is the server-side code
 */

var express = require("express");
var app = express(); 
var server = require('http').createServer(app);
var port = 8080;

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

//req = request from HTTP, res = response to send back
app.get("/", function(req, res){
    console.log("Someone has accessed page");
    res.render("page");
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(server);
server.listen(port);
var currentfen = 'start';

io.sockets.on('connection', function(socket){
    socket.emit('initBoard', currentfen);
    console.log(currentfen);

    socket.on('send', function(data){
        io.sockets.emit('message', data);
        lastMessage = data;
        console.log(lastMessage);
    });

    socket.on('clientUpdateRequest', function(data){
        currentfen = data;
        socket.broadcast.emit('updateGameFromServer',currentfen);
        console.log(data);
    });
});

console.log("Listening on port: " + port);
