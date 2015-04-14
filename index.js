//var sys = require("sys);
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
var lastMessage = '';

io.sockets.on('connection', function(socket){
    socket.emit('message', {message: 'welcome to the chat'});
    if(lastMessage != ''){
        socket.emit('message', lastMessage);
    }
    socket.on('send', function(data){
        io.sockets.emit('message', data);
        lastMessage = data;
        console.log(lastMessage);
    });
});

console.log("listening on port " + port);
