var io = null;
var currentfen = 'start'
var sp = require("serialport").SerialPort;
var ser = new sp("/dev/ttyO4", {baudrate: 9600});

exports.setRoute = function(ioVar){
    io = ioVar;
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
            ser.write('A');
        });
    });
};
