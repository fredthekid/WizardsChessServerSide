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

        socket.on('clientUpdateRequest', function(data,last){
            currentfen = data;
            var lm = last;
            var cap = lm['captured'];
            socket.broadcast.emit('updateGameFromServer',currentfen);
            //console.log(data);
            
            if(cap == undefined) //no piece was captured, just a normal move
            {
	      //Move
              ser.write('M');
              ser.write(lm['from']);
              ser.write(lm['to']);
	      //ser.write('\n');
            }
    
            else
            {
              //Kill
              ser.write('K');
              ser.write(lm['captured']);
              ser.write(lm['color']);
              ser.write(lm['to']);
              //ser.write('\n');       
              //Move
              ser.write('M');
              ser.write(lm['from']);
              ser.write(lm['to']);
              //ser.write('\n');
            }
        });
    });
};
