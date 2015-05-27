//setup requirement variables
var express = require('express'),
    http = require('http'),
    appRoute = require('./routes/appRoute'),
    ioRoute = require('./routes/ioRoute'),
    socket = require('socket.io'),
    jade = require('jade');

//start express, server, and socket
var app = express(),
    server = http.createServer(app),
    io = socket.listen(server);

//set express settings
app.set('port', process.env.PORT || 3030);
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', jade.__express);

//using middleware
app.use(express.static(__dirname + '/public'));

//set routes
appRoute.setRoute(app);
ioRoute.setRoute(io);

//Start server
server.listen(app.get('port'));
console.log("Listening on port: " + app.get('port'));
